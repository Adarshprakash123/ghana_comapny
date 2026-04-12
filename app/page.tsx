import Image from "next/image";

const navItems = [
  { label: "Home" },
  { label: "About Us" },
  {
    label: "Our Services",
    dropdown: ["Sales", "Property Management", "Relocation Management"]
  },
  {
    label: "Properties",
    dropdown: ["Rent", "Sale"]
  },
  { label: "Blog" },
  { label: "Careers" },
  { label: "Contact Us" }
];

const searchFilters = [
  {
    label: "Looking for",
    type: "checkbox-list",
    panelAlign: "left",
    footerLabel: "Property Filter",
    options: [
      "Select All",
      "Apartment",
      "House",
      "Land",
      "Office",
      "Retail",
      "Townhouse",
      "Warehouse"
    ]
  },
  {
    label: "Location",
    type: "checkbox-list",
    panelAlign: "left",
    footerLabel: "Location Filter",
    options: [
      "Select All",
      "Abelemkpe",
      "Aburi",
      "Achimota",
      "Adjiringanor",
      "Airport Hills",
      "Airport Residential",
      "Asylum Down",
      "Cantonments",
      "Dzorwulu",
      "East Airport",
      "East Legon"
    ]
  },
  {
    label: "Price Range",
    type: "price-range",
    panelAlign: "left",
    footerLabel: "Price Filter",
    minPrice: "GHC 1",
    maxPrice: "GHC 100M+"
  },
  {
    label: "Property Type",
    type: "checkbox-list",
    panelAlign: "right",
    footerLabel: "Property Filter",
    options: ["Select All", "For Sale", "For Rent"]
  },
  {
    label: "Bedrooms",
    type: "checkbox-list",
    panelAlign: "right",
    footerLabel: "Bedroom Filter",
    options: ["Select All", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "5+ Bedrooms"]
  }
] as const;

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
    title: "Relocation Management",
    text: "Thinking of moving to Ghana? Let the experts guide you!",
    icon: "✦"
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

const featuredProperties = [
  {
    city: "Accra",
    title: "3 Bedroom Modern Apartment in Airport Residential",
    meta: "Apartment | 6125s",
    description:
      "An architectural statement of refined living in the heart of Accra's most prestigious neighbourhood,...",
    price: "GHC 10,828,630",
    beds: "3 Bedrooms",
    baths: "4 Bathrooms",
    parking: "1 Parking Spaces",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80"
  },
  {
    city: "Accra",
    title: "4 Bedroom House in Airport Hills",
    meta: "House | 5992s",
    description:
      "This beautifully designed furnished 4-bedroom house in Airport Hills offers modern comfort, privacy, and...",
    price: "GHC 17,250,000",
    beds: "4 Bedrooms",
    baths: "4.5 Bathrooms",
    parking: "Parking Spaces",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80"
  },
  {
    city: "Accra",
    title: "Modern Family Residence in East Legon",
    meta: "House | 4388s",
    description:
      "Spacious interiors, strong rental potential and an address designed for easy family living.",
    price: "GHC 8,950,000",
    beds: "5 Bedrooms",
    baths: "5 Bathrooms",
    parking: "2 Parking Spaces",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80"
  },
  {
    city: "Accra",
    title: "Contemporary Villa in Cantonments",
    meta: "Villa | 7100s",
    description:
      "Private luxury living with elegant outdoor spaces, curated finishes and strong investor appeal.",
    price: "GHC 21,400,000",
    beds: "6 Bedrooms",
    baths: "6 Bathrooms",
    parking: "4 Parking Spaces",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=80"
  }
];

const partnerNames = [
  "Pippa's",
  "P4 Pilates",
  "Lotus Living",
  "Theia",
  "The Mix Design Hub",
  "Splash & Play"
];

const accreditationNames = [
  "werc",
  "MIM",
  "EURA",
  "Real Estate Agency Council"
];

const footerLinks = [
  "About Us",
  "Our Services",
  "For Sale",
  "For Rent",
  "Blog",
  "Careers"
];

