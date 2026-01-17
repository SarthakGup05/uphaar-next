"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import api from "@/lib/axios";
import { HeroSkeleton } from "@/components/skeletons/public-skeletons";

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

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [[page, direction], setPage] = useState([0, 0]);

  // Fetch Slides
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data } = await api.get("/hero");
        if (data.length > 0) {
          setSlides(data);
        } else {
          // Fallback if no slides exist
          setSlides([]);
        }
      } catch (error) {
        console.error("Failed to fetch hero slides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

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

  if (loading) {
    return <HeroSkeleton />;
  }

  if (slides.length === 0) {
    // Return null or a default static hero if no slides are set up yet
    return null;
  }

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-background md:h-[700px]">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
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
          {/* Background Image */}
          <div className="relative h-full w-full">
            <Image
              src={currentSlide.image}
              alt={currentSlide.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30 md:bg-black/20" />
          </div>

          {/* Text Content */}
          <div className={`absolute inset-0 flex items-center px-8 md:px-16 ${currentSlide.align === 'left' ? 'justify-start' :
            currentSlide.align === 'right' ? 'justify-end' :
              'justify-center text-center'
            }`}>
            <div className="max-w-2xl text-white">
              <motion.div
                key={`text-${page}`}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
              >
                <motion.h2 variants={textVariants} className="mb-2 text-lg font-medium uppercase tracking-widest text-accent/90">
                  Handcrafted Collection
                </motion.h2>
                <motion.h1 variants={textVariants} className="mb-6 font-serif text-5xl font-bold leading-tight md:text-7xl">
                  {currentSlide.title}
                </motion.h1>
                <motion.p variants={textVariants} className="mb-8 text-lg font-light text-white/90 md:text-xl">
                  {currentSlide.subtitle}
                </motion.p>
                <motion.div variants={textVariants}>
                  <Button size="lg" className="rounded-full bg-white text-black hover:bg-white/90">
                    {currentSlide.cta}
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons (Only if > 1 slide) */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            onClick={() => paginate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            onClick={() => paginate(1)}
          >
            <ArrowRight className="h-6 w-6" />
          </Button>

          {/* Pagination Dots */}
          <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setPage([index, index > slideIndex ? 1 : -1])}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${index === slideIndex ? "bg-white w-8" : "bg-white/50"
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}