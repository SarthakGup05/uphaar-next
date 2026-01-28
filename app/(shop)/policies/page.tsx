import React from 'react';
import { Separator } from "@/components/ui/separator";

export const metadata = {
    title: 'Policies | Uphaar by Niharika',
    description: 'Read our Terms of Service, Privacy Policy, Refund Policy, and Shipping Information.',
};

export default function PoliciesPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl text-stone-800">
            <div className="mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-stone-900">
                    Terms & Policies
                </h1>
                <p className="text-stone-500 text-lg">
                    Everything you need to know about shopping with Uphaar
                </p>
            </div>

            <div className="space-y-12">
                {/* PRIVACY POLICY */}
                <section id="privacy-policy" className="scroll-mt-24">
                    <h2 className="text-2xl font-serif font-semibold mb-4 text-stone-900">Privacy Policy</h2>
                    <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed">
                        <p><strong>Effective Date:</strong> January 28, 2026</p>
                        <p className="mt-4">
                            At <strong>Uphaar by Niharika</strong>, we value your trust and are committed to protecting your personal information.
                            This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.
                        </p>

                        <h3 className="text-lg font-semibold text-stone-800 mt-6 mb-2">1. Information We Collect</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Personal Information:</strong> Name, email address, phone number, shipping and billing address.</li>
                            <li><strong>Order Information:</strong> Details of products purchased, order history, and payment method (processed securely via third-party gateways).</li>
                            <li><strong>Usage Data:</strong> Information about how you interact with our website, such as IP address, browser type, and pages visited.</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-stone-800 mt-6 mb-2">2. How We Use Your Information</h3>
                        <p>We use your data to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Process and fulfill your orders.</li>
                            <li>Communicate with you regarding order updates and support.</li>
                            <li>Improve our website and customer experience.</li>
                            <li>Send promotional emails (only if you have opted in).</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-stone-800 mt-6 mb-2">3. Data Sharing</h3>
                        <p>
                            We do not sell your personal data. We strictly share information only with trusted third parties necessary for operations,
                            such as payment processors (e.g., Razorpay, Stripe) and shipping partners.
                        </p>
                    </div>
                </section>

                <Separator className="bg-stone-200" />

                {/* SHIPPING POLICY */}
                <section id="shipping-policy" className="scroll-mt-24">
                    <h2 className="text-2xl font-serif font-semibold mb-4 text-stone-900">Shipping Policy</h2>
                    <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed">
                        <p>
                            We aim to deliver your handcrafted gifts as safely and quickly as possible. Please review our shipping guidelines below.
                        </p>

                        <h3 className="text-lg font-semibold text-stone-800 mt-6 mb-2">1. Processing Time</h3>
                        <p>
                            Depending on the product, processing takes <strong>2-5 business days</strong>. Custom or personalized orders may take
                            an additional <strong>3-7 days</strong> to create.
                        </p>

                        <h3 className="text-lg font-semibold text-stone-800 mt-6 mb-2">2. Delivery Timelines</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Metro Cities:</strong> 3-5 business days after dispatch.</li>
                            <li><strong>Rest of India:</strong> 5-8 business days after dispatch.</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-stone-800 mt-6 mb-2">3. Shipping Charges</h3>
                        <p>
                            Shipping is calculated at checkout based on the weight and dimensions of your order. We offer free shipping on orders above ₹2,999.
                        </p>
                    </div>
                </section>

                <Separator className="bg-stone-200" />

                {/* REFUND & CANCELLATION */}
                <section id="refund-policy" className="scroll-mt-24">
                    <h2 className="text-2xl font-serif font-semibold mb-4 text-stone-900">Refund & Cancellation Policy</h2>
                    <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed">
                        <h3 className="text-lg font-semibold text-stone-800 mt-6 mb-2">1. Cancellations</h3>
                        <p>
                            You may cancel your order within <strong>24 hours</strong> of placement. Once the order has been processed or shipped, it cannot be cancelled.
                            For custom orders, cancellation is not possible once work has begun.
                        </p>

                        <h3 className="text-lg font-semibold text-stone-800 mt-6 mb-2">2. Returns & Refunds</h3>
                        <p>
                            Due to the delicate and handcrafted nature of our products, we generally <strong>do not accept returns</strong>. However, we will offer a replacement or refund if:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>The product arrives damaged or broken.</li>
                            <li>You received the wrong item.</li>
                        </ul>
                        <p className="mt-2">
                            <strong>Note:</strong> To claim a refund for damage, an <strong>unboxing video is mandatory</strong> without any cuts or edits.
                            Please report the issue within 48 hours of delivery via email or WhatsApp.
                        </p>
                    </div>
                </section>

                <Separator className="bg-stone-200" />

                {/* TERMS OF SERVICE */}
                <section id="terms-of-service" className="scroll-mt-24">
                    <h2 className="text-2xl font-serif font-semibold mb-4 text-stone-900">Terms of Service</h2>
                    <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed">
                        <p>
                            By accessing or using the Uphaar by Niharika website, you agree to be bound by these terms.
                        </p>

                        <h3 className="text-lg font-semibold text-stone-800 mt-6 mb-2">1. Intellectual Property</h3>
                        <p>
                            All content, including images, designs, logos, and text, is the property of Uphaar by Niharika. You may not use our
                            content for commercial purposes without prior written permission.
                        </p>

                        <h3 className="text-lg font-semibold text-stone-800 mt-6 mb-2">2. Product Variations</h3>
                        <p>
                            Since our products are handcrafted using materials like resin and concrete, slight variations in color, texture, and
                            design are natural and add to the uniqueness of each piece. These are not considered defects.
                        </p>

                        <h3 className="text-lg font-semibold text-stone-800 mt-6 mb-2">3. Limitation of Liability</h3>
                        <p>
                            Uphaar by Niharika shall not be liable for any indirect, incidental, or consequential damages arising arising from
                            the use of our products or website.
                        </p>

                        <p className="mt-6 text-sm text-stone-500 italic">
                            Questions? Contact us at support@uphaarbyniharika.in
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
