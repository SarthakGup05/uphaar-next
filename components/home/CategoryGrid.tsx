"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    id: "resin",
    title: "Resin Art",
    description: "Ocean waves & floral preservation.",
    href: "/shop?category=resin", // Updated link
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
    size: "large", // Takes up 2 rows
  },
  {
    id: "candles",
    title: "Aromatherapy",
    description: "Hand-poured soy wax.",
    href: "/shop?category=candles", // Updated link
    image: "https://images.unsplash.com/photo-1602143407151-11115cd4e69b?auto=format&fit=crop&q=80&w=800",
    size: "small",
  },
  {
    id: "concrete",
    title: "Concrete Décor",
    description: "Minimalist planters & trays.",
    href: "/shop?category=concrete", // Updated link
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800",
    size: "small",
  },
];

export default function CategoryGrid() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Shop by Category</h2>
          <p className="mt-2 text-muted-foreground">Explore our handmade collections.</p>
        </div>
        <Link href="/shop" className="group flex items-center gap-1 text-sm font-medium text-primary">
          View All <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 h-[800px] md:h-[600px]">
        {categories.map((cat, idx) => (
          <Link
            key={cat.id}
            href={cat.href}
            className={`group relative overflow-hidden rounded-2xl ${
              cat.size === "large" ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative h-full w-full"
            >
              {/* Image with Zoom Effect */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 p-6 text-white md:p-8">
                <h3 className="font-serif text-2xl font-bold md:text-3xl">{cat.title}</h3>
                <p className="mt-2 text-white/80">{cat.description}</p>
              </div>

              {/* Hover Floating Button */}
              <div className="absolute right-6 top-6 translate-x-10 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                    <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}