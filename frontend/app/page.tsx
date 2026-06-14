"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  defaultSearchFilters,
  type BlogPost,
  type PropertyListing,
  type SearchFilterConfig,
  type SiteSettings
} from "./data";
import { staticBlogs, staticProperties } from "./static-content";

const navItems = [
  { label: "Home", href: "#" },
  { label: "About Us", href: "#about" },
  {
    label: "Our Services",
    href: "#services",
    dropdown: ["Sales", "Property Management", "Relocation Management"]
  },
  {
    label: "Properties",
    href: "#properties",
    dropdown: ["Rent", "Sale"]
  },
  { label: "Blog", href: "#blog" },
  { label: "Careers", href: "#careers" },
  { label: "Contact Us", href: "#contact" }
];

const serviceCards = [
  {
    title: "Sales & Lettings",
    text: "We help you find the house or office of your dreams!",
    icon: "⌂"
  },
  {
    title: "Property Management",
    text: "How your property is managed today determines its worth tomorrow!",
    icon: "◎"
  },
  {
    title: "Construction Consultancy",
    text: "Thinking of developing a project? Let the experts guide you!",
    icon: "⌘"
  }
];

const neighborhoods = [
  {
    name: "Airport Residential",
    text: "Considered the most exclusive and secure residential area in the city.",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Cantonments",
    text: "Perfect blend of residential, recreational, dinning and shopping experience.",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "East Legon",
    text: "Perfect mix of tranquility and entertainment in the exciting city of Accra.",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Labone",
    text: "Perfect mix of tranquility and entertainment in the exciting city of Accra.",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80"
  }
];

