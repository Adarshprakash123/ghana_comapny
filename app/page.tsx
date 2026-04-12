import Image from "next/image";

const navItems = [
  "Home",
  "About Us",
  "Our Services",
  "Properties",
  "Blog",
  "Careers",
  "Contact Us"
];

const searchFilters = [
  "Looking for",
  "Location",
  "Price Range",
  "Property Type",
  "Bedrooms"
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
              alt="Akka Kappa"
              width={220}
              height={220}
              className="logo-image"
              priority
            />
            <p className="logo-wordmark">akka kappa</p>
          </div>

          <nav className="main-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a href="#" key={item} className="main-nav-link">
                {item}
                {(item === "Our Services" || item === "Properties") && (
                  <span className="nav-caret">⌄</span>
                )}
              </a>
            ))}
          </nav>
        </header>

        <div className="hero-stage">
          <button className="hero-arrow hero-arrow-left" type="button" aria-label="Previous slide">
            ‹
          </button>

          <div className="hero-copy">
            <h1>
              Welcome To
              <br />
              Akka Kappa
            </h1>
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
              <button key={filter} type="button" className="filter-chip">
                <span>{filter}</span>
                <span className="chip-caret">⌄</span>
              </button>
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

      <div className="floating-buttons" aria-hidden="true">
        <div className="floating-button floating-button-dark">✦</div>
        <div className="floating-button floating-button-green">◔</div>
      </div>
    </main>
  );
}
