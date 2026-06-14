import { NextRequest, NextResponse } from "next/server";
import type { BlogPost } from "@/app/data";
import { readAdminSessionFromRequest } from "@/lib/server/admin-auth";
import { readBlogs, slugify, writeBlogs } from "@/lib/server/content-store";

export const runtime = "nodejs";

type BlogPayload = {
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  content?: string;
};

export async function GET() {
  const blogs = await readBlogs();
  return NextResponse.json({ blogs });
}

export async function POST(request: NextRequest) {
  if (!readAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

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
