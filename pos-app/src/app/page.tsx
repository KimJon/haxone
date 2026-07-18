'use client';
import { useState } from 'react';
import Link from "next/link";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Check, ArrowRight, TrendingUp, Package, Users, CreditCard, Brain, Shield, BarChart3, Globe, Phone, Mail, MapPin, Star, ChevronRight } from "lucide-react";

const features = [
  { icon: BarChart3, title: "Real-time Analytics", desc: "Graphical insights that help you make data-driven decisions and optimize performance instantly." },
  { icon: Package, title: "Inventory Management", desc: "Track stock levels, set reorder alerts, and manage inventory across multiple branches." },
  { icon: CreditCard, title: "M-Pesa & Card Payments", desc: "Accept M-Pesa STK Push, Visa, Mastercard and cash with automatic reconciliation." },
  { icon: Users, title: "Customer CRM", desc: "Build loyalty with customer profiles, purchase history, and automated loyalty points." },
  { icon: Brain, title: "AI Copilot", desc: "AI-powered recommendations for stock, pricing, sales forecasting and business intelligence." },
  { icon: Shield, title: "Multi-Branch & Roles", desc: "Manage multiple locations with role-based access for managers, cashiers, and staff." },
];

const plans = [
  { name: "Starter", price: "500", period: "/month", features: ["1 Store", "1 Cashier", "100 Products", "Basic Reports"], highlight: false },
  { name: "Professional", price: "3,000", period: "/month", features: ["Unlimited Users", "Unlimited Products", "Inventory", "Customer CRM", "Advanced Reports", "M-Pesa STK Push"], highlight: true },
  { name: "Business", price: "4,500", period: "/month", features: ["Everything in Professional", "Multi-Branch", "Custom Branding", "Dedicated Server", "Priority Support", "API Access"], highlight: false },
];

