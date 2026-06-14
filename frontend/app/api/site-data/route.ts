import { NextRequest, NextResponse } from "next/server";
import type { SearchFilterConfig, SiteSettings } from "@/app/data";
import { readAdminSessionFromRequest } from "@/lib/server/admin-auth";
import {
  readBlogs,
  readProperties,
  readSearchFilters,
  readSiteSettings,
  writeSearchFilters,
  writeSiteSettings
} from "@/lib/server/content-store";

export const runtime = "nodejs";

type SiteDataPayload = {
  filters?: SearchFilterConfig[];
  settings?: SiteSettings;
};

export async function GET() {
  const [blogs, properties, filters, settings] = await Promise.all([
    readBlogs(),
    readProperties(),
    readSearchFilters(),
    readSiteSettings()
  ]);

  return NextResponse.json({ blogs, properties, filters, settings });
}

export async function PUT(request: NextRequest) {
  if (!readAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = (await request.json()) as SiteDataPayload;

  if (payload.filters) {
    await writeSearchFilters(payload.filters);
  }

  if (payload.settings) {
    await writeSiteSettings(payload.settings);
  }

  const [blogs, properties, filters, settings] = await Promise.all([
    readBlogs(),
    readProperties(),
    readSearchFilters(),
    readSiteSettings()
  ]);

  return NextResponse.json({ blogs, properties, filters, settings });
}
