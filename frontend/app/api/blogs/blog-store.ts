import { promises as fs } from "fs";
import path from "path";
import type { BlogPost } from "../../data";

export type BlogPayload = {
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  content?: string;
};

const blogsFilePath = path.join(process.cwd(), "data", "blogs.json");

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function readBlogs() {
  try {
    const file = await fs.readFile(blogsFilePath, "utf8");
    return JSON.parse(file) as BlogPost[];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function writeBlogs(blogs: BlogPost[]) {
  await fs.mkdir(path.dirname(blogsFilePath), { recursive: true });
  await fs.writeFile(blogsFilePath, JSON.stringify(blogs, null, 2));
}
