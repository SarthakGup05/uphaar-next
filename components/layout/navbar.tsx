"use client";

import Link from "next/link";
import { Menu, Search, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* 1. Announcement Bar */}
      <div className="bg-primary px-4 py-2 text-center text-[10px] font-medium uppercase tracking-widest text-white sm:text-xs">
        Free Shipping on Orders Above ₹1,999
      </div>

      {/* 2. Main Navigation */}
      <nav className="border-b border-stone-200/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          
          {/* Mobile Menu Trigger (Left on Mobile) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-5 w-5 text-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader className="mb-8 text-left">
                  <SheetTitle className="font-serif text-2xl text-primary">
                    Uphar <span className="text-sm italic text-secondary font-normal">by Niharika</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                  <Link href="/" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                    Home
                  </Link>
                  <Link href="/about" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                  <Link href="/shop" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                    Shop All
                  </Link>
                  <div className="my-2 border-t border-border" />
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="mt-8 border-t pt-8 flex gap-4">
                     <Instagram className="w-5 h-5 text-foreground" />
                     <Facebook className="w-5 h-5 text-foreground" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo (Centered on Mobile, Left on Desktop) */}
          <div className="flex-1 md:flex-none text-center md:text-left">
            <Link href="/" className="flex flex-col items-center md:items-start leading-none group">
              <span className="font-serif text-2xl font-bold tracking-tight text-primary transition-colors group-hover:opacity-80">
                Uphar
              </span>
              <span className="font-serif text-[10px] italic tracking-widest text-secondary -mt-1">
                by Niharika
              </span>
            </Link>
          </div>

          {/* Desktop Links (Centered) */}
          <div className="hidden flex-1 justify-center gap-8 md:flex">
             <Link
                href="/"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 decoration-secondary"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 decoration-secondary"
              >
                About
              </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 decoration-secondary"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-primary">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Cart Sheet Component */}
            <CartSheet />
          </div>
        </div>
      </nav>
    </header>
  );
}