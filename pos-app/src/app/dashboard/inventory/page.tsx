'use client';
import { Plus, X, ArrowDown, AlertCircle, CheckCircle, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';

const LOW_STOCK: any[] = [];

const MOVEMENTS: any[] = [];

export default function InventoryPage() {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [form, setForm] = useState({ productId: '', qty: '', supplier: '', ref: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedProducts = JSON.parse(localStorage.getItem('haxone_products') || '[]');
        setProducts(storedProducts);
        const storedMovements = JSON.parse(localStorage.getItem('haxone_inventory_movements') || '[]');
        setMovements(storedMovements);
      } catch (e) {}
    }
  }, []);

  const handleStockIn = () => {
    if (!form.productId || !form.qty) {
      alert("Select a product and quantity");
      return;
    }

    const qtyNumber = Number(form.qty);
    if (qtyNumber <= 0) return;

    const targetProduct = products.find(p => p.id === form.productId);
    if (!targetProduct) return;

    // Update product stock
    const updatedProducts = products.map(p => 
      p.id === form.productId ? { ...p, stock: p.stock + qtyNumber } : p
    );
    setProducts(updatedProducts);
    
    // Record movement
    const newMovement = {
      id: `MOV-${Math.floor(Math.random() * 100000)}`,
      date: form.date,
      product: targetProduct.name,
      type: 'Stock In',
      qty: qtyNumber,
      ref: form.ref || 'Direct',
      user: 'Current User'
    };
    const updatedMovements = [newMovement, ...movements];
    setMovements(updatedMovements);

    if (typeof window !== 'undefined') {
      localStorage.setItem('haxone_products', JSON.stringify(updatedProducts));
      localStorage.setItem('haxone_inventory_movements', JSON.stringify(updatedMovements));
    }

    setShowModal(false);
    setForm({ productId: '', qty: '', supplier: '', ref: '', date: new Date().toISOString().split('T')[0] });
  };

  const lowStockProducts = products.filter(p => p.stock <= 10).map(p => ({
    ...p,
    suggestedOrder: Math.max(20 - p.stock, 0)
  }));
  
  const totalValue = products.reduce((acc, p) => acc + (p.buyPrice * p.stock), 0);

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">Inventory</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitor stock levels and movements</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-colors">
          <Plus size={16} /> Record Stock-In
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total SKUs', value: products.length, sub: 'Products tracked', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Value', value: `KES ${totalValue.toLocaleString()}`, sub: 'Inventory worth', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Low Stock', value: lowStockProducts.length, sub: 'Need attention', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Reorder Needed', value: lowStockProducts.filter(p => p.stock === 0).length, sub: 'Urgent orders', color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-5">
            <div className="text-2xl font-bold text-[#0D1117]">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            <div className="text-xs mt-1 text-gray-400">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <AlertCircle size={18} className="text-amber-500" />
          <h2 className="font-bold text-[#0D1117]">Low Stock Alerts</h2>
          <span className="ml-auto text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-semibold">{lowStockProducts.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                {['Product', 'Current Stock', 'Suggested Order', 'Supplier', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lowStockProducts.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">All products are adequately stocked!</td></tr>
              ) : lowStockProducts.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5 flex items-center gap-3">
                    <span className="font-medium text-[#0D1117]">{item.name}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`font-bold ${item.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>{item.stock}</span>
                    {item.stock === 0 && <span className="ml-2 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-semibold">Out</span>}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-blue-600">{item.suggestedOrder} units</td>
                  <td className="px-4 py-3.5 text-gray-500">General Supplier</td>
                  <td className="px-4 py-3.5">
                    <button className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                      <ShoppingCart size={12} /> Order Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movements */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#0D1117]">Recent Stock Movements</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                {['Date', 'Product', 'Type', 'Quantity', 'Reference', 'Recorded By'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {movements.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500">No stock movements recorded yet.</td></tr>
              ) : movements.map(m => (
                <tr key={m.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">{m.date}</td>
                  <td className="px-4 py-3.5 font-medium text-[#0D1117]">{m.product}</td>
                  <td className="px-4 py-3.5">
                    {m.type === 'Stock In'
                      ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700"><CheckCircle size={11} /> Stock In</span>
                      : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600"><ArrowDown size={11} /> Stock Out</span>}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-[#0D1117]">{m.qty}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-[#2563EB]">{m.ref}</td>
                  <td className="px-4 py-3.5 text-gray-500">{m.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock-In Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#0D1117]">Record Stock-In</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Product *</label>
                <select value={form.productId} onChange={e => setForm(f => ({...f, productId: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB] bg-white">
                  <option value="">-- Select Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Current: {p.stock})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Quantity Received *</label>
                  <input type="number" value={form.qty} onChange={e => setForm(f => ({...f, qty: e.target.value}))} placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Supplier</label>
                <input value={form.supplier} onChange={e => setForm(f => ({...f, supplier: e.target.value}))} placeholder="Supplier name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Purchase Order / Reference</label>
                <input value={form.ref} onChange={e => setForm(f => ({...f, ref: e.target.value}))} placeholder="PO-0090" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleStockIn} className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">Record Stock-In</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
