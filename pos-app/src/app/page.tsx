'use client';
import { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Check, ArrowRight, TrendingUp, Package, Users, CreditCard, Brain, Shield, BarChart3, Globe, Phone, Mail, MapPin, Star, Smartphone, Monitor, Play, Zap, Clock, Wifi, WifiOff } from "lucide-react";

const features = [
  { icon: BarChart3, title: "Real-time Analytics", desc: "Graphical insights that help you make data-driven decisions and optimize performance instantly." },
  { icon: Package, title: "Inventory Management", desc: "Track stock levels, set reorder alerts, and manage inventory across multiple branches." },
  { icon: CreditCard, title: "M-Pesa & Card Payments", desc: "Accept M-Pesa STK Push, Visa, Mastercard and cash with automatic reconciliation." },
  { icon: Users, title: "Customer CRM", desc: "Build loyalty with customer profiles, purchase history, and automated loyalty points." },
  { icon: Brain, title: "AI Copilot", desc: "AI-powered recommendations for stock, pricing, sales forecasting and business intelligence." },
  { icon: Shield, title: "Multi-Branch & Roles", desc: "Manage multiple locations with role-based access for managers, cashiers, and staff." },
];

const testimonials = [
  { name: "Sarah Wanjiku", role: "Supermarket Owner, Nairobi", text: "HaxOne transformed my business. I can now track stock across 3 branches from my phone. M-Pesa integration is seamless!", stars: 5 },
  { name: "James Ochieng", role: "Hardware Store, Kisumu", text: "The AI recommendations helped me optimize my stock levels. I reduced wastage by 40% in the first month.", stars: 5 },
  { name: "Fatuma Hassan", role: "Boutique Owner, Mombasa", text: "Customer loyalty features are amazing. My repeat customers grew by 60%. Very easy to use for my staff.", stars: 5 },
];

