"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function ContactPage() {
  const handleWhatsAppClick = () => {
    // Replace with actual number
    window.open("https://wa.me/917000769656", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">

      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-primary/5 py-20 text-center md:py-32">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl"
          >
            <h1 className="mb-4 font-serif text-4xl font-bold text-foreground md:text-6xl">
              Get in <span className="text-primary italic">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a custom design in mind? Looking for bulk gifting options?
              Or just want to say hi? We’d love to hear from you.
            </p>
          </motion.div>
        </div>
        {/* Decorative Blur */}
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" />
      </section>

      {/* 2. MAIN CONTENT SPLIT */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20"
        >

          {/* LEFT: Contact Form */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold">Send us a Message</h2>
              <p className="text-sm text-muted-foreground">
                For custom orders, please describe the colors and quantity you are looking for.
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input id="name" placeholder="Your name" className="bg-stone-50" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="hello@example.com" className="bg-stone-50" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input id="subject" placeholder="Custom Order / Inquiry" className="bg-stone-50" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea
                  id="message"
                  placeholder="Tell us what you have in mind..."
                  className="min-h-[150px] bg-stone-50"
                />
              </div>

              <Button type="submit" size="lg" className="w-full md:w-auto">
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* RIGHT: Contact Info & Direct Links */}
          <motion.div variants={itemVariants} className="flex flex-col gap-8 lg:pl-10">

            {/* Info Cards */}
            <div className="grid gap-6">
              <div className="flex items-start gap-4 rounded-xl border border-border p-6 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Chat on WhatsApp</h3>
                  <p className="mb-3 text-sm text-muted-foreground">The fastest way to reach us for orders.</p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                    onClick={handleWhatsAppClick}
                  >
                    +91 97566 55122
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-border p-6 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Email Us</h3>
                  <p className="mb-3 text-sm text-muted-foreground">For collaborations and bulk inquiries.</p>
                  <a href="mailto:Uphaarbyniharika@gmail.com" className="text-sm hover:text-primary">
                    Uphaarbyniharika@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-border p-6 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-yellow-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Studio Location</h3>
                  <p className="text-sm text-muted-foreground">
                    New Delhi, India <br />
                    (Studio visits by appointment only)
                  </p>
                </div>
              </div>
            </div>

            {/* Social Proof / Follow */}
            <div className="mt-auto rounded-2xl bg-stone-900 p-8 text-white">
              <h3 className="font-serif text-xl">Follow the Journey</h3>
              <p className="mt-2 text-white/70">
                See behind-the-scenes of how we pour our candles and resin art.
              </p>
              <a
                href="https://www.instagram.com/uphaar_token_of_love/?igsh=Mm9leXRoY3hvaDJl#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="mt-6 gap-2 border-white/20 bg-white/10 text-white hover:bg-white hover:text-black"
                >
                  <Instagram className="h-4 w-4" />
                  @uphar_by_niharika
                </Button>
              </a>
            </div>

          </motion.div>
        </motion.div>
      </div>

      {/* 3. FAQ TEASER */}
      <section className="border-t border-border bg-stone-50 py-16 text-center">
        <div className="container px-4">
          <h2 className="mb-4 font-serif text-2xl font-bold">Frequently Asked Questions</h2>
          <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
            Wondering about shipping times or resin care instructions? We might have already answered your question.
          </p>
          <Link href="/faq">
            <Button variant="outline" className="gap-2">
              Visit FAQ Page <Send className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}