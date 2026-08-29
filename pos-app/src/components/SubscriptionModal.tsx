'use client';

import { useState } from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  planName: string;
  planPrice: number;
}

export function SubscriptionModal({ isOpen, onClose, onSuccess, planName, planPrice }: SubscriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activationCode, setActivationCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanInput = activationCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const storedLicenses = JSON.parse(localStorage.getItem('haxone_licenses') || '[]');
      const licenseIndex = storedLicenses.findIndex((lic: any) => lic.id.replace(/[^A-Z0-9]/g, '') === cleanInput);

      if (licenseIndex !== -1) {
        const license = storedLicenses[licenseIndex];
        
        if (license.status === 'active') {
          // Mark it as used
          storedLicenses[licenseIndex].status = 'used';
          storedLicenses[licenseIndex].usedBy = 'Current Store';
          localStorage.setItem('haxone_licenses', JSON.stringify(storedLicenses));
          
          alert(`Activation Successful! Welcome to ${planName}.`);
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.href = '/dashboard';
          }
        } else {
          setError('This activation code has already been used.');
          setLoading(false);
        }
      } else {
        setError('Invalid activation code. Please check and try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-[#0D1117]">Activate {planName}</h2>
            <p className="text-sm text-gray-500 mt-1">Manual Offline Activation</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-bold text-blue-900 mb-1">Enter Your License Key</h3>
              <p className="text-xs text-blue-700 leading-relaxed">
                Please enter the 16-character Activation Code provided by your administrator to unlock this software.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Activation Code</label>
              <input 
                type="text" 
                required
                value={activationCode}
                onChange={e => setActivationCode(e.target.value.toUpperCase())}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-mono tracking-widest text-center focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all uppercase"
                placeholder="HAX-XXXX-XXXX-XXXX"
                maxLength={20}
              />
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading || activationCode.length < 5}
                className="w-full h-12 rounded-xl bg-[#0D1117] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Verifying Code...
                  </>
                ) : (
                  'Activate License'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
