"use client";

export default function imageKitLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src[0] === "/") src = src.slice(1);
  const params = [`w-${width}`];
  // Default quality to 80 if not specified to save bandwidth
  params.push(`q-${quality || 80}`);
  const paramsString = params.join(",");
  const urlEndpoint =
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
    "https://ik.imagekit.io/uphaar";

  // Clean the endpoint to ensure no trailing slash
  const cleanEndpoint = urlEndpoint.endsWith("/")
    ? urlEndpoint.slice(0, -1)
    : urlEndpoint;

  // Check if the image source is hosted on ImageKit
  if (src.startsWith(cleanEndpoint)) {
    // If it's already an absolute URL matching our endpoint, inject the transformation
    // Example: https://ik.imagekit.io/uphaar/file.jpg -> https://ik.imagekit.io/uphaar/tr:w-300,q-75/file.jpg
    const parts = src.split(cleanEndpoint);
    // parts[1] is everything after the endpoint (e.g., "/file.jpg")
    // We construct: endpoint + /tr:params + path
    return `${cleanEndpoint}/tr:${paramsString}${parts[1]}`;
  }

  // If it's a relative path or doesn't match our endpoint, return original
  // (or you could force it to go through ImageKit if you wanted to proxy everything)
  return src;
}
