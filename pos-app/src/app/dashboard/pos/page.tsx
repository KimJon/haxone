"use client";
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Search, Wifi, WifiOff, UserPlus, CheckCircle2 } from 'lucide-react';
import { SplitPaymentModal } from "@/components/SplitPaymentModal";

export default function POSPage() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSplitOpen, setIsSplitOpen] = useState(false);
  
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [taxRate, setTaxRate] = useState(0.16);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedProducts = JSON.parse(localStorage.getItem('haxone_products') || '[]');
        setProducts(storedProducts);
        
        const storedCustomers = JSON.parse(localStorage.getItem('haxone_customers') || '[]');
        setCustomers(storedCustomers);

        const store = JSON.parse(localStorage.getItem('haxone_active_store') || 'null');
        if (store && store.taxRate !== undefined) {
           setTaxRate(store.taxRate / 100);
        }
      } catch (e) {}
    }
  }, []);

  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [showMpesaPrompt, setShowMpesaPrompt] = useState(false);
  const [phone, setPhone] = useState('2547');
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCustomers = customerSearch.length > 0 ? customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch)) : [];

  const handlePayment = (method: string) => {
    if (method === 'M-Pesa' && !showMpesaPrompt) {
      setShowMpesaPrompt(true);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMsg('Payment Successful!');
      
      const newTx = {
        id: `TXN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        total: total,
        subtotal: subtotal,
        tax: tax,
        status: 'Completed',
        paymentMethod: method,
        date: new Date().toISOString(),
        customer: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
        customerId: selectedCustomer ? selectedCustomer.id : null,
        items: cart.map(c => ({...c, costPrice: c.costPrice || 0}))
      };
      
      try {
        if (typeof window !== 'undefined') {
          const existingSales = JSON.parse(localStorage.getItem('haxone_sales') || '[]');
          localStorage.setItem('haxone_sales', JSON.stringify([newTx, ...existingSales]));
          
          const storedProducts = JSON.parse(localStorage.getItem('haxone_products') || '[]');
          const updatedProducts = storedProducts.map((p: any) => {
            const inCart = cart.find(c => c.id === p.id);
            if (inCart) {
              return { ...p, stock: Math.max(0, (p.stock || 0) - inCart.quantity) };
            }
            return p;
          });
          localStorage.setItem('haxone_products', JSON.stringify(updatedProducts));
          setProducts(updatedProducts);
        }
      } catch (e) {
        console.error('Failed to save sale', e);
      }
      
      setTimeout(() => {
        setSuccessMsg('');
        setCart([]);
        setShowMpesaPrompt(false);
        setSelectedCustomer(null);
        setCustomerSearch('');
      }, 3000);
    }, 1500);
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1, price: product.price }];
    });
  };

  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col bg-gray-50 -m-6 lg:-m-8">
      {/* Top Bar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0 relative z-20">
        <div className="flex items-center gap-2 lg:hidden">
           <span className="font-bold text-[#0D1117]">HaxOne POS</span>
        </div>
        <div className="hidden lg:flex items-center gap-3 w-[400px]">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              placeholder="Search product (barcode/name)..." 
              className="pl-9 bg-gray-50 border-transparent focus:bg-white focus:border-[#2563EB]" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${isOffline ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            {isOffline ? 'Offline Mode' : 'Online'}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50/50 relative z-10">
          <div className="lg:hidden mb-4 relative z-20">
             <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input 
                placeholder="Search product..." 
                className="pl-9 bg-white" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4 pb-20 lg:pb-0">
              {filteredProducts.map((p, i) => {
                const colors = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
                const color = colors[i % colors.length];
                return (
                  <div 
                    key={p.id} 
                    onClick={() => addToCart(p)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-[#2563EB] hover:shadow-md transition-all group flex flex-col overflow-hidden h-[160px]"
                  >
                    <div className="h-16 flex items-center justify-center relative" style={{ backgroundColor: `${color}15` }}>
                       <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ backgroundColor: color }}>
                         {(p.name || 'P').substring(0, 2).toUpperCase()}
                       </div>
                       <div className="absolute top-2 right-2">
                         <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.stock <= (p.minStock || 5) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 backdrop-blur-sm shadow-sm'}`}>
                           {p.stock} left
                         </div>
                       </div>
                    </div>
                    <div className="p-3 flex flex-col justify-between flex-1">
                      <div>
                         <div className="text-sm font-bold text-[#0D1117] line-clamp-2 leading-tight group-hover:text-[#2563EB] transition-colors">{p.name}</div>
                         <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider truncate">{p.category || p.id}</div>
                      </div>
                      <div className="mt-2">
                        <div className="text-sm font-black text-[#0D1117]">KES {(p.price || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400 font-medium">
                No products found.
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart Panel */}
        <div className="w-[320px] lg:w-[400px] bg-white border-l border-gray-200 flex flex-col flex-shrink-0 z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          {/* Customer Selection */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            {!selectedCustomer ? (
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input 
                  placeholder="Add customer (Phone/Name)..." 
                  className="pl-9 bg-white border-gray-200" 
                  value={customerSearch}
                  onChange={e => setCustomerSearch(e.target.value)}
                />
                {customerSearch && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {filteredCustomers.length > 0 ? filteredCustomers.map(c => (
                      <div 
                        key={c.id} 
                        onClick={() => setSelectedCustomer(c)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                      >
                        <div className="font-semibold text-sm">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.phone}</div>
                      </div>
                    )) : (
                      <div className="p-3 text-center text-sm text-gray-500">No customers found.</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white border border-blue-100 p-2.5 rounded-lg">
                 <div className="flex items-center gap-2.5">
                   <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                     <UserPlus className="w-4 h-4 text-blue-600" />
                   </div>
                   <div>
                     <div className="text-sm font-bold text-[#0D1117]">{selectedCustomer.name}</div>
                     <div className="text-xs text-gray-500">{selectedCustomer.phone}</div>
                   </div>
                 </div>
                 <button onClick={() => {setSelectedCustomer(null); setCustomerSearch('');}} className="text-gray-400 hover:text-red-500 p-1">
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                   <Search className="w-8 h-8 text-gray-300" />
                 </div>
                 <p className="font-medium">Cart is empty</p>
              </div>
            ) : cart.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm relative group">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#0D1117] text-sm truncate pr-6">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">KES {item.price} / unit</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="font-black text-[#0D1117] text-sm">KES {(item.price * item.quantity).toLocaleString()}</div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                    <button 
                      onClick={() => setCart(c => c.map((p, idx) => idx === i ? {...p, quantity: Math.max(1, p.quantity - 1)} : p))}
                      className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:bg-white hover:shadow-sm rounded"
                    >-</button>
                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => setCart(c => c.map((p, idx) => idx === i ? {...p, quantity: p.quantity + 1} : p))}
                      className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:bg-white hover:shadow-sm rounded"
                    >+</button>
                  </div>
                </div>
                <button 
                  onClick={() => setCart(c => c.filter((_, idx) => idx !== i))}
                  className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Totals & Payment */}
          <div className="p-5 bg-white border-t border-gray-200 space-y-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] relative z-30">
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Tax ({taxRate * 100}%)</span>
                <span>KES {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-[#0D1117] pt-3 border-t border-gray-100">
                <span>Total</span>
                <span className="text-[#2563EB]">KES {total.toLocaleString()}</span>
              </div>
            </div>
            
            {showMpesaPrompt && (
              <div className="bg-blue-50 p-4 rounded-xl space-y-3 mb-2 animate-in fade-in slide-in-from-bottom-2">
                <label className="text-xs font-bold text-blue-800 uppercase tracking-wider">Customer Phone for STK Push</label>
                <Input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 font-bold"
                  autoFocus
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 relative z-50">
              <Button 
                onClick={() => handlePayment('M-Pesa')}
                disabled={cart.length === 0 || isProcessing}
                className="h-14 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-base shadow-sm"
              >
                M-Pesa Pay
              </Button>
              <Button 
                onClick={() => handlePayment('Cash')}
                disabled={cart.length === 0 || isProcessing}
                className="h-14 bg-[#0D1117] hover:bg-black text-white font-bold text-base shadow-sm"
              >
                Cash
              </Button>
              <Button 
                onClick={() => handlePayment('Card')}
                disabled={cart.length === 0 || isProcessing}
                variant="outline"
                className="h-12 border-gray-200 text-gray-700 font-bold col-span-2"
              >
                Card Payment
              </Button>
            </div>
          </div>
          
          {/* Success Overlay */}
          {successMsg && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-[#0D1117]">{successMsg}</h3>
              <p className="text-gray-500 font-medium mt-2 text-center px-8">Receipt generated and stock updated.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
