'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Bell,
  PieChart,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                Z
              </div>
              <span className="font-bold text-xl tracking-tight">ZenSub</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Log in</Link>
                <Link href="/signup" className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  Get Started
                </Link>
              </div>
            </div>

            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="px-4 py-4 space-y-4 flex flex-col">
              <Link href="#features" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
              <Link href="/login" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
              <Link href="/signup" className="w-full text-center px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              100% Free & Open Source
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Master Your Subscriptions <br className="hidden sm:block" />
              <span className="text-primary">Save More Money.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              ZenSub helps you track, manage, and optimize your recurring expenses. Stop paying for services you don't use and regain control of your finances. Completely free.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25">
                Start Now <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image/Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl ring-1 ring-white/10 flex items-center justify-center overflow-hidden">
              {/* UI Container */}
              <div className="w-full h-full bg-background/95 p-6 sm:p-8 flex flex-col gap-6 backdrop-blur-xl">

                {/* Header Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-between shadow-sm hover:border-primary/20 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <PieChart size={18} />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold tracking-tight">$1,240</div>
                      <div className="text-xs text-muted-foreground font-medium mt-1">Total Monthly Spend</div>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-between shadow-sm hover:border-primary/20 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                        <CheckCircle2 size={18} />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold tracking-tight">12</div>
                      <div className="text-xs text-muted-foreground font-medium mt-1">Active Subscriptions</div>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-between shadow-sm hover:border-primary/20 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <Bell size={18} />
                      </div>
                      <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full">Urgent</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold tracking-tight">2 Days</div>
                      <div className="text-xs text-muted-foreground font-medium mt-1">Next Renewal</div>
                    </div>
                  </div>
                </div>

                {/* Subscription List */}
                <div className="flex-1 bg-card rounded-xl border border-border flex flex-col overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                    <div className="font-semibold text-sm">Recent Activity</div>
                    <div className="text-xs text-muted-foreground">Filter by: <span className="text-foreground font-medium">Date</span></div>
                  </div>
                  <div className="p-2 space-y-1">
                    {/* Subscription Item 1 */}
                    <div className="group flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#E50914] text-white flex items-center justify-center font-bold text-lg shadow-sm">N</div>
                        <div>
                          <div className="font-semibold text-sm">Netflix Premium</div>
                          <div className="text-xs text-muted-foreground">Entertainment • Monthly</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">-$19.99</div>
                        <div className="text-xs text-muted-foreground">Nov 24</div>
                      </div>
                    </div>

                    {/* Subscription Item 2 */}
                    <div className="group flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#1DB954] text-white flex items-center justify-center font-bold text-lg shadow-sm">S</div>
                        <div>
                          <div className="font-semibold text-sm">Spotify Duo</div>
                          <div className="text-xs text-muted-foreground">Music • Monthly</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">-$14.99</div>
                        <div className="text-xs text-muted-foreground">Nov 22</div>
                      </div>
                    </div>

                    {/* Subscription Item 3 */}
                    <div className="group flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#00A8E1] text-white flex items-center justify-center font-bold text-lg shadow-sm">A</div>
                        <div>
                          <div className="font-semibold text-sm">Amazon Prime</div>
                          <div className="text-xs text-muted-foreground">Shopping • Yearly</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">-$139.00</div>
                        <div className="text-xs text-muted-foreground">Nov 15</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to control spend</h2>
            <p className="text-muted-foreground">Powerful features designed to give you clarity and confidence over your monthly outgoings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<PieChart className="w-6 h-6 text-blue-500" />}
              title="Visual Analytics"
              description="See exactly where your money goes with beautiful, interactive charts and breakdowns by category."
            />
            <FeatureCard
              icon={<Bell className="w-6 h-6 text-amber-500" />}
              title="Smart Reminders"
              description="Get notified before a renewal hits your card. Never pay for an unwanted subscription again."
            />
            <FeatureCard
              icon={<CreditCard className="w-6 h-6 text-green-500" />}
              title="All-in-One Dashboard"
              description="Connect all your accounts or add manually. View every recurring expense in a single, clean interface."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-purple-500" />}
              title="Bank-Level Security"
              description="Your data is encrypted with AES-256. We never sell your data to third parties. Ever."
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-6 h-6 text-rose-500" />}
              title="Cancel in One Click"
              description="We guide you through the cancellation process for hundreds of popular services."
            />
            <FeatureCard
              icon={<ArrowRight className="w-6 h-6 text-indigo-500" />}
              title="Export & Reports"
              description="Generate PDF or CSV reports for your personal finance tracking or accounting needs."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 sm:p-16 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px]" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 relative z-10">Stop the subscription bleed today.</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Take the first step towards financial freedom. Track, manage, and optimize your spending with ZenSub.
            </p>
            <div className="relative z-10">
              <Link href="/signup" className="px-8 py-3 bg-background text-foreground rounded-full font-semibold hover:bg-secondary transition-colors inline-block">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              Z
            </div>
            <span className="font-bold text-lg">ZenSub</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ZenSub Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors hover:shadow-lg group"
    >
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}
