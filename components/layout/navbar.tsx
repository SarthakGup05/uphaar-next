"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingBag, X, ChevronDown, Instagram, Facebook } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/Cartsheet";
import { cn } from "@/lib/utils"; // Assuming you have a standard shadcn utils file

// --- Configuration ---
const SHOP_CATEGORIES = [
  { name: "Resin Art", href: "/shop?category=resin" },
  { name: "Scented Candles", href: "/shop?category=candles" },
  { name: "Concrete Décor", href: "/shop?category=concrete" },
  { name: "Gift Hampers", href: "/shop?category=gifts" },
  { name: "Workshops", href: "/workshops" },
  { name: "Shop All", href: "/shop" },
];

const MAIN_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { scrollY } = useScroll();

  // Handle Scroll Appearance
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > 50 && latest > previous) {
      setIsScrolled(true);
    } else if (latest < 50) {
      setIsScrolled(false);
    }
  });

  return (
    <>
      {/* Announcement Bar - Slim & Elegant */}
      <div className="bg-stone-900 text-white overflow-hidden relative z-50">
        <div className="container flex items-center justify-center h-9">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase"
          >
            Free Shipping on Orders Above ₹1,999
          </motion.p>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-500 border-b border-transparent",
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border-stone-100 py-2 shadow-sm"
            : "bg-white py-4 md:py-6"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 h-full">
          <div className="flex items-center justify-between">

            {/* LEFT: Mobile Menu & Desktop Nav */}
            <div className="flex-1 flex items-center justify-start">
              {/* Mobile Trigger */}
              <div className="md:hidden">
                <MobileMenu />
              </div>

              {/* Desktop Navigation (Left Side) */}
              <nav className="hidden md:flex items-center gap-8">
                {MAIN_LINKS.filter(l => l.name !== 'Contact').map((link) => (
                  <NavLink key={link.name} href={link.href}>{link.name}</NavLink>
                ))}

                {/* Shop Dropdown Trigger - Simple Hover */}
                <div className="group relative h-full flex items-center">
                  <Link href="/shop" className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-black transition-colors py-2">
                    Shop <ChevronDown className="w-3 h-3 opacity-50" />
                  </Link>

                  {/* Dropdown Content */}
                  <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                    <div className="w-56 bg-white border border-stone-100 shadow-xl rounded-sm p-4 flex flex-col gap-2">
                      {SHOP_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          className="text-sm text-stone-500 hover:text-stone-900 hover:pl-2 transition-all duration-300 block py-1"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </nav>
            </div>

            {/* CENTER: Logo */}
            <div className="flex-0 flex justify-center absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="group relative block">
                <div className={cn(
                  "relative transition-all duration-500 ease-in-out",
                  isScrolled ? "w-32 h-12" : "w-40 h-16 md:w-56 md:h-20"
                )}>
                  <Image
                    src="/logo.png"
                    alt="UPHAAR"
                    fill
                    className="object-contain mix-blend-multiply"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* RIGHT: Utilities (Search, Contact, Cart) */}
            <div className="flex-1 flex items-center justify-end gap-4 md:gap-6">

              {/* Desktop Only Extra Link */}
              <Link href="/contact" className="hidden md:block text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-black transition-colors">
                Contact
              </Link>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-stone-800 hover:text-stone-500 transition-colors"
              >
                <Search strokeWidth={1.5} className="w-5 h-5 md:w-5 md:h-5" />
              </button>

              <CartSheet />

            </div>
          </div>
        </div>

        {/* Expandable Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-stone-50 border-b border-stone-100"
            >
              <div className="container mx-auto px-6 py-4 flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Search for gifts, candles, art..."
                  className="w-full bg-transparent border-none text-xl placeholder:text-stone-300 focus:ring-0 text-stone-800 font-serif outline-none"
                  autoFocus
                />
                <button onClick={() => setIsSearchOpen(false)}>
                  <X className="w-5 h-5 text-stone-400 hover:text-stone-800" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

// --- Sub Components ---

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative text-xs font-bold uppercase tracking-[0.15em] text-stone-600 transition-colors hover:text-black group py-2"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-stone-800 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="-ml-2 hover:bg-transparent">
          <Menu strokeWidth={1.5} className="h-6 w-6 text-stone-800" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] border-r-stone-100 bg-white/95 backdrop-blur-sm p-0 flex flex-col">

        {/* Mobile Header */}
        <div className="p-8 pb-4 border-b border-stone-100">
          <h2 className="font-serif text-2xl text-stone-900">UPHAAR</h2>
          <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">Artisanal Decor</p>
        </div>

        {/* Scrollable Links Area */}
        <div className="flex-1 overflow-y-auto py-6 px-8 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Menu</span>
            {MAIN_LINKS.map((link) => (
              <MobileLink key={link.href} href={link.href}>{link.name}</MobileLink>
            ))}
          </div>

          <div className="h-px bg-stone-100 w-full my-2" />

          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Collections</span>
            {SHOP_CATEGORIES.map((cat) => (
              <MobileLink key={cat.href} href={cat.href} isSub>{cat.name}</MobileLink>
            ))}
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="p-8 border-t border-stone-100 bg-stone-50">
          <div className="flex gap-4 mb-6">
            <Instagram className="w-5 h-5 text-stone-600" />
            <Facebook className="w-5 h-5 text-stone-600" />
          </div>
          <p className="text-xs text-stone-400">© 2024 Uphaar by Niharika</p>
        </div>

      </SheetContent>
    </Sheet>
  );
}

function MobileLink({ href, children, isSub = false }: { href: string; children: React.ReactNode, isSub?: boolean }) {
  return (
    <SheetClose asChild>
      <Link
        href={href}
        className={cn(
          "block transition-colors hover:text-stone-900",
          isSub
            ? "text-base font-medium text-stone-600"
            : "text-xl font-serif text-stone-800"
        )}
      >
        {children}
      </Link>
    </SheetClose>
  )
}