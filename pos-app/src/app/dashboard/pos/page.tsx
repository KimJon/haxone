'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, History, Wifi, WifiOff, Users, ArrowRight, CheckCircle2, QrCode } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function POSPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isOffline, setIsOffline] = useState(false);
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
    
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (!navigator.onLine) setIsOffline(true);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [showMpesaPrompt, setShowMpesaPrompt] = useState(false);
  const [phone, setPhone] = useState('2547');
  
  const subtotal = cart.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
  const tax = subtotal * (Number(taxRate) || 0);
  const total = subtotal + tax;

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCustomers = customerSearch.length > 0 ? customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch)) : [];

  const handlePayment = (method: string) => {
    if (cart.length === 0) return;
    
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
        amount: total, // Dashboard compatibility
        subtotal: subtotal,
        tax: tax,
        status: 'Completed',
        paymentMethod: method,
        method: method, // Dashboard compatibility
        date: new Date().toISOString(),
        customer: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
        customerId: selectedCustomer ? selectedCustomer.id : null,
        items: cart.map(c => ({...c, qty: c.quantity, costPrice: c.costPrice || 0}))
      };
      
      try {
        if (typeof window !== 'undefined') {
          const existingSales = JSON.parse(localStorage.getItem('haxone_sales') || '[]');
          localStorage.setItem('haxone_sales', JSON.stringify([newTx, ...existingSales]));
          
          const storedProducts = JSON.parse(localStorage.getItem('haxone_products') || '[]');
          const updatedProducts = storedProducts.map((p: any) => {
            const inCart = cart.find(c => c.id === p.id);
            if (inCart) {
              return { ...p, stock: Math.max(0, p.stock - inCart.quantity) };
            }
            return p;
          });
          localStorage.setItem('haxone_products', JSON.stringify(updatedProducts));
          
          if (selectedCustomer) {
            const storedCustomers = JSON.parse(localStorage.getItem('haxone_customers') || '[]');
            const updatedCustomers = storedCustomers.map((c: any) => {
              if (c.id === selectedCustomer.id) {
                return {
                  ...c,
                  totalSpent: (c.totalSpent || 0) + total,
                  orders: (c.orders || 0) + 1,
                  lastVisit: new Date().toISOString()
                };
              }
              return c;
            });
            localStorage.setItem('haxone_customers', JSON.stringify(updatedCustomers));
          }
        }
      } catch(e) {}
    }, 1500);
  };

  const addToCart = (product: any) => {
    const itemPrice = Number(product.sellPrice) || Number(product.price) || 0;
    const itemCost = Number(product.buyPrice) || Number(product.costPrice) || 0;
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1, price: itemPrice, costPrice: itemCost }];
    });
  };

  const handleNewSale = () => {
    setCart([]);
    setSuccessMsg('');
    setShowMpesaPrompt(false);
    setSelectedCustomer(null);
    setCustomerSearch('');
  };

  const activeStoreName = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('haxone_active_store') || '{}').businessName || 'HaxOne Store' : 'HaxOne Store';

  return (
    <>
    <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col bg-gray-50 -m-6 lg:-m-8 print:hidden">
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
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50/50 relative z-10 h-1/2 lg:h-auto">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4 pb-2 lg:pb-0">
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
                      <div className="text-sm font-black text-[#0D1117]">KES {(Number(p.sellPrice) || Number(p.price) || 0).toLocaleString()}</div>
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
        <div className="w-full lg:w-[400px] h-[45vh] lg:h-auto bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col flex-shrink-0 z-20 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.05)] lg:shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
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
              <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-blue-900">{selectedCustomer.name}</div>
                    <div className="text-xs text-blue-700">{selectedCustomer.phone}</div>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-blue-400 hover:text-blue-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {cart.map(item => (
              <div key={item.id} className="flex gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-xl shadow-sm border border-gray-100">
                  📦
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm text-[#0D1117] line-clamp-1">{item.name}</h4>
                    <button 
                      onClick={() => setCart(prev => prev.filter(p => p.id !== item.id))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">KES {item.price}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                      <button 
                        onClick={() => setCart(prev => prev.map(p => p.id === item.id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p))}
                        className="w-6 h-6 rounded bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-black"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => setCart(prev => prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p))}
                        className="w-6 h-6 rounded bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-black"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="font-bold text-sm text-[#0D1117]">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-sm font-medium">Cart is empty</p>
              </div>
            )}
          </div>

          {/* Checkout Footer */}
          <div className="border-t border-gray-200 bg-white p-4 space-y-4 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.05)]">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Tax ({taxRate * 100}%)</span>
                <span>KES {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-[#0D1117] pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
            </div>

            {showMpesaPrompt ? (
              <div className="space-y-3 animate-in slide-in-from-bottom-2">
                <Input 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  className="h-12 bg-green-50 border-green-200 focus:border-green-500 focus:ring-green-500 text-lg font-bold"
                  placeholder="2547..."
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowMpesaPrompt(false)}
                    className="flex-1 h-12 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handlePayment('M-Pesa')}
                    className="flex-[2] h-12 bg-[#00A859] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                  >
                    Send Prompt
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button 
                  disabled={cart.length === 0 || isProcessing}
                  onClick={() => handlePayment('Cash')}
                  className="h-12 flex items-center justify-center gap-2 bg-[#0D1117] text-white rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50"
                >
                  {isProcessing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <><Banknote size={18} /> Cash</>}
                </button>
                <button 
                  disabled={cart.length === 0 || isProcessing}
                  onClick={() => handlePayment('M-Pesa')}
                  className="h-12 flex items-center justify-center gap-2 bg-[#00A859] text-white rounded-xl font-bold hover:bg-[#00904C] transition-all disabled:opacity-50 shadow-lg shadow-green-500/20"
                >
                  {isProcessing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <><QrCode size={18} /> M-Pesa</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Overlay */}
      {successMsg && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center max-w-sm w-full mx-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-black text-[#0D1117]">{successMsg}</h3>
            <p className="text-gray-500 font-medium mt-2 text-center px-8 mb-6">Receipt generated and stock updated.</p>
            <div className="flex gap-3">
              <button onClick={() => window.print()} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                Print Receipt
              </button>
              <button onClick={handleNewSale} className="px-6 py-2.5 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
    {/* PRINTABLE RECEIPT */}
    <div className="hidden print:block w-[300px] text-black bg-white font-mono text-sm mx-auto p-4">
      <div className="text-center font-bold text-lg mb-2">{activeStoreName}</div>
      <div className="text-center text-xs mb-4">Date: {new Date().toLocaleString()}</div>
      <div className="border-t border-b border-black py-2 mb-2">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Item</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Amt</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(c => (
              <tr key={c.id}>
                <td className="truncate max-w-[150px]">{c.name}</td>
                <td className="text-right">{c.quantity}</td>
                <td className="text-right">{(c.price * c.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between font-bold mt-2">
        <span>Subtotal</span>
        <span>{subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Tax</span>
        <span>{tax.toLocaleString()}</span>
      </div>
      <div className="flex justify-between font-black text-lg mt-2 border-t border-black pt-1">
        <span>TOTAL</span>
        <span>{total.toLocaleString()}</span>
      </div>
      <div className="text-center mt-6 text-xs">
        Thank you for shopping with us!
      </div>
    </div>
    </>
  );
}
