"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { PackageOpen, ArrowLeft, Home } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-[60px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center px-4 md:px-6 text-center"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <PackageOpen className="w-32 h-32 md:w-40 md:h-40 text-primary relative z-10 stroke-[1.5]" />
        </motion.div>

        {/* 404 Text */}
        <h1 className="text-[8rem] md:text-[12rem] font-serif leading-none tracking-tighter text-foreground/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 bg-gradient-to-b from-foreground/5 to-transparent bg-clip-text text-transparent">
          404
        </h1>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 tracking-tight"
        >
          The Gift is Missing
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed"
        >
          We've looked everywhere, but the page you're wrapping simply doesn't exist.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Button asChild size="lg" className="rounded-full px-8 h-12 shadow-lg shadow-primary/20 transition-transform hover:scale-105">
            <Link href="/">
              <Home className="mr-2 w-4 h-4" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 hover:bg-muted transition-transform hover:scale-105 border-primary/20">
            <Link href="/shop">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Continue Shopping
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Footer Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 left-0 w-full text-center text-sm text-muted-foreground/60"
      >
        Lost? Don't worry, it happens to the best of us.
      </motion.div>
    </div>
  )
}
