"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import api from "@/lib/axios";
import { HeroSkeleton } from "@/components/skeletons/public-skeletons";
import imageKitLoader from "@/lib/imagekit-loader";

// Interface must match DB schema + UI needs
interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  align: "left" | "center" | "right";
  order: number;
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const textVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

export default function Hero({ initialSlides = [] }: { initialSlides?: Slide[] }) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [loading, setLoading] = useState(false);
  const [[page, direction], setPage] = useState([0, 0]);

  const slideIndex = slides.length > 0 ? Math.abs(page % slides.length) : 0;
  const currentSlide = slides[slideIndex];

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  useEffect(() => {
    if (slides.length <= 1) return; // Don't autoplay if 0 or 1 slide
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [paginate, slides.length]);

  // Swipe logic helpers
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-background">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <m.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 h-full w-full"
        >
          {/* Background Image with Zoom Effect */}
          <div className="relative h-full w-full overflow-hidden">
            <m.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 10, ease: "linear" }}
              className="relative h-full w-full"
            >
              <Image
                src={currentSlide.image}
                alt={currentSlide.title}
                fill
                loader={imageKitLoader}
                sizes="100vw"
                className="object-cover"
                priority
                fetchPriority="high"
              />
            </m.div>
            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Text Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-4 md:px-20">
            <div className="max-w-4xl text-white pt-10 md:pt-20 mx-auto">
              <m.div
                key={`text-${page}`}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.15 } }
                }}
              >
                <m.div variants={textVariants} className="mb-4 md:mb-6 flex items-center justify-center gap-3">
                  <span className="h-px w-8 md:w-12 bg-accent/80"></span>
                  <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Handcrafted Luxury
                  </span>
                  <span className="h-px w-8 md:w-12 bg-accent/80"></span>
                </m.div>

                <m.h1 variants={textVariants} className="mb-4 md:mb-6 font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-lg">
                  {currentSlide.title}
                </m.h1>

                <m.p variants={textVariants} className="mb-8 md:mb-10 text-base sm:text-lg md:text-2xl font-light leading-relaxed text-white/90 mx-auto max-w-lg md:max-w-2xl drop-shadow-sm">
                  {currentSlide.subtitle}
                </m.p>

                <m.div variants={textVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg" className="w-full sm:w-auto h-12 md:h-14 rounded-full bg-white px-8 text-base font-semibold text-black transition-all hover:bg-stone-200 hover:scale-105 active:scale-95">
                    <Link href="/shop">
                      Shop Collection
                    </Link>
                  </Button>
                </m.div>
              </m.div>
            </div>
          </div>
        </m.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <div className="absolute bottom-12 right-12 z-20 hidden flex-col gap-4 md:flex">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-14 w-14 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black hover:border-transparent hover:scale-110"
                onClick={() => paginate(-1)}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-14 w-14 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black hover:border-transparent hover:scale-110"
                onClick={() => paginate(1)}
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 md:hidden text-white/70 hover:text-white"
            onClick={() => paginate(-1)}
          >
            <ArrowLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 md:hidden text-white/70 hover:text-white"
            onClick={() => paginate(1)}
          >
            <ArrowRight className="h-8 w-8" />
          </Button>

          {/* Pagination Indicators */}
          <div className="absolute bottom-12 left-12 z-20 flex gap-4 md:bottom-16">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setPage([index, index > slideIndex ? 1 : -1])}
                className="group relative h-1 overflow-hidden rounded-full bg-white/30 transition-all duration-500"
                style={{ width: index === slideIndex ? "4rem" : "2rem" }}
              >
                <span className={`absolute left-0 top-0 h-full bg-white transition-all duration-500 ${index === slideIndex ? "w-full" : "w-0 group-hover:w-full"}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}