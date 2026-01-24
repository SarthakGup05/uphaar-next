"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { AlertCircle, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center bg-background text-foreground font-sans">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-destructive/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center px-4 md:px-6 text-center max-w-lg mx-auto"
            >
                {/* Animated Icon */}
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                    transition={{
                        delay: 0.5,
                        duration: 0.6,
                        ease: "easeInOut",
                        repeat: 0,
                    }}
                    className="mb-8 relative"
                >
                    <div className="absolute inset-0 bg-destructive/10 blur-xl rounded-full" />
                    <AlertCircle className="w-24 h-24 md:w-32 md:h-32 text-destructive relative z-10 stroke-[1.5]" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 tracking-tight"
                >
                    Something Went Wrong
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-lg text-muted-foreground mb-8 text-balance"
                >
                    We encountered an unexpected error while wrapping your request. Don't worry, it's not you, it's us.
                </motion.p>

                <div className="p-4 bg-muted/50 rounded-lg border border-border/50 mb-8 w-full backdrop-blur-sm">
                    <p className="text-sm font-mono text-muted-foreground break-all">
                        Error: {error.message || "Unknown error occurred"}
                    </p>
                    {error.digest && (
                        <p className="text-xs text-muted-foreground/60 mt-2 font-mono">
                            Digest: {error.digest}
                        </p>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                >
                    <Button
                        onClick={reset}
                        size="lg"
                        className="w-full sm:w-auto rounded-full px-8 h-12 shadow-lg shadow-destructive/10 transition-transform hover:scale-105"
                    >
                        <RefreshCcw className="mr-2 w-4 h-4" />
                        Try Again
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto rounded-full px-8 h-12 transition-transform hover:scale-105 hover:bg-muted"
                    >
                        <Link href="/">
                            <Home className="mr-2 w-4 h-4" />
                            Go Home
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    )
}
