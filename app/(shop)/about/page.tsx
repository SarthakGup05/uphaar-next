"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Leaf, Palette, Heart, Hammer, Award, Users, Gift } from "lucide-react"; // Added Gift icon
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      
      {/* SECTION 1: HERO & BRAND STORY */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 text-center z-10 relative">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className="max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 px-4 py-1 border-primary text-primary tracking-widest uppercase">
              Est. 2024
            </Badge>
            <h1 className="font-serif text-5xl md:text-8xl font-bold text-foreground mb-6">
              Uphaar <span className="text-3xl md:text-5xl font-normal italic text-secondary">by Niharika</span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              "Uphaar" means <em>Gift</em>. <br/>
              We believe that art is the most personal gift you can give—to your home, to your loved ones, or to yourself.
            </p>
          </motion.div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </section>

      {/* SECTION 2: MEET NIHARIKA */}
      <section className="py-16 bg-stone-50/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Image Side */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[4/5] w-full max-w-md mx-auto md:mr-auto rounded-2xl overflow-hidden shadow-2xl">
                {/* Replace with Niharika's photo */}
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop" 
                  alt="Niharika - Founder of Uphar" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-primary/20 rounded-2xl -z-10 hidden md:block" />
            </motion.div>

            {/* Text Side */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Hi, I'm <span className="text-primary">Niharika.</span>
              </h2>
              <h3 className="text-xl font-medium text-secondary">Artist & Creator</h3>
              <p className="text-muted-foreground leading-relaxed">
                Uphar began with a simple idea: the joy of creating something with my own hands. 
                I fell in love with the unpredictability of resin, the warmth of soy wax, and the 
                raw strength of concrete.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every piece in this shop is poured, sanded, and packaged by me. 
                I don't just sell decor; I sell a piece of my time, my vision, and my heart. 
                I hope you find a Uphar here that speaks to you.
              </p>
              
              <div className="pt-4 font-serif text-3xl text-primary opacity-80 italic">
                - Niharika
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 3: THE VALUES */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-3xl font-bold mb-4">The Art of Gifting</h2>
          <p className="text-muted-foreground">What makes a Uphar special?</p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <motion.div variants={fadeIn} className="bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
              <Gift className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Gift Ready</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Packaging is part of the experience. Every order arrives beautifully wrapped, ready to be gifted immediately.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={fadeIn} className="bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-secondary/10 rounded-full flex items-center justify-center mb-6 text-secondary">
              <Palette className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Unique Aesthetic</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Inspired by nature and modern art. We blend colors to create one-of-a-kind patterns that cannot be replicated.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={fadeIn} className="bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center mb-6 text-yellow-700">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Handmade Soul</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              No machines. Just hands, heart, and patience. Imperfections are the proof of authenticity.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 4: STATS STRIP */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary-foreground/20">
            <div className="space-y-2">
              <Hammer className="h-8 w-8 mx-auto mb-4 opacity-80" />
              <h4 className="text-4xl font-serif font-bold">100%</h4>
              <p className="text-sm font-medium uppercase tracking-wider opacity-80">Handmade</p>
            </div>
            <div className="space-y-2">
              <Users className="h-8 w-8 mx-auto mb-4 opacity-80" />
              <h4 className="text-4xl font-serif font-bold">500+</h4>
              <p className="text-sm font-medium uppercase tracking-wider opacity-80">Gifts Delivered</p>
            </div>
            <div className="space-y-2">
              <Award className="h-8 w-8 mx-auto mb-4 opacity-80" />
              <h4 className="text-4xl font-serif font-bold">Top</h4>
              <p className="text-sm font-medium uppercase tracking-wider opacity-80">Quality Resin</p>
            </div>
            <div className="space-y-2">
              <Leaf className="h-8 w-8 mx-auto mb-4 opacity-80" />
              <h4 className="text-4xl font-serif font-bold">Eco</h4>
              <p className="text-sm font-medium uppercase tracking-wider opacity-80">Soy Wax</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* SECTION 5: CTA */}
      <section className="py-24 text-center">
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Find the perfect Uphar.</h2>
          <Link href="/shop">
        <Button size="lg" className="cursor-pointer rounded-full px-8 h-12 text-lg">
          Browse Collection
        </Button>
        </Link>
      </section>

    </div>
  );
}