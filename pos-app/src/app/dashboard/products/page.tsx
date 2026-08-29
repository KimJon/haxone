'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Package, TrendingDown, AlertTriangle, CheckCircle, Download, Upload } from 'lucide-react';

const INITIAL_PRODUCTS: any[] = [];

const CATEGORIES = ['All', 'Flour & Grains', 'Cooking Oil', 'Sugar & Sweeteners', 'Beverages', 'Dairy', 'Personal Care', 'Spreads', 'Spices'];

function StatusBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">Out of Stock</span>;
  if (stock <= 5) return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600">Low Stock</span>;
  return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600">In Stock</span>;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState(CATEGORIES);
  const [category, setCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const defaultForm = { id: '', name: '', sku: '', category: CATEGORIES[1], buyPrice: '', sellPrice: '', stock: '', unit: 'Pcs', image: '' };
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedProducts = JSON.parse(localStorage.getItem('haxone_products') || '[]');
        setProducts(storedProducts);

        const custom = JSON.parse(localStorage.getItem('haxone_product_categories') || '[]');
        if (custom.length > 0) {
          setCategories(prev => Array.from(new Set([...prev, ...custom])));
        }
      } catch(e) {}
    }
  }, []);

  const handleSaveProduct = () => {
    if (!form.name || !form.buyPrice || !form.sellPrice || !form.stock) {
      alert('Please fill out all required fields.');
      return;
    }

    let updatedCats = categories;
    if (form.category && !categories.includes(form.category) && form.category !== 'All') {
      updatedCats = [...categories, form.category];
      setCategories(updatedCats);
      try {
        const customOnly = updatedCats.filter(c => !CATEGORIES.includes(c));
        localStorage.setItem('haxone_product_categories', JSON.stringify(customOnly));
      } catch(e) {}
    }

    let updatedProducts;
    if (isEditing) {
      updatedProducts = products.map(p => p.id === form.id ? form : p);
    } else {
      const newProduct = {
        ...form,
        id: `PRD-${Math.floor(Math.random() * 100000)}`,
        buyPrice: Number(form.buyPrice),
        sellPrice: Number(form.sellPrice),
        stock: Number(form.stock)
      };
      updatedProducts = [newProduct, ...products];
    }

    setProducts(updatedProducts);
    if (typeof window !== 'undefined') {
      localStorage.setItem('haxone_products', JSON.stringify(updatedProducts));
    }
    
    setShowModal(false);
    setForm(defaultForm);
    setIsEditing(false);
  };

  const handleEdit = (product: any) => {
    setForm(product);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('haxone_products', JSON.stringify(updated));
      }
    }
  };

  const openNewProductModal = () => {
    setForm(defaultForm);
    setIsEditing(false);
    setShowModal(true);
  };

  
  const handleExportCSV = () => {
    const headers = ['id', 'name', 'sku', 'category', 'buyPrice', 'sellPrice', 'stock', 'minStock', 'unit'];
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    products.forEach(p => {
      const row = headers.map(h => `"${(p[h] || '').toString().replace(/"/g, '""')}"`);
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haxone_products_template_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const newProducts = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
          const prod: any = {};
          headers.forEach((h, index) => {
            prod[h] = values[index];
          });
          
          if (prod.name) {
            newProducts.push({
              id: prod.id || `PRD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
              name: prod.name,
              sku: prod.sku || '',
              category: prod.category || 'General',
              buyPrice: Number(prod.buyPrice) || 0,
              sellPrice: Number(prod.sellPrice) || 0,
              stock: Number(prod.stock) || 0,
              minStock: Number(prod.minStock) || 5,
              unit: prod.unit || 'pcs'
            });
          }
        }
        
        if (newProducts.length > 0) {
          if(confirm(`Found ${newProducts.length} valid products in CSV. Import them now?`)) {
            const updated = [...products, ...newProducts];
            setProducts(updated);
            if (typeof window !== 'undefined') localStorage.setItem('haxone_products', JSON.stringify(updated));
            alert('Products imported successfully!');
          }
        } else {
          alert('No valid products found in CSV. Please check the format.');
        }
      } catch (err) {
        alert('Error parsing CSV file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };
\n  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  const total = products.length;
  const active = products.filter(p => p.stock > 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6">
      
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0D1117]">Products</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your product catalogue</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleExportCSV} className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
              <Download size={16} /> CSV Template
            </button>
            <div className="relative">
              <input type="file" accept=".csv" id="csvUpload" className="hidden" onChange={handleImportCSV} />
              <button onClick={() => document.getElementById('csvUpload')?.click()} className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
                <Upload size={16} /> Import CSV
              </button>
            </div>
            <button onClick={openNewProductModal} className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>


      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Products', value: total, icon: <Package size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active', value: active, icon: <CheckCircle size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Low Stock', value: lowStock, icon: <TrendingDown size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Out of Stock', value: outOfStock, icon: <AlertTriangle size={20} />, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${s.bg} ${s.color} p-2.5 rounded-lg`}>{s.icon}</div>
            </div>
            <div className="text-2xl font-bold text-[#0D1117]">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products or SKU…" className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2563EB] bg-white">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                {['Product', 'SKU', 'Category', 'Buy Price', 'Sell Price', 'Margin', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">No products found. Create one to get started.</td>
                </tr>
              ) : filtered.map(p => {
                const margin = Math.round(((p.sellPrice - p.buyPrice) / p.buyPrice) * 100) || 0;
                return (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-[#0D1117]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 font-mono text-xs">{p.sku}</td>
                    <td className="px-4 py-3.5 text-gray-500">{p.category}</td>
                    <td className="px-4 py-3.5 font-medium text-[#0D1117]">KES {p.buyPrice}</td>
                    <td className="px-4 py-3.5 font-semibold text-[#0D1117]">KES {p.sellPrice}</td>
                    <td className="px-4 py-3.5 font-semibold text-emerald-600">+{margin}%</td>
                    <td className="px-4 py-3.5 font-semibold text-[#0D1117]">{p.stock} {p.unit}</td>
                    <td className="px-4 py-3.5"><StatusBadge stock={p.stock} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-blue-50 hover:text-blue-600 text-gray-400 rounded-lg transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500">Showing {filtered.length} of {products.length} products</div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#0D1117]">Add New Product</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Product Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Unga Hostess 2kg" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">SKU</label>
                  <input value={form.sku} onChange={e => setForm(f => ({...f, sku: e.target.value}))} placeholder="UNG-001" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Category <span className="text-gray-400 font-normal">(type to add new)</span></label>
                  <input
                    list="product-categories"
                    value={form.category}
                    onChange={e => setForm(f => ({...f, category: e.target.value}))}
                    placeholder="e.g. Beverages, Dairy..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]"
                  />
                  <datalist id="product-categories">
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Buying Price (KES)</label>
                  <input type="number" value={form.buyPrice} onChange={e => setForm(f => ({...f, buyPrice: e.target.value}))} placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Selling Price (KES)</label>
                  <input type="number" value={form.sellPrice} onChange={e => setForm(f => ({...f, sellPrice: e.target.value}))} placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Opening Stock Qty</label>
                  <input type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Unit</label>
                  <select value={form.unit} onChange={e => setForm(f => ({...f, unit: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB] bg-white">
                    {['Pcs','Kg','Litres','Bag','Box','Carton','Pack','Bottle','Bar','Roll'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSaveProduct} className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">Add Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
