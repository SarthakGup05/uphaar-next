"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
    {
        category: "Ordering & Shipping",
        items: [
            {
                question: "How long does shipping take?",
                answer: "Since our items are handcrafted with care, please allow 3-5 business days for processing. Once shipped, delivery typically takes 4-7 business days depending on your location in India."
            },
            {
                question: "Do you offer cash on delivery (COD)?",
                answer: "Currently, we only accept prepaid orders via UPI, Credit/Debit Cards, and Net Banking to ensure a seamless and contactless delivery experience."
            },
            {
                question: "Can I track my order?",
                answer: "Yes! Once your order is shipped, you will receive a tracking link via WhatsApp and Email to stay updated on its journey."
            }
        ]
    },
    {
        category: "Customization",
        items: [
            {
                question: "Can I customize the colors for resin art?",
                answer: "Absolutely! We love creating unique pieces. You can reach out to us via WhatsApp or Email with your color preferences after placing an order, or use the 'Custom Order' form on our Contact page."
            },
            {
                question: "Do you make custom neon signs?",
                answer: "Yes, we specialize in custom neon signage. Please share your design or text idea with us on WhatsApp for a quote."
            },
            {
                question: "Is there an extra charge for customization?",
                answer: "Minor color changes are usually free! For significant design modifications or personalized text, there might be a small additional fee which we will confirm with you beforehand."
            }
        ]
    },
    {
        category: "Product Care",
        items: [
            {
                question: "How do I care for my resin coaster/tray?",
                answer: "Resin is durable but scratch-prone. Wipe with a soft, damp cloth. Avoid harsh chemicals, scrubbing pads, and placing extremely hot items (like boiling pots) directly on the surface."
            },
            {
                question: "Are the candles non-toxic?",
                answer: "Yes, we use 100% natural soy wax and lead-free cotton wicks, ensuring a clean burn without harmful toxins."
            }
        ]
    },
    {
        category: "Returns & Refunds",
        items: [
            {
                question: "What is your return policy?",
                answer: "Due to the handmade nature of our products, we do not accept returns unless the item arrives damaged. If you receive a damaged product, please send us an unboxing video within 24 hours of delivery."
            },
            {
                question: "Can I cancel my order?",
                answer: "You can cancel your order within 24 hours of placing it for a full refund. After that, processing may have already begun."
            }
        ]
    }
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-background pb-20">

            {/* 1. Hero Section */}
            <section className="relative w-full bg-primary/5 py-20 text-center md:py-32">
                <div className="container px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mx-auto max-w-2xl"
                    >
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <HelpCircle className="h-8 w-8" />
                            </div>
                        </div>
                        <h1 className="mb-4 font-serif text-4xl font-bold text-foreground md:text-5xl">
                            Frequently Asked <span className="text-primary italic">Questions</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Everything you need to know about our products and customization.
                        </p>
                    </motion.div>
                </div>
                {/* Decorative Blur */}
                <div className="absolute right-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" />
            </section>

            {/* 2. FAQ Accordion */}
            <div className="container mx-auto max-w-3xl px-4 py-16">
                {faqs.map((section, idx) => (
                    <motion.div
                        key={section.category}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="mb-6 font-serif text-2xl font-bold text-foreground border-b border-border pb-2">
                            {section.category}
                        </h2>
                        <Accordion type="single" collapsible className="w-full">
                            {section.items.map((item, itemIdx) => (
                                <AccordionItem key={itemIdx} value={`${section.category}-${itemIdx}`}>
                                    <AccordionTrigger className="text-left text-base font-medium hover:text-primary hover:no-underline">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </motion.div>
                ))}
            </div>

            {/* 3. CTA Section */}
            <section className="container mx-auto px-4">
                <div className="rounded-2xl bg-stone-900 px-6 py-12 text-center text-white md:px-12 md:py-16">
                    <h2 className="font-serif text-2xl font-bold md:text-3xl">Still have questions?</h2>
                    <p className="mx-auto mt-4 max-w-lg text-white/80">
                        Can't find the answer you're looking for? Please chat to our friendly team.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Link href="/contact">
                            <Button size="lg" className="bg-white text-stone-900 hover:bg-stone-200">
                                Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
