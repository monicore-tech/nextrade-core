"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const perks = [
  { icon: ShoppingBag, label: "100+ Products" },
  { icon: Zap, label: "Fast Delivery" },
  { icon: Shield, label: "Secure Checkout" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl mb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background grid texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 px-8 py-16 md:py-24 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-300 mb-4 border border-indigo-400/30 rounded-full px-3 py-1">
            New arrivals every week
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-4">
            Shop Smarter,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
              Live Better
            </span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
            Discover premium products across every category. Curated quality, delivered fast, backed by data.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/#products">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold gap-2">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/category/smartphones">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                View Deals
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {perks.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-slate-300">
              <Icon className="h-4 w-4 text-indigo-300" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
