"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  blogStorageKey,
  defaultProperties,
  defaultSearchFilters,
  filterStorageKey,
  propertyStorageKey,
  type BlogPost,
  type PropertyListing,
  type SearchFilterConfig
} from "../data";
import { staticBlogs, staticProperties } from "../static-content";

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
  const [blogs, setBlogs] = useState<BlogPost[]>(staticBlogs);
  const [properties, setProperties] = useState<PropertyListing[]>(staticProperties);
  const [propertyForm, setPropertyForm] = useState<PropertyForm>(emptyPropertyForm);
  const [filters, setFilters] = useState<SearchFilterConfig[]>(defaultSearchFilters);
  const [selectedFilter, setSelectedFilter] = useState("Looking for");
  const [newOption, setNewOption] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const quillRef = useRef<QuillInstance | null>(null);

  useEffect(() => {
    setFilters(readStoredJson(filterStorageKey, defaultSearchFilters));
    setProperties(readStoredJson(propertyStorageKey, staticProperties));
    setBlogs(readStoredJson(blogStorageKey, staticBlogs));
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

    const nextBlog: BlogPost = {
      id: editingBlogId ?? crypto.randomUUID(),
      title,
      slug: blogSlug.trim() || slugify(title),
      excerpt: blogExcerpt.trim(),
      coverImage: blogCoverImage.trim(),
      content,
      createdAt:
        blogs.find((blog) => blog.id === editingBlogId)?.createdAt ?? new Date().toISOString()
    };

    const nextBlogs = editingBlogId
      ? blogs.map((blog) => (blog.id === editingBlogId ? nextBlog : blog))
      : [nextBlog, ...blogs];

    writeStoredJson(blogStorageKey, nextBlogs);
    setBlogs(nextBlogs);
    resetBlogForm();
    setStatusMessage(editingBlogId ? "Blog updated locally." : "Blog created locally.");
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
    setStatusMessage(`Editing "${blog.title}". Save to update the local data.`);
  }

  async function handleDeleteBlog(blog: BlogPost) {
    const confirmed = window.confirm(`Delete "${blog.title}"?`);
    if (!confirmed) {
      return;
    }

    const nextBlogs = blogs.filter((item) => item.id !== blog.id);
    writeStoredJson(blogStorageKey, nextBlogs);
    setBlogs(nextBlogs);
    if (editingBlogId === blog.id) {
      resetBlogForm();
    }
    setStatusMessage("Blog deleted locally.");
  }

  async function handleCreateProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!propertyForm.title.trim()) {
      setStatusMessage("Add a property title before creating API data.");
      return;
    }

    const nextProperty: PropertyListing = {
      id: `${slugify(propertyForm.title)}-${Date.now()}`,
      ...propertyForm
    };
    const nextProperties = [nextProperty, ...properties];
    writeStoredJson(propertyStorageKey, nextProperties);
    setProperties(nextProperties);
    setPropertyForm(emptyPropertyForm);
    setStatusMessage("Property created locally for the exported site.");
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
    setStatusMessage("Search filter option updated locally.");
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
    setProperties(staticProperties);
    setBlogs(staticBlogs);
    setFilters(defaultSearchFilters);
    writeStoredJson(propertyStorageKey, staticProperties);
    writeStoredJson(blogStorageKey, staticBlogs);
    writeStoredJson(filterStorageKey, defaultSearchFilters);
    setStatusMessage("Local data reset to the starter values.");
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
          Site Data
        </button>
      </aside>

      <section className="admin-content">
        <header className="admin-header">
          <div>
            <p className="admin-kicker">Admin Frontend</p>
            <h1>{activeSection === "blog" ? "Create Blog" : "Create Search Data"}</h1>
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
              <h2>Blog Preview</h2>
              <div className="admin-preview-list">
                {blogs.length === 0 ? (
                  <p className="admin-muted">No blogs yet.</p>
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
                Create Property
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

              <h2>Created Records</h2>
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
                          const nextProperties = properties.filter((item) => item.id !== property.id);
                          writeStoredJson(propertyStorageKey, nextProperties);
                          setProperties(nextProperties);
                          setStatusMessage("Property deleted locally.");
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <button type="button" className="admin-secondary-button" onClick={resetDummyData}>
                Reset Local Data
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
