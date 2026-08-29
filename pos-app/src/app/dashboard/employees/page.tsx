'use client';

import { useState, useEffect } from 'react';
import { Users, UserCheck, Plus, Search, MoreVertical, Edit2, Trash2, X, Eye, EyeOff, Shield } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  branch: string;
  status: 'Active' | 'Inactive';
  pin: string;
  initials: string;
  color: string;
  permissions?: string[];
}

const MODULES = [
  'POS Terminal', 'Sales History', 'Products', 'Inventory', 
  'Customers', 'Suppliers', 'Expenses', 'Reports', 'Settings', 'Employees'
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeStore, setActiveStore] = useState<any>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('haxone_employees') || '[]');
      setEmployees(stored);
      
      const store = JSON.parse(localStorage.getItem('haxone_active_store') || 'null');
      setActiveStore(store);
    }
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '', role: 'Cashier', phone: '', email: '', branch: '', status: 'Active', pin: '', permissions: []
  });
  const [showPin, setShowPin] = useState(false);

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleSave = () => {
    if (!formData.name || !formData.pin || formData.pin.length !== 4) {
      alert("Name and a 4-digit PIN are required.");
      return;
    }

    let updatedList;
    if (editingId) {
      updatedList = employees.map(emp => 
        emp.id === editingId ? { ...emp, ...formData } as Employee : emp
      );
    } else {
      const newEmployee: Employee = {
        ...(formData as Employee),
        id: `EMP-${Math.floor(Math.random()*10000)}`,
        initials: getInitials(formData.name || ''),
        color: ['#2563EB', '#7C3AED', '#10B981', '#F59E0B'][Math.floor(Math.random() * 4)],
        branch: formData.branch || (activeStore ? activeStore.location : 'Main Branch')
      };
      updatedList = [newEmployee, ...employees];
    }

    setEmployees(updatedList);
    if (typeof window !== 'undefined') localStorage.setItem('haxone_employees', JSON.stringify(updatedList));
    
    setShowAddModal(false);
    setEditingId(null);
    setFormData({ name: '', role: 'Cashier', phone: '', email: '', branch: '', status: 'Active', pin: '', permissions: [] });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this employee?")) {
      const updatedList = employees.filter(e => e.id !== id);
      setEmployees(updatedList);
      if (typeof window !== 'undefined') localStorage.setItem('haxone_employees', JSON.stringify(updatedList));
    }
  };

  const openEdit = (emp: Employee) => {
    setFormData(emp);
    setEditingId(emp.id);
    setShowAddModal(true);
  };

  const togglePermission = (mod: string) => {
    const current = formData.permissions || [];
    if (current.includes(mod)) {
      setFormData({ ...formData, permissions: current.filter(m => m !== mod) });
    } else {
      setFormData({ ...formData, permissions: [...current, mod] });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">Staff & Users</h1>
          <p className="text-sm text-gray-500 mt-1">Manage POS access, PIN codes, and permissions.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', role: 'Cashier', phone: '', email: '', branch: '', status: 'Active', pin: '', permissions: [] });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-[#2563EB]" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Total Staff</div>
            <div className="text-2xl font-bold text-[#0D1117]">{employees.length}</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-[#10B981]" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Active Now</div>
            <div className="text-2xl font-bold text-[#0D1117]">{employees.filter(e => e.status === 'Active').length}</div>
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Employee</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Role & Branch</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">PIN Code</th>
                <th className="text-right px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                        style={{ backgroundColor: emp.color }}
                      >
                        {emp.initials}
                      </div>
                      <div>
                        <div className="font-bold text-[#0D1117]">{emp.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{emp.phone || emp.email || 'No contact info'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-700">{emp.role}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{emp.branch}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      emp.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                     <span className="font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                       {emp.pin ? '****' : 'Not Set'}
                     </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(emp)} className="p-1.5 text-gray-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(emp.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-[#0D1117]">{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-6 py-5 space-y-6">
              {/* Profile Details */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><UserCheck className="w-4 h-4" /> Profile Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name *</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Role *</label>
                    <select 
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]"
                    >
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Cashier</option>
                      <option>Stock Clerk</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Branch</label>
                    <input 
                      type="text" 
                      value={formData.branch}
                      placeholder={activeStore ? activeStore.location : "Main Branch"}
                      onChange={e => setFormData({...formData, branch: e.target.value})}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              </div>

              {/* Login Credentials */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><Shield className="w-4 h-4" /> POS Login Credentials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">4-Digit PIN Code *</label>
                    <div className="relative">
                      <input 
                        type={showPin ? "text" : "password"} 
                        maxLength={4}
                        value={formData.pin}
                        onChange={e => setFormData({...formData, pin: e.target.value.replace(/\D/g, '')})}
                        placeholder="e.g. 1234"
                        className="w-full bg-white border border-gray-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:border-[#2563EB] font-mono tracking-widest"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Used to fast-switch accounts on the POS terminal.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as any})}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Access Rights */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Allowed Modules & Rights</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MODULES.map(mod => {
                    const isChecked = formData.permissions?.includes(mod);
                    return (
                      <label key={mod} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked ? 'border-[#2563EB] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          isChecked ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-white border-gray-300'
                        }`}>
                          {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`text-sm font-medium ${isChecked ? 'text-[#2563EB]' : 'text-gray-600'}`}>{mod}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white rounded-b-2xl">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                {editingId ? 'Save Changes' : 'Add Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
