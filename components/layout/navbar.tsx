"use client";

import { motion, Variants } from "framer-motion";

import Link from "next/link";
import { Menu, Search, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CartSheet } from "@/components/Cartsheet";

export default function Navbar() {
  // Updated links to query the Shop Page filters directly
  const navLinks = [
    { name: "Resin Art", href: "/shop?category=resin" },
    { name: "Scented Candles", href: "/shop?category=candles" },
    { name: "Concrete Décor", href: "/shop?category=concrete" },
    { name: "Gift Hampers", href: "/shop?category=gifts" },
    { name: "Contact", href: "/contact" },
  ];

  // Animation variants
  const menuVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* ... Announcement Bar ... */}
      <div className="bg-stone-900 px-4 py-2.5 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white sm:text-xs">
        Free Shipping on Orders Above ₹1,999
      </div>

      <nav className="border-b border-white/20 bg-white/75 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-8">

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2 hover:bg-black/5">
                  <Menu className="h-6 w-6 text-stone-800" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] bg-stone-50/95 backdrop-blur-xl border-stone-200/50 p-0">
                <SheetHeader className="p-8 pb-4 text-left border-b border-stone-100">
                  <SheetTitle className="font-serif text-3xl text-stone-900">
                    UPHAAR <span className="block text-xs font-sans font-medium tracking-[0.3em] text-stone-500 mt-2 uppercase">by Niharika</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col px-8 py-8 h-full">
                  <div className="flex flex-col gap-6">
                    {["Home", "About Us", "Shop All"].map((item, i) => (
                      <motion.div
                        key={item}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={menuVariants}
                      >
                        <Link
                          href={item === "Home" ? "/" : item === "About Us" ? "/about" : "/shop"}
                          className="text-xl font-medium uppercase tracking-[0.1em] text-stone-900 hover:text-stone-600 transition-colors"
                        >
                          {item}
                        </Link>
                      </motion.div>
                    ))}

                    <div className="my-2 border-t border-stone-200" />

                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.name}
                        custom={i + 3}
                        initial="hidden"
                        animate="visible"
                        variants={menuVariants}
                      >
                        <Link
                          href={link.href}
                          className="text-lg font-medium text-stone-600 hover:text-stone-900 transition-colors"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    custom={8}
                    initial="hidden"
                    animate="visible"
                    variants={menuVariants}
                    className="mt-auto pb-8 flex gap-6"
                  >
                    <a href="#" className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-900">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-900">
                      <Facebook className="w-5 h-5" />
                    </a>
                  </motion.div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo (Centered on Mobile, Left on Desktop) */}
          <div className="flex-1 md:flex-none text-center md:text-left">
            <Link href="/" className="flex flex-col items-center md:items-start group">
              <div className="relative h-20 w-48 md:h-24 md:w-64 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Uphar by Niharika"
                  fill
                  className="object-contain object-center md:object-left"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Links (Centered) */}
          <div className="hidden flex-1 justify-center gap-10 md:flex">
            <Link
              href="/"
              className="group relative text-xs font-bold uppercase tracking-[0.15em] text-stone-600 transition-colors hover:text-black"
            >
              Home
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/about"
              className="group relative text-xs font-bold uppercase tracking-[0.15em] text-stone-600 transition-colors hover:text-black"
            >
              About
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group relative text-xs font-bold uppercase tracking-[0.15em] text-stone-600 transition-colors hover:text-black"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-black transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Sheet Component */}
            <CartSheet />
          </div>
        </div>
      </nav>
    </header>
  );
}