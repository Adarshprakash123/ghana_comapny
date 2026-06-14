import { NextRequest, NextResponse } from "next/server";
import type { PropertyListing } from "@/app/data";
import { readAdminSessionFromRequest } from "@/lib/server/admin-auth";
import { readProperties, writeProperties } from "@/lib/server/content-store";

export const runtime = "nodejs";

type PropertyPayload = Omit<PropertyListing, "id"> & { id?: string };

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const properties = await readProperties();
  const property = properties.find((item) => item.id === id);

  if (!property) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 });
  }

  return NextResponse.json({ property });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!readAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const payload = (await request.json()) as PropertyPayload;
  const title = payload.title?.trim() ?? "";

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const properties = await readProperties();
  const index = properties.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 });
  }

  const updatedProperty: PropertyListing = {
    ...properties[index],
    title,
    city: payload.city?.trim() ?? properties[index].city,
    location: payload.location?.trim() ?? properties[index].location,
    type: payload.type?.trim() ?? properties[index].type,
    status:
      payload.status === "For Rent" || payload.status === "For Sale"
        ? payload.status
        : properties[index].status,
    meta: payload.meta?.trim() ?? properties[index].meta,
    description: payload.description?.trim() ?? properties[index].description,
    price: payload.price?.trim() ?? properties[index].price,
    beds: payload.beds?.trim() ?? properties[index].beds,
    baths: payload.baths?.trim() ?? properties[index].baths,
    parking: payload.parking?.trim() ?? properties[index].parking,
    image: payload.image?.trim() ?? properties[index].image
  };

  properties[index] = updatedProperty;
  await writeProperties(properties);

  return NextResponse.json({ property: updatedProperty, properties });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!readAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const properties = await readProperties();
  const nextProperties = properties.filter((property) => property.id !== id);

  if (nextProperties.length === properties.length) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 });
  }

  await writeProperties(nextProperties);

  return NextResponse.json({ properties: nextProperties });
}
