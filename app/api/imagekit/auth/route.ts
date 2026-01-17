import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY || "dummy_public_key",
  privateKey: process.env.PRIVATE_KEY || "dummy_private_key",
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT || "https://ik.imagekit.io/dummy_endpoint",
});

export async function GET() {
  return NextResponse.json(imagekit.getAuthenticationParameters());
}
