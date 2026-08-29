'use client';

import { useState, useEffect } from 'react';
import {
  Package, Search, Plus, ArrowDown, ArrowUp, X, Filter, Trash2, Shield, Box, FileText, CheckCircle, Truck, DollarSign
} from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'movements' | 'alerts'>('movements');

  // Modals
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProducts(JSON.parse(localStorage.getItem('haxone_products') || '[]'));
      setMovements(JSON.parse(localStorage.getItem('haxone_inventory_movements') || '[]'));
      setSuppliers(JSON.parse(localStorage.getItem('haxone_suppliers') || '[]'));
    }
  }, []);

  const lowStockProducts = products.filter(p => (p.stock || 0) <= (p.minStock || 5));

  // Multi-item cart states
  const [cart, setCart] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [newSupplierName, setNewSupplierName] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  
  // Receive specific
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [paymentRef, setPaymentRef] = useState('');

  // Dispatch specific
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('Sale');

  const addToCart = (product: any) => {
    if (!cart.find(c => c.id === product.id)) {
      setCart([...cart, { ...product, quantity: 1, costPrice: product.costPrice || 0 }]);
    }
  };

  const updateCartQty = (id: string, qty: number) => {
    setCart(cart.map(c => c.id === id ? { ...c, quantity: Number(qty) } : c));
  };
  
  const updateCartCost = (id: string, cost: number) => {
    setCart(cart.map(c => c.id === id ? { ...c, costPrice: Number(cost) } : c));
  };

  const removeCartItem = (id: string) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const addSupplier = () => {
    if (newSupplierName) {
      const newSup = { id: `SUP-${Math.random().toString(36).substr(2,6)}`, name: newSupplierName };
      const updated = [...suppliers, newSup];
      setSuppliers(updated);
      setSelectedSupplier(newSup.name);
      setNewSupplierName('');
      if (typeof window !== 'undefined') localStorage.setItem('haxone_suppliers', JSON.stringify(updated));
    }
  };

  const handleReceiveGoods = () => {
    if (cart.length === 0) return alert("Add items to receive");
    
    let finalSupplier = selectedSupplier;
    if (newSupplierName) {
      finalSupplier = newSupplierName;
      // Auto add to supplier list
      const newSup = { id: `SUP-${Math.random().toString(36).substr(2,6)}`, name: newSupplierName };
      const updated = [...suppliers, newSup];
      setSuppliers(updated);
      if (typeof window !== 'undefined') localStorage.setItem('haxone_suppliers', JSON.stringify(updated));
    }

    let updatedProducts = [...products];
    const newMovements = cart.map(item => {
      const pIdx = updatedProducts.findIndex(p => p.id === item.id);
      if (pIdx > -1) {
        updatedProducts[pIdx].stock = (updatedProducts[pIdx].stock || 0) + item.quantity;
        updatedProducts[pIdx].costPrice = item.costPrice; // Update cost price
      }
      return {
        id: `MOV-${Math.random().toString(36).substr(2,6)}`,
        date: new Date().toISOString(),
        product: item.name,
        type: 'Stock In',
        qty: item.quantity,
        totalCost: item.quantity * item.costPrice,
        ref: reference,
        source: finalSupplier,
        paymentStatus,
        paymentRef,
        notes,
        user: 'Admin'
      };
    });

    const finalMovements = [...newMovements, ...movements];
    setProducts(updatedProducts);
    setMovements(finalMovements);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('haxone_products', JSON.stringify(updatedProducts));
      localStorage.setItem('haxone_inventory_movements', JSON.stringify(finalMovements));
      
      // Also save as an Expense if it's paid
      if (paymentStatus === 'Paid') {
         const totalCost = newMovements.reduce((acc, m) => acc + (m.totalCost || 0), 0);
         const expenses = JSON.parse(localStorage.getItem('haxone_expenses') || '[]');
         expenses.unshift({
           id: `EXP-${Math.random().toString(36).substr(2,6)}`,
           date: new Date().toISOString(),
           category: 'Inventory Purchase',
           amount: totalCost,
           description: `Received goods from ${finalSupplier} (Ref: ${reference})`,
           paymentMethod: 'Bank/M-Pesa',
           ref: paymentRef
         });
         localStorage.setItem('haxone_expenses', JSON.stringify(expenses));
      }
    }

    closeModals();
  };

  const handleDispatchGoods = () => {
    if (cart.length === 0) return alert("Add items to dispatch");
    
    let updatedProducts = [...products];
    for (const item of cart) {
       const p = updatedProducts.find(p => p.id === item.id);
       if (!p || p.stock < item.quantity) {
          return alert(`Not enough stock for ${item.name}! Available: ${p?.stock || 0}`);
       }
    }

    const newMovements = cart.map(item => {
      const pIdx = updatedProducts.findIndex(p => p.id === item.id);
      if (pIdx > -1) {
        updatedProducts[pIdx].stock = (updatedProducts[pIdx].stock || 0) - item.quantity;
      }
      return {
        id: `MOV-${Math.random().toString(36).substr(2,6)}`,
        date: new Date().toISOString(),
        product: item.name,
        type: 'Stock Out',
        qty: item.quantity,
        ref: reference,
        destination: destination,
        reason,
        notes,
        user: 'Admin'
      };
    });

    const finalMovements = [...newMovements, ...movements];
    setProducts(updatedProducts);
    setMovements(finalMovements);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('haxone_products', JSON.stringify(updatedProducts));
      localStorage.setItem('haxone_inventory_movements', JSON.stringify(finalMovements));
    }

    closeModals();
  };

  const closeModals = () => {
    setShowReceiveModal(false);
    setShowDispatchModal(false);
    setCart([]);
    setSelectedSupplier('');
    setReference('');
    setNotes('');
    setPaymentRef('');
    setDestination('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Receive goods, track movements, and monitor stock.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowDispatchModal(true)}
            className="flex items-center gap-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
            Dispatch
          </button>
          <button 
            onClick={() => setShowReceiveModal(true)}
            className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
          >
            <ArrowDown className="w-4 h-4" />
            Receive
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Package className="w-6 h-6 text-[#2563EB]" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Products in Catalog</div>
            <div className="text-2xl font-bold text-[#0D1117]">{products.length}</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-red-50 border-l-4 border-l-red-500 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
            <Box className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Low Stock Alerts</div>
            <div className="text-2xl font-bold text-red-600">{lowStockProducts.length}</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <ArrowDown className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Total Stock In</div>
            <div className="text-2xl font-bold text-green-700">{movements.filter(m => m.type === 'Stock In').length}</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
            <ArrowUp className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Total Stock Out</div>
            <div className="text-2xl font-bold text-orange-700">{movements.filter(m => m.type === 'Stock Out').length}</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('movements')}
            className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'movements' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
          >
            Recent Movements
          </button>
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'alerts' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
          >
            Low Stock Alerts ({lowStockProducts.length})
          </button>
        </div>

        {activeTab === 'movements' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Qty</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Details</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Cost/Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {movements.map((mov, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 text-gray-500">{new Date(mov.date).toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        mov.type === 'Stock In' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {mov.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#0D1117]">{mov.product}</td>
                    <td className="px-5 py-3 font-bold">{mov.qty}</td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      <div>Ref: {mov.ref || 'N/A'}</div>
                      {mov.source && <div>From: {mov.source}</div>}
                      {mov.destination && <div>To: {mov.destination}</div>}
                    </td>
                    <td className="px-5 py-3 text-xs">
                      {mov.type === 'Stock In' && (
                        <>
                          <div className="font-bold text-gray-800">KES {(mov.totalCost || 0).toLocaleString()}</div>
                          <div className={mov.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}>{mov.paymentStatus}</div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {movements.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-500">No inventory movements recorded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Current Stock</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Min Required</th>
                  <th className="text-right px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lowStockProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-red-50/20 transition-colors">
                    <td className="px-5 py-3 font-bold text-[#0D1117]">{p.name}</td>
                    <td className="px-5 py-3 text-gray-500">{p.category}</td>
                    <td className="px-5 py-3 font-black text-red-600">{p.stock || 0}</td>
                    <td className="px-5 py-3 text-gray-500">{p.minStock || 5}</td>
                    <td className="px-5 py-3 text-right">
                      <button 
                        onClick={() => { setShowReceiveModal(true); addToCart(p); }}
                        className="text-xs bg-blue-50 text-[#2563EB] font-bold px-3 py-1.5 rounded hover:bg-[#2563EB] hover:text-white transition-colors"
                      >
                        Reorder
                      </button>
                    </td>
                  </tr>
                ))}
                {lowStockProducts.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-500">No low stock alerts. You are fully stocked!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RECEIVE MODAL */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-[#0D1117] flex items-center gap-2"><ArrowDown className="text-[#10B981] w-5 h-5"/> Receive Goods (Stock In)</h2>
              <button onClick={closeModals} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
               <div className="w-full lg:w-1/2 space-y-4 border-r border-gray-100 pr-0 lg:pr-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Search Products to Receive</label>
                   <select onChange={(e) => {
                     const p = products.find(p => p.id === e.target.value);
                     if(p) addToCart(p);
                     e.target.value = "";
                   }} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#2563EB] bg-gray-50">
                     <option value="">Select a product...</option>
                     {products.map(p => <option key={p.id} value={p.id}>{p.name} (Current: {p.stock})</option>)}
                   </select>
                 </div>
                 
                 <div className="border border-gray-200 rounded-xl overflow-hidden">
                   <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Receive Cart</div>
                   <div className="max-h-60 overflow-y-auto p-2 space-y-2">
                     {cart.map((c, i) => (
                       <div key={i} className="flex flex-col gap-2 p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                         <div className="flex justify-between items-start">
                           <div className="font-bold text-sm text-[#0D1117] truncate max-w-[200px]">{c.name}</div>
                           <button onClick={() => removeCartItem(c.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                         </div>
                         <div className="flex gap-2">
                           <div className="flex-1">
                             <label className="text-[10px] text-gray-500 block">Qty</label>
                             <input type="number" min="1" value={c.quantity} onChange={(e) => updateCartQty(c.id, Number(e.target.value))} className="w-full border border-gray-200 rounded px-2 py-1 text-sm"/>
                           </div>
                           <div className="flex-1">
                             <label className="text-[10px] text-gray-500 block">Cost/Unit</label>
                             <input type="number" min="0" value={c.costPrice} onChange={(e) => updateCartCost(c.id, Number(e.target.value))} className="w-full border border-gray-200 rounded px-2 py-1 text-sm"/>
                           </div>
                         </div>
                       </div>
                     ))}
                     {cart.length === 0 && <div className="text-center py-4 text-sm text-gray-400">Select products above to add to cart.</div>}
                   </div>
                 </div>
               </div>
               
               <div className="w-full lg:w-1/2 space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Supplier</label>
                    <div className="flex gap-2">
                      <select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#2563EB]">
                        <option value="">Select Supplier...</option>
                        {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                      <input type="text" placeholder="Or New Supplier Name" value={newSupplierName} onChange={e => setNewSupplierName(e.target.value)} className="w-1/3 border border-gray-200 rounded-lg px-2 text-sm"/>
                      <button onClick={addSupplier} className="bg-gray-100 text-gray-600 px-3 rounded-lg hover:bg-gray-200 font-bold text-sm">+</button>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Purchase Order / Ref</label>
                     <input type="text" value={reference} onChange={e => setReference(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#2563EB]"/>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Payment Status</label>
                     <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#2563EB]">
                       <option>Pending</option>
                       <option>Paid</option>
                     </select>
                   </div>
                 </div>
                 
                 {paymentStatus === 'Paid' && (
                   <div>
                     <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Payment Ref (e.g. M-Pesa Code)</label>
                     <input type="text" value={paymentRef} onChange={e => setPaymentRef(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#2563EB]"/>
                   </div>
                 )}
                 
                 <div>
                   <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Notes</label>
                   <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#2563EB] resize-none"/>
                 </div>
                 
                 <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-200 mt-4">
                    <span className="font-bold text-gray-600">Total Purchase Cost:</span>
                    <span className="text-xl font-black text-[#0D1117]">KES {cart.reduce((acc, c) => acc + (c.quantity * c.costPrice), 0).toLocaleString()}</span>
                 </div>
               </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end flex-shrink-0 bg-gray-50 rounded-b-2xl">
              <button onClick={closeModals} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleReceiveGoods} className="px-6 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                Confirm & Receive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPATCH MODAL */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-[#0D1117] flex items-center gap-2"><ArrowUp className="text-red-500 w-5 h-5"/> Dispatch Goods (Stock Out)</h2>
              <button onClick={closeModals} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
               <div className="w-full lg:w-1/2 space-y-4 border-r border-gray-100 pr-0 lg:pr-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Search Products to Dispatch</label>
                   <select onChange={(e) => {
                     const p = products.find(p => p.id === e.target.value);
                     if(p) addToCart(p);
                     e.target.value = "";
                   }} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#2563EB] bg-gray-50">
                     <option value="">Select a product...</option>
                     {products.map(p => <option key={p.id} value={p.id}>{p.name} (Avail: {p.stock || 0})</option>)}
                   </select>
                 </div>
                 
                 <div className="border border-gray-200 rounded-xl overflow-hidden">
                   <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Dispatch Cart</div>
                   <div className="max-h-60 overflow-y-auto p-2 space-y-2">
                     {cart.map((c, i) => (
                       <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                         <div className="flex-1 min-w-0">
                           <div className="font-bold text-sm text-[#0D1117] truncate">{c.name}</div>
                           <div className="text-[10px] text-gray-500">Available: {c.stock}</div>
                         </div>
                         <div className="w-24">
                           <input type="number" min="1" max={c.stock} value={c.quantity} onChange={(e) => updateCartQty(c.id, Number(e.target.value))} className="w-full border border-gray-200 rounded px-2 py-1 text-sm text-center"/>
                         </div>
                         <button onClick={() => removeCartItem(c.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                       </div>
                     ))}
                     {cart.length === 0 && <div className="text-center py-4 text-sm text-gray-400">Select products above to add to cart.</div>}
                   </div>
                 </div>
               </div>
               
               <div className="w-full lg:w-1/2 space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Reason</label>
                    <select value={reason} onChange={e => setReason(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#2563EB]">
                      <option>Sale</option>
                      <option>Transfer to Branch</option>
                      <option>Return to Supplier</option>
                      <option>Damaged / Expired</option>
                      <option>Other</option>
                    </select>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Destination</label>
                     <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. Branch B" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#2563EB]"/>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Reference</label>
                     <input type="text" value={reference} onChange={e => setReference(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#2563EB]"/>
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Notes</label>
                   <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#2563EB] resize-none"/>
                 </div>
               </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end flex-shrink-0 bg-gray-50 rounded-b-2xl">
              <button onClick={closeModals} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleDispatchGoods} className="px-6 py-2 bg-[#0D1117] hover:bg-black text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
