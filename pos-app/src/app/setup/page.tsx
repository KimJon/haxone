"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { Check } from "lucide-react";

export default function SetupWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: number} | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleNext = () => {
    if (step === 3) {
      if (!selectedPlan) {
        alert("Please select a plan first");
        return;
      }
      setShowPayment(true);
    } else if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setStep(4);
    setLoading(true);

    if (typeof window !== 'undefined') {
      // 1. Register the store for the Super Admin
      const existingStores = JSON.parse(localStorage.getItem('haxone_stores') || '[]');
      const newStore = {
        id: `ST-${Math.floor(Math.random() * 10000)}`,
        name: businessName || 'My Store',
        owner: ownerName || 'Owner',
        plan: selectedPlan?.name || 'Starter',
        status: 'Active',
        joined: new Date().toISOString().split('T')[0]
      };
      localStorage.setItem('haxone_stores', JSON.stringify([newStore, ...existingStores]));

      // 2. Wipe ALL demo data so the customer gets a fresh POS
      const blankState = JSON.stringify([]);
      localStorage.setItem('haxone_products', blankState);
      localStorage.setItem('haxone_sales', blankState);
      localStorage.setItem('haxone_customers', blankState);
      localStorage.setItem('haxone_suppliers', blankState);
      localStorage.setItem('haxone_expenses', blankState);
      localStorage.setItem('haxone_employees', blankState);
      localStorage.setItem('haxone_branches', blankState);
    }

    // Finalize setup
    setTimeout(() => router.push('/dashboard'), 2000);
  };

  const plans = [
    { name: 'Starter', price: 500, features: ['1 Store', '1 Cashier', '100 Products'] },
    { name: 'Professional', price: 3000, features: ['Unlimited Users', 'Inventory', 'M-Pesa STK Push'], popular: true },
    { name: 'Business', price: 4500, features: ['Multi-Branch', 'API Access', 'Dedicated Server'] },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#0D1117] font-sans pb-20">
      
      {/* Header */}
      <div className="flex flex-col items-center pt-12 pb-8">
        <Logo className="h-20 mb-8" />
        <h1 className="text-3xl font-extrabold text-[#0D1117]">Create Your Store in 3 Minutes</h1>
        <p className="text-gray-500 mt-2 font-medium">Start selling and growing your business today</p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto mb-10 px-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-gray-200 -z-10 -translate-y-1/2"></div>
          
          {['Business', 'Store', 'Plan', 'Payment'].map((label, index) => {
            const stepNum = index + 1;
            const isActive = step === stepNum;
            const isPast = step > stepNum;
            return (
              <div key={label} className="flex flex-col items-center bg-[#F5F6FA] px-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  isActive ? 'bg-[#2563EB] border-[#2563EB] text-white' : 
                  isPast ? 'bg-[#10B981] border-[#10B981] text-white' : 
                  'bg-white border-gray-300 text-gray-400'
                }`}>
                  {isPast ? '✓' : stepNum}
                </div>
                <span className={`text-xs mt-2 font-semibold ${isActive || isPast ? 'text-[#0D1117]' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 flex flex-col md:flex-row gap-12 min-h-[450px]">
          
          {/* Form Section */}
          <div className="flex-1 flex flex-col">
            
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1">
                <h2 className="text-xl font-bold mb-6 text-[#0D1117]">1. Business Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600 font-medium">Business Name</Label>
                    <Input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Sunrise Supermarket" className="mt-1 h-11 bg-gray-50 border-gray-200 focus:ring-[#2563EB]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600 font-medium">Owner Name</Label>
                      <Input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="John Kamau" className="mt-1 h-11 bg-gray-50 border-gray-200 focus:ring-[#2563EB]" />
                    </div>
                    <div>
                      <Label className="text-gray-600 font-medium">Phone</Label>
                      <Input placeholder="+254 712 345 678" className="mt-1 h-11 bg-gray-50 border-gray-200 focus:ring-[#2563EB]" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600 font-medium">Email</Label>
                    <Input type="email" placeholder="john@sunrise.co.ke" className="mt-1 h-11 bg-gray-50 border-gray-200 focus:ring-[#2563EB]" />
                  </div>
                  <div>
                    <Label className="text-gray-600 font-medium">Business Category</Label>
                    <Input defaultValue="Supermarket / Retail" className="mt-1 h-11 bg-gray-50 border-gray-200 focus:ring-[#2563EB]" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1">
                <h2 className="text-xl font-bold mb-6 text-[#0D1117]">2. Store Configuration</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600 font-medium">Store Name</Label>
                    <Input placeholder="Sunrise Main Branch" className="mt-1 h-11 bg-gray-50 border-gray-200 focus:ring-[#2563EB]" />
                  </div>
                  <div>
                    <Label className="text-gray-600 font-medium">Store Location (City/Town)</Label>
                    <Input placeholder="Nairobi CBD" className="mt-1 h-11 bg-gray-50 border-gray-200 focus:ring-[#2563EB]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600 font-medium">Country</Label>
                      <Input defaultValue="Kenya" className="mt-1 h-11 bg-gray-50 border-gray-200 focus:ring-[#2563EB]" />
                    </div>
                    <div>
                      <Label className="text-gray-600 font-medium">Currency</Label>
                      <Input defaultValue="KES - Kenyan Shilling" className="mt-1 h-11 bg-gray-50 border-gray-200 focus:ring-[#2563EB]" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600 font-medium">Tax/VAT Rate (%)</Label>
                    <Input defaultValue="16" type="number" className="mt-1 h-11 bg-gray-50 border-gray-200 focus:ring-[#2563EB]" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1">
                <h2 className="text-xl font-bold mb-6 text-[#0D1117]">3. Select a Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div 
                      key={plan.name}
                      onClick={() => setSelectedPlan(plan)}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        selectedPlan?.name === plan.name 
                          ? 'border-[#2563EB] bg-blue-50/50 shadow-md ring-2 ring-[#2563EB]/20' 
                          : 'border-gray-100 hover:border-[#2563EB]/40 hover:shadow-sm'
                      }`}
                    >
                      {plan.popular && <div className="text-[10px] font-bold text-white bg-[#7C3AED] px-2 py-0.5 rounded-full w-fit mb-2 uppercase tracking-wider">Popular</div>}
                      <h3 className="font-bold text-[#0D1117] text-lg">{plan.name}</h3>
                      <div className="text-xl font-black text-[#2563EB] mt-1 mb-3">KES {plan.price.toLocaleString()}</div>
                      <ul className="space-y-2">
                        {plan.features.map(f => (
                          <li key={f} className="flex items-start text-xs text-gray-600 font-medium">
                            <Check className="w-3.5 h-3.5 text-green-500 mr-1.5 flex-shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-[#0D1117]">Payment Successful!</h2>
                <p className="text-gray-500 mb-6">Your store is being configured. You will be redirected to the dashboard in a moment.</p>
                <div className="animate-pulse flex items-center gap-2 text-[#2563EB] font-bold text-sm">
                  <div className="w-4 h-4 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
                  Setting up dashboard...
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center mt-auto">
                <Button 
                  onClick={handleBack}
                  variant="outline"
                  className={`border-gray-200 text-gray-600 hover:bg-gray-50 px-6 h-11 rounded-lg font-bold ${step === 1 ? 'invisible' : ''}`}
                >
                  ← Back
                </Button>
                <Button 
                  onClick={handleNext}
                  className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8 h-11 rounded-lg font-bold shadow-md shadow-blue-500/20"
                >
                  {step === 3 ? "Proceed to Payment" : "Next →"}
                </Button>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="hidden lg:flex w-64 flex-col items-center justify-center border-l border-gray-100 pl-10">
            <div className="w-full aspect-square bg-blue-50 rounded-2xl flex items-center justify-center mb-8 border border-blue-100">
               <span className="text-5xl">🏪</span>
            </div>
            
            <div className="w-full space-y-4">
              {[
                { label: 'No installation', icon: '✓' },
                { label: 'No hardware lock-in', icon: '✓' },
                { label: 'Cloud based', icon: '✓' },
                { label: 'Access anywhere', icon: '✓' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">{item.icon}</div>
                  <span className="text-sm font-medium text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Subscription Modal for Payment */}
      {selectedPlan && (
        <SubscriptionModal 
          isOpen={showPayment} 
          onClose={() => setShowPayment(false)} 
          onSuccess={handlePaymentSuccess}
          planName={selectedPlan.name} 
          planPrice={selectedPlan.price} 
        />
      )}
    </div>
  );
}
