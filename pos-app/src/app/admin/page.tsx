"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Search, Store, Key, ShieldAlert, Activity, Users, FileText, CheckCircle2 } from "lucide-react";

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<'licenses' | 'stores' | 'audit'>('licenses');
  const [licenses, setLicenses] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Security Lock
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Edit Store Modal State
  const [editingStore, setEditingStore] = useState<any>(null);

  // Default Seed Data
  const defaultStores = [
    { id: 'ST-001', name: 'Sunrise Supermarket', owner: 'John Kamau', plan: 'Professional', status: 'Active', joined: '2026-08-15' },
    { id: 'ST-002', name: 'QuickMart Westlands', owner: 'Sarah Wanjiku', plan: 'Enterprise', status: 'Active', joined: '2026-08-20' },
    { id: 'ST-003', name: 'Mama Ntilie Food', owner: 'Fatuma Hassan', plan: 'Starter', status: 'Suspended', joined: '2026-07-10' },
  ];

  const defaultLogs = [
    { id: 'LOG-891', store: 'System', action: 'Super Admin Portal Initialized', user: 'System', time: new Date().toLocaleString(), severity: 'Info' },
  ];

  const fetchData = () => {
    setLoading(true);
    if (typeof window !== 'undefined') {
      try {
        const licData = JSON.parse(localStorage.getItem('haxone_licenses') || '[]');
        setLicenses(licData);

        let storeData = JSON.parse(localStorage.getItem('haxone_stores') || 'null');
        if (!storeData) {
          storeData = defaultStores;
          localStorage.setItem('haxone_stores', JSON.stringify(storeData));
        }
        setStores(storeData);

        let logData = JSON.parse(localStorage.getItem('haxone_audit_logs') || 'null');
        if (!logData) {
          logData = defaultLogs;
          localStorage.setItem('haxone_audit_logs', JSON.stringify(logData));
        }
        setAuditLogs(logData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('haxone_admin_auth');
      if (auth === 'true') setIsLocked(false);
    }
    fetchData();
  }, []);

  const addAuditLog = (action: string, store: string, severity: 'Info'|'Warning'|'High') => {
    const newLog = {
      id: `LOG-${Math.floor(Math.random() * 10000)}`,
      store,
      action,
      user: 'Super Admin',
      time: new Date().toLocaleString(),
      severity
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('haxone_audit_logs', JSON.stringify(updated));
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '6464') {
      setIsLocked(false);
      setPinError(false);
      addAuditLog('Admin Login Successful', 'System', 'Info');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('haxone_admin_auth', 'true');
      }
    } else {
      setPinError(true);
      setPin('');
      addAuditLog('Failed Admin Login Attempt', 'System', 'Warning');
    }
  };

  // --- LICENSE OPERATIONS ---
  const generateLicense = () => {
    const code = "HAX-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    try {
      const newLicense = { id: code, status: "active", createdAt: new Date().toISOString(), usedBy: null };
      const updated = [newLicense, ...licenses];
      setLicenses(updated);
      if (typeof window !== 'undefined') localStorage.setItem('haxone_licenses', JSON.stringify(updated));
      addAuditLog(`Generated License ${code}`, 'System', 'Info');
    } catch (err) { alert("Failed to generate license."); }
  };

  const deleteLicense = (id: string) => {
    if (confirm(`Are you sure you want to delete license ${id}?`)) {
      const updated = licenses.filter(l => l.id !== id);
      setLicenses(updated);
      if (typeof window !== 'undefined') localStorage.setItem('haxone_licenses', JSON.stringify(updated));
      addAuditLog(`Deleted License ${id}`, 'System', 'Warning');
    }
  };

  // --- STORE OPERATIONS ---
  const saveStoreEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = stores.map(s => s.id === editingStore.id ? editingStore : s);
    setStores(updated);
    if (typeof window !== 'undefined') localStorage.setItem('haxone_stores', JSON.stringify(updated));
    addAuditLog(`Edited Store details for ${editingStore.name}`, editingStore.name, 'Info');
    setEditingStore(null);
  };

  const toggleStoreStatus = (id: string) => {
    const store = stores.find(s => s.id === id);
    const newStatus = store.status === 'Active' ? 'Suspended' : 'Active';
    if (confirm(`Are you sure you want to change ${store.name}'s status to ${newStatus}?`)) {
      const updated = stores.map(s => s.id === id ? { ...s, status: newStatus } : s);
      setStores(updated);
      if (typeof window !== 'undefined') localStorage.setItem('haxone_stores', JSON.stringify(updated));
      addAuditLog(`Changed status to ${newStatus}`, store.name, newStatus === 'Suspended' ? 'Warning' : 'Info');
    }
  };

  const deleteStore = (id: string) => {
    const store = stores.find(s => s.id === id);
    if (confirm(`CRITICAL: Are you sure you want to completely delete ${store.name}? This cannot be undone.`)) {
      const updated = stores.filter(s => s.id !== id);
      setStores(updated);
      if (typeof window !== 'undefined') localStorage.setItem('haxone_stores', JSON.stringify(updated));
      addAuditLog(`Deleted Store ${store.name}`, store.name, 'High');
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center font-sans">
        <form onSubmit={handlePinSubmit} className="bg-[#161B22] p-8 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-[#3B82F6]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Portal</h2>
          <p className="text-gray-400 text-sm mb-8">Enter security PIN to access the dashboard.</p>
          
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            maxLength={4}
            className={`w-full bg-[#0D1117] border ${pinError ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-4 text-center text-3xl font-mono text-white tracking-[1em] focus:outline-none focus:border-[#3B82F6] transition-colors mb-4`}
            autoFocus
          />
          {pinError && <p className="text-red-400 text-sm mb-4">Incorrect PIN. Try again.</p>}
          
          <Button type="submit" className="w-full h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20">
            Unlock Dashboard
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col font-sans">
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0D1117] shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Logo lightText className="h-8" />
          <div className="h-6 w-px bg-white/20"></div>
          <span className="font-bold text-sm text-gray-300 tracking-wide uppercase">Super Admin Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { sessionStorage.removeItem('haxone_admin_auth'); setIsLocked(true); }} className="text-sm text-gray-400 hover:text-white mr-4">Lock</button>
          <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center font-bold text-sm">SA</div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 bg-[#0D1117] p-4 flex flex-col gap-2 shrink-0">
          <button 
            onClick={() => setActiveTab('licenses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'licenses' ? 'bg-[#2563EB] text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Key className="w-4 h-4" /> Licenses
          </button>
          <button 
            onClick={() => setActiveTab('stores')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'stores' ? 'bg-[#2563EB] text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Store className="w-4 h-4" /> Registered Stores
          </button>
          <button 
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'audit' ? 'bg-[#2563EB] text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <ShieldAlert className="w-4 h-4" /> Audit Logs
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#161B22] overflow-y-auto p-8 relative">
          
          {activeTab === 'licenses' && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Activation Licenses</h2>
                  <p className="text-gray-400 text-sm mt-1">Generate and manage offline activation codes for tenants.</p>
                </div>
                <Button onClick={generateLicense} className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold h-11 px-6 rounded-lg">
                  <Key className="w-4 h-4 mr-2" /> Generate New License
                </Button>
              </div>

              <div className="bg-[#0D1117] rounded-xl border border-white/10 overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-gray-500">Loading licenses...</div>
                ) : licenses.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                    <Key className="w-12 h-12 mb-4 opacity-20" />
                    <p>No licenses generated yet.</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-[#161B22] text-xs uppercase text-gray-400 font-bold border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4">License Key</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Created Date</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {licenses.map((lic) => (
                        <tr key={lic.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-lg tracking-wider text-[#3B82F6]">{lic.id}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${lic.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                              {lic.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {new Date(lic.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => deleteLicense(lic.id)} className="text-red-400 hover:text-red-300 text-sm font-bold px-3 py-1 bg-red-500/10 rounded-lg">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stores' && (
            <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Registered Stores</h2>
                  <p className="text-gray-400 text-sm mt-1">Manage all SaaS tenants and stores across the platform.</p>
                </div>
              </div>

              <div className="bg-[#0D1117] rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#161B22] text-xs uppercase text-gray-400 font-bold border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4">Store Name</th>
                      <th className="px-6 py-4">Owner</th>
                      <th className="px-6 py-4">Plan</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stores.map((store) => (
                      <tr key={store.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold text-white">{store.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{store.owner}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-[#3B82F6] bg-blue-500/10 px-2.5 py-1 rounded-md">{store.plan}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${store.status === 'Active' ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                            {store.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                          <button onClick={() => setEditingStore(store)} className="text-gray-300 hover:text-white text-xs font-bold px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">Edit</button>
                          <button onClick={() => toggleStoreStatus(store.id)} className={`${store.status === 'Active' ? 'text-orange-400 bg-orange-500/10 hover:bg-orange-500/20' : 'text-green-400 bg-green-500/10 hover:bg-green-500/20'} text-xs font-bold px-3 py-1.5 rounded-lg transition-colors`}>
                            {store.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button onClick={() => deleteStore(store.id)} className="text-red-400 bg-red-500/10 hover:bg-red-500/20 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold">System Audit Logs</h2>
                  <p className="text-gray-400 text-sm mt-1">Track high-privilege actions across all POS clients.</p>
                </div>
              </div>

              <div className="space-y-4">
                {auditLogs.map(log => (
                  <div key={log.id} className="bg-[#0D1117] p-5 rounded-xl border border-white/10 flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${log.severity === 'High' ? 'bg-red-500/20 text-red-400' : log.severity === 'Warning' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {log.severity === 'High' ? <ShieldAlert className="w-5 h-5" /> : log.severity === 'Warning' ? <Activity className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{log.action}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1"><Store className="w-3.5 h-3.5" /> {log.store}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {log.user}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                      {log.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit Store Modal */}
          {editingStore && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-[#161B22] rounded-2xl border border-white/10 w-full max-w-md shadow-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Edit Store</h3>
                <form onSubmit={saveStoreEdit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Store Name</label>
                    <input required type="text" value={editingStore.name} onChange={e => setEditingStore({...editingStore, name: e.target.value})} className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Owner Name</label>
                    <input required type="text" value={editingStore.owner} onChange={e => setEditingStore({...editingStore, owner: e.target.value})} className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Plan</label>
                    <select value={editingStore.plan} onChange={e => setEditingStore({...editingStore, plan: e.target.value})} className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]">
                      <option>Starter</option>
                      <option>Professional</option>
                      <option>Enterprise</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setEditingStore(null)} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white bg-white/5 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1d4ed8] rounded-lg">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
