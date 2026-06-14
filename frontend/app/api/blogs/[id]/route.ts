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

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const blogs = await readBlogs();
  const blog = blogs.find((item) => item.id === id);

  if (!blog) {
    return NextResponse.json({ error: "Blog not found." }, { status: 404 });
  }

  return NextResponse.json({ blog });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!readAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const payload = (await request.json()) as BlogPayload;
  const title = payload.title?.trim() ?? "";
  const content = payload.content?.trim() ?? "";

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and blog content are required." },
      { status: 400 }
    );
  }

  const blogs = await readBlogs();
  const blogIndex = blogs.findIndex((item) => item.id === id);

  if (blogIndex === -1) {
    return NextResponse.json({ error: "Blog not found." }, { status: 404 });
  }

  const updatedBlog: BlogPost = {
    ...blogs[blogIndex],
    title,
    slug: slugify(payload.slug || title),
    excerpt: payload.excerpt?.trim() ?? "",
    coverImage: payload.coverImage?.trim() ?? "",
    content
  };

  const nextBlogs = blogs.map((blog) => (blog.id === id ? updatedBlog : blog));
  await writeBlogs(nextBlogs);

  return NextResponse.json({ blog: updatedBlog, blogs: nextBlogs });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!readAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const blogs = await readBlogs();
  const nextBlogs = blogs.filter((blog) => blog.id !== id);

  if (nextBlogs.length === blogs.length) {
    return NextResponse.json({ error: "Blog not found." }, { status: 404 });
  }

  await writeBlogs(nextBlogs);

  return NextResponse.json({ blogs: nextBlogs });
}
