import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readBlogs } from "@/lib/server/content-store";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blogs = await readBlogs();
  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="akka-page" style={{ backgroundColor: "#081222", minHeight: "100vh" }}>
      <header className="topbar">
        <div className="logo-card">
          <Link href="/">
            <Image
              src="/IMG_8557.JPG"
              alt="Fairhaven"
              width={220}
              height={220}
              className="logo-image"
              priority
            />
          </Link>
        </div>
      </header>

      <section
        style={{
          position: "relative",
          background: "linear-gradient(180deg, #0a1629 0%, #060e1b 100%)",
          padding: "10rem 5% 4rem",
          color: "#fff",
          borderBottom: "1px solid #1a2942"
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <span
            style={{
              background: "#d2b48c",
              color: "#081222",
              padding: "0.25rem 0.75rem",
              fontSize: "0.8rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "1.5rem",
              display: "inline-block"
            }}
          >
            Fairhaven Journal
          </span>

          <h1
            style={{
              fontSize: "3.5rem",
              margin: "0 0 1.5rem",
              lineHeight: "1.2",
              fontFamily: "'Playfair Display', serif"
            }}
          >
            {blog.title}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              color: "#8b94a5",
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}
          >
            <p>
              Published on{" "}
              {new Date(blog.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>
        </div>
      </section>

      <section
        className="section-shell"
        style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 2rem", background: "#081222" }}
      >
        {blog.excerpt && (
          <div
            style={{
              fontSize: "1.2rem",
              lineHeight: "1.8",
              color: "#d2b48c",
              marginBottom: "3rem",
              fontStyle: "italic",
              borderLeft: "4px solid #d2b48c",
              paddingLeft: "1.5rem"
            }}
          >
            {blog.excerpt}
          </div>
        )}

        <div
          className="blog-content-body"
          style={{
            fontSize: "1.1rem",
            lineHeight: "1.9",
            color: "#cbd5e1"
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .blog-content-body h1, .blog-content-body h2, .blog-content-body h3 {
          font-family: 'Playfair Display', serif;
          color: #eaddcc;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .blog-content-body h1 { font-size: 2.2rem; }
        .blog-content-body h2 { font-size: 1.8rem; }
        .blog-content-body h3 { font-size: 1.4rem; }
        .blog-content-body p {
          margin-bottom: 1.5rem;
        }
        .blog-content-body ul, .blog-content-body ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        .blog-content-body li {
          margin-bottom: 0.5rem;
        }
        .blog-content-body blockquote {
          border-left: 4px solid #1a2942;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #8b94a5;
        }
        .blog-content-body a {
          color: #d2b48c;
          text-decoration: underline;
        }
      `
        }}
      />

      <footer className="site-footer" style={{ borderTop: "1px solid #1a2942", backgroundColor: "#060e1b" }}>
        <div className="footer-bottom" style={{ borderTop: "none" }}>
          <p>
            <Link href="/#blog" style={{ color: "#d2b48c", textDecoration: "none" }}>
              ← Back to All Blogs
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
