
"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import WorkshopForm from "../_components/workshop-form";

export default function NewWorkshopPage() {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/workshops">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="font-serif text-2xl font-bold">Add New Workshop</h1>
            </div>

            <WorkshopForm />
        </div>
    );
}
