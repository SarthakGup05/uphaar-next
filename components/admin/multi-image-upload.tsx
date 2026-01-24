"use client";

import { Image } from "@imagekit/next";
import { Loader2, X, Image as ImageIcon, Plus } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { authenticator } from "@/components/provider";

interface MultiImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    folder?: string;
    disabled?: boolean;
}

export const MultiImageUpload = ({
    value = [],
    onChange,
    folder = "/products/gallery",
    disabled
}: MultiImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const uploadRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);

        try {
            const authParams = await authenticator();
            const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

            if (!publicKey) throw new Error("Public Key missing");

            const newUrls: string[] = [];

            // Upload files sequentially (or parallel via Promise.all if preferred)
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
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
                    console.error(`Failed to upload ${file.name}`);
                    continue; // Skip failed uploads or handle error
                }

                const data = await response.json();
                newUrls.push(data.url);
            }

            onChange([...value, ...newUrls]);

        } catch (error) {
            console.error("Batch Upload Error:", error);
            alert("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            if (uploadRef.current) {
                uploadRef.current.value = "";
            }
        }
    };

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter((url) => url !== urlToRemove));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {value.map((url) => (
                    <div key={url} className="relative aspect-square overflow-hidden rounded-lg border border-stone-200 bg-stone-50 group">
                        <Image
                            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                            src={url}
                            alt="Gallery Image"
                            width={300}
                            height={300}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => handleRemove(url)}
                                disabled={disabled}
                                className="h-8 w-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Upload Trigger */}
                <div
                    onClick={() => !disabled && uploadRef.current?.click()}
                    className={`flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer ${disabled && 'opacity-50 cursor-not-allowed'}`}
                >
                    {isUploading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                            <Plus className="h-8 w-8" />
                            <span className="text-xs font-medium">Add Image</span>
                        </div>
                    )}
                </div>
            </div>

            <input
                type="file"
                ref={uploadRef}
                onChange={handleUpload}
                accept="image/*"
                multiple
                className="hidden"
                disabled={disabled}
            />
        </div>
    );
};
