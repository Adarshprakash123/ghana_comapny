import { NextResponse } from "next/server";
import type { PropertyListing } from "../../data";
import { type PropertyPayload, readProperties, slugify, writeProperties } from "./property-store";

export const runtime = "nodejs";

export async function GET() {
  const properties = await readProperties();
  return NextResponse.json({ properties });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as PropertyPayload;
  const title = payload.title?.trim() ?? "";

  if (!title) {
    return NextResponse.json(
      { error: "Title is required." },
      { status: 400 }
    );
  }

  const property: PropertyListing = {
    id: `${slugify(title)}-${Date.now()}`,
    title,
    city: payload.city?.trim() ?? "Accra",
    location: payload.location?.trim() ?? "",
    type: payload.type?.trim() ?? "Apartment",
    status: (payload.status === "For Rent" ? "For Rent" : "For Sale"),
    meta: payload.meta?.trim() ?? "",
    description: payload.description?.trim() ?? "",
    price: payload.price?.trim() ?? "GHC 0",
    beds: payload.beds?.trim() ?? "3 Bedrooms",
    baths: payload.baths?.trim() ?? "3 Bathrooms",
    parking: payload.parking?.trim() ?? "1 Parking Space",
    image: payload.image?.trim() ?? ""
  };

  const properties = [property, ...(await readProperties())];
  await writeProperties(properties);

  return NextResponse.json({ property, properties }, { status: 201 });
}
