import type { PropertyListing } from "@/app/data";

type PropertyImageInput = {
  image?: string;
  images?: string[];
};

export function normalizePropertyImages(input: PropertyImageInput) {
  const images = Array.from(
    new Set((input.images ?? []).map((url) => url.trim()).filter(Boolean))
  );
  const cover = input.image?.trim() || images[0] || "";

  if (cover && !images.includes(cover)) {
    images.unshift(cover);
  }

  return {
    image: cover,
    images: images.length > 0 ? images : cover ? [cover] : []
  };
}

export function getPropertyGalleryImages(property: Pick<PropertyListing, "image" | "images">) {
  const normalized = normalizePropertyImages(property);
  return normalized.images;
}
