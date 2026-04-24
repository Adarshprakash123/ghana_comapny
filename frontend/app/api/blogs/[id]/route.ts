import { NextResponse } from "next/server";
import type { BlogPost } from "../../../data";
import { type BlogPayload, readBlogs, slugify, writeBlogs } from "../blog-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const blogs = await readBlogs();
  const blog = blogs.find((item) => item.id === id);

  if (!blog) {
    return NextResponse.json({ error: "Blog not found." }, { status: 404 });
  }

  return NextResponse.json({ blog });
}

export async function PUT(request: Request, context: RouteContext) {
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

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const blogs = await readBlogs();
  const nextBlogs = blogs.filter((blog) => blog.id !== id);

  if (nextBlogs.length === blogs.length) {
    return NextResponse.json({ error: "Blog not found." }, { status: 404 });
  }

  await writeBlogs(nextBlogs);

  return NextResponse.json({ blogs: nextBlogs });
}
