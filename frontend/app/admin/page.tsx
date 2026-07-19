"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  defaultSearchFilters,
  type BlogPost,
  type PropertyListing,
  type SearchFilterConfig,
  type SiteSettings
} from "../data";

type AdminSection = "blog" | "api";
type UploadTarget = "blog" | "property" | null;

type PropertyForm = Omit<PropertyListing, "id">;

type QuillInstance = {
  root: HTMLElement;
  on: (eventName: "text-change", handler: () => void) => void;
};

type QuillConstructor = new (
  container: string | HTMLElement,
  options: Record<string, unknown>
) => QuillInstance;

type SiteDataResponse = {
  blogs: BlogPost[];
  properties: PropertyListing[];
  filters: SearchFilterConfig[];
  settings: SiteSettings;
};

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
  image: "",
  images: []
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function readJson<T>(response: Response) {
  return (await response.json()) as T;
}

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>("blog");
  const [quillReady, setQuillReady] = useState(false);
  const [quillFailed, setQuillFailed] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [configReady, setConfigReady] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogCoverImage, setBlogCoverImage] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [propertyForm, setPropertyForm] = useState<PropertyForm>(emptyPropertyForm);
  const [filters, setFilters] = useState<SearchFilterConfig[]>(defaultSearchFilters);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ googleFormUrl: "" });
  const [selectedFilter, setSelectedFilter] = useState("Looking for");
  const [newOption, setNewOption] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<UploadTarget>(null);
  const quillRef = useRef<QuillInstance | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

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
    if (!quillReady || activeSection !== "blog" || !isAuthenticated) {
      return;
    }

    const container = editorContainerRef.current ?? document.getElementById("blog-quill-editor");
    if (!container || quillRef.current) {
      return;
    }

    const Quill = (window as unknown as { Quill?: QuillConstructor }).Quill;
    if (!Quill) {
      return;
    }

    container.innerHTML = "";

    const instance = new Quill(container, {
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

    if (blogContent) {
      instance.root.innerHTML = blogContent;
    }

    instance.on("text-change", () => {
      setBlogContent(instance.root.innerHTML ?? "");
    });

    quillRef.current = instance;

    return () => {
      quillRef.current = null;
    };
  }, [activeSection, isAuthenticated, quillReady]);

  useEffect(() => {
    void initializeAdmin();
  }, []);

  useEffect(() => {
    if (!filters.some((filter) => filter.label === selectedFilter)) {
      const firstFilter = filters.find((filter) => filter.type === "checkbox-list");
      if (firstFilter) {
        setSelectedFilter(firstFilter.label);
      }
    }
  }, [filters, selectedFilter]);

  useEffect(() => {
    if (quillRef.current && quillRef.current.root.innerHTML !== blogContent) {
      quillRef.current.root.innerHTML = blogContent;
    }
  }, [blogContent]);

  async function initializeAdmin() {
    try {
      const sessionResponse = await fetch("/api/admin/session", { cache: "no-store" });
      const sessionPayload = await readJson<{
        authenticated: boolean;
        email: string | null;
        configReady: boolean;
      }>(sessionResponse);

      setConfigReady(sessionPayload.configReady);
      setIsAuthenticated(sessionPayload.authenticated);
      setAuthEmail(sessionPayload.email ?? "");
      setLoginEmail(sessionPayload.email ?? "");

      if (sessionPayload.authenticated) {
        await loadSiteData();
      }
    } catch {
      setStatusMessage("Could not load the admin session.");
    } finally {
      setSessionChecked(true);
    }
  }

  async function loadSiteData() {
    const response = await fetch("/api/site-data", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Could not load site data.");
    }
    const payload = await readJson<SiteDataResponse>(response);
    setBlogs(payload.blogs);
    setProperties(payload.properties);
    setFilters(payload.filters);
    setSiteSettings(payload.settings);
  }

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

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword
        })
      });
      const payload = await readJson<{ authenticated?: boolean; email?: string; error?: string }>(
        response
      );

      if (!response.ok) {
        setStatusMessage(payload.error ?? "Login failed.");
        return;
      }

      setIsAuthenticated(true);
      setAuthEmail(payload.email ?? loginEmail.trim());
      setLoginPassword("");
      await loadSiteData();
      setStatusMessage("Admin access granted.");
    } catch {
      setStatusMessage("Could not log in.");
    } finally {
      setIsSaving(false);
      setSessionChecked(true);
    }
  }

  async function handleLogout() {
    setIsSaving(true);

    try {
      await fetch("/api/admin/session", { method: "DELETE" });
      setIsAuthenticated(false);
      setAuthEmail("");
      setBlogs([]);
      setProperties([]);
      setStatusMessage("You have been logged out.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUploadImage(file: File, target: Exclude<UploadTarget, null>) {
    setUploadingTarget(target);
    setStatusMessage(`Uploading ${target} image...`);

    try {
      const formData = new FormData();
      const derivedFileName =
        target === "blog"
          ? `${blogSlug.trim() || slugify(blogTitle) || "blog-cover"}-${Date.now()}`
          : `${slugify(propertyForm.title) || "property-image"}-${Date.now()}`;

      formData.append("file", file);
      formData.append("fileName", derivedFileName);
      formData.append("folder", target === "blog" ? "/blogs" : "/properties");
      formData.append("tags", target === "blog" ? "blog,cover" : "property,listing");
      formData.append("useUniqueFileName", "true");

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData
      });
      const payload = await readJson<{ imageUrl?: string; error?: string }>(response);

      if (!response.ok || !payload.imageUrl) {
        setStatusMessage(payload.error ?? "Image upload failed.");
        return;
      }

      if (target === "blog") {
        setBlogCoverImage(payload.imageUrl);
      } else {
        updatePropertyField("image", payload.imageUrl);
      }

      setStatusMessage("Image uploaded successfully.");
    } catch {
      setStatusMessage("Could not upload the image.");
    } finally {
      setUploadingTarget(null);
    }
  }

  async function handleUploadMultipleImages(files: File[], target: Exclude<UploadTarget, null>) {
    setUploadingTarget(target);
    setStatusMessage(`Uploading ${files.length} ${target} image(s)...`);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        const derivedFileName =
          target === "blog"
            ? `${blogSlug.trim() || slugify(blogTitle) || "blog-cover"}-${Date.now()}-${i}`
            : `${slugify(propertyForm.title) || "property-image"}-${Date.now()}-${i}`;

        formData.append("file", file);
        formData.append("fileName", derivedFileName);
        formData.append("folder", target === "blog" ? "/blogs" : "/properties");
        formData.append("tags", target === "blog" ? "blog,cover" : "property,listing");
        formData.append("useUniqueFileName", "true");

        const response = await fetch("/api/admin/uploads", {
          method: "POST",
          body: formData
        });
        const payload = await readJson<{ imageUrl?: string; error?: string }>(response);

        if (response.ok && payload.imageUrl) {
          uploadedUrls.push(payload.imageUrl);
        }
      }

      if (uploadedUrls.length === 0) {
        setStatusMessage("Image upload failed.");
        return;
      }

      if (target === "blog") {
        setBlogCoverImage(uploadedUrls[0]);
      } else {
        setPropertyForm((current) => {
          const currentImages = current.images ?? (current.image ? [current.image] : []);
          const nextImages = [...currentImages, ...uploadedUrls];
          return {
            ...current,
            images: nextImages,
            image: current.image || nextImages[0] || ""
          };
        });
      }

      setStatusMessage(`Successfully uploaded ${uploadedUrls.length} image(s).`);
    } catch {
      setStatusMessage("Could not upload the images.");
    } finally {
      setUploadingTarget(null);
    }
  }

  async function handleSaveBlog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = blogTitle.trim();
    const content = blogContent.trim();

    if (!title || !content) {
      setStatusMessage("Add a title and blog content before saving the blog.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(editingBlogId ? `/api/blogs/${editingBlogId}` : "/api/blogs", {
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
      });
      const payload = await readJson<{ blogs?: BlogPost[]; error?: string }>(response);

      if (!response.ok || !payload.blogs) {
        setStatusMessage(payload.error ?? "Could not save the blog.");
        return;
      }

      setBlogs(payload.blogs);
      resetBlogForm();
      setStatusMessage(editingBlogId ? "Blog updated." : "Blog created.");
    } catch {
      setStatusMessage("Could not save the blog.");
    } finally {
      setIsSaving(false);
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
    setStatusMessage(`Editing "${blog.title}".`);
  }

  async function handleDeleteBlog(blog: BlogPost) {
    const confirmed = window.confirm(`Delete "${blog.title}"?`);
    if (!confirmed) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/blogs/${blog.id}`, {
        method: "DELETE"
      });
      const payload = await readJson<{ blogs?: BlogPost[]; error?: string }>(response);

      if (!response.ok || !payload.blogs) {
        setStatusMessage(payload.error ?? "Could not delete the blog.");
        return;
      }

      setBlogs(payload.blogs);
      if (editingBlogId === blog.id) {
        resetBlogForm();
      }
      setStatusMessage("Blog deleted.");
    } catch {
      setStatusMessage("Could not delete the blog.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!propertyForm.title.trim()) {
      setStatusMessage("Add a property title before saving site data.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(propertyForm)
      });
      const payload = await readJson<{ properties?: PropertyListing[]; error?: string }>(response);

      if (!response.ok || !payload.properties) {
        setStatusMessage(payload.error ?? "Could not create the property.");
        return;
      }

      setProperties(payload.properties);
      setPropertyForm(emptyPropertyForm);
      setStatusMessage("Property created.");
    } catch {
      setStatusMessage("Could not create the property.");
    } finally {
      setIsSaving(false);
    }
  }

  function updatePropertyField(field: keyof PropertyForm, value: string) {
    setPropertyForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function saveFilters(nextFilters: SearchFilterConfig[], message: string) {
    setFilters(nextFilters);
    setIsSaving(true);

    try {
      const response = await fetch("/api/site-data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ filters: nextFilters })
      });
      const payload = await readJson<{ filters?: SearchFilterConfig[]; error?: string }>(response);

      if (!response.ok || !payload.filters) {
        setStatusMessage(payload.error ?? "Could not update the search filters.");
        return;
      }

      setFilters(payload.filters);
      setStatusMessage(message);
    } catch {
      setStatusMessage("Could not update the search filters.");
    } finally {
      setIsSaving(false);
    }
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

    setNewOption("");
    void saveFilters(nextFilters, "Search filter option added.");
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

    void saveFilters(nextFilters, "Search filter option removed.");
  }

  async function handleSaveGoogleFormUrl() {
    setIsSaving(true);

    try {
      const response = await fetch("/api/site-data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ settings: siteSettings })
      });
      const payload = await readJson<{ settings?: SiteSettings; error?: string }>(response);

      if (!response.ok || !payload.settings) {
        setStatusMessage(payload.error ?? "Could not save the Google Form link.");
        return;
      }

      setSiteSettings(payload.settings);
      setStatusMessage("Google Form link saved.");
    } catch {
      setStatusMessage("Could not save the Google Form link.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteProperty(property: PropertyListing) {
    const confirmed = window.confirm(`Delete "${property.title}"?`);
    if (!confirmed) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: "DELETE"
      });
      const payload = await readJson<{ properties?: PropertyListing[]; error?: string }>(response);

      if (!response.ok || !payload.properties) {
        setStatusMessage(payload.error ?? "Could not delete the property.");
        return;
      }

      setProperties(payload.properties);
      setStatusMessage("Property deleted.");
    } catch {
      setStatusMessage("Could not delete the property.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!sessionChecked) {
    return (
      <main className="admin-shell">
        <section className="admin-content" style={{ display: "grid", placeItems: "center" }}>
          <p className="admin-status">Checking admin access...</p>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="admin-shell">
        <section className="admin-content" style={{ maxWidth: 560, margin: "0 auto" }}>
          <header className="admin-header">
            <div>
              <p className="admin-kicker">Admin Access</p>
              <h1>Sign in to Fairhaven Admin</h1>
            </div>
            <Link href="/" className="admin-home-link">
              View Site
            </Link>
          </header>

          {!configReady && (
            <p className="admin-status">
              Admin credentials are not configured yet. Add them to `frontend/.env.local`.
            </p>
          )}

          {statusMessage && <p className="admin-status">{statusMessage}</p>}

          <form className="admin-panel admin-form" onSubmit={handleLogin}>
            <label>
              Admin Gmail
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                placeholder="admin@gmail.com"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                placeholder="Password"
              />
            </label>
            <button type="submit" className="admin-primary-button" disabled={isSaving || !configReady}>
              {isSaving ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </section>
      </main>
    );
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
            <p className="admin-muted">Signed in as {authEmail}</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/" className="admin-home-link">
              View Site
            </Link>
            <button type="button" className="admin-secondary-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
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
                Cover Image
                <input type="text" value={blogCoverImage} readOnly placeholder="Upload an image below" />
              </label>
              <label>
                Upload Cover Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void handleUploadImage(file, "blog");
                    }
                    event.currentTarget.value = "";
                  }}
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
                  <div id="blog-quill-editor" ref={editorContainerRef} className="blog-quill-editor" />
                )}
              </div>

              <button type="submit" className="admin-primary-button" disabled={isSaving}>
                {editingBlogId ? "Update Blog" : "Create Blog"}
              </button>
              {uploadingTarget === "blog" && <p className="admin-muted">Uploading blog image...</p>}
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
                          onClick={() => void handleDeleteBlog(blog)}
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
                Upload Property Images (Select Multiple)
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    if (files.length > 0) {
                      void handleUploadMultipleImages(files, "property");
                    }
                    event.currentTarget.value = "";
                  }}
                />
              </label>

              {(propertyForm.images && propertyForm.images.length > 0) ? (
                <div className="admin-uploaded-images-preview" style={{ marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#8b94a5", fontWeight: 600 }}>
                    Uploaded Property Images ({propertyForm.images.length})
                  </span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                      gap: "0.75rem",
                      marginTop: "0.5rem"
                    }}
                  >
                    {propertyForm.images.map((imgUrl, idx) => {
                      const isCover = imgUrl === propertyForm.image;
                      return (
                        <div
                          key={idx}
                          style={{
                            position: "relative",
                            border: isCover ? "2px solid #d2b48c" : "1px solid #1a2942",
                            borderRadius: "4px",
                            overflow: "hidden",
                            background: "#0a1629",
                            padding: "0.25rem",
                            display: "flex",
                            flexDirection: "column"
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt={`Uploaded property image ${idx + 1}`}
                            style={{ width: "100%", height: "75px", objectFit: "cover", borderRadius: "2px" }}
                          />
                          <div style={{ display: "flex", gap: "0.25rem", marginTop: "0.35rem" }}>
                            <button
                              type="button"
                              onClick={() => updatePropertyField("image", imgUrl)}
                              style={{
                                flex: 1,
                                fontSize: "0.65rem",
                                padding: "0.25rem 0.1rem",
                                background: isCover ? "#d2b48c" : "#1a2942",
                                color: isCover ? "#081222" : "#fff",
                                border: "none",
                                borderRadius: "2px",
                                cursor: "pointer",
                                fontWeight: "bold"
                              }}
                            >
                              {isCover ? "★ Cover" : "Set Cover"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const nextImages = (propertyForm.images || []).filter((_, i) => i !== idx);
                                setPropertyForm((prev) => ({
                                  ...prev,
                                  images: nextImages,
                                  image: prev.image === imgUrl ? nextImages[0] || "" : prev.image
                                }));
                              }}
                              style={{
                                fontSize: "0.65rem",
                                padding: "0.25rem 0.4rem",
                                background: "#7f1d1d",
                                color: "#fff",
                                border: "none",
                                borderRadius: "2px",
                                cursor: "pointer"
                              }}
                              title="Delete image"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : propertyForm.image ? (
                <div style={{ marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#8b94a5", display: "block", marginBottom: "0.25rem" }}>
                    Cover Image
                  </span>
                  <img
                    src={propertyForm.image}
                    alt="Cover image"
                    style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "4px", border: "1px solid #1a2942" }}
                  />
                </div>
              ) : null}
              <label>
                Description
                <textarea
                  rows={4}
                  value={propertyForm.description}
                  onChange={(event) => updatePropertyField("description", event.target.value)}
                  placeholder="Short property description"
                />
              </label>

              <button type="submit" className="admin-primary-button" disabled={isSaving}>
                Create Property
              </button>
              {uploadingTarget === "property" && <p className="admin-muted">Uploading property image...</p>}
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

              <h2>Google Form Link</h2>
              <label style={{ display: "block", marginBottom: "1rem" }}>
                Contact Form URL
                <input
                  type="url"
                  value={siteSettings.googleFormUrl}
                  onChange={(event) =>
                    setSiteSettings((current) => ({
                      ...current,
                      googleFormUrl: event.target.value
                    }))
                  }
                  placeholder="https://forms.gle/..."
                />
              </label>
              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => void handleSaveGoogleFormUrl()}
              >
                Save Google Form Link
              </button>

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
                        onClick={() => void handleDeleteProperty(property)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
