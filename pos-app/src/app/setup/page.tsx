"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";

export default function SetupWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      setLoading(true);
      setTimeout(() => router.push('/dashboard'), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#0D1117] font-sans pb-20">
      
      {/* Header */}
      <div className="flex flex-col items-center pt-12 pb-8">
        <Logo className="h-10 mb-8" />
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
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 flex flex-col md:flex-row gap-12">
          
          {/* Form Section */}
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-6 text-[#0D1117]">1. Business Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="text-gray-600 font-medium">Business Name</Label>
                <Input placeholder="Sunrise Supermarket" className="mt-1 h-11 bg-gray-50 border-gray-200 focus:ring-[#2563EB]" />
              </div>
              
              <div>
                <Label className="text-gray-600 font-medium">Store Name</Label>
                <Input placeholder="Sunrise Main Branch" className="mt-1 h-11 bg-gray-50 border-gray-200 focus:ring-[#2563EB]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 font-medium">Owner Name</Label>
                  <Input placeholder="John Kamau" className="mt-1 h-11 bg-gray-50 border-gray-200 focus:ring-[#2563EB]" />
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
                <Label className="text-gray-600 font-medium">Business Category</Label>
                <Input defaultValue="Supermarket / Retail" className="mt-1 h-11 bg-gray-50 border-gray-200 focus:ring-[#2563EB]" />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button 
                onClick={handleNext}
                className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8 h-12 rounded-lg font-bold shadow-md shadow-blue-500/20"
                disabled={loading}
              >
                {loading ? "Creating..." : "Next →"}
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="hidden md:flex w-64 flex-col items-center justify-center border-l border-gray-100 pl-10">
            {/* Store Illustration Placeholder */}
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
    </div>
  );
}