const footerLinks = [
  { label: "About Us", href: "#about" },
  { label: "Our Services", href: "#services" },
  { label: "For Sale", href: "#properties" },
  { label: "For Rent", href: "#properties" },
  { label: "Blog", href: "#blog" },
  { label: "Careers", href: "#careers" }
];
const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1ESUryEUc2/?mibextid=wwXIfr",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.2 8.2V6.8c0-.7.5-1.1 1.2-1.1h1.8V2.6c-.9-.1-1.7-.2-2.6-.2-2.7 0-4.5 1.6-4.5 4.5v1.3H7.2v3.5h2.9v8.9h3.6v-8.9h2.9l.5-3.5h-3Z" />
      </svg>
    )
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/fairhaven_properties_ghana?igsh=cWhhbGY1ZmRjNml6",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.4 2.8h9.2c2.5 0 4.6 2.1 4.6 4.6v9.2c0 2.5-2.1 4.6-4.6 4.6H7.4c-2.5 0-4.6-2.1-4.6-4.6V7.4c0-2.5 2.1-4.6 4.6-4.6Zm0 2.1c-1.4 0-2.5 1.1-2.5 2.5v9.2c0 1.4 1.1 2.5 2.5 2.5h9.2c1.4 0 2.5-1.1 2.5-2.5V7.4c0-1.4-1.1-2.5-2.5-2.5H7.4Zm4.6 3.2a3.9 3.9 0 1 1 0 7.8 3.9 3.9 0 0 1 0-7.8Zm0 2.1a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Zm4.2-2.4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
      </svg>
    )
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@fairhavenproperties?_r=1&_t=ZS-95TySZSEeIf",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.6 2.5c.4 2.6 1.9 4.2 4.4 4.4v3.3a7.4 7.4 0 0 1-4.3-1.3v6.2c0 3.1-2.2 6.2-6.1 6.2a6 6 0 0 1-6.1-5.9c0-3.9 3.5-6.7 7.4-5.7v3.4c-1.9-.6-4 .6-4 2.5 0 1.4 1.1 2.5 2.5 2.5 1.6 0 2.7-1.1 2.7-3V2.5h3.5Z" />
      </svg>
    )
  }
];

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>(staticBlogs);
  const [properties, setProperties] = useState<PropertyListing[]>(staticProperties);
  const [searchFilters, setSearchFilters] = useState<SearchFilterConfig[]>(defaultSearchFilters);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    googleFormUrl: process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ?? ""
  });
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState<"For Sale" | "For Rent">("For Sale");

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/site-data", { cache: "no-store" });
        const payload = (await response.json()) as {
          blogs: BlogPost[];
          properties: PropertyListing[];
          filters: SearchFilterConfig[];
          settings: SiteSettings;
        };

        setSearchFilters(payload.filters);
        setProperties(payload.properties);
        setBlogs(payload.blogs);
        setSiteSettings(payload.settings);
      } catch {
        setSearchFilters(defaultSearchFilters);
        setProperties(staticProperties);
        setBlogs(staticBlogs);
      }
    })();
  }, []);

  const googleFormHref = siteSettings.googleFormUrl.trim() || "#contact";
  const opensExternalGoogleForm = googleFormHref.startsWith("http");

  const filteredProperties = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return properties.filter((property) => {
      const searchableText = [
        property.title,
        property.city,
        property.location,
        property.type,
        property.status,
        property.beds,
        property.price,
        property.description
      ]
        .join(" ")
        .toLowerCase();

      const queryMatches = !normalizedQuery || searchableText.includes(normalizedQuery);
      const lookingFor = selectedFilters["Looking for"] ?? [];
      const location = selectedFilters.Location ?? [];
      const propertyType = selectedFilters["Property Type"] ?? [];
      const bedrooms = selectedFilters.Bedrooms ?? [];

      return (
        queryMatches &&
        (lookingFor.length === 0 || lookingFor.includes(property.type)) &&
        (location.length === 0 || location.includes(property.location)) &&
        (propertyType.length === 0 || propertyType.includes(property.status)) &&
        (bedrooms.length === 0 || bedrooms.includes(property.beds))
      );
    });
  }, [properties, query, selectedFilters]);

  const displayedProperties = hasSearched ? filteredProperties : properties.filter((p) => p.status === activeTab).slice(0, 4);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSearched(true);
  }

  function toggleFilter(label: string, option: string, options: string[]) {
    if (option === "Select All") {
      setSelectedFilters((current) => ({
        ...current,
        [label]: []
      }));
      return;
    }

    const validOptions = options.filter((item) => item !== "Select All");
    setSelectedFilters((current) => {
      const currentOptions = current[label] ?? [];
      const nextOptions = currentOptions.includes(option)
        ? currentOptions.filter((item) => item !== option)
        : [...currentOptions, option].filter((item) => validOptions.includes(item));

      return {
        ...current,
        [label]: nextOptions
      };
    });
  }

  function resetFilter(label: string) {
    setSelectedFilters((current) => ({
      ...current,
      [label]: []
    }));
  }

  return (
    <main className="akka-page">
      <section className="hero">
        <header className="topbar">
          <div className="logo-card">
            <Image
              src="/IMG_8557.JPG"
              alt="Fairhaven"
              width={220}
              height={220}
              className="logo-image"
              priority
            />
          </div>

          <nav className="main-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={item.dropdown ? "nav-item nav-item-dropdown" : "nav-item"}
              >
                <a href={item.href} className="main-nav-link">
                  {item.label}
                  {item.dropdown && <span className="nav-caret">⌄</span>}
                </a>
                {item.dropdown && (
                  <div className="nav-dropdown" role="menu" aria-label={item.label}>
                    {item.dropdown.map((option) => (
                      <a href="#" key={option} className="nav-dropdown-link" role="menuitem">
                        {option}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </header>

        <div className="hero-stage">
          <button className="hero-arrow hero-arrow-left" type="button" aria-label="Previous slide">
            ‹
          </button>

          <div className="hero-copy">
            <h1>Fairhaven</h1>
            <span className="hero-divider" />
            <p>Ghana&apos;s Real Estate Experts!</p>
          </div>

          <div className="award-ribbon">
            <span className="award-top">African Property Awards</span>
            <span className="award-mid">Real Estate</span>
            <span className="award-bottom">2022-2023</span>
          </div>

          <button className="hero-arrow hero-arrow-right" type="button" aria-label="Next slide">
            ›
          </button>
        </div>

        <div className="search-box">
          <p className="search-title">Over 1,300 Premium Properties At Your Hands</p>
 

          <div className="google-form-callout">
            <div>
              <p className="google-form-kicker">Need help finding the right property?</p>
              <p>
                Share your requirements with Fairhaven and our team will reach out with options that
                match your budget, location, and timeline.
              </p>
            </div>
            <a
              href={googleFormHref}
              className="google-form-button"
              target={opensExternalGoogleForm ? "_blank" : undefined}
              rel={opensExternalGoogleForm ? "noreferrer" : undefined}
            >
              Contact Us Through Google Form
            </a>
          </div>
        </div>
      </section>

      <section className="excellence-section section-shell" id="about">
        <div className="section-intro centered">
          <h2>10 Years Of Excellence</h2>
          <span className="section-line" />
          <p>
            This year is especially meaningful as it marks our 10th anniversary, a decade of serving
            Ghana&apos;s real estate needs with dedication, professionalism, and a relentless drive for
            excellence.
          </p>
        </div>

        <div className="services-grid" id="services">
          {serviceCards.map((service) => (
            <article key={service.title} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <span className="mini-line" />
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell neighborhoods-section">
        <div className="section-header">
          <p className="section-kicker">Search By Neighborhood</p>
          <p className="section-subtitle">1,300 premium properties at your hands</p>
        </div>

        <div className="neighborhoods-grid">
          {neighborhoods.map((item) => (
            <article
              key={item.name}
              className="neighborhood-card"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(8, 18, 34, 0.04) 0%, rgba(8, 18, 34, 0.9) 78%), url(${item.image})`
              }}
            >
              <div className="neighborhood-content">
                <h3>{item.name}</h3>
                <span className="mini-line" />
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell featured-section" id="properties">
        <div className="featured-header">
          <h2>{hasSearched ? "Search Results" : "Featured Properties"}</h2>
          <div className="feature-tabs" aria-label="Property category">
            <button 
              type="button" 
              className={`feature-tab ${activeTab === "For Sale" ? "active" : ""}`}
              onClick={() => { setActiveTab("For Sale"); setHasSearched(false); }}
            >
              For Sale
            </button>
            <button 
              type="button" 
              className={`feature-tab ${activeTab === "For Rent" ? "active" : ""}`}
              onClick={() => { setActiveTab("For Rent"); setHasSearched(false); }}
            >
              For Rent
            </button>
          </div>
          {hasSearched && (
            <p className="search-result-count">
              Showing {displayedProperties.length} property result
              {displayedProperties.length === 1 ? "" : "s"} from admin API dummy data.
            </p>
          )}
        </div>

        {displayedProperties.length > 0 ? (
          <div className="featured-grid">
            {displayedProperties.map((property) => (
              <article key={property.id} className="property-card">
                <div className="property-photo" style={{ backgroundImage: `url(${property.image})` }}>
                  <span className="property-badge">{property.status}</span>
                </div>

                <div className="property-body">
                  <p className="property-city">
                    {property.city} / {property.location}
                  </p>
                  <h3>{property.title}</h3>
                  <p className="property-meta">{property.meta}</p>
                  <p className="property-description">{property.description}</p>
                  <p className="property-price">{property.price}</p>
                  <div className="property-stats">
                    <span>{property.beds}</span>
                    <span>{property.baths}</span>
                    <span>{property.parking}</span>
                  </div>
                  <a href={`/property/${property.id}`} className="details-button">
                    See More Details
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-results">
            <h3>No matching property found</h3>
            <p>Try another search, or add matching dummy data from the admin API section.</p>
          </div>
        )}


      </section>

      {blogs.length > 0 && (
        <section className="section-shell blog-section" id="blog">
          <div className="section-header">
            <p className="section-kicker">Featured Blog</p>
            <p className="section-subtitle">Created from the admin blog API</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
            {blogs.map((blog) => {
              const previewText = blog.excerpt || stripHtml(blog.content);

              return (
                <article
                  key={blog.id}
                  style={{
                    backgroundColor: "#0a1629",
                    border: "1px solid #1a2942",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ 
                      background: "#d2b48c", 
                      color: "#081222", 
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}>
                      Fairhaven Journal
                    </span>
                    <p style={{ color: "#8b94a5", fontSize: "0.9rem", margin: 0 }}>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: "1.5rem", 
                    color: "#fff", 
                    fontFamily: "'Playfair Display', serif",
                    margin: 0
                  }}>
                    {blog.title}
                  </h3>
                  
                  <p style={{ 
                    color: "#cbd5e1", 
                    lineHeight: "1.6",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    margin: 0
                  }}>
                    {previewText}
                  </p>
                  
                  <a 
                    href={`/blog/${blog.slug}`} 
                    style={{ 
                      color: "#d2b48c", 
                      fontWeight: "bold", 
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "auto",
                      paddingTop: "1rem"
                    }}
                  >
                    Read Article <span aria-hidden="true">&rarr;</span>
                  </a>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="partners-section">
        <div className="list-property-banner">
          <div className="list-property-image" />
          <div className="list-property-copy">
            <h2>
              List Your
              <br />
              Property With
              <br />
              Us Today!
            </h2>
            <ul>
              <li>Priority Marketing</li>
              <li>Increased likelihood of renting / selling</li>
            </ul>
            <a
              href={googleFormHref}
              className="contact-experts-button"
              target={opensExternalGoogleForm ? "_blank" : undefined}
              rel={opensExternalGoogleForm ? "noreferrer" : undefined}
            >
              Contact The Experts! →
            </a>
          </div>
        </div>

      </section>

      <section className="section-shell" id="careers" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <p className="section-kicker">Careers</p>
          <p className="section-subtitle">Grow with Fairhaven</p>
        </div>
        <div
          style={{
            marginTop: "2rem",
            border: "1px solid #1a2942",
            background: "#0a1629",
            padding: "2rem"
          }}
        >
          <p style={{ color: "#cbd5e1", lineHeight: "1.7", margin: 0 }}>
            We are always open to meeting strong real estate, operations, and client service talent in Ghana.
          </p>
        </div>
      </section>

      <footer className="site-footer" id="contact">
        <div className="footer-main section-shell">
          <div className="footer-col">
            <h3>Quick Links</h3>
            <div className="footer-links">
              {footerLinks.map((link) => (
                <a href={link.href} key={link.label}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col footer-contact">
            <h3>Contact Us</h3>
            <p>31 Nortei Ababio Street</p>
            <p>Airport Residential Area</p>
            <p>Accra</p>
            <p className="footer-gap">Ghana Post GPS: GA-117-9018</p>
            <p>+233 (0) 540 122 800</p>
            <p>info@akkakappaghana.com</p>
          </div>

          <div className="footer-col">
            <h3>Follow Us</h3>
            <div className="social-row">
              {socialLinks.map((link) => (
                <a href={link.href} key={link.label} aria-label={link.label} target="_blank" rel="noreferrer">
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Fairhaven LTD. ALL RIGHTS RESERVED. | TERMS & PRIVACY</p>
          <p>DESIGNED & DEVELOPED BY Raghu Technologies</p>
        </div>
      </footer>
    </main>
  );
}
