import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { staticProperties } from "../../static-content";

const dummyImages = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd9b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
];

export const dynamicParams = false;

export function generateStaticParams() {
  return staticProperties.map((property) => ({
    id: property.id
  }));
}

export default async function PropertyPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = staticProperties.find((item) => item.id === id);

  if (!property) {
    notFound();
  }

  return (
    <main className="akka-page">
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
          height: "60vh",
          background: `linear-gradient(180deg, rgba(8, 18, 34, 0.4) 0%, rgba(8, 18, 34, 0.9) 100%), url(${property.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 5% 4rem",
          color: "#fff"
        }}
      >
        <div style={{ maxWidth: "800px" }}>
          <span
            style={{
              background: "#d2b48c",
              color: "#081222",
              padding: "0.25rem 0.75rem",
              fontSize: "0.8rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "1rem",
              display: "inline-block"
            }}
          >
            {property.status}
          </span>
          <p
            style={{
              color: "#d2b48c",
              fontSize: "0.9rem",
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "0.5rem"
            }}
          >
            {property.city} / {property.location}
          </p>
          <h1
            style={{
              fontSize: "3rem",
              margin: "0 0 1rem",
              lineHeight: "1.1",
              fontFamily: "'Playfair Display', serif"
            }}
          >
            {property.title}
          </h1>
          <p style={{ fontSize: "1.5rem", fontWeight: "600", color: "#eaddcc" }}>{property.price}</p>
        </div>
      </section>

      <section className="section-shell" style={{ display: "flex", flexWrap: "wrap", gap: "4rem" }}>
        <div style={{ flex: "1 1 600px" }}>
          <h2
            style={{
              fontSize: "2rem",
              marginBottom: "1rem",
              fontFamily: "'Playfair Display', serif",
              color: "#d2b48c"
            }}
          >
            Description
          </h2>
          <span className="mini-line" style={{ marginBottom: "2rem", display: "block" }} />
          <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#ccc" }}>{property.description}</p>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#ccc", marginTop: "1.5rem" }}>
            Explore {property.title}, a premium {property.type} located in {property.location}. Featuring
            top-notch amenities, it includes {property.beds}, {property.baths}, and {property.parking}.
            This is an ideal investment or home for those seeking luxury in {property.city}.
          </p>

          <h3
            style={{
              fontSize: "1.5rem",
              margin: "3rem 0 1rem",
              fontFamily: "'Playfair Display', serif",
              color: "#d2b48c"
            }}
          >
            Property Details
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              color: "#fff"
            }}
          >
            <li style={{ padding: "1rem", background: "#0a1629", borderLeft: "4px solid #d2b48c" }}>
              <strong
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#8b94a5",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem"
                }}
              >
                Type
              </strong>
              {property.type}
            </li>
            <li style={{ padding: "1rem", background: "#0a1629", borderLeft: "4px solid #d2b48c" }}>
              <strong
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#8b94a5",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem"
                }}
              >
                Location
              </strong>
              {property.location}
            </li>
            <li style={{ padding: "1rem", background: "#0a1629", borderLeft: "4px solid #d2b48c" }}>
              <strong
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#8b94a5",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem"
                }}
              >
                Bedrooms
              </strong>
              {property.beds}
            </li>
            <li style={{ padding: "1rem", background: "#0a1629", borderLeft: "4px solid #d2b48c" }}>
              <strong
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#8b94a5",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem"
                }}
              >
                Bathrooms
              </strong>
              {property.baths}
            </li>
            <li style={{ padding: "1rem", background: "#0a1629", borderLeft: "4px solid #d2b48c" }}>
              <strong
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#8b94a5",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem"
                }}
              >
                Parking
              </strong>
              {property.parking}
            </li>
            <li style={{ padding: "1rem", background: "#0a1629", borderLeft: "4px solid #d2b48c" }}>
              <strong
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#8b94a5",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem"
                }}
              >
                Status
              </strong>
              {property.status}
            </li>
          </ul>
        </div>

        <div style={{ flex: "1 1 400px" }}>
          <div style={{ background: "#0a1629", padding: "2rem", border: "1px solid #1a2942" }}>
            <h3
              style={{
                fontSize: "1.5rem",
                marginBottom: "1rem",
                color: "#d2b48c",
                fontFamily: "'Playfair Display', serif"
              }}
            >
              Interested in this Property?
            </h3>
            <p style={{ color: "#ccc", marginBottom: "2rem", lineHeight: "1.6" }}>
              Contact Fairhaven to schedule a viewing or request more information about this {property.type}.
            </p>
            <a
              href="#google-form-link"
              style={{
                display: "block",
                textAlign: "center",
                background: "#d2b48c",
                color: "#081222",
                padding: "1rem",
                textDecoration: "none",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}
            >
              Contact Agent
            </a>
          </div>
        </div>
      </section>

      <section className="section-shell" style={{ paddingTop: 0 }}>
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "1rem",
            fontFamily: "'Playfair Display', serif",
            color: "#d2b48c"
          }}
        >
          Gallery
        </h2>
        <span className="mini-line" style={{ marginBottom: "2.5rem", display: "block" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          <div
            style={{
              height: "250px",
              background: `url(${property.image}) center/cover`,
              opacity: 0.9,
              transition: "opacity 0.3s"
            }}
          />
          {dummyImages.map((src, index) => (
            <div
              key={index}
              style={{
                height: "250px",
                background: `url(${src}) center/cover`,
                opacity: 0.9,
                transition: "opacity 0.3s"
              }}
            />
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-bottom" style={{ borderTop: "none" }}>
          <p>
            <Link href="/#properties" style={{ color: "#d2b48c", textDecoration: "none" }}>
              ← Back to All Properties
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
