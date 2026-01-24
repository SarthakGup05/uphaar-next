import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F0] pt-16 pb-8 border-t border-stone-200">
      <div className="container mx-auto px-4 md:px-6">

        {/* Top Section: Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="block relative h-24 w-72 transition-opacity hover:opacity-90">
              <Image
                src="/logo.png"
                alt="Uphaar by Niharika"
                fill
                className="object-contain object-left mix-blend-multiply"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Handcrafted with love. We bring sustainable, artistic, and unique décor pieces to your modern home.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.instagram.com/uphaar_token_of_love/?igsh=Mm9leXRoY3hvaDJl#" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white border-stone-300 bg-transparent">
                  <Instagram className="h-4 w-4" />
                </Button>
              </a>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white border-stone-300 bg-transparent">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white border-stone-300 bg-transparent">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-foreground">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {/* Updated links to match the Shop Page filtering logic */}
              <li><Link href="/shop?category=resin" className="hover:text-primary transition-colors">Resin Art</Link></li>
              <li><Link href="/shop?category=candles" className="hover:text-primary transition-colors">Scented Candles</Link></li>
              <li><Link href="/shop?category=concrete" className="hover:text-primary transition-colors">Concrete Décor</Link></li>
              <li><Link href="/shop?category=gifts" className="hover:text-primary transition-colors">Gift Hampers</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">View All</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-foreground">Help</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQs & Care</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter (Commented out as per previous code, but structure kept) */}
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="block text-foreground font-medium">Email</span> Uphaarbyniharika@gmail.com</li>
              <li><span className="block text-foreground font-medium">Phone</span> +91 70007 69656</li>
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-stone-300" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Uphaar by Niharika. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}