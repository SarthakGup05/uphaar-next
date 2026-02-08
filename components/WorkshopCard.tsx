
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import imageKitLoader from "@/lib/imagekit-loader";

interface WorkshopProps {
    id: number;
    title: string;
    slug: string;
    description: string;
    date: Date | string;
    location: string;
    price: number;
    totalSeats: number;
    seatsFilled: number;
    image: string;
}

export default function WorkshopCard({
    title,
    slug,
    date,
    location,
    price,
    totalSeats,
    seatsFilled,
    image,
}: WorkshopProps) {
    const workshopDate = new Date(date);
    const seatsLeft = totalSeats - seatsFilled;
    const isSoldOut = seatsLeft <= 0;

    return (
        <Link href={`/workshops/${slug}`} className="group block h-full w-full">
            <div className="relative flex flex-col h-full bg-white rounded-xl overflow-hidden border border-stone-100 transition-all duration-300 hover:shadow-lg hover:border-stone-200">
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-50">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        loader={imageKitLoader}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Date Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm flex flex-col items-center justify-center min-w-[60px]">
                        <span className="text-xs font-bold text-red-500 uppercase">
                            {format(workshopDate, "MMM")}
                        </span>
                        <span className="text-lg font-bold text-stone-900 leading-none">
                            {format(workshopDate, "dd")}
                        </span>
                    </div>

                    {/* Sold Out Overlay */}
                    {isSoldOut && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-red-600 text-white px-4 py-2 font-bold text-sm tracking-widest uppercase transform -rotate-12 border-2 border-white">
                                Sold Out
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3 flex-grow">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs font-medium text-stone-500">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[100px]">{location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>{seatsLeft} seats left</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-xl font-medium text-stone-900 group-hover:text-red-600 transition-colors line-clamp-2">
                        {title}
                    </h3>

                    {/* Footer: Price & Action */}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-stone-100">
                        <div>
                            <p className="text-xs text-stone-500">Price per person</p>
                            <p className="text-lg font-bold text-stone-900">
                                ₹{price.toLocaleString()}
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            className="group-hover:bg-stone-900 group-hover:text-white transition-colors"
                            disabled={isSoldOut}
                        >
                            {isSoldOut ? "Full" : "Book Now"}
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
