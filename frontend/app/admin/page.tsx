"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  defaultProperties,
  defaultSearchFilters,
  filterStorageKey,
  propertyStorageKey,
  type BlogPost,
  type PropertyListing,
  type SearchFilterConfig
} from "../data";

type AdminSection = "blog" | "api";

type PropertyForm = Omit<PropertyListing, "id">;

type QuillInstance = {
  root: HTMLElement;
  on: (eventName: "text-change", handler: () => void) => void;
};

type QuillConstructor = new (
  selector: string,
  options: Record<string, unknown>
) => QuillInstance;

const emptyPropertyForm: PropertyForm = {
  city: "Accra",
  location: "Airport Residential",
  title: "",
  type: "Apartment",
  status: "For Sale",
  meta: "Apartment | 1200s",
  description: "",
  price: "GHC ",
  beds: "3 Bedrooms",
  baths: "3 Bathrooms",
  parking: "1 Parking Spaces",
  image:
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80"
};

function readStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const value = window.localStorage.getItem(key);
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function writeStoredJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>("blog");
  const [quillReady, setQuillReady] = useState(false);
  const [quillFailed, setQuillFailed] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogCoverImage, setBlogCoverImage] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [properties, setProperties] = useState<PropertyListing[]>(defaultProperties);
  const [propertyForm, setPropertyForm] = useState<PropertyForm>(emptyPropertyForm);
  const [filters, setFilters] = useState<SearchFilterConfig[]>(defaultSearchFilters);
  const [selectedFilter, setSelectedFilter] = useState("Looking for");
  const [newOption, setNewOption] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const quillRef = useRef<QuillInstance | null>(null);

  useEffect(() => {
    setFilters(readStoredJson(filterStorageKey, defaultSearchFilters));

    async function loadProperties() {
      try {
        const response = await fetch("/api/properties");
        if (response.ok) {
          const data = (await response.json()) as { properties: PropertyListing[] };
          if (data.properties && data.properties.length > 0) {
            setProperties(data.properties);
          }
        }
      } catch {
        // Fallback to default
      }
    }
    loadProperties();

    async function loadBlogs() {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) {
          throw new Error("Blog API failed");
        }

        const data = (await response.json()) as { blogs: BlogPost[] };
        setBlogs(data.blogs);
      } catch {
        setStatusMessage("Could not load blogs from the API.");
      }
    }

    loadBlogs();
  }, []);

  useEffect(() => {
    const existingQuill = (window as unknown as { Quill?: QuillConstructor }).Quill;
    if (existingQuill) {
      setQuillReady(true);
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.quilljs.com/1.3.7/quill.snow.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.quilljs.com/1.3.7/quill.min.js";
    script.async = true;
    script.onload = () => setQuillReady(true);
    script.onerror = () => setQuillFailed(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!quillReady || quillRef.current || activeSection !== "blog") {
      return;
    }

    const Quill = (window as unknown as { Quill?: QuillConstructor }).Quill;
    if (!Quill) {
      return;
    }

    quillRef.current = new Quill("#blog-quill-editor", {
      theme: "snow",
      placeholder: "Write the blog content here...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "blockquote"],
          ["clean"]
        ]
      }
    });
    quillRef.current.on("text-change", () => {
      setBlogContent(quillRef.current?.root.innerHTML ?? "");
    });
  }, [activeSection, quillReady]);

  function resetBlogForm() {
    setEditingBlogId(null);
    setBlogTitle("");
    setBlogSlug("");
    setBlogExcerpt("");
    setBlogCoverImage("");
    setBlogContent("");
    if (quillRef.current) {
      quillRef.current.root.innerHTML = "";
    }
  }

  async function handleSaveBlog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = blogTitle.trim();
    const content = blogContent.trim();

    if (!title || !content) {
      setStatusMessage("Add a title and blog content before creating the blog.");
      return;
    }

    try {
      const response = await fetch(
        editingBlogId ? `/api/blogs/${encodeURIComponent(editingBlogId)}` : "/api/blogs",
        {
          method: editingBlogId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            slug: blogSlug.trim() || slugify(title),
            excerpt: blogExcerpt.trim(),
            coverImage: blogCoverImage.trim(),
            content
          })
        }
      );

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Blog API failed");
      }

      const data = (await response.json()) as { blogs: BlogPost[] };
      setBlogs(data.blogs);
      resetBlogForm();
      setStatusMessage(
        editingBlogId
          ? "Blog updated through PUT /api/blogs/:id."
          : "Blog created through POST /api/blogs and saved for the homepage."
      );
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Could not save blog.");
    }
  }

  function handleEditBlog(blog: BlogPost) {
    setEditingBlogId(blog.id);
    setBlogTitle(blog.title);
    setBlogSlug(blog.slug);
    setBlogExcerpt(blog.excerpt);
    setBlogCoverImage(blog.coverImage);
    setBlogContent(blog.content);
    if (quillRef.current) {
      quillRef.current.root.innerHTML = blog.content;
    }
    setStatusMessage(`Editing "${blog.title}". Save to send PUT /api/blogs/${blog.id}.`);
  }

  async function handleDeleteBlog(blog: BlogPost) {
    const confirmed = window.confirm(`Delete "${blog.title}"?`);
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${encodeURIComponent(blog.id)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Blog API failed");
      }

      const data = (await response.json()) as { blogs: BlogPost[] };
      setBlogs(data.blogs);
      if (editingBlogId === blog.id) {
        resetBlogForm();
      }
      setStatusMessage("Blog deleted through DELETE /api/blogs/:id.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Could not delete blog.");
    }
  }

  async function handleCreateProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!propertyForm.title.trim()) {
      setStatusMessage("Add a property title before creating API data.");
      return;
    }

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyForm)
      });

      if (!response.ok) {
        throw new Error("Failed to create property via API.");
      }

      const data = (await response.json()) as { properties: PropertyListing[] };
      setProperties(data.properties);
      setPropertyForm(emptyPropertyForm);
      setStatusMessage("Search API dummy data created via API. Go to the homepage and search for it.");
    } catch {
      setStatusMessage("Could not create property via API.");
    }
  }

  function updatePropertyField(field: keyof PropertyForm, value: string) {
    setPropertyForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function addFilterOption(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanOption = newOption.trim();
    if (!cleanOption) {
      return;
    }

    const nextFilters = filters.map((filter) => {
      if (filter.label !== selectedFilter || filter.type !== "checkbox-list") {
        return filter;
      }

      if (filter.options.includes(cleanOption)) {
        return filter;
      }

      return {
        ...filter,
        options: [...filter.options, cleanOption]
      };
    });
    setFilters(nextFilters);
    writeStoredJson(filterStorageKey, nextFilters);
    setNewOption("");
    setStatusMessage("Search filter option updated for the homepage dummy API.");
  }

  function removeFilterOption(filterLabel: string, option: string) {
    if (option === "Select All") {
      return;
    }

    const nextFilters = filters.map((filter) => {
      if (filter.label !== filterLabel || filter.type !== "checkbox-list") {
        return filter;
      }

      return {
        ...filter,
        options: filter.options.filter((item) => item !== option)
      };
    });
    setFilters(nextFilters);
    writeStoredJson(filterStorageKey, nextFilters);
  }

  function resetDummyData() {
    setProperties(defaultProperties);
    setFilters(defaultSearchFilters);
    writeStoredJson(propertyStorageKey, defaultProperties);
    writeStoredJson(filterStorageKey, defaultSearchFilters);
    setStatusMessage("Dummy API data reset to the starter values.");
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-brand">
          Fairhaven Admin
        </Link>
        <button
          type="button"
          className={`admin-nav-button ${activeSection === "blog" ? "active" : ""}`}
          onClick={() => setActiveSection("blog")}
        >
          Blog
        </button>
        <button
          type="button"
          className={`admin-nav-button ${activeSection === "api" ? "active" : ""}`}
          onClick={() => setActiveSection("api")}
        >
          API Data
        </button>
      </aside>

      <section className="admin-content">
        <header className="admin-header">
          <div>
            <p className="admin-kicker">Admin Frontend</p>
            <h1>{activeSection === "blog" ? "Create Blog" : "Create Search API Data"}</h1>
          </div>
          <Link href="/" className="admin-home-link">
            View Site
          </Link>
        </header>

        {statusMessage && <p className="admin-status">{statusMessage}</p>}

        {activeSection === "blog" ? (
          <div className="admin-grid">
            <form className="admin-panel admin-form" onSubmit={handleSaveBlog}>
              <label>
                Blog Title
                <input
                  type="text"
                  value={blogTitle}
                  onChange={(event) => {
                    setBlogTitle(event.target.value);
                    setBlogSlug(slugify(event.target.value));
                  }}
                  placeholder="Luxury living in Airport Residential"
                />
              </label>
              <label>
                Slug
                <input
                  type="text"
                  value={blogSlug}
                  onChange={(event) => setBlogSlug(event.target.value)}
                  placeholder="luxury-living-airport-residential"
                />
              </label>
              <label>
                Cover Image URL
                <input
                  type="url"
                  value={blogCoverImage}
                  onChange={(event) => setBlogCoverImage(event.target.value)}
                  placeholder="https://..."
                />
              </label>
              <label>
                Excerpt
                <textarea
                  value={blogExcerpt}
                  onChange={(event) => setBlogExcerpt(event.target.value)}
                  rows={3}
                  placeholder="Short summary for the blog card"
                />
              </label>

              <div className="admin-editor-wrap">
                <span>Quill Blog Editor</span>
                {quillFailed ? (
                  <textarea
                    value={blogContent}
                    onChange={(event) => setBlogContent(event.target.value)}
                    rows={12}
                    placeholder="Quill CDN did not load. Write HTML/plain content here."
                  />
                ) : (
                  <div id="blog-quill-editor" className="blog-quill-editor" />
                )}
              </div>

              <button type="submit" className="admin-primary-button">
                {editingBlogId ? "Update Blog" : "Create Blog"}
              </button>
              {editingBlogId && (
                <button type="button" className="admin-secondary-button" onClick={resetBlogForm}>
                  Cancel Edit
                </button>
              )}
            </form>

            <div className="admin-panel">
              <h2>Blog API Preview</h2>
              <div className="admin-preview-list">
                {blogs.length === 0 ? (
                  <p className="admin-muted">No blog payloads yet.</p>
                ) : (
                  blogs.map((blog) => (
                    <article key={blog.id} className="admin-preview-card">
                      <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
                      <h3>{blog.title}</h3>
                      <span>/blog/{blog.slug}</span>
                      <div className="admin-card-actions">
                        <button type="button" onClick={() => handleEditBlog(blog)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDeleteBlog(blog)}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="admin-grid">
            <form className="admin-panel admin-form" onSubmit={handleCreateProperty}>
              <div className="admin-form-row">
                <label>
                  Title
                  <input
                    type="text"
                    value={propertyForm.title}
                    onChange={(event) => updatePropertyField("title", event.target.value)}
                    placeholder="2 Bedroom Apartment in Labone"
                  />
                </label>
                <label>
                  Price
                  <input
                    type="text"
                    value={propertyForm.price}
                    onChange={(event) => updatePropertyField("price", event.target.value)}
                    placeholder="GHC 5,000,000"
                  />
                </label>
              </div>

              <div className="admin-form-row">
                <label>
                  Location
                  <input
                    type="text"
                    value={propertyForm.location}
                    onChange={(event) => updatePropertyField("location", event.target.value)}
                  />
                </label>
                <label>
                  Property Type
                  <select
                    value={propertyForm.type}
                    onChange={(event) => updatePropertyField("type", event.target.value)}
                  >
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Land</option>
                    <option>Office</option>
                    <option>Retail</option>
                    <option>Townhouse</option>
                    <option>Warehouse</option>
                  </select>
                </label>
              </div>

              <div className="admin-form-row">
                <label>
                  Status
                  <select
                    value={propertyForm.status}
                    onChange={(event) =>
                      updatePropertyField("status", event.target.value as PropertyForm["status"])
                    }
                  >
                    <option>For Sale</option>
                    <option>For Rent</option>
                  </select>
                </label>
                <label>
                  Bedrooms
                  <select
                    value={propertyForm.beds}
                    onChange={(event) => updatePropertyField("beds", event.target.value)}
                  >
                    <option>1 Bedroom</option>
                    <option>2 Bedrooms</option>
                    <option>3 Bedrooms</option>
                    <option>4 Bedrooms</option>
                    <option>5+ Bedrooms</option>
                  </select>
                </label>
              </div>

              <div className="admin-form-row">
                <label>
                  Bathrooms
                  <input
                    type="text"
                    value={propertyForm.baths}
                    onChange={(event) => updatePropertyField("baths", event.target.value)}
                  />
                </label>
                <label>
                  Parking
                  <input
                    type="text"
                    value={propertyForm.parking}
                    onChange={(event) => updatePropertyField("parking", event.target.value)}
                  />
                </label>
              </div>

              <label>
                Image URL
                <input
                  type="url"
                  value={propertyForm.image}
                  onChange={(event) => updatePropertyField("image", event.target.value)}
                />
              </label>
              <label>
                Description
                <textarea
                  rows={4}
                  value={propertyForm.description}
                  onChange={(event) => updatePropertyField("description", event.target.value)}
                  placeholder="Short property description"
                />
              </label>

              <button type="submit" className="admin-primary-button">
                Create API Data
              </button>
            </form>

            <div className="admin-panel">
              <h2>Search Options</h2>
              <form className="admin-option-form" onSubmit={addFilterOption}>
                <select
                  value={selectedFilter}
                  onChange={(event) => setSelectedFilter(event.target.value)}
                >
                  {filters
                    .filter((filter) => filter.type === "checkbox-list")
                    .map((filter) => (
                      <option key={filter.label}>{filter.label}</option>
                    ))}
                </select>
                <input
                  type="text"
                  value={newOption}
                  onChange={(event) => setNewOption(event.target.value)}
                  placeholder="Add option"
                />
                <button type="submit">Add</button>
              </form>

              <div className="admin-filter-list">
                {filters.map((filter) =>
                  filter.type === "checkbox-list" ? (
                    <div key={filter.label}>
                      <h3>{filter.label}</h3>
                      <div className="admin-option-chips">
                        {filter.options.map((option) => (
                          <button
                            type="button"
                            key={option}
                            onClick={() => removeFilterOption(filter.label, option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
              </div>

              <h2>Created API Records</h2>
              <div className="admin-preview-list">
                {properties.map((property) => (
                  <article key={property.id} className="admin-preview-card">
                    <p>
                      {property.status} / {property.location}
                    </p>
                    <h3>{property.title}</h3>
                    <span>
                      {property.type} / {property.beds} / {property.price}
                    </span>
                    <div className="admin-card-actions" style={{ marginTop: "1rem" }}>
                      <button
                        type="button"
                        className="danger"
                        onClick={async () => {
                          const confirmed = window.confirm(`Delete "${property.title}"?`);
                          if (!confirmed) return;
                          try {
                            const response = await fetch(`/api/properties/${encodeURIComponent(property.id)}`, { method: "DELETE" });
                            if (response.ok) {
                              const data = await response.json() as { properties: PropertyListing[] };
                              setProperties(data.properties);
                              setStatusMessage("Property deleted.");
                            }
                          } catch {
                            setStatusMessage("Failed to delete property.");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <button type="button" className="admin-secondary-button" onClick={resetDummyData}>
                Reset Dummy API Data
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
