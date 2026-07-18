import { forwardRef } from 'react';

export const Receipt = forwardRef<HTMLDivElement, any>(({ cart, subtotal, tax, total, storeName }, ref) => {
  return (
    <div ref={ref} className="bg-white text-black p-8 max-w-sm mx-auto font-mono text-sm shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="font-bold text-xl">{storeName || "HAXONE POS"}</h2>
        <p>123 Business Street</p>
        <p>Nairobi, Kenya</p>
        <p className="mt-2 text-xs">Date: {new Date().toLocaleString()}</p>
        <p className="text-xs">Receipt #: {Math.floor(Math.random() * 100000)}</p>
      </div>

      <div className="border-t border-b border-black border-dashed py-4 mb-4">
        <div className="flex justify-between font-bold mb-2">
          <span>ITEM</span>
          <span>TOTAL</span>
        </div>
        {cart.map((item: any) => (
          <div key={item.id} className="flex justify-between mb-1">
            <span>{item.qty}x {item.name}</span>
            <span>{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1 text-right">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>VAT (16%)</span>
          <span>{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-black">
          <span>TOTAL</span>
          <span>KSh {total.toLocaleString()}</span>
        </div>
      </div>

      <div className="text-center mt-8">
        <p>Thank you for shopping with us!</p>
        <p className="text-xs mt-1">Powered by HaxOne</p>
        <div className="w-24 h-24 bg-black mx-auto mt-4" style={{
          backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
          backgroundSize: '8px 8px'
        }} />
      </div>
    </div>
  );
});
Receipt.displayName = 'Receipt';
