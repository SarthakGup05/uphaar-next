
import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { workshops } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { format } from "date-fns";
import { Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import imageKitLoader from "@/lib/imagekit-loader";
import AddToCartButton from "./_components/add-to-cart-button"; // We'll create this client component

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function WorkshopDetailPage({ params }: PageProps) {
    const { slug } = await params;

    const [workshop] = await db
        .select()
        .from(workshops)
        .where(eq(workshops.slug, slug));

    if (!workshop) {
        notFound();
    }

    const workshopDate = new Date(workshop.date);
    const seatsLeft = workshop.totalSeats - workshop.seatsFilled;
    const isSoldOut = seatsLeft <= 0;

    return (
        <div className="min-h-screen bg-stone-50/50">
            {/* Hero Section */}
            <div className="relative h-[50vh] md:h-[60vh] w-full bg-stone-900">
                <Image
                    src={workshop.image}
                    alt={workshop.title}
                    fill
                    loader={imageKitLoader}
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute inset-x-0 bottom-0 pb-12 md:pb-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-3 mb-4 text-white/90">
                                <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                    Workshop
                                </span>
                                <span className="flex items-center gap-1 text-sm font-medium">
                                    <Calendar className="w-4 h-4" />
                                    {format(workshopDate, "MMMM d, yyyy")}
                                </span>
                            </div>
                            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                {workshop.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm md:text-base">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    {workshop.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    {format(workshopDate, "h:mm a")}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    {seatsLeft} seats remaining
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                    {/* Left Column: Description */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm">
                            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">About the Workshop</h2>
                            <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed whitespace-pre-wrap">
                                {workshop.description}
                            </div>
                        </div>

                        {/* Gallery (if images exist) */}
                        {workshop.images && workshop.images.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-serif text-xl font-bold text-stone-900">Gallery</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {workshop.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100">
                                            <Image
                                                src={img}
                                                alt={`Gallery ${idx + 1}`}
                                                fill
                                                loader={imageKitLoader}
                                                className="object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-2xl p-6 border border-stone-100 shadow-lg">
                            <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">
                                Reserve your spot
                            </h3>
                            <p className="text-stone-500 text-sm mb-6">
                                Limited seats available for this session.
                            </p>

                            <div className="flex items-end justify-between mb-8 pb-8 border-b border-stone-100">
                                <div>
                                    <p className="text-sm text-stone-400 mb-1">Price per person</p>
                                    <p className="text-3xl font-bold text-stone-900">₹{workshop.price.toLocaleString()}</p>
                                </div>
                                {isSoldOut ? (
                                    <span className="text-red-500 font-bold text-sm">Sold Out</span>
                                ) : (
                                    <span className="text-green-600 font-bold text-sm">Available</span>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-stone-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-stone-900">Date & Time</p>
                                        <p className="text-sm text-stone-500">
                                            {format(workshopDate, "eeee, MMMM d, yyyy")} <br />
                                            {format(workshopDate, "h:mm a")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                                    <MapPin className="w-5 h-5 text-stone-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-stone-900">Location</p>
                                        <p className="text-sm text-stone-500">{workshop.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <AddToCartButton
                                    workshop={workshop}
                                    isSoldOut={isSoldOut}
                                />
                            </div>

                            <p className="mt-4 text-xs text-center text-stone-400">
                                Secure payment processed by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
