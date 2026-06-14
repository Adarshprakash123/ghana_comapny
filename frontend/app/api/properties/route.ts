import { NextRequest, NextResponse } from "next/server";
import type { PropertyListing } from "@/app/data";
import { readAdminSessionFromRequest } from "@/lib/server/admin-auth";
import { readProperties, slugify, writeProperties } from "@/lib/server/content-store";

export const runtime = "nodejs";

type PropertyPayload = Omit<PropertyListing, "id"> & { id?: string };

export async function GET() {
  const properties = await readProperties();
  return NextResponse.json({ properties });
}

export async function POST(request: NextRequest) {
  if (!readAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = (await request.json()) as PropertyPayload;
  const title = payload.title?.trim() ?? "";

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const property: PropertyListing = {
    id: `${slugify(title)}-${Date.now()}`,
    title,
    city: payload.city?.trim() ?? "Accra",
    location: payload.location?.trim() ?? "",
    type: payload.type?.trim() ?? "Apartment",
    status: payload.status === "For Rent" ? "For Rent" : "For Sale",
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
