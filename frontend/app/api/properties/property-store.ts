import { promises as fs } from "fs";
import path from "path";
import type { PropertyListing } from "../../data";

export type PropertyPayload = Omit<PropertyListing, "id"> & { id?: string };

const propertiesFilePath = path.join(process.cwd(), "data", "properties.json");

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function readProperties() {
  try {
    const file = await fs.readFile(propertiesFilePath, "utf8");
    return JSON.parse(file) as PropertyListing[];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function writeProperties(properties: PropertyListing[]) {
  await fs.mkdir(path.dirname(propertiesFilePath), { recursive: true });
  await fs.writeFile(propertiesFilePath, JSON.stringify(properties, null, 2));
}
