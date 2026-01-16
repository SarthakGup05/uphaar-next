"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion"; // 1. Import Variants
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Data for the slides
const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1656725035727-7779ed46eb1e?q=80&w=653&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Resin Artistry",
    subtitle: "Capture the ocean's depth in your living room.",
    cta: "Shop Resin",
    align: "center",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1600&auto=format&fit=crop",
    title: "Scented Serenity",
    subtitle: "Hand-poured soy candles for quiet moments.",
    cta: "Shop Candles",
    align: "left",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1600&auto=format&fit=crop",
    title: "Modern Concrete",
    subtitle: "Minimalist textures for the contemporary home.",
    cta: "Shop Concrete",
    align: "right",
  },
];

// 2. Explicitly type the variants so TS knows "easeOut" is valid
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
    transition: { duration: 0.6, ease: "easeOut" } // No error now!
  },
};

export default function Hero() {
  const [[page, direction], setPage] = useState([0, 0]);

  const slideIndex = Math.abs(page % slides.length);
  const currentSlide = slides[slideIndex];

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [paginate]);

  // Swipe logic helpers
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

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
          <div className={`absolute inset-0 flex items-center px-8 md:px-16 ${
            currentSlide.align === 'left' ? 'justify-start' : 
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

      {/* Navigation Buttons */}
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
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              index === slideIndex ? "bg-white w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}