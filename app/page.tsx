export const dynamic = "force-dynamic";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import * as motion from "framer-motion/client";
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  CreditCard,
  Globe,
  Layers,
  Search,
  ShoppingCart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const categories = [
  {
    title: "Regional banking",
    subtitle: "Curated accounts across key markets",
    icon: Globe,
  },
  {
    title: "High balance tiers",
    subtitle: "Premium inventories with verified limits",
    icon: Layers,
  },
  {
    title: "Enterprise bundles",
    subtitle: "Multi-account packages for teams",
    icon: BadgeCheck,
  },
];

const steps = [
  { id: "discover", label: "Discover", icon: Search },
  { id: "cart", label: "Cart", icon: ShoppingCart },
  { id: "checkout", label: "Checkout", icon: CreditCard },
  { id: "complete", label: "Complete", icon: CheckCircle2 },
];

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f2ea] text-foreground">
      <section className="relative isolate overflow-hidden px-6 pb-16 pt-20 md:px-10 lg:pb-24 lg:pt-24">
        <Image
          src="/images/hero/coin.png"
          alt="Floating coin"
          width={220}
          height={220}
          className="coin-float pointer-events-none absolute -left-6 top-8 h-16 w-16 md:-left-10 md:top-10 md:h-32 md:w-32 lg:h-40 lg:w-40"
          style={{ "--coin-rotate": "-12deg" } as React.CSSProperties}
        />
        <Image
          src="/images/hero/coin.png"
          alt="Floating coin"
          width={260}
          height={260}
          className="coin-float-slow pointer-events-none absolute -right-6 top-6 h-16 w-16 sm:-right-10 sm:top-8 sm:h-28 sm:w-28 md:-right-16 md:h-36 md:w-36 lg:h-44 lg:w-44"
          style={{ "--coin-rotate": "6deg" } as React.CSSProperties}
        />
        <div className="pointer-events-none absolute -left-20 top-1/2 hidden -translate-y-1/2 lg:block">
          <Image
            src="/images/hero/coin.png"
            alt="Floating coin"
            width={320}
            height={320}
            className="coin-float h-44 w-44 lg:h-56 lg:w-56"
            style={{ "--coin-rotate": "12deg" } as React.CSSProperties}
          />
        </div>
        <Image
          src="/images/hero/coin.png"
          alt="Floating coin"
          width={300}
          height={300}
          className="coin-float-slow pointer-events-none absolute -right-24 bottom-12 hidden h-40 w-40 lg:block lg:h-52 lg:w-52"
          style={{ "--coin-rotate": "-12deg" } as React.CSSProperties}
        />

        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <Badge variant="outline" className="bg-background/60 px-4 py-1 text-xs">
              Premium marketplace for verified buyers
            </Badge>
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Go from 0 to verified.
              </h1>
              <p className="text-pretty text-base text-muted-foreground sm:text-lg">
                Anyone can access verified listings. Start with a region, compare
                balances, and complete transactions with confidence.
              </p>
            </div>
            <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="h-11 rounded-3xl px-6">
                <Link href="/shop">Start buying</Link>
              </Button>
              <InputGroup className="h-11 w-full max-w-md rounded-3xl bg-white/70 shadow-sm">
                <InputGroupInput
                  placeholder="Search marketplace..."
                  className="text-sm"
                />
                <InputGroupButton
                  size="icon-sm"
                  className="h-8 w-8 rounded-full bg-foreground text-background"
                  aria-label="Search marketplace"
                >
                  <Search className="size-4" />
                </InputGroupButton>
              </InputGroup>
            </div>
            <div className="text-xs text-muted-foreground">
              Trusted by verified buyers worldwide
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 pb-20 md:px-10 lg:pb-28">

        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="grid gap-6 lg:grid-cols-2"
          >
            <div className="relative overflow-hidden rounded-4xl border border-border/60 bg-white p-8 shadow-[0_25px_80px_-60px_rgba(15,23,42,0.25)]">
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  List anything with confidence.
                </h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  From verified accounts to premium bundles, create listings that
                  look sharp, stay consistent, and convert quickly.
                </p>
              </div>
              <div className="relative mt-6 h-52 w-full sm:h-64">
                <Image
                  src="/images/hero/ukelele.png"
                  alt="Marketplace listing preview"
                  fill
                  className="object-contain object-right-top"
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-4xl border border-border/60 bg-white p-8 shadow-[0_25px_80px_-60px_rgba(15,23,42,0.25)]">
              <div className="space-y-4">
                <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Build your own momentum.
                </h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Track performance, optimize pricing, and scale listings with
                  visibility that stays clear on every device.
                </p>
              </div>
              <div className="relative mt-6 h-52 w-full sm:h-64">
                <Image
                  src="/images/hero/analytics.png"
                  alt="Marketplace analytics preview"
                  fill
                  className="object-contain object-right-bottom"
                />
              </div>
            </div>
          </motion.div>
        </section>

        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
            className="grid gap-6 lg:grid-cols-2"
          >
            <div className="relative overflow-hidden rounded-4xl border border-border/60 bg-white p-8 shadow-[0_25px_80px_-60px_rgba(15,23,42,0.25)]">
              <div className="space-y-5">
                <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Reach verified buyers anywhere.
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Fast checkout with secure escrow.",
                    "Multi-currency pricing with transparent fees.",
                    "Flexible terms for single or bundled sales.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full border border-border/60 bg-white">
                        <Check className="size-3 text-foreground" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-4xl border border-border/60 bg-white p-8 shadow-[0_25px_80px_-60px_rgba(15,23,42,0.25)]">
              <div className="space-y-4">
                <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Ship your listings everywhere.
                </h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Launch a professional storefront in minutes and connect your
                  inventory to the channels your buyers already trust.
                </p>
              </div>
              <div className="relative mt-6 h-56 w-full sm:h-64 md:h-72">
                <Image
                  src="/images/hero/order.jpg"
                  alt="Kubera order storefront preview"
                  fill
                  className="object-contain object-right-bottom"
                />
              </div>
            </div>
          </motion.div>
        </section>

        <section className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
            className="text-center"
          >
            <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              You already have the inventory. Now make it convert.
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Kubera keeps every step clean, fast, and trusted.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.18 }}
            className="relative overflow-hidden rounded-3xl border border-border/60 bg-[#e8d48a] px-4 py-10 shadow-[0_35px_90px_-70px_rgba(200,170,80,0.6)] sm:rounded-[3rem] sm:px-8 sm:py-14 lg:rounded-[4rem]"
          >
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="absolute -left-6 top-4 h-20 w-20 rounded-full border border-black/10 sm:-left-10 sm:top-6 sm:h-32 sm:w-32" />
              <div className="absolute bottom-4 right-6 h-14 w-14 rounded-full border border-black/10 sm:bottom-6 sm:right-10 sm:h-20 sm:w-20" />
            </div>

            <div className="relative mx-auto max-w-4xl">
              <div className="flex flex-col items-center gap-6 sm:gap-10">
                <div className="relative grid w-full grid-cols-4 gap-2 sm:gap-4 md:gap-8">
                  <div className="absolute left-[12.5%] right-[12.5%] top-[1.75rem] h-0.5 bg-black/10 sm:top-[1.75rem]" />

                  {steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={false}
                      className="relative z-10 flex flex-col items-center gap-2 sm:gap-4"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.08, 1],
                          backgroundColor: ["#dcc97a", "#ffffff", "#dcc97a"],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          delay: index * 0.6,
                        }}
                        className="flex size-10 items-center justify-center rounded-xl border border-black/15 bg-[#dcc97a] shadow-[0_6px_16px_-8px_rgba(0,0,0,0.18)] sm:size-14 sm:rounded-2xl"
                      >
                        <step.icon className="size-4 text-foreground sm:size-6" />
                      </motion.div>

                      <span className="text-center text-[10px] font-bold uppercase tracking-wide text-foreground/70 sm:text-xs sm:tracking-widest">
                        {step.label}
                      </span>
                    </motion.div>
                  ))}

                  <motion.div
                    animate={{
                      left: ["12.5%", "37.5%", "62.5%", "87.5%", "12.5%"],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.25, 0.5, 0.75, 1],
                    }}
                    className="absolute top-[1.75rem] z-20 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="flex size-3 items-center justify-center rounded-full bg-foreground shadow-[0_0_12px_2px_rgba(0,0,0,0.25)] sm:size-4">
                      <div className="size-1 rounded-full bg-white sm:size-1.5" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                title: "Lower risk. Faster decisions.",
                body: "Verified data and clear provenance reduce friction on every deal.",
              },
              {
                title: "Start with one listing.",
                body: "Test demand, refine pricing, and scale with confidence.",
              },
              {
                title: "Match with the right buyers.",
                body: "Smart filtering and regional insights bring qualified buyers to you.",
              },
              {
                title: "Close in one flow.",
                body: "Escrow-ready checkout keeps payments smooth and secure.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 + index * 0.08 }}
                className="rounded-4xl border border-border/60 bg-white p-8 shadow-[0_25px_80px_-60px_rgba(15,23,42,0.25)]"
              >
                <h4 className="text-2xl font-semibold">{item.title}</h4>
                <p className="mt-3 text-sm text-muted-foreground">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel rounded-4xl border border-border/60 p-8">
            <h3 className="text-2xl font-semibold">Signature blue, modern depth.</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Glass panels, layered lighting, and a restrained palette keep focus on
              the listings while delivering a premium feel.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.title}
                  className="rounded-3xl border border-border/50 bg-background/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
                >
                  <category.icon className="size-5 text-sky-400" />
                  <p className="mt-3 text-sm font-semibold">{category.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {category.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {[
              {
                title: "Curated inventory",
                body: "Every listing includes transparent metadata and activity logs.",
              },
              {
                title: "Secure fulfillment",
                body: "Escrow-ready flows with compliance checks baked in.",
              },
              {
                title: "Global-ready UI",
                body: "Localized regions, pricing clarity, and flexible delivery.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="glass-card rounded-3xl border border-border/50 p-5"
              >
                <h4 className="text-sm font-semibold">{item.title}</h4>
                <p className="mt-2 text-xs text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-4xl border border-border/60 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">Launch-ready experience</h3>
              <p className="max-w-xl text-sm text-muted-foreground">
                Smooth transitions, muted motion, and glassmorphism framing keep
                the interface modern without sacrificing clarity.
              </p>
            </div>
            <Button asChild size="lg" variant="outline" className="bg-background/60">
              <Link href="/shop">View listings</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}