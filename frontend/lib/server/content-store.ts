import { promises as fs } from "fs";
import path from "path";
import blogsData from "../../data/blogs.json";
import {
  defaultProperties,
  defaultSearchFilters,
  type BlogPost,
  type PropertyListing,
  type SearchFilterConfig,
  type SiteSettings
} from "../../app/data";

const dataDirectory = path.join(process.cwd(), "data");
const blogsFilePath = path.join(dataDirectory, "blogs.json");
const propertiesFilePath = path.join(dataDirectory, "properties.json");
const searchFiltersFilePath = path.join(dataDirectory, "search-filters.json");
const siteSettingsFilePath = path.join(dataDirectory, "site-settings.json");

const defaultSiteSettings: SiteSettings = {
  googleFormUrl: process.env.NEXT_PUBLIC_GOOGLE_FORM_URL?.trim() ?? ""
};

let mongoDbPromise: Promise<MongoDbLike | null> | null = null;

type MongoDbLike = {
  collection: (name: string) => {
    find: () => {
      sort: (value: Record<string, 1 | -1>) => {
        toArray: () => Promise<Record<string, unknown>[]>;
      };
      toArray: () => Promise<Record<string, unknown>[]>;
    };
    deleteMany: (query: Record<string, never>) => Promise<void>;
    insertMany: (documents: Record<string, unknown>[]) => Promise<void>;
    findOne: (query: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
    replaceOne: (
      filter: Record<string, unknown>,
      replacement: Record<string, unknown>,
      options: { upsert: boolean }
    ) => Promise<void>;
  };
};

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function withGoogleFormFallback(settings: Partial<SiteSettings> | null | undefined): SiteSettings {
  return {
    googleFormUrl:
      settings?.googleFormUrl?.trim() ??
      process.env.NEXT_PUBLIC_GOOGLE_FORM_URL?.trim() ??
      ""
  };
}

async function readJsonFile<T>(filePath: string, fallback: T) {
  try {
    const file = await fs.readFile(filePath, "utf8");
    return JSON.parse(file) as T;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return cloneValue(fallback);
    }

    throw error;
  }
}

async function writeJsonFile<T>(filePath: string, value: T) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2));
}

async function getMongoDb() {
  if (mongoDbPromise) {
    return mongoDbPromise;
  }

  mongoDbPromise = (async () => {
    const atlasUrl = process.env.MONGODB_ATLAS_URL?.trim();
    const dbName = process.env.MONGODB_DB_NAME?.trim();

    if (!atlasUrl || !dbName) {
      return null;
    }

    try {
      const dynamicImport = new Function("specifier", "return import(specifier);") as (
        specifier: string
      ) => Promise<{
        MongoClient: new (uri: string) => {
          connect: () => Promise<void>;
          db: (name: string) => MongoDbLike;
        };
      }>;
      const { MongoClient } = await dynamicImport("mongodb");
      const client = new MongoClient(atlasUrl);
      await client.connect();
      return client.db(dbName);
    } catch {
      return null;
    }
  })();

  return mongoDbPromise;
}

async function readCollection<T>(
  collectionName: string,
  filePath: string,
  fallback: T,
  sortBy?: Record<string, 1 | -1>
) {
  const db = await getMongoDb();
  if (db) {
    const cursor = db.collection(collectionName).find();
    const documents = sortBy ? await cursor.sort(sortBy).toArray() : await cursor.toArray();
    return documents.map(({ _id: _ignored, ...rest }) => rest) as T;
  }

  return readJsonFile<T>(filePath, fallback);
}

async function writeCollection<T extends Record<string, unknown>[]>(
  collectionName: string,
  filePath: string,
  value: T
) {
  const db = await getMongoDb();
  if (db) {
    const collection = db.collection(collectionName);
    await collection.deleteMany({});
    if (value.length > 0) {
      await collection.insertMany(value);
    }
    return;
  }

  await writeJsonFile(filePath, value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function readBlogs() {
  return readCollection<BlogPost[]>(
    "blogs",
    blogsFilePath,
    blogsData as BlogPost[],
    { createdAt: -1 }
  );
}

export async function writeBlogs(blogs: BlogPost[]) {
  await writeCollection("blogs", blogsFilePath, blogs);
}

export async function readProperties() {
  return readCollection<PropertyListing[]>("properties", propertiesFilePath, defaultProperties);
}

export async function writeProperties(properties: PropertyListing[]) {
  await writeCollection("properties", propertiesFilePath, properties);
}

export async function readSearchFilters() {
  return readCollection<SearchFilterConfig[]>(
    "searchFilters",
    searchFiltersFilePath,
    defaultSearchFilters
  );
}

export async function writeSearchFilters(filters: SearchFilterConfig[]) {
  await writeCollection("searchFilters", searchFiltersFilePath, filters);
}

export async function readSiteSettings() {
  const db = await getMongoDb();

  if (db) {
    const document = await db.collection("siteSettings").findOne({ key: "site-settings" });
    return withGoogleFormFallback(document as Partial<SiteSettings> | null);
  }

  const settings = await readJsonFile(siteSettingsFilePath, defaultSiteSettings);
  return withGoogleFormFallback(settings);
}

export async function writeSiteSettings(settings: SiteSettings) {
  const nextSettings = withGoogleFormFallback(settings);
  const db = await getMongoDb();

  if (db) {
    await db.collection("siteSettings").replaceOne(
      { key: "site-settings" },
      { key: "site-settings", ...nextSettings },
      { upsert: true }
    );
    return;
  }

  await writeJsonFile(siteSettingsFilePath, nextSettings);
}
