"use client";
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Search, Wifi, WifiOff } from 'lucide-react';
import { SplitPaymentModal } from "@/components/SplitPaymentModal";

export default function POSPage() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSplitOpen, setIsSplitOpen] = useState(false);
  
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedProducts = JSON.parse(localStorage.getItem('haxone_products') || '[]');
        setProducts(storedProducts);
      } catch (e) {}
    }
  }, []);

  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [showMpesaPrompt, setShowMpesaPrompt] = useState(false);
  const [phone, setPhone] = useState('2547');
  
  const subtotal = cart.reduce((sum, item) => sum + (item.sellPrice * item.qty), 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  const handlePayment = (method: string) => {
    if (method === 'M-Pesa' && !showMpesaPrompt) {
      setShowMpesaPrompt(true);
      return;
    }
    
    setIsProcessing(true);
    setSuccessMsg('');
    setTimeout(() => {
      setIsProcessing(false);
      setShowMpesaPrompt(false);
      
      // Save transaction to localStorage
      const newTx = {
        id: `TXN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        amount: total,
        status: 'Completed',
        method: method,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullDate: new Date().toISOString(),
        items: cart
      };
      
      try {
        if (typeof window !== 'undefined') {
          // Push sale
          const existingSales = JSON.parse(localStorage.getItem('haxone_sales') || '[]');
          localStorage.setItem('haxone_sales', JSON.stringify([newTx, ...existingSales]));
          
          // Decrement stock
          const storedProducts = JSON.parse(localStorage.getItem('haxone_products') || '[]');
          const updatedProducts = storedProducts.map((p: any) => {
            const inCart = cart.find(c => c.id === p.id);
            if (inCart) {
              return { ...p, stock: Math.max(0, p.stock - inCart.qty) };
            }
            return p;
          });
          localStorage.setItem('haxone_products', JSON.stringify(updatedProducts));
          setProducts(updatedProducts); // update UI
        }
      } catch (e) {
        console.error('Failed to save sale', e);
      }

      setSuccessMsg(`Payment successful via ${method}!`);
      setTimeout(() => {
        window.print();
        setCart([]);
        setSuccessMsg('');
      }, 1000);
    }, method === 'M-Pesa' ? 2500 : 1000); // STK Push takes a bit longer
  };

  const addToCart = (product: any) => {
    const existing = cart.find(c => c.id === product.id);
    if (existing) {
      setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const [mobileTab, setMobileTab] = useState<'products' | 'cart'>('products');

  return (
    <>
    <div className="h-[calc(100vh-64px)] -m-8 flex flex-col md:flex-row bg-[#F5F6FA] print:hidden">
      
      {/* Mobile Tabs */}
      <div className="md:hidden flex bg-white border-b border-gray-200 shrink-0">
        <button 
          onClick={() => setMobileTab('products')}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${mobileTab === 'products' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-500'}`}
        >
          Products
        </button>
        <button 
          onClick={() => setMobileTab('cart')}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${mobileTab === 'cart' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-500'}`}
        >
          Cart
          {cart.length > 0 && (
            <span className="bg-[#2563EB] text-white text-[10px] px-2 py-0.5 rounded-full">{cart.reduce((a,b)=>a+b.qty,0)}</span>
          )}
        </button>
      </div>

      {/* Product Grid (Left) */}
      <div className={`flex-1 flex flex-col h-full border-r border-gray-200 ${mobileTab === 'products' ? 'flex' : 'hidden md:flex'}`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm shrink-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search products, scan barcode..." className="pl-9 bg-gray-50 border-gray-200 text-[#0D1117] focus:ring-[#2563EB]" />
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {isOffline ? (
              <span className="hidden sm:flex items-center text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1.5 rounded-full">
                <WifiOff className="w-3 h-3 mr-1.5" /> OFFLINE
              </span>
            ) : (
              <span className="hidden sm:flex items-center text-xs font-bold text-green-600 bg-green-100 px-3 py-1.5 rounded-full">
                <Wifi className="w-3 h-3 mr-1.5" /> ONLINE
              </span>
            )}
            <Button variant="outline" size="sm" onClick={() => setIsOffline(!isOffline)} className="border-gray-200 text-gray-600 hover:bg-gray-50">
              Toggle
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => (
              <div 
                key={p.id} 
                onClick={() => addToCart(p)}
                className="bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer hover:border-[#2563EB]/50 hover:shadow-md transition-all flex flex-col items-center justify-center aspect-square active:scale-95 shadow-sm"
              >
                <div className="text-4xl md:text-5xl mb-2 md:mb-4">{p.image || '📦'}</div>
                <div className="text-xs md:text-sm font-bold text-[#0D1117] text-center">{p.name}</div>
                <div className="text-[10px] md:text-xs text-[#2563EB] font-bold mt-1">KES {p.sellPrice}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart & Checkout (Right) */}
      <div className={`w-full md:w-[400px] flex flex-col bg-white shadow-[-4px_0_15px_rgba(0,0,0,0.02)] h-full ${mobileTab === 'cart' ? 'flex' : 'hidden md:flex'}`}>
        <div className="p-4 md:p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
          <span className="font-bold text-lg text-[#0D1117]">Current Order</span>
          <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md">Ticket #0042</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#F8F9FB] inset-shadow-sm">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
              <div className="text-5xl opacity-50">🛒</div>
              <p className="text-sm font-medium">Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 font-bold rounded-lg text-sm">{item.qty}x</div>
                  <div>
                    <div className="text-sm font-bold text-[#0D1117]">{item.name}</div>
                    <div className="text-xs text-gray-500 font-medium">KES {item.sellPrice}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-bold text-[#0D1117]">KES {item.sellPrice * item.qty}</div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-6 border-t border-gray-100 space-y-5 bg-white">
          <div className="space-y-2 text-sm font-medium">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>VAT (16%)</span>
              <span>KES {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-[#0D1117] pt-3 border-t border-gray-100">
              <span>Total</span>
              <span className="text-[#2563EB]">KES {total.toLocaleString()}</span>
            </div>
          </div>
          
          {successMsg && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center text-sm font-bold border border-green-200">
              <span className="mr-2">✅</span> {successMsg}
            </div>
          )}
          
          {showMpesaPrompt && (
            <div className="bg-blue-50 p-4 rounded-xl space-y-3 mb-2 animate-in fade-in slide-in-from-bottom-2">
              <label className="text-xs font-bold text-blue-800 uppercase tracking-wider">Customer Phone for STK Push</label>
              <Input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="bg-white border-blue-200 focus:ring-blue-500 font-mono text-lg h-12" 
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3 mt-2">
            <Button 
              className={`${showMpesaPrompt ? 'col-span-2' : ''} bg-[#10B981] hover:bg-[#059669] text-white h-14 rounded-xl font-bold text-lg shadow-md shadow-emerald-500/20`} 
              disabled={cart.length === 0 || isProcessing || (showMpesaPrompt && phone.length < 10)}
              onClick={() => handlePayment('M-Pesa')}
            >
              {isProcessing ? 'Waiting for PIN...' : showMpesaPrompt ? 'Send STK Push' : 'M-Pesa'}
            </Button>
            {!showMpesaPrompt && (
              <Button 
                className="bg-[#0D1117] hover:bg-black text-white h-14 rounded-xl font-bold text-lg shadow-md shadow-gray-900/20" 
                disabled={cart.length === 0 || isProcessing}
                onClick={() => handlePayment('Cash')}
              >
                {isProcessing ? 'Processing...' : 'Cash'}
              </Button>
            )}
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsSplitOpen(true)} 
            className="w-full bg-white border-gray-200 text-gray-700 hover:bg-gray-50 h-12 rounded-xl font-bold shadow-sm" 
            disabled={cart.length === 0 || isProcessing}
          >
            Split Payment
          </Button>
        </div>
      </div>
      
      <SplitPaymentModal isOpen={isSplitOpen} onClose={() => setIsSplitOpen(false)} total={total} />
    </div>

    {/* Thermal Receipt for Printing (58mm / 80mm) */}
    <style jsx global>{`
      @media print {
        @page {
          size: 80mm auto;
          margin: 0;
        }
        body * {
          visibility: hidden !important;
        }
        #thermal-receipt, #thermal-receipt * {
          visibility: visible !important;
        }
        #thermal-receipt {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 80mm !important;
          padding: 2mm !important;
          margin: 0 !important;
          background: white !important;
          font-family: 'Courier New', 'Lucida Console', monospace !important;
          font-size: 12px !important;
          line-height: 1.4 !important;
          color: #000 !important;
        }
      }
    `}</style>
    <div id="thermal-receipt" className="hidden print:block">
      <div style={{ width: '80mm', padding: '2mm', fontFamily: "'Courier New', monospace", fontSize: '12px', lineHeight: '1.4', color: '#000' }}>
        
        {/* Store Header */}
        <div style={{ textAlign: 'center', marginBottom: '4px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px' }}>HAXONE STORE</div>
          <div style={{ fontSize: '10px' }}>Nairobi, Kenya</div>
          <div style={{ fontSize: '10px' }}>Tel: 0729 915 459</div>
          <div style={{ fontSize: '10px' }}>haxorconsults@gmail.com</div>
        </div>
        
        <div style={{ borderTop: '1px dashed #000', margin: '4px 0' }}></div>
        
        {/* Receipt Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '2px' }}>
          <span>Receipt: #0042</span>
          <span>Cashier: Admin</span>
        </div>
        <div style={{ fontSize: '10px', marginBottom: '4px' }}>
          {new Date().toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}
        </div>
        
        <div style={{ borderTop: '1px dashed #000', margin: '4px 0' }}></div>
        
        {/* Column Headers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 'bold', marginBottom: '2px' }}>
          <span style={{ flex: 1 }}>ITEM</span>
          <span style={{ width: '30px', textAlign: 'center' }}>QTY</span>
          <span style={{ width: '60px', textAlign: 'right' }}>PRICE</span>
          <span style={{ width: '70px', textAlign: 'right' }}>TOTAL</span>
        </div>
        
        <div style={{ borderTop: '1px dashed #000', margin: '2px 0' }}></div>
        
        {/* Items */}
        {cart.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '1px 0' }}>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
            <span style={{ width: '30px', textAlign: 'center' }}>{item.qty}</span>
            <span style={{ width: '60px', textAlign: 'right' }}>{item.sellPrice}</span>
            <span style={{ width: '70px', textAlign: 'right' }}>{(item.sellPrice * item.qty).toLocaleString()}</span>
          </div>
        ))}
        
        <div style={{ borderTop: '1px dashed #000', margin: '4px 0' }}></div>
        
        {/* Totals */}
        <div style={{ fontSize: '11px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0' }}>
            <span>Subtotal</span>
            <span>KES {subtotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0' }}>
            <span>VAT (16%)</span>
            <span>KES {tax.toLocaleString()}</span>
          </div>
        </div>
        
        <div style={{ borderTop: '1px dashed #000', margin: '4px 0' }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', padding: '2px 0' }}>
          <span>TOTAL</span>
          <span>KES {total.toLocaleString()}</span>
        </div>
        
        <div style={{ borderTop: '1px dashed #000', margin: '4px 0' }}></div>
        
        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: '10px', marginTop: '6px' }}>
          <div>Items: {cart.reduce((a, b) => a + b.qty, 0)}</div>
          <div style={{ marginTop: '8px', fontWeight: 'bold' }}>Thank you for your purchase!</div>
          <div>Please come again</div>
          <div style={{ marginTop: '6px', fontSize: '9px', color: '#666' }}>Powered by HaxOne POS</div>
          <div style={{ marginTop: '6px', fontSize: '9px' }}>www.haxormtc.com</div>
        </div>
        
        {/* Extra space for paper cut */}
        <div style={{ height: '20px' }}></div>
      </div>
    </div>
    </>
  );
}
