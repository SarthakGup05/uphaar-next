"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ImageKitProvider } from "@imagekit/next";
import { LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

export const authenticator = async () => {
  try {
    const response = await fetch("/api/imagekit/auth");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence>
        <LazyMotion features={domAnimation}>
          <ImageKitProvider
            {...({
              publicKey,
              urlEndpoint,
              authenticator,
            } as any)}
          >
            {children}
          </ImageKitProvider>
        </LazyMotion>
      </AnimatePresence>
    </QueryClientProvider>
  );
}