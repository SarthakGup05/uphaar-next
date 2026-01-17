"use client";

import { Instagram, Mail, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";

export function FloatingSocials() {
    const socials = [
        {
            name: "Instagram",
            icon: Instagram,
            href: "https://www.instagram.com/uphaar_token_of_love/?igsh=Mm9leXRoY3hvaDJl#",
            color: "hover:bg-pink-600",
        },
        {
            name: "WhatsApp",
            icon: MessageCircle,
            href: "https://wa.me/917000769656",
            color: "hover:bg-green-600",
        },
        {
            name: "Email",
            icon: Mail,
            href: "mailto:Uphaarbyniharika@gmail.com",
            color: "hover:bg-blue-600",
        },
    ];

    return (
        <div className="fixed right-0 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-2 p-2">
            {socials.map((social) => (
                <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-700 shadow-md transition-all hover:text-white hover:scale-110 ${social.color} md:h-12 md:w-12`}
                    title={social.name}
                >
                    <social.icon className="h-5 w-5 md:h-6 md:w-6" />
                </a>
            ))}
        </div>
    );
}
