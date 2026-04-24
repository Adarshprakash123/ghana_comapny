import { NextResponse } from "next/server";
import type { BlogPost } from "../../data";
import { type BlogPayload, readBlogs, slugify, writeBlogs } from "./blog-store";

export const runtime = "nodejs";

export async function GET() {
  const blogs = await readBlogs();
  return NextResponse.json({ blogs });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as BlogPayload;
  const title = payload.title?.trim() ?? "";
  const content = payload.content?.trim() ?? "";

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and blog content are required." },
      { status: 400 }
    );
  }

  const blog: BlogPost = {
    id: crypto.randomUUID(),
    title,
    slug: slugify(payload.slug || title),
    excerpt: payload.excerpt?.trim() ?? "",
    coverImage: payload.coverImage?.trim() ?? "",
    content,
    createdAt: new Date().toISOString()
  };

  const blogs = [blog, ...(await readBlogs())];
  await writeBlogs(blogs);

  return NextResponse.json({ blog, blogs }, { status: 201 });
}
