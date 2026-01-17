
"use client";

import { Image } from "@imagekit/next";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { authenticator } from "@/components/provider";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    folder?: string;
    className?: string;
}

export const ImageUpload = ({ value, onChange, folder = "/products" }: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const uploadRef = useRef<HTMLInputElement>(null);

    // Manual Upload Handler
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            // 1. Get Authentication Parameters
            const authParams = await authenticator();

            const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
            if (!publicKey) {
                throw new Error("Public Key is missing (NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY)");
            }

            // 2. Upload to ImageKit
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", file.name);
            formData.append("publicKey", publicKey);
            formData.append("signature", authParams.signature);
            formData.append("expire", authParams.expire);
            formData.append("token", authParams.token);
            if (folder) formData.append("folder", folder);

            const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${errorText}`);
            }

            const data = await response.json();
            console.log("Upload Success:", data);

            // Use url from response
            onChange(data.url);
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            if (uploadRef.current) {
                uploadRef.current.value = ""; // Reset input
            }
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {value ? (
                <div className="relative aspect-square w-40 overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                    <Image
                        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                        src={value}
                        alt="Upload Preview"
                        width={300}
                        height={300}
                        className="h-full w-full object-cover"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6"
                        onClick={() => onChange("")}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    onClick={() => uploadRef.current?.click()}
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 py-10 hover:bg-stone-100 transition-colors cursor-pointer w-full text-center"
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm font-medium">Uploading...</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm mb-4">
                                <ImageIcon className="h-6 w-6 text-stone-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-stone-900">Click to upload image</p>
                                <p className="text-xs text-stone-500">SVG, PNG, JPG</p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Default File Input */}
            <input
                type="file"
                ref={uploadRef}
                onChange={handleUpload}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
};