export default function Home() {
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
                <a href="#" className="main-nav-link">
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

          <div className="search-row">
            <input type="text" placeholder="Search here ...." aria-label="Search here" />
            <button type="button">Search</button>
          </div>

          <div className="filters-row">
            {searchFilters.map((filter) => (
              <details
                key={filter.label}
                className={`filter-dropdown ${filter.type === "price-range" ? "filter-dropdown-price" : ""} ${
                  filter.panelAlign === "right" ? "filter-dropdown-right" : ""
                }`}
              >
                <summary className="filter-chip">
                  <span>{filter.label}</span>
                  <span className="chip-caret">⌄</span>
                </summary>

                <div className="filter-panel">
                  {filter.type === "price-range" ? (
                    <div className="price-panel">
                      <div className="price-inputs">
                        <label className="price-field">
                          <span>Min Price</span>
                          <div>{filter.minPrice}</div>
                        </label>
                        <label className="price-field">
                          <span>Max Price</span>
                          <div>{filter.maxPrice}</div>
                        </label>
                      </div>

                      <div className="range-visual" aria-hidden="true">
                        <span className="range-track" />
                        <span className="range-thumb range-thumb-left" />
                        <span className="range-thumb range-thumb-right" />
                        <div className="range-labels">
                          <span>{filter.minPrice}</span>
                          <span>{filter.maxPrice}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="filter-options">
                      {filter.options.map((option) => (
                        <label key={option} className="filter-option">
                          <input type="checkbox" />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="filter-panel-footer">
                    <span>{filter.footerLabel}</span>
                    <button type="button" className="filter-reset">
                      Reset
                    </button>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="excellence-section section-shell">
        <div className="section-intro centered">
          <h2>10 Years Of Excellence</h2>
          <span className="section-line" />
          <p>
            This year is especially meaningful as it marks our 10th anniversary, a decade of serving
            Ghana&apos;s real estate needs with dedication, professionalism, and a relentless drive for
            excellence. Whether it&apos;s buying, selling, renting, or managing properties, we are here to
            be your trusted partner every step of the way.
          </p>
        </div>

        <div className="services-grid">
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

      <section className="section-shell featured-section">
        <div className="featured-header">
          <h2>Featured Properties</h2>
          <div className="feature-tabs" aria-label="Property category">
            <button type="button" className="feature-tab active">
              For Sale
            </button>
            <button type="button" className="feature-tab">
              For Rent
            </button>
          </div>
        </div>

        <div className="featured-grid">
          {featuredProperties.map((property) => (
            <article key={property.title} className="property-card">
              <div
                className="property-photo"
                style={{ backgroundImage: `url(${property.image})` }}
              >
                <span className="property-badge">For Sale</span>
              </div>

              <div className="property-body">
                <p className="property-city">{property.city}</p>
                <h3>{property.title}</h3>
                <p className="property-meta">{property.meta}</p>
                <p className="property-description">{property.description}</p>
                <p className="property-price">{property.price}</p>
                <div className="property-stats">
                  <span>{property.beds}</span>
                  <span>{property.baths}</span>
                  <span>{property.parking}</span>
                </div>
                <a href="#" className="details-button">
                  See More Details
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="view-more-wrap">
          <a href="#" className="view-more-button">
            View More Properties
          </a>
        </div>
      </section>

      <section className="partners-section">
        <div className="section-shell partners-inner">
          <div className="go-up">Go Up ⌃</div>
          <h2>Our Relocation Partners</h2>
          <div className="partners-row">
            {partnerNames.map((partner) => (
              <div key={partner} className="partner-logo">
                {partner}
              </div>
            ))}
          </div>
        </div>

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
            <a href="#" className="contact-experts-button">
              Contact The Experts! →
            </a>
          </div>
        </div>

        <div className="section-shell accreditation-row">
          {accreditationNames.map((item) => (
            <div key={item} className="accreditation-logo">
              {item}
            </div>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-main section-shell">
          <div className="footer-col">
            <h3>Quick Links</h3>
            <div className="footer-links">
              {footerLinks.map((link) => (
                <a href="#" key={link}>
                  {link}
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
              <span>f</span>
              <span>◎</span>
              <span>in</span>
              <span>▷</span>
              <span>♪</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 AKKA KAPPA LTD. ALL RIGHTS RESERVED. | TERMS & PRIVACY</p>
          <p>DESIGNED & DEVELOPED BY TRIBAL HOUSE STUDIOS</p>
        </div>
      </footer>

      <div className="floating-buttons">
        <a href="#" className="floating-button floating-button-whatsapp" aria-label="WhatsApp">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="floating-button-icon"
            fill="currentColor"
          >
            <path d="M19.05 4.94A9.9 9.9 0 0 0 12.03 2C6.56 2 2.1 6.45 2.1 11.92c0 1.75.46 3.46 1.33 4.97L2 22l5.26-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.47 0 9.93-4.45 9.93-9.92a9.83 9.83 0 0 0-2.91-6.97Zm-7.02 15.22h-.01a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-3.12.82.84-3.04-.2-.31a8.23 8.23 0 0 1-1.27-4.37c0-4.56 3.72-8.28 8.3-8.28 2.21 0 4.29.86 5.86 2.42a8.2 8.2 0 0 1 2.43 5.86c0 4.57-3.72 8.29-8.3 8.29Zm4.54-6.2c-.25-.13-1.47-.72-1.7-.8-.23-.08-.4-.13-.57.13-.17.25-.66.8-.81.97-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.01-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.3.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.57-1.36-.78-1.86-.21-.5-.42-.42-.57-.43h-.49c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1s.9 2.44 1.02 2.61c.13.17 1.77 2.71 4.29 3.8.6.26 1.07.42 1.43.54.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.18-.06-.1-.23-.15-.48-.27Z" />
          </svg>
        </a>
      </div>
    </main>
  );
}
