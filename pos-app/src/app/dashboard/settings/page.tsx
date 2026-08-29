'use client';
import { useState, useEffect } from 'react';
import { Settings, Store, Shield, Crown, Save, Globe, EyeOff, Eye, CheckCircle, Database } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Active Contexts
  const [activeStore, setActiveStore] = useState<any>(null);
  const [activeUser, setActiveUser] = useState<any>(null);

  // General Form
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [taxRate, setTaxRate] = useState(16);
  
  // Store Form
  const [receiptFooter, setReceiptFooter] = useState('Thank you for shopping with us!');
  const [loyaltyPoints, setLoyaltyPoints] = useState(false);
  const [autoDiscounts, setAutoDiscounts] = useState(false);
  const [emailReceipts, setEmailReceipts] = useState(false);

  // Security Form
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const store = JSON.parse(localStorage.getItem('haxone_active_store') || 'null');
      const user = JSON.parse(localStorage.getItem('haxone_active_user') || 'null');
      if (store) {
        setActiveStore(store);
        setBusinessName(store.name || '');
        setEmail(store.email || '');
        setPhone(store.phone || '');
        setTaxRate(store.taxRate !== undefined ? store.taxRate : 16);
        setReceiptFooter(store.receiptFooter || 'Thank you for shopping with us!');
        setLoyaltyPoints(store.features?.loyaltyPoints || false);
        setAutoDiscounts(store.features?.autoDiscounts || false);
        setEmailReceipts(store.features?.emailReceipts || false);
      }
      if (user) {
        setActiveUser(user);
      }
    }
  }, []);

  const handleSaveGeneral = () => {
    if (activeStore && typeof window !== 'undefined') {
      const updatedStore = {
        ...activeStore,
        name: businessName,
        email,
        phone,
        taxRate,
        receiptFooter,
        features: { loyaltyPoints, autoDiscounts, emailReceipts }
      };
      
      localStorage.setItem('haxone_active_store', JSON.stringify(updatedStore));
      
      const stores = JSON.parse(localStorage.getItem('haxone_stores') || '[]');
      const updatedStores = stores.map((s:any) => s.id === updatedStore.id ? updatedStore : s);
      localStorage.setItem('haxone_stores', JSON.stringify(updatedStores));
      
      setActiveStore(updatedStore);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleUpdatePin = () => {
    if (!activeUser) return;
    if (currentPin !== activeUser.pin) {
      alert("Current PIN is incorrect!");
      return;
    }
    if (newPin.length !== 4) {
      alert("New PIN must be exactly 4 digits.");
      return;
    }
    
    if (typeof window !== 'undefined') {
      const updatedUser = { ...activeUser, pin: newPin };
      localStorage.setItem('haxone_active_user', JSON.stringify(updatedUser));
      
      const employees = JSON.parse(localStorage.getItem('haxone_employees') || '[]');
      const updatedEmployees = employees.map((e:any) => e.id === updatedUser.id ? updatedUser : e);
      localStorage.setItem('haxone_employees', JSON.stringify(updatedEmployees));
      
      alert("PIN updated successfully! Please log in again.");
      localStorage.removeItem('haxone_active_user');
      window.location.href = '/login';
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'store', label: 'Store Features', icon: Store },
    { id: 'security', label: 'Security (PIN)', icon: Shield },
    { id: 'data', label: 'Data Backup & Restore', icon: Database },
    { id: 'subscription', label: 'Subscription', icon: Crown },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D1117]">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your business configuration and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-1 flex-shrink-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20' 
                    : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-[#0D1117]'
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="p-6 md:p-8 space-y-8">
              <div>
                <h2 className="text-lg font-bold text-[#0D1117] mb-4">Business Information</h2>
                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Name</label>
                    <input value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Email</label>
                      <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-lg font-bold text-[#0D1117] mb-4">Tax Configuration</h2>
                <div className="max-w-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Default VAT / Tax Rate (%)</label>
                  <input type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                  <p className="text-xs text-gray-500 mt-2">Enter 0 to disable tax calculation on the POS terminal.</p>
                </div>
              </div>
            </div>
          )}

          {/* Store Tab */}
          {activeTab === 'store' && (
            <div className="p-6 md:p-8 space-y-8">
              <div>
                <h2 className="text-lg font-bold text-[#0D1117] mb-4">Receipt Settings</h2>
                <div className="max-w-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Receipt Footer Message</label>
                    <textarea value={receiptFooter} onChange={e => setReceiptFooter(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] resize-none" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-lg font-bold text-[#0D1117] mb-4">Features</h2>
                <div className="space-y-3 max-w-lg">
                  <label className="flex items-center justify-between p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">Loyalty Points Program</div>
                      <div className="text-xs text-gray-500">Award points on purchases</div>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors relative ${loyaltyPoints ? 'bg-[#2563EB]' : 'bg-gray-200'}`} onClick={() => setLoyaltyPoints(!loyaltyPoints)}>
                      <div className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${loyaltyPoints ? 'right-1' : 'left-1'}`} />
                    </div>
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">Automatic Discounts</div>
                      <div className="text-xs text-gray-500">Apply bulk discounts automatically</div>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors relative ${autoDiscounts ? 'bg-[#2563EB]' : 'bg-gray-200'}`} onClick={() => setAutoDiscounts(!autoDiscounts)}>
                      <div className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${autoDiscounts ? 'right-1' : 'left-1'}`} />
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">Email Receipts</div>
                      <div className="text-xs text-gray-500">Allow emailing receipts to customers</div>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors relative ${emailReceipts ? 'bg-[#2563EB]' : 'bg-gray-200'}`} onClick={() => setEmailReceipts(!emailReceipts)}>
                      <div className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${emailReceipts ? 'right-1' : 'left-1'}`} />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6 md:p-8">
              <h2 className="text-lg font-bold text-[#0D1117] mb-2">Update Login PIN</h2>
              <p className="text-sm text-gray-500 mb-6">Change your 4-digit PIN for the POS terminal.</p>
              
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Current PIN</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} maxLength={4} value={currentPin} onChange={e => setCurrentPin(e.target.value.replace(/\D/g, ''))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                    <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New PIN</label>
                  <input type="password" maxLength={4} value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                </div>
                <button onClick={handleUpdatePin} className="w-full py-2.5 bg-[#0D1117] hover:bg-black text-white rounded-lg text-sm font-bold mt-2">
                  Update PIN & Relogin
                </button>
              </div>
            </div>
          )}
          {/* Data Backup & Restore Tab */}
          {activeTab === 'data' && (
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-[#0D1117] mb-2">Data Management</h3>
              <p className="text-sm text-gray-500 mb-6">Since this app runs offline in your browser, you should periodically backup your data. You can also export your data to transfer it to a different device or browser.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Save size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Export All Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Download a full backup file containing your products, sales, customers, inventory movements, and settings.</p>
                  <button 
                    onClick={() => {
                      const allData: Record<string, any> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('haxone_')) {
                          allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
                        }
                      }
                      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `haxone_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Download Backup File
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Database size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Restore Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Upload a previously exported backup file. Warning: This will overwrite all existing data on this device.</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".json"
                      id="backupUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm('WARNING: This will overwrite all current local data with the backup file. Are you sure you want to proceed?')) return;
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            for (const key in data) {
                              if (key.startsWith('haxone_')) {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                              }
                            }
                            alert('Data successfully restored! The app will now reload.');
                            window.location.reload();
                          } catch (err) {
                            alert('Invalid backup file. Restoration failed.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <button 
                      onClick={() => document.getElementById('backupUpload')?.click()}
                      className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Upload Backup File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Data Backup & Restore Tab */}
          {activeTab === 'data' && (
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-[#0D1117] mb-2">Data Management</h3>
              <p className="text-sm text-gray-500 mb-6">Since this app runs offline in your browser, you should periodically backup your data. You can also export your data to transfer it to a different device or browser.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Save size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Export All Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Download a full backup file containing your products, sales, customers, inventory movements, and settings.</p>
                  <button 
                    onClick={() => {
                      const allData: Record<string, any> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('haxone_')) {
                          allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
                        }
                      }
                      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `haxone_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Download Backup File
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Database size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Restore Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Upload a previously exported backup file. Warning: This will overwrite all existing data on this device.</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".json"
                      id="backupUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm('WARNING: This will overwrite all current local data with the backup file. Are you sure you want to proceed?')) return;
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            for (const key in data) {
                              if (key.startsWith('haxone_')) {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                              }
                            }
                            alert('Data successfully restored! The app will now reload.');
                            window.location.reload();
                          } catch (err) {
                            alert('Invalid backup file. Restoration failed.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <button 
                      onClick={() => document.getElementById('backupUpload')?.click()}
                      className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Upload Backup File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Data Backup & Restore Tab */}
          {activeTab === 'data' && (
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-[#0D1117] mb-2">Data Management</h3>
              <p className="text-sm text-gray-500 mb-6">Since this app runs offline in your browser, you should periodically backup your data. You can also export your data to transfer it to a different device or browser.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Save size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Export All Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Download a full backup file containing your products, sales, customers, inventory movements, and settings.</p>
                  <button 
                    onClick={() => {
                      const allData: Record<string, any> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('haxone_')) {
                          allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
                        }
                      }
                      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `haxone_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Download Backup File
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Database size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Restore Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Upload a previously exported backup file. Warning: This will overwrite all existing data on this device.</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".json"
                      id="backupUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm('WARNING: This will overwrite all current local data with the backup file. Are you sure you want to proceed?')) return;
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            for (const key in data) {
                              if (key.startsWith('haxone_')) {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                              }
                            }
                            alert('Data successfully restored! The app will now reload.');
                            window.location.reload();
                          } catch (err) {
                            alert('Invalid backup file. Restoration failed.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <button 
                      onClick={() => document.getElementById('backupUpload')?.click()}
                      className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Upload Backup File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

 
          {/* Data Backup & Restore Tab */}
          {activeTab === 'data' && (
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-[#0D1117] mb-2">Data Management</h3>
              <p className="text-sm text-gray-500 mb-6">Since this app runs offline in your browser, you should periodically backup your data. You can also export your data to transfer it to a different device or browser.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Save size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Export All Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Download a full backup file containing your products, sales, customers, inventory movements, and settings.</p>
                  <button 
                    onClick={() => {
                      const allData: Record<string, any> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('haxone_')) {
                          allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
                        }
                      }
                      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `haxone_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Download Backup File
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Database size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Restore Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Upload a previously exported backup file. Warning: This will overwrite all existing data on this device.</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".json"
                      id="backupUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm('WARNING: This will overwrite all current local data with the backup file. Are you sure you want to proceed?')) return;
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            for (const key in data) {
                              if (key.startsWith('haxone_')) {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                              }
                            }
                            alert('Data successfully restored! The app will now reload.');
                            window.location.reload();
                          } catch (err) {
                            alert('Invalid backup file. Restoration failed.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <button 
                      onClick={() => document.getElementById('backupUpload')?.click()}
                      className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Upload Backup File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

 
          {/* Data Backup & Restore Tab */}
          {activeTab === 'data' && (
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-[#0D1117] mb-2">Data Management</h3>
              <p className="text-sm text-gray-500 mb-6">Since this app runs offline in your browser, you should periodically backup your data. You can also export your data to transfer it to a different device or browser.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Save size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Export All Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Download a full backup file containing your products, sales, customers, inventory movements, and settings.</p>
                  <button 
                    onClick={() => {
                      const allData: Record<string, any> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('haxone_')) {
                          allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
                        }
                      }
                      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `haxone_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Download Backup File
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Database size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Restore Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Upload a previously exported backup file. Warning: This will overwrite all existing data on this device.</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".json"
                      id="backupUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm('WARNING: This will overwrite all current local data with the backup file. Are you sure you want to proceed?')) return;
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            for (const key in data) {
                              if (key.startsWith('haxone_')) {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                              }
                            }
                            alert('Data successfully restored! The app will now reload.');
                            window.location.reload();
                          } catch (err) {
                            alert('Invalid backup file. Restoration failed.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <button 
                      onClick={() => document.getElementById('backupUpload')?.click()}
                      className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Upload Backup File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

 
          {/* Data Backup & Restore Tab */}
          {activeTab === 'data' && (
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-[#0D1117] mb-2">Data Management</h3>
              <p className="text-sm text-gray-500 mb-6">Since this app runs offline in your browser, you should periodically backup your data. You can also export your data to transfer it to a different device or browser.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Save size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Export All Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Download a full backup file containing your products, sales, customers, inventory movements, and settings.</p>
                  <button 
                    onClick={() => {
                      const allData: Record<string, any> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('haxone_')) {
                          allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
                        }
                      }
                      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `haxone_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Download Backup File
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Database size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Restore Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Upload a previously exported backup file. Warning: This will overwrite all existing data on this device.</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".json"
                      id="backupUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm('WARNING: This will overwrite all current local data with the backup file. Are you sure you want to proceed?')) return;
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            for (const key in data) {
                              if (key.startsWith('haxone_')) {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                              }
                            }
                            alert('Data successfully restored! The app will now reload.');
                            window.location.reload();
                          } catch (err) {
                            alert('Invalid backup file. Restoration failed.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <button 
                      onClick={() => document.getElementById('backupUpload')?.click()}
                      className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Upload Backup File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

 
          {/* Data Backup & Restore Tab */}
          {activeTab === 'data' && (
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-[#0D1117] mb-2">Data Management</h3>
              <p className="text-sm text-gray-500 mb-6">Since this app runs offline in your browser, you should periodically backup your data. You can also export your data to transfer it to a different device or browser.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Save size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Export All Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Download a full backup file containing your products, sales, customers, inventory movements, and settings.</p>
                  <button 
                    onClick={() => {
                      const allData: Record<string, any> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('haxone_')) {
                          allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
                        }
                      }
                      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `haxone_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Download Backup File
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Database size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Restore Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Upload a previously exported backup file. Warning: This will overwrite all existing data on this device.</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".json"
                      id="backupUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm('WARNING: This will overwrite all current local data with the backup file. Are you sure you want to proceed?')) return;
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            for (const key in data) {
                              if (key.startsWith('haxone_')) {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                              }
                            }
                            alert('Data successfully restored! The app will now reload.');
                            window.location.reload();
                          } catch (err) {
                            alert('Invalid backup file. Restoration failed.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <button 
                      onClick={() => document.getElementById('backupUpload')?.click()}
                      className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Upload Backup File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

 
          {/* Data Backup & Restore Tab */}
          {activeTab === 'data' && (
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-[#0D1117] mb-2">Data Management</h3>
              <p className="text-sm text-gray-500 mb-6">Since this app runs offline in your browser, you should periodically backup your data. You can also export your data to transfer it to a different device or browser.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Save size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Export All Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Download a full backup file containing your products, sales, customers, inventory movements, and settings.</p>
                  <button 
                    onClick={() => {
                      const allData: Record<string, any> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('haxone_')) {
                          allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
                        }
                      }
                      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `haxone_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Download Backup File
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Database size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Restore Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Upload a previously exported backup file. Warning: This will overwrite all existing data on this device.</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".json"
                      id="backupUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm('WARNING: This will overwrite all current local data with the backup file. Are you sure you want to proceed?')) return;
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            for (const key in data) {
                              if (key.startsWith('haxone_')) {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                              }
                            }
                            alert('Data successfully restored! The app will now reload.');
                            window.location.reload();
                          } catch (err) {
                            alert('Invalid backup file. Restoration failed.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <button 
                      onClick={() => document.getElementById('backupUpload')?.click()}
                      className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Upload Backup File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

 
          {/* Data Backup & Restore Tab */}
          {activeTab === 'data' && (
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-[#0D1117] mb-2">Data Management</h3>
              <p className="text-sm text-gray-500 mb-6">Since this app runs offline in your browser, you should periodically backup your data. You can also export your data to transfer it to a different device or browser.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Save size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Export All Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Download a full backup file containing your products, sales, customers, inventory movements, and settings.</p>
                  <button 
                    onClick={() => {
                      const allData: Record<string, any> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('haxone_')) {
                          allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
                        }
                      }
                      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `haxone_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Download Backup File
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Database size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Restore Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Upload a previously exported backup file. Warning: This will overwrite all existing data on this device.</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".json"
                      id="backupUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm('WARNING: This will overwrite all current local data with the backup file. Are you sure you want to proceed?')) return;
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            for (const key in data) {
                              if (key.startsWith('haxone_')) {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                              }
                            }
                            alert('Data successfully restored! The app will now reload.');
                            window.location.reload();
                          } catch (err) {
                            alert('Invalid backup file. Restoration failed.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <button 
                      onClick={() => document.getElementById('backupUpload')?.click()}
                      className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Upload Backup File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

 
          {/* Data Backup & Restore Tab */}
          {activeTab === 'data' && (
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-[#0D1117] mb-2">Data Management</h3>
              <p className="text-sm text-gray-500 mb-6">Since this app runs offline in your browser, you should periodically backup your data. You can also export your data to transfer it to a different device or browser.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Save size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Export All Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Download a full backup file containing your products, sales, customers, inventory movements, and settings.</p>
                  <button 
                    onClick={() => {
                      const allData: Record<string, any> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('haxone_')) {
                          allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
                        }
                      }
                      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `haxone_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Download Backup File
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Database size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Restore Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Upload a previously exported backup file. Warning: This will overwrite all existing data on this device.</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".json"
                      id="backupUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm('WARNING: This will overwrite all current local data with the backup file. Are you sure you want to proceed?')) return;
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            for (const key in data) {
                              if (key.startsWith('haxone_')) {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                              }
                            }
                            alert('Data successfully restored! The app will now reload.');
                            window.location.reload();
                          } catch (err) {
                            alert('Invalid backup file. Restoration failed.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <button 
                      onClick={() => document.getElementById('backupUpload')?.click()}
                      className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Upload Backup File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

 
          {/* Data Backup & Restore Tab */}
          {activeTab === 'data' && (
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-[#0D1117] mb-2">Data Management</h3>
              <p className="text-sm text-gray-500 mb-6">Since this app runs offline in your browser, you should periodically backup your data. You can also export your data to transfer it to a different device or browser.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Save size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Export All Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Download a full backup file containing your products, sales, customers, inventory movements, and settings.</p>
                  <button 
                    onClick={() => {
                      const allData: Record<string, any> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('haxone_')) {
                          allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
                        }
                      }
                      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `haxone_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Download Backup File
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Database size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Restore Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Upload a previously exported backup file. Warning: This will overwrite all existing data on this device.</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".json"
                      id="backupUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm('WARNING: This will overwrite all current local data with the backup file. Are you sure you want to proceed?')) return;
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            for (const key in data) {
                              if (key.startsWith('haxone_')) {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                              }
                            }
                            alert('Data successfully restored! The app will now reload.');
                            window.location.reload();
                          } catch (err) {
                            alert('Invalid backup file. Restoration failed.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <button 
                      onClick={() => document.getElementById('backupUpload')?.click()}
                      className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Upload Backup File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

 
          {/* Data Backup & Restore Tab */}
          {activeTab === 'data' && (
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-[#0D1117] mb-2">Data Management</h3>
              <p className="text-sm text-gray-500 mb-6">Since this app runs offline in your browser, you should periodically backup your data. You can also export your data to transfer it to a different device or browser.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Save size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Export All Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Download a full backup file containing your products, sales, customers, inventory movements, and settings.</p>
                  <button 
                    onClick={() => {
                      const allData: Record<string, any> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('haxone_')) {
                          allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
                        }
                      }
                      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `haxone_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Download Backup File
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Database size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Restore Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Upload a previously exported backup file. Warning: This will overwrite all existing data on this device.</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".json"
                      id="backupUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm('WARNING: This will overwrite all current local data with the backup file. Are you sure you want to proceed?')) return;
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            for (const key in data) {
                              if (key.startsWith('haxone_')) {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                              }
                            }
                            alert('Data successfully restored! The app will now reload.');
                            window.location.reload();
                          } catch (err) {
                            alert('Invalid backup file. Restoration failed.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <button 
                      onClick={() => document.getElementById('backupUpload')?.click()}
                      className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Upload Backup File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

 
          {/* Data Backup & Restore Tab */}
          {activeTab === 'data' && (
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-[#0D1117] mb-2">Data Management</h3>
              <p className="text-sm text-gray-500 mb-6">Since this app runs offline in your browser, you should periodically backup your data. You can also export your data to transfer it to a different device or browser.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Save size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Export All Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Download a full backup file containing your products, sales, customers, inventory movements, and settings.</p>
                  <button 
                    onClick={() => {
                      const allData: Record<string, any> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('haxone_')) {
                          allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
                        }
                      }
                      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `haxone_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Download Backup File
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Database size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0D1117]">Restore Data</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Upload a previously exported backup file. Warning: This will overwrite all existing data on this device.</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".json"
                      id="backupUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm('WARNING: This will overwrite all current local data with the backup file. Are you sure you want to proceed?')) return;
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            for (const key in data) {
                              if (key.startsWith('haxone_')) {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                              }
                            }
                            alert('Data successfully restored! The app will now reload.');
                            window.location.reload();
                          } catch (err) {
                            alert('Invalid backup file. Restoration failed.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                    <button 
                      onClick={() => document.getElementById('backupUpload')?.click()}
                      className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Upload Backup File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

{/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="p-6 md:p-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#0D1117] mb-1">{activeStore?.plan || 'Starter'} Plan</h2>
                  <p className="text-sm text-gray-600">Your account is active and billing is up to date.</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-1">Status</div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                    <CheckCircle className="w-4 h-4" /> Active
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#0D1117] mb-4">Billing History</h3>
                <div className="border border-gray-100 rounded-xl bg-gray-50/50 p-8 text-center">
                   <p className="text-gray-500 text-sm">You are on a new subscription. Your billing history will appear here after your first renewal.</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer for Settings */}
          {(activeTab === 'general' || activeTab === 'store') && (
            <div className="px-6 md:px-8 py-5 border-t border-gray-100 bg-gray-50/30 rounded-b-2xl flex items-center justify-end gap-4 sticky bottom-0">
              {saved && <span className="text-sm font-medium text-green-600 flex items-center gap-1.5 animate-in fade-in"><CheckCircle className="w-4 h-4" /> Settings saved!</span>}
              <button onClick={handleSaveGeneral} className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

