"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Users, Package, Settings, LogOut, TerminalSquare, Box, Truck, Receipt, Calculator, FileText, MapPin, Search, Bell, Brain, ChevronDown, Store, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useState, useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStore, setActiveStore] = useState<any>({ name: 'My Store', location: 'Main Branch' });
  const [activeUser, setActiveUser] = useState<any>({ name: 'Admin', role: 'Manager' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const store = JSON.parse(localStorage.getItem('haxone_active_store') || 'null');
      if (store) setActiveStore(store);
      
      const user = JSON.parse(localStorage.getItem('haxone_active_user') || 'null');
      if (user) setActiveUser(user);
    }
  }, []);
  
  const navSections = [
    {
      label: "Main",
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'POS Terminal', href: '/dashboard/pos', icon: TerminalSquare },
      ]
    },
    {
      label: "Business",
      items: [
        { name: 'Sales', href: '/dashboard/sales', icon: ShoppingCart },
        { name: 'Products', href: '/dashboard/products', icon: Package },
        { name: 'Inventory', href: '/dashboard/inventory', icon: Box },
        { name: 'Customers', href: '/dashboard/customers', icon: Users },
        { name: 'Suppliers', href: '/dashboard/suppliers', icon: Truck },
        { name: 'Expenses', href: '/dashboard/expenses', icon: Receipt },
      ]
    },
    {
      label: "Finance",
      items: [
        { name: 'Accounting', href: '/dashboard/accounting', icon: Calculator },
        { name: 'Reports', href: '/dashboard/reports', icon: FileText },
      ]
    },
    {
      label: "Settings",
      items: [
        { name: 'Employees', href: '/dashboard/employees', icon: Users },
        { name: 'Branches', href: '/dashboard/branches', icon: MapPin },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#0D1117] flex font-sans">
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-[260px] bg-[#0D1117] text-white flex flex-col fixed inset-y-0 z-50 overflow-y-auto transition-transform duration-300 ease-in-out print:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-16 flex items-center px-5 border-b border-white/10 flex-shrink-0 justify-between">
          <Logo lightText={true} />
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Store Switcher */}
        <div className="px-3 py-3 border-b border-white/10 flex-shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left">
            <div className="w-7 h-7 rounded-md bg-[#2563EB] flex items-center justify-center text-xs font-bold flex-shrink-0">
              {activeStore.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{activeStore.name}</div>
              <div className="text-xs text-gray-500">{activeStore.location || 'Main Branch'}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navSections.map(section => (
            <div key={section.label}>
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider px-3 mb-2">{section.label}</div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2.5 rounded-lg transition-all text-sm font-medium group ${
                        isActive 
                          ? 'bg-[#2563EB] text-white shadow-sm' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                      {item.name}
                      {item.name === 'AI Insights' && (
                        <span className="ml-auto text-xs bg-[#7C3AED] text-white px-1.5 py-0.5 rounded font-bold">NEW</span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 border-t border-white/10 flex-shrink-0 space-y-1">
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') localStorage.removeItem('haxone_active_user');
              window.location.href = '/login';
            }} 
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white cursor-pointer transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-[260px] print:ml-0 w-full overflow-x-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm print:hidden">
          
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="relative hidden md:block w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search products, customers..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <button className="relative text-gray-500 hover:text-[#0D1117] transition-colors p-2 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-2.5 cursor-pointer border-l border-gray-200 pl-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {activeUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-bold text-[#0D1117]">{activeUser.name}</div>
                <div className="text-xs text-gray-500">{activeUser.role || 'Staff'}</div>
              </div>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8 flex-1 overflow-y-auto overflow-x-hidden min-h-0 print:p-0 print:overflow-visible">
          {children}
        </div>
      </main>
    </div>
  );
}
