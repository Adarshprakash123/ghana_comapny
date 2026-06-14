import { NextRequest, NextResponse } from "next/server";
import { readAdminSessionFromRequest } from "@/lib/server/admin-auth";
import { isImageKitConfigured, uploadImageToImageKit } from "@/lib/server/imagekit-images";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = readAdminSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isImageKitConfigured()) {
    return NextResponse.json(
      { error: "ImageKit is not configured yet. Add the ImageKit values to frontend/.env.local." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  try {
    const imageUrl = await uploadImageToImageKit(file, {
      fileName: getOptionalString(formData, "fileName"),
      folder: getOptionalString(formData, "folder"),
      tags: getOptionalCsvList(formData, "tags"),
      isPrivateFile: getOptionalBoolean(formData, "isPrivateFile"),
      useUniqueFileName: getOptionalBoolean(formData, "useUniqueFileName"),
      overwriteFile: getOptionalBoolean(formData, "overwriteFile"),
      overwriteTags: getOptionalBoolean(formData, "overwriteTags"),
      overwriteCustomMetadata: getOptionalBoolean(formData, "overwriteCustomMetadata"),
      customCoordinates: getOptionalString(formData, "customCoordinates"),
      responseFields: getOptionalCsvList(formData, "responseFields"),
      customMetadata: getOptionalJsonRecord(formData, "customMetadata")
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Image upload failed." },
      { status: 500 }
    );
  }
}

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getOptionalCsvList(formData: FormData, key: string) {
  const value = getOptionalString(formData, key);

  if (!value) {
    return undefined;
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getOptionalBoolean(formData: FormData, key: string) {
  const value = getOptionalString(formData, key);

  if (!value) {
    return undefined;
  }

  return value === "true";
}

function getOptionalJsonRecord(formData: FormData, key: string) {
  const value = getOptionalString(formData, key);

  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const entries = Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === "string");
    return Object.fromEntries(entries);
  } catch {
    return undefined;
  }
}