const plans = [
  { name: 'Starter', price: 500, features: ['1 Store', '1 Cashier', '100 Products', 'Basic Reports'] },
  { name: 'Professional', price: 3000, features: ['Unlimited Users', 'Inventory Management', 'M-Pesa STK Push', 'AI Insights'], popular: true },
  { name: 'Business', price: 4500, features: ['Multi-Branch', 'API Access', 'Priority Support', 'Custom Branding'] },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#0D1117] font-sans overflow-x-hidden selection:bg-[#2563EB] selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <Logo className="h-8 md:h-10" />
          
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
            <Link href="#features" className="hover:text-[#2563EB] transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-[#2563EB] transition-colors">How It Works</Link>
            <Link href="#pricing" className="hover:text-[#2563EB] transition-colors">Pricing</Link>
            <Link href="#testimonials" className="hover:text-[#2563EB] transition-colors">Testimonials</Link>
            <Link href="#contact" className="hover:text-[#2563EB] transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-gray-200 text-[#0D1117] hover:bg-gray-50 rounded-full px-4 md:px-6 py-2 md:py-5 font-bold text-sm">
                Sign In
              </Button>
            </Link>
            <Link href="/setup">
              <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-4 md:px-6 py-2 md:py-5 font-bold shadow-lg shadow-blue-500/30 text-sm">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 md:pt-32 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#2563EB] text-sm font-bold px-4 py-2 rounded-full mb-6 border border-blue-100">
              <Brain className="w-4 h-4" />
              AI-Powered POS Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-[#0D1117] leading-[1.1] mb-6">
              The All-in-One<br/>Business POS for<br/>
              <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">a Smarter Tomorrow</span>
            </h1>
            <p className="text-xl text-gray-600 mb-2 font-medium">Sell. Track. Grow. Anywhere.</p>
            <p className="text-base md:text-lg text-gray-500 mb-10 max-w-lg leading-relaxed">
              Sign up in 3 minutes and start managing your business from any device — phone, tablet, or PC. Works offline, syncs when connected.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/setup">
                <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-8 py-6 text-lg font-bold shadow-xl shadow-blue-500/20">
                  <Zap className="w-5 h-5 mr-2" /> Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-gray-200 text-[#0D1117] bg-white hover:bg-gray-50 rounded-full px-8 py-6 text-lg font-bold shadow-sm">
                  Sign In <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-10 flex flex-wrap items-center gap-4 md:gap-6 text-sm font-medium text-gray-500">
              {["Works offline", "Free 14-day trial", "Phone, Tablet & PC"].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>
                  {t}
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative lg:ml-10 hidden md:block">
            <div className="relative w-full aspect-[4/3] bg-white rounded-2xl shadow-2xl border border-gray-100 flex items-center justify-center overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-white"></div>
              <div className="absolute top-4 left-4 right-4 bottom-4 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col overflow-hidden">
                <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <div className="flex-1 h-4 bg-gray-100 rounded ml-4 text-xs flex items-center px-2 text-gray-400">HaxOne POS</div>
                </div>
                <div className="flex-1 flex">
                  <div className="w-1/4 bg-[#0D1117] p-3 space-y-2">
                    <div className="w-full h-4 bg-white/10 rounded"></div>
                    {[85, 70, 92, 65, 78, 88].map((w, i) => (
                      <div key={i} className={`h-3 rounded ${i === 0 ? 'bg-[#2563EB]' : 'bg-white/5'}`} style={{width: `${w}%`}}></div>
                    ))}
                  </div>
                  <div className="flex-1 bg-[#F5F6FA] p-3 flex flex-col gap-2">
                    <div className="flex gap-2">
                      {['bg-blue-100','bg-green-100','bg-purple-100','bg-orange-100'].map((c, i) => (
                        <div key={i} className={`h-12 ${c} rounded-lg flex-1`}></div>
                      ))}
                    </div>
                    <div className="flex-1 bg-white rounded-lg p-2 flex items-end gap-1">
                      {[40, 65, 45, 80, 60, 90, 55].map((h, i) => (
                        <div key={i} className="flex-1 bg-[#2563EB] rounded-t-sm opacity-80" style={{height: `${h}%`}}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating cards */}
              <div className="absolute -left-8 top-1/3 bg-white rounded-xl shadow-xl p-3 border border-gray-100 w-36">
                <div className="text-xs text-gray-500 font-medium">Today&apos;s Sales</div>
                <div className="text-lg font-black text-[#0D1117]">KES 42,500</div>
                <div className="text-xs text-green-600 font-bold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +12.5%
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 w-32 h-64 bg-white rounded-[1.5rem] shadow-2xl border-4 border-gray-900 flex flex-col overflow-hidden transform -rotate-6">
                <div className="h-6 w-1/2 bg-gray-900 mx-auto rounded-b-xl"></div>
                <div className="flex-1 p-2 flex flex-col gap-1.5 mt-2">
                  <div className="w-full h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">✓ M-PESA</div>
                  <div className="w-full h-3 bg-gray-100 rounded"></div>
                  <div className="w-3/4 h-3 bg-gray-100 rounded"></div>
                  <div className="w-full h-8 bg-[#2563EB] rounded mt-auto text-white text-xs flex items-center justify-center font-bold">KES 2,500</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="border-y border-gray-100 bg-white py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { num: "100+", label: "Businesses Trust Us" },
              { num: "10+", label: "Countries" },
              { num: "50k+", label: "Monthly Transactions" },
              { num: "99.9%", label: "Uptime SLA" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-extrabold text-[#2563EB]">{s.num}</div>
                <div className="text-xs md:text-sm font-medium text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#2563EB] text-sm font-bold px-4 py-2 rounded-full mb-4 border border-blue-100">
            Everything You Need
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1117]">Built for African Businesses</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base md:text-lg">One platform to manage your entire business — from the front counter to the back office.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2563EB]/20 transition-all group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#2563EB] transition-colors">
                <f.icon className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-[#0D1117] mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1117]">Get Started in 3 Simple Steps</h2>
            <p className="text-gray-500 mt-4 text-base md:text-lg">No downloads, no installation. Just open in your browser and start selling.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: Zap, title: "Create Your Store", desc: "Sign up with your email, enter your business details, and choose a plan that fits your needs.", color: "bg-blue-50 text-[#2563EB]" },
              { step: "2", icon: CreditCard, title: "Activate Your License", desc: "Pay via cash or M-Pesa, receive your activation code, enter it, and unlock your full POS dashboard.", color: "bg-green-50 text-green-600" },
              { step: "3", icon: TrendingUp, title: "Start Selling", desc: "Add products, ring up sales, accept M-Pesa payments, and track your business growth in real-time.", color: "bg-purple-50 text-[#7C3AED]" },
            ].map(item => (
              <div key={item.step} className="text-center p-6 md:p-8">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <div className="w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">{item.step}</div>
                <h3 className="font-bold text-[#0D1117] text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/setup">
              <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-10 py-6 text-lg font-bold shadow-xl shadow-blue-500/20">
                Create Your Store Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Offline-First Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#F0F4FF] to-[#F8F9FB]">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-sm font-bold px-4 py-2 rounded-full mb-4 border border-green-100">
                <WifiOff className="w-4 h-4" /> Works Offline
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1117] mb-4">Sell Even Without Internet</h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8">
                HaxOne works as a Progressive Web App (PWA). Install it on your phone like a real app — no Play Store needed. All data is saved locally and automatically syncs to the cloud when you reconnect.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Smartphone, text: "Install on any phone, tablet, or PC from the browser" },
                  { icon: WifiOff, text: "Ring up sales and manage inventory without internet" },
                  { icon: Wifi, text: "Auto-sync all data when you reconnect to WiFi or mobile data" },
                  { icon: Clock, text: "Real-time sync across all your devices" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-[480px] bg-white rounded-[2.5rem] shadow-2xl border-4 border-gray-900 flex flex-col overflow-hidden relative">
                <div className="h-8 w-1/3 bg-gray-900 mx-auto rounded-b-2xl"></div>
                <div className="flex-1 p-4 flex flex-col gap-3 mt-2">
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-500">HaxOne POS</div>
                    <div className="text-xl font-black text-[#0D1117] mt-1">KES 12,450</div>
                  </div>
                  <div className="w-full h-10 bg-green-500 rounded-xl flex items-center justify-center text-white text-sm font-bold gap-2">
                    ✓ Payment Received
                  </div>
                  <div className="flex-1 space-y-2">
                    {["Bread x2", "Milk 500ml", "Sugar 1kg", "Cooking Oil"].map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-xs font-medium text-gray-700">{item}</span>
                        <span className="text-xs font-bold text-[#0D1117]">KES {(Math.random() * 500 + 100).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="w-full h-12 bg-[#2563EB] rounded-xl flex items-center justify-center text-white text-sm font-bold">
                    New Sale
                  </div>
                </div>
                <div className="absolute top-12 right-3">
                  <div className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <WifiOff className="w-3 h-3" /> Offline
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1117]">Simple, Transparent Pricing</h2>
          <p className="text-gray-500 mt-4 text-base md:text-lg">Start free for 14 days. No credit card required.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
          {plans.map(plan => (
            <div key={plan.name} className={`bg-white rounded-2xl p-6 md:p-8 border-2 shadow-sm hover:shadow-lg transition-all relative ${
              plan.popular ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20' : 'border-gray-100'
            }`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-[#7C3AED] px-4 py-1 rounded-full uppercase tracking-wider">Most Popular</div>}
              <h3 className="font-bold text-[#0D1117] text-xl">{plan.name}</h3>
              <div className="mt-2 mb-6">
                <span className="text-3xl font-black text-[#2563EB]">KES {plan.price.toLocaleString()}</span>
                <span className="text-gray-500 text-sm"> /month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center text-sm text-gray-600 font-medium">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/setup">
                <Button className={`w-full h-12 rounded-xl font-bold text-sm ${
                  plan.popular 
                    ? 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-md shadow-blue-500/20' 
                    : 'bg-gray-50 hover:bg-gray-100 text-[#0D1117] border border-gray-200'
                }`}>
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1117]">Loved by 10,000+ Businesses</h2>
            <p className="text-gray-500 mt-4 text-base md:text-lg">Real stories from real business owners across Africa.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map(t => (
              <div key={t.name} className="bg-[#F8F9FB] rounded-2xl p-6 md:p-8 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-[#0D1117] text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#0D1117] to-[#1a1f35] text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-gray-400 text-base md:text-lg mb-10">Create your store in 3 minutes. Works on any device, even offline.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/setup">
              <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-10 py-6 text-lg font-bold shadow-2xl shadow-blue-500/30 w-full sm:w-auto">
                <Zap className="w-5 h-5 mr-2" /> Create Your Store
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-white/10 hover:bg-white/20 text-white rounded-full px-10 py-6 text-lg font-bold border border-white/20 w-full sm:w-auto">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-4">Free 14-day trial. No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0D1117] text-white pt-16 md:pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 mb-12 md:mb-16">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Logo lightText className="h-10 mb-6" />
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
                HaxOne is the all-in-one POS application empowering African businesses to digitize, grow, and thrive.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Phone className="w-4 h-4 text-[#2563EB]" />
                  <a href="tel:+254729915459" className="hover:text-white transition-colors">0729 915 459</a>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail className="w-4 h-4 text-[#2563EB]" />
                  <a href="mailto:haxorconsults@gmail.com" className="hover:text-white transition-colors">haxorconsults@gmail.com</a>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail className="w-4 h-4 text-[#2563EB]" />
                  <a href="mailto:info@haxormtc.com" className="hover:text-white transition-colors">info@haxormtc.com</a>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 text-[#2563EB]" />
                  <span>Nairobi, Kenya 🇰🇪</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-bold text-white mb-5">Product</h3>
              <ul className="space-y-3">
                {["Features", "Pricing", "POS Terminal", "Inventory", "CRM", "AI Insights"].map(item => (
                  <li key={item}><Link href="#" className="text-gray-400 text-sm hover:text-white transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold text-white mb-5">Company</h3>
              <ul className="space-y-3">
                {["About Us", "Blog", "Careers", "Press", "Partners", "Affiliate Program"].map(item => (
                  <li key={item}><Link href="#" className="text-gray-400 text-sm hover:text-white transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-white mb-5">Support</h3>
              <ul className="space-y-3">
                {["Help Center", "Contact Us", "API Docs", "Status Page", "Privacy Policy", "Terms of Service"].map(item => (
                  <li key={item}><Link href="#" className="text-gray-400 text-sm hover:text-white transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Partners */}
          <div className="border-t border-white/10 pt-10 mb-10">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-5">Payment Partners &amp; Integrations</p>
            <div className="flex flex-wrap gap-4 md:gap-6 items-center">
              {["M-PESA", "PayPal", "Stripe", "PesaPal", "Paystack", "Flutterwave", "DPO Pay"].map(p => (
                <div key={p} className="text-gray-400 text-sm font-bold bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">{p}</div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">&copy; 2026 HaxOne Technologies. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-500 text-sm hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-gray-500 text-sm hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="text-gray-500 text-sm hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
