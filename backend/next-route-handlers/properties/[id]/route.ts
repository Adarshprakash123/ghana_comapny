import { NextResponse } from "next/server";
import type { PropertyListing } from "../../../../frontend/app/data";
import { type PropertyPayload, readProperties, writeProperties } from "../property-store";

export const runtime = "nodejs";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
  }

  const payload = (await request.json()) as PropertyPayload;
  const title = payload.title?.trim() ?? "";

  if (!title) {
    return NextResponse.json(
      { error: "Title is required." },
      { status: 400 }
    );
  }

  const properties = await readProperties();
  const index = properties.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
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

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
  }

  let properties = await readProperties();
  const initialLength = properties.length;

  properties = properties.filter((p) => p.id !== id);

  if (properties.length === initialLength) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  await writeProperties(properties);

  return NextResponse.json({ success: true, properties });
}
