'use client';
import { Plus, X, ArrowDown, ArrowUp, AlertCircle, CheckCircle, ShoppingCart, Package, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [receiveForm, setReceiveForm] = useState({ productId: '', qty: '', supplier: '', ref: '', date: new Date().toISOString().split('T')[0], notes: '' });
  const [dispatchForm, setDispatchForm] = useState({ productId: '', qty: '', destination: '', ref: '', date: new Date().toISOString().split('T')[0], reason: 'Sale', notes: '' });

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

  const lowStockProducts = products.filter(p => p.stock <= (p.minStock || 5));
  const totalStockValue = products.reduce((sum, p) => sum + (p.stock * (p.costPrice || p.price || 0)), 0);
  const todayMovements = movements.filter(m => m.date === new Date().toISOString().split('T')[0]);

  const handleReceive = () => {
    if (!receiveForm.productId || !receiveForm.qty) {
      alert("Select a product and enter quantity");
      return;
    }
    const qtyNumber = Number(receiveForm.qty);
    if (qtyNumber <= 0) return;

    const targetProduct = products.find(p => p.id === receiveForm.productId);
    if (!targetProduct) return;

    const updatedProducts = products.map(p =>
      p.id === receiveForm.productId ? { ...p, stock: (p.stock || 0) + qtyNumber } : p
    );

    const newMovement = {
      id: `MV-${Date.now()}`,
      date: receiveForm.date,
      product: targetProduct.name,
      productId: targetProduct.id,
      type: 'Stock In',
      qty: qtyNumber,
      ref: receiveForm.ref || `RCV-${Date.now().toString(36).toUpperCase()}`,
      source: receiveForm.supplier || 'Unknown Supplier',
      reason: 'Purchase',
      notes: receiveForm.notes,
      user: 'Admin'
    };

    const updatedMovements = [newMovement, ...movements];
    setProducts(updatedProducts);
    setMovements(updatedMovements);
    localStorage.setItem('haxone_products', JSON.stringify(updatedProducts));
    localStorage.setItem('haxone_inventory_movements', JSON.stringify(updatedMovements));
    setReceiveForm({ productId: '', qty: '', supplier: '', ref: '', date: new Date().toISOString().split('T')[0], notes: '' });
    setShowReceiveModal(false);
  };

  const handleDispatch = () => {
    if (!dispatchForm.productId || !dispatchForm.qty) {
      alert("Select a product and enter quantity");
      return;
    }
    const qtyNumber = Number(dispatchForm.qty);
    if (qtyNumber <= 0) return;

    const targetProduct = products.find(p => p.id === dispatchForm.productId);
    if (!targetProduct) return;

    if (qtyNumber > (targetProduct.stock || 0)) {
      alert(`Insufficient stock! ${targetProduct.name} only has ${targetProduct.stock} units available.`);
      return;
    }

    const updatedProducts = products.map(p =>
      p.id === dispatchForm.productId ? { ...p, stock: (p.stock || 0) - qtyNumber } : p
    );

    const newMovement = {
      id: `MV-${Date.now()}`,
      date: dispatchForm.date,
      product: targetProduct.name,
      productId: targetProduct.id,
      type: 'Stock Out',
      qty: qtyNumber,
      ref: dispatchForm.ref || `DSP-${Date.now().toString(36).toUpperCase()}`,
      source: dispatchForm.destination || 'Unknown Destination',
      reason: dispatchForm.reason,
      notes: dispatchForm.notes,
      user: 'Admin'
    };

    const updatedMovements = [newMovement, ...movements];
    setProducts(updatedProducts);
    setMovements(updatedMovements);
    localStorage.setItem('haxone_products', JSON.stringify(updatedProducts));
    localStorage.setItem('haxone_inventory_movements', JSON.stringify(updatedMovements));
    setDispatchForm({ productId: '', qty: '', destination: '', ref: '', date: new Date().toISOString().split('T')[0], reason: 'Sale', notes: '' });
    setShowDispatchModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track stock movements, receive goods, and dispatch orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReceiveModal(true)}
            className="flex items-center gap-2 bg-[#10B981] hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
          >
            <ArrowDown className="w-4 h-4" />
            Receive Goods
          </button>
          <button
            onClick={() => setShowDispatchModal(true)}
            className="flex items-center gap-2 bg-[#F59E0B] hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
          >
            <Truck className="w-4 h-4" />
            Dispatch Goods
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center"><Package className="w-4 h-4 text-[#2563EB]" /></div>
            <span className="text-xs font-medium text-gray-500">Total Products</span>
          </div>
          <div className="text-2xl font-bold text-[#0D1117]">{products.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-[#10B981]" /></div>
            <span className="text-xs font-medium text-gray-500">Stock Value</span>
          </div>
          <div className="text-2xl font-bold text-[#0D1117]">KES {totalStockValue.toLocaleString()}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center"><AlertCircle className="w-4 h-4 text-amber-500" /></div>
            <span className="text-xs font-medium text-gray-500">Low Stock Alerts</span>
          </div>
          <div className="text-2xl font-bold text-[#EF4444]">{lowStockProducts.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center"><ArrowUp className="w-4 h-4 text-[#7C3AED]" /></div>
            <span className="text-xs font-medium text-gray-500">Movements Today</span>
          </div>
          <div className="text-2xl font-bold text-[#0D1117]">{todayMovements.length}</div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <AlertCircle size={18} className="text-amber-500" />
          <h2 className="font-bold text-[#0D1117]">Low Stock Alerts</h2>
          <span className="ml-auto text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-semibold">{lowStockProducts.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                {['Product', 'Current Stock', 'Min Stock', 'Suggested Order', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lowStockProducts.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">All products are adequately stocked!</td></tr>
              ) : lowStockProducts.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-[#0D1117]">{item.name}</td>
                  <td className="px-4 py-3.5">
                    <span className={`font-bold ${item.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>{item.stock}</span>
                    {item.stock === 0 && <span className="ml-2 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-semibold">Out</span>}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{item.minStock || 5}</td>
                  <td className="px-4 py-3.5 font-semibold text-blue-600">{Math.max(50, (item.minStock || 5) * 3)} units</td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => { setReceiveForm(f => ({...f, productId: item.id})); setShowReceiveModal(true); }} className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                      <ShoppingCart size={12} /> Restock
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
                {['Date', 'Product', 'Type', 'Quantity', 'Reference', 'Source / Destination', 'Reason', 'Recorded By'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {movements.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-500">No stock movements recorded yet.</td></tr>
              ) : movements.map(m => (
                <tr key={m.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">{m.date}</td>
                  <td className="px-4 py-3.5 font-medium text-[#0D1117]">{m.product}</td>
                  <td className="px-4 py-3.5">
                    {m.type === 'Stock In'
                      ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700"><CheckCircle size={11} /> Received</span>
                      : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600"><ArrowDown size={11} /> Dispatched</span>}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-[#0D1117]">{m.qty}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-[#2563EB]">{m.ref}</td>
                  <td className="px-4 py-3.5 text-gray-600">{m.source}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs">{m.reason || '-'}</td>
                  <td className="px-4 py-3.5 text-gray-500">{m.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive Goods Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><ArrowDown className="w-5 h-5 text-[#10B981]" /></div>
                <h2 className="text-lg font-bold text-[#0D1117]">Receive Goods</h2>
              </div>
              <button onClick={() => setShowReceiveModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Product *</label>
                <select value={receiveForm.productId} onChange={e => setReceiveForm(f => ({...f, productId: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB] bg-white">
                  <option value="">-- Select Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Current: {p.stock})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Quantity Received *</label>
                  <input type="number" value={receiveForm.qty} onChange={e => setReceiveForm(f => ({...f, qty: e.target.value}))} placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Date</label>
                  <input type="date" value={receiveForm.date} onChange={e => setReceiveForm(f => ({...f, date: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Supplier</label>
                <input value={receiveForm.supplier} onChange={e => setReceiveForm(f => ({...f, supplier: e.target.value}))} placeholder="Supplier name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Purchase Order / Reference</label>
                <input value={receiveForm.ref} onChange={e => setReceiveForm(f => ({...f, ref: e.target.value}))} placeholder="PO-0090" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes</label>
                <textarea value={receiveForm.notes} onChange={e => setReceiveForm(f => ({...f, notes: e.target.value}))} rows={2} placeholder="Any additional notes..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB] resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowReceiveModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleReceive} className="px-5 py-2 bg-[#10B981] hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors">Record Received Goods</button>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Goods Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Truck className="w-5 h-5 text-[#F59E0B]" /></div>
                <h2 className="text-lg font-bold text-[#0D1117]">Dispatch Goods</h2>
              </div>
              <button onClick={() => setShowDispatchModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Product *</label>
                <select value={dispatchForm.productId} onChange={e => setDispatchForm(f => ({...f, productId: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB] bg-white">
                  <option value="">-- Select Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Available: {p.stock})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Quantity to Dispatch *</label>
                  <input type="number" value={dispatchForm.qty} onChange={e => setDispatchForm(f => ({...f, qty: e.target.value}))} placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                  {dispatchForm.productId && (
                    <p className="text-xs text-gray-400 mt-1">Max: {products.find(p => p.id === dispatchForm.productId)?.stock || 0} units</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Date</label>
                  <input type="date" value={dispatchForm.date} onChange={e => setDispatchForm(f => ({...f, date: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Destination (Branch / Customer)</label>
                <input value={dispatchForm.destination} onChange={e => setDispatchForm(f => ({...f, destination: e.target.value}))} placeholder="e.g. Westlands Branch, John Kamau" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Reason</label>
                <select value={dispatchForm.reason} onChange={e => setDispatchForm(f => ({...f, reason: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB] bg-white">
                  <option value="Sale">Sale</option>
                  <option value="Transfer to Branch">Transfer to Branch</option>
                  <option value="Return to Supplier">Return to Supplier</option>
                  <option value="Damaged/Expired">Damaged / Expired</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Dispatch Reference</label>
                <input value={dispatchForm.ref} onChange={e => setDispatchForm(f => ({...f, ref: e.target.value}))} placeholder="DSP-001" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes</label>
                <textarea value={dispatchForm.notes} onChange={e => setDispatchForm(f => ({...f, notes: e.target.value}))} rows={2} placeholder="Any additional notes..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB] resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowDispatchModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleDispatch} className="px-5 py-2 bg-[#F59E0B] hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">Record Dispatch</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
