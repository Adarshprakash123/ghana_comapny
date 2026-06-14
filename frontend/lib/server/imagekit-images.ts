type ImageKitUploadOptions = {
  fileName?: string;
  folder?: string;
  tags?: string[];
  isPrivateFile?: boolean;
  useUniqueFileName?: boolean;
  overwriteFile?: boolean;
  overwriteTags?: boolean;
  overwriteCustomMetadata?: boolean;
  customCoordinates?: string;
  responseFields?: string[];
  customMetadata?: Record<string, string>;
};

const imageKitUploadEndpoint = "https://upload.imagekit.io/api/v1/files/upload";

export function isImageKitConfigured() {
  return Boolean(
    process.env.IMAGEKIT_PUBLIC_KEY?.trim() &&
      process.env.IMAGEKIT_PRIVATE_KEY?.trim() &&
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.trim()
  );
}

export async function uploadImageToImageKit(file: File, options: ImageKitUploadOptions = {}) {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY?.trim();
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.trim();

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error("ImageKit is not configured yet.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", options.fileName?.trim() || file.name || `upload-${Date.now()}`);

  if (options.folder?.trim()) {
    formData.append("folder", options.folder.trim());
  }

  if (options.tags?.length) {
    formData.append("tags", options.tags.join(","));
  }

  if (typeof options.isPrivateFile === "boolean") {
    formData.append("isPrivateFile", String(options.isPrivateFile));
  }

  if (typeof options.useUniqueFileName === "boolean") {
    formData.append("useUniqueFileName", String(options.useUniqueFileName));
  }

  if (typeof options.overwriteFile === "boolean") {
    formData.append("overwriteFile", String(options.overwriteFile));
  }

  if (typeof options.overwriteTags === "boolean") {
    formData.append("overwriteTags", String(options.overwriteTags));
  }

  if (typeof options.overwriteCustomMetadata === "boolean") {
    formData.append("overwriteCustomMetadata", String(options.overwriteCustomMetadata));
  }

  if (options.customCoordinates?.trim()) {
    formData.append("customCoordinates", options.customCoordinates.trim());
  }

  if (options.responseFields?.length) {
    formData.append("responseFields", options.responseFields.join(","));
  }

  if (options.customMetadata && Object.keys(options.customMetadata).length > 0) {
    formData.append("customMetadata", JSON.stringify(options.customMetadata));
  }

  const basicAuthToken = Buffer.from(`${privateKey}:`).toString("base64");

  const response = await fetch(imageKitUploadEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuthToken}`
    },
    body: formData
  });

  const payload = (await response.json()) as {
    message?: string;
    url?: string;
    thumbnailUrl?: string;
    filePath?: string;
  };

  if (!response.ok || !payload.url) {
    throw new Error(payload.message ?? "ImageKit upload failed.");
  }

  if (payload.url.startsWith("http://") || payload.url.startsWith("https://")) {
    return payload.url;
  }

  return `${urlEndpoint.replace(/\/$/, "")}/${payload.filePath?.replace(/^\//, "") ?? ""}`;
}