const testimonials = [
  { name: "Sarah Wanjiku", role: "Supermarket Owner, Nairobi", text: "HaxOne transformed my business. I can now track stock across 3 branches from my phone. M-Pesa integration is seamless!", stars: 5 },
  { name: "James Ochieng", role: "Hardware Store, Kisumu", text: "The AI recommendations helped me optimize my stock levels. I reduced wastage by 40% in the first month.", stars: 5 },
  { name: "Fatuma Hassan", role: "Boutique Owner, Mombasa", text: "Customer loyalty features are amazing. My repeat customers grew by 60%. Very easy to use for my staff.", stars: 5 },
];

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ name: '', price: 0 });

  const handleSubscribe = (planName: string, planPrice: string) => {
    const priceNum = parseInt(planPrice.replace(/,/g, ''));
    setSelectedPlan({ name: planName, price: priceNum });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#0D1117] font-sans overflow-x-hidden selection:bg-[#2563EB] selection:text-white">
      <SubscriptionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        planName={selectedPlan.name} 
        planPrice={selectedPlan.price} 
      />
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo className="h-10" />
          
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
            <Link href="#features" className="hover:text-[#2563EB] transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-[#2563EB] transition-colors">Pricing</Link>
            <Link href="#testimonials" className="hover:text-[#2563EB] transition-colors">Testimonials</Link>
            <Link href="#contact" className="hover:text-[#2563EB] transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-[#0D1117] hover:text-[#2563EB] transition-colors px-4">
              Login
            </Link>
            <Link href="/setup">
              <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-6 py-5 font-bold shadow-lg shadow-blue-500/30">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#2563EB] text-sm font-bold px-4 py-2 rounded-full mb-6 border border-blue-100">
              <Brain className="w-4 h-4" />
              AI-Powered POS Platform
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-[#0D1117] leading-[1.1] mb-6">
              The All-in-One<br/>Business POS for<br/>
              <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">a Smarter Tomorrow</span>
            </h1>
            <p className="text-xl text-gray-600 mb-2 font-medium">Sell. Track. Grow. Anywhere.</p>
            <p className="text-lg text-gray-500 mb-10 max-w-lg leading-relaxed">
              Modern cloud POS that helps businesses manage sales, inventory, customers and payments — all in one place.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/setup">
                <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-8 py-6 text-lg font-bold shadow-xl shadow-blue-500/20">
                  Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-gray-200 text-[#0D1117] bg-white hover:bg-gray-50 rounded-full px-8 py-6 text-lg font-bold shadow-sm">
                  Watch Demo
                </Button>
              </Link>
            </div>
            
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500">
              {["No credit card required", "14-day free trial", "Cancel anytime"].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>
                  {t}
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative lg:ml-10">
            <div className="relative w-full aspect-[4/3] bg-white rounded-2xl shadow-2xl border border-gray-100 flex items-center justify-center overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-white"></div>
              <div className="absolute top-4 left-4 right-4 bottom-4 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col overflow-hidden">
                <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <div className="flex-1 h-4 bg-gray-100 rounded ml-4 text-xs flex items-center px-2 text-gray-400">app.haxone.com</div>
                </div>
                <div className="flex-1 flex">
                  <div className="w-1/4 bg-[#0D1117] p-3 space-y-2">
                    <div className="w-full h-4 bg-white/10 rounded"></div>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`h-3 rounded ${i === 0 ? 'bg-[#2563EB]' : 'bg-white/5'}`} style={{width: `${60+Math.random()*40}%`}}></div>
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
                <div className="text-xs text-gray-500 font-medium">Today's Sales</div>
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
      <div className="border-y border-gray-100 bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "100+", label: "Businesses Trust Us" },
              { num: "10+", label: "Countries" },
              { num: "50k+", label: "Monthly Transactions" },
              { num: "99.9%", label: "Uptime SLA" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-[#2563EB]">{s.num}</div>
                <div className="text-sm font-medium text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#2563EB] text-sm font-bold px-4 py-2 rounded-full mb-4 border border-blue-100">
            Everything You Need
          </div>
          <h2 className="text-4xl font-extrabold text-[#0D1117]">Built for African Businesses</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">One platform to manage your entire business — from the front counter to the back office.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2563EB]/20 transition-all group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#2563EB] transition-colors">
                <f.icon className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-[#0D1117] mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#0D1117]">Choose the Plan That Fits Your Business</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">All plans include a 14-day free trial. No credit card required.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map(plan => (
              <div key={plan.name} className={`rounded-2xl p-8 border relative ${plan.highlight ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-2xl shadow-blue-500/30 scale-105' : 'bg-white border-gray-100 shadow-sm'}`}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#7C3AED] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">Most Popular</div>
                )}
                <div className={`text-sm font-bold mb-2 ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>{plan.name}</div>
                <div className={`text-4xl font-extrabold mb-1 ${plan.highlight ? 'text-white' : 'text-[#0D1117]'}`}>
                  KES {plan.price}
                  <span className={`text-base font-medium ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
                <div className={`h-px my-6 ${plan.highlight ? 'bg-white/20' : 'bg-gray-100'}`}></div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-blue-200' : 'text-green-500'}`} />
                      <span className={plan.highlight ? 'text-blue-100' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => handleSubscribe(plan.name, plan.price)}
                  className={`w-full font-bold h-12 rounded-xl ${plan.highlight ? 'bg-white text-[#2563EB] hover:bg-blue-50' : 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white'}`}
                >
                  Subscribe via M-PESA
                </Button>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-8 text-sm">Enterprise plans with custom pricing available. <Link href="#contact" className="text-[#2563EB] font-bold">Talk to Sales →</Link></p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-[#0D1117]">Loved by 10,000+ Businesses</h2>
          <p className="text-gray-500 mt-4 text-lg">Real stories from real business owners across Africa.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(t => (
            <div key={t.name} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
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
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#0D1117] to-[#1a1f35] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-gray-400 text-lg mb-10">Join 10,000+ businesses using HaxOne to run smarter operations every day.</p>
          <Link href="/setup">
            <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-10 py-6 text-lg font-bold shadow-2xl shadow-blue-500/30">
              Start Your Free 14-Day Trial <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-gray-500 text-sm mt-4">No credit card required. Setup in under 3 minutes.</p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0D1117] text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Logo lightText className="h-10 mb-6" />
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
                HaxOne is the all-in-one cloud POS platform empowering African businesses to digitize, grow, and thrive. One Platform. Endless Possibilities.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Phone className="w-4 h-4 text-[#2563EB]" />
                  <a href="tel:+254722000001" className="hover:text-white transition-colors">+254 722 000 001</a>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail className="w-4 h-4 text-[#2563EB]" />
                  <a href="mailto:hello@haxone.com" className="hover:text-white transition-colors">hello@haxone.com</a>
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
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-5">Payment Partners & Integrations</p>
            <div className="flex flex-wrap gap-6 items-center">
              {["M-PESA", "PayPal", "Stripe", "PesaPal", "Paystack", "Flutterwave", "DPO Pay"].map(p => (
                <div key={p} className="text-gray-400 text-sm font-bold bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">{p}</div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2026 HaxOne Technologies. All rights reserved.</p>
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
