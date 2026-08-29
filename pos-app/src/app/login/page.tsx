"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from "@/components/Logo";
import { User, Lock, Store } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [stores, setStores] = useState<any[]>([]);
  const [activeStore, setActiveStore] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedStores = JSON.parse(localStorage.getItem('haxone_stores') || '[]');
      setStores(storedStores);
      if (storedStores.length > 0) {
        // For multi-tenant on same device, normally you'd choose.
        // If there's only one, auto-select it.
        setActiveStore(storedStores[0]);
      }

      // Fetch employees for this device (in a real app, this would be scoped to the store)
      const storedEmployees = JSON.parse(localStorage.getItem('haxone_employees') || '[]');
      if (storedEmployees.length === 0) {
        // Fallback demo employee if none exist
        setEmployees([{ id: 'EMP-01', name: 'Demo Admin', pin: '1234', role: 'Admin' }]);
      } else {
        setEmployees(storedEmployees);
      }
    }
  }, []);

  const handlePinInput = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleLogin = () => {
    if (pin === selectedEmployee.pin) {
      localStorage.setItem('haxone_active_store', JSON.stringify(activeStore));
      localStorage.setItem('haxone_active_user', JSON.stringify(selectedEmployee));
      router.push('/dashboard');
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  useEffect(() => {
    if (pin.length === 4) {
      handleLogin();
    }
  }, [pin]);

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center mb-6">
        <Logo className="h-24" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {!activeStore ? (
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Store Configured</h2>
              <p className="text-gray-500 text-sm mb-6">Please run the setup wizard to register a store.</p>
              <button onClick={() => router.push('/setup')} className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-bold">
                Go to Setup
              </button>
            </div>
          ) : !selectedEmployee ? (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-[#0D1117]">Welcome to {activeStore.name}</h2>
                <p className="text-sm text-gray-500 mt-1">Select your profile to continue</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {employees.map(emp => (
                  <button 
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className="flex flex-col items-center p-4 border border-gray-100 rounded-xl hover:border-[#2563EB] hover:bg-blue-50 transition-all"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <span className="font-bold text-[#0D1117] text-sm">{emp.name}</span>
                    <span className="text-xs text-gray-400 mt-1">{emp.role}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6 relative">
                <button 
                  onClick={() => { setSelectedEmployee(null); setPin(''); setError(''); }}
                  className="absolute left-0 top-1 text-sm text-[#2563EB] font-medium"
                >
                  Back
                </button>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h2 className="text-xl font-bold text-[#0D1117]">Enter PIN</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedEmployee.name}</p>
              </div>

              <div className="flex justify-center gap-3 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      i < pin.length ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                ))}
              </div>

              {error && <p className="text-center text-red-500 text-sm font-medium mb-4">{error}</p>}

              <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button 
                    key={num}
                    onClick={() => handlePinInput(num.toString())}
                    className="h-16 bg-gray-50 hover:bg-gray-100 rounded-2xl text-2xl font-semibold text-[#0D1117] transition-colors"
                  >
                    {num}
                  </button>
                ))}
                <div />
                <button 
                  onClick={() => handlePinInput('0')}
                  className="h-16 bg-gray-50 hover:bg-gray-100 rounded-2xl text-2xl font-semibold text-[#0D1117] transition-colors"
                >
                  0
                </button>
                <button 
                  onClick={handleDelete}
                  className="h-16 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-bold text-gray-500 transition-colors flex items-center justify-center"
                >
                  DEL
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
