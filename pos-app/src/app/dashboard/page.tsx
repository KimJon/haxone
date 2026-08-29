"use client";
import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, MoreHorizontal, Database } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState({ sales: 0, transactions: 0, profit: 0, lowStock: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sales = JSON.parse(localStorage.getItem('haxone_sales') || '[]');
      const products = JSON.parse(localStorage.getItem('haxone_products') || '[]');
      
      setHasData(sales.length > 0 || products.length > 0);

      const totalSales = sales.reduce((acc: number, s: any) => acc + (s.total || 0), 0);
      const totalCost = sales.reduce((acc: number, s: any) => {
        return acc + (s.items || []).reduce((cAcc: number, item: any) => cAcc + ((item.costPrice || 0) * item.quantity), 0);
      }, 0);
      const profit = totalSales - totalCost;

      const lowStockCount = products.filter((p: any) => p.stock <= (p.minStock || 5)).length;

      setStats({
        sales: totalSales,
        transactions: sales.length,
        profit: profit,
        lowStock: lowStockCount
      });

      // Mock chart data based on real total
      if (sales.length > 0) {
        setChartData([
          { time: '6AM', sales: totalSales * 0.1 },
          { time: '9AM', sales: totalSales * 0.2 },
          { time: '12PM', sales: totalSales * 0.3 },
          { time: '3PM', sales: totalSales * 0.2 },
          { time: '6PM', sales: totalSales * 0.15 },
          { time: '9PM', sales: totalSales * 0.05 },
        ]);

        const pData = [
          { name: 'M-Pesa', value: sales.filter((s:any) => s.paymentMethod === 'M-Pesa').length || 1, color: '#2563EB' },
          { name: 'Cash', value: sales.filter((s:any) => s.paymentMethod === 'Cash').length || 1, color: '#7C3AED' },
          { name: 'Cards', value: sales.filter((s:any) => s.paymentMethod === 'Card').length || 1, color: '#F59E0B' },
        ];
        setPaymentData(pData);
      } else {
        setChartData([]);
        setPaymentData([]);
      }

      setTopProducts(products.slice(0, 5).map((p: any) => ({
        id: p.id, name: p.name, stock: `${p.stock} pcs`, sales: `KES ${p.price * 10}`, image: '📦'
      })));
    }
  }, []);

  const loadDemoData = () => {
    const demoProducts = [
      { id: '1', name: 'Coca Cola 500ml', stock: 284, minStock: 50, price: 60, costPrice: 40, category: 'Beverages' },
      { id: '2', name: 'Soko Maize Meal 2kg', stock: 192, minStock: 20, price: 200, costPrice: 150, category: 'Food' },
      { id: '3', name: 'Brookside Milk 1L', stock: 156, minStock: 30, price: 120, costPrice: 90, category: 'Dairy' },
      { id: '4', name: 'Blue Band 500g', stock: 4, minStock: 10, price: 180, costPrice: 130, category: 'Food' },
    ];
    
    const demoSales = Array.from({ length: 15 }).map((_, i) => ({
      id: `INV-${1000 + i}`,
      date: new Date().toISOString(),
      total: Math.floor(Math.random() * 5000) + 500,
      paymentMethod: ['Cash', 'M-Pesa', 'Card'][Math.floor(Math.random() * 3)],
      items: [
        { name: 'Demo Item', quantity: 2, price: 500, costPrice: 300 }
      ]
    }));

    localStorage.setItem('haxone_products', JSON.stringify(demoProducts));
    localStorage.setItem('haxone_sales', JSON.stringify(demoSales));
    window.location.reload();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          {!hasData && (
            <button 
              onClick={loadDemoData}
              className="flex items-center gap-2 bg-[#10B981] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#059669] transition-colors"
            >
              <Database className="w-4 h-4" />
              Load Demo Data
            </button>
          )}
          <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
          <div className="text-sm text-gray-500 font-medium">Total Sales</div>
          <div>
            <div className="text-2xl font-bold text-[#0D1117]">KES {stats.sales.toLocaleString()}</div>
            <div className="flex items-center text-sm mt-1 text-[#10B981] font-medium">
              <ArrowUp className="w-4 h-4 mr-1" />
              0.0% <span className="text-gray-400 ml-1 font-normal">vs yesterday</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
          <div className="text-sm text-gray-500 font-medium">Transactions</div>
          <div>
            <div className="text-2xl font-bold text-[#0D1117]">{stats.transactions.toLocaleString()}</div>
            <div className="flex items-center text-sm mt-1 text-[#10B981] font-medium">
              <ArrowUp className="w-4 h-4 mr-1" />
              0.0%
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
          <div className="text-sm text-gray-500 font-medium">Profit</div>
          <div>
            <div className="text-2xl font-bold text-[#0D1117]">KES {stats.profit.toLocaleString()}</div>
            <div className="flex items-center text-sm mt-1 text-[#10B981] font-medium">
              <ArrowUp className="w-4 h-4 mr-1" />
              0.0%
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
          <div className="text-sm text-gray-500 font-medium">Low Stock</div>
          <div>
            <div className="text-2xl font-bold text-[#EF4444]">{stats.lowStock}</div>
            <div className="flex items-center text-sm mt-1 text-[#EF4444] font-medium">
              <ArrowDown className="w-4 h-4 mr-1" />
              needs restocking
            </div>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <Database className="w-12 h-12 text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700">Your dashboard is empty</h2>
          <p className="text-gray-500 mt-2 mb-6 max-w-md">You haven't made any sales or added any products yet. Start using the POS terminal to see your metrics grow, or load demo data to see how it works.</p>
          <button 
            onClick={loadDemoData}
            className="bg-[#2563EB] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#1D4ED8]"
          >
            Populate Demo Data
          </button>
        </div>
      ) : (
        <>
          {/* Middle Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
            {/* Sales Trend Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-[#0D1117]">Sales Trend</h2>
                <div className="text-sm text-gray-500 border border-gray-200 px-3 py-1 rounded-md cursor-pointer">
                  This Week
                </div>
              </div>
              <div className="flex-1 min-h-0 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dx={-10} tickFormatter={(value) => `${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: any) => [`KES ${Number(value).toLocaleString()}`, 'Sales']}
                    />
                    <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-[#0D1117]">Top Products</h2>
                <div className="text-sm text-gray-500 cursor-pointer">Today</div>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {topProducts.length === 0 ? (
                   <div className="text-sm text-gray-400 text-center mt-10">No products added yet</div>
                ) : topProducts.map((product, i) => (
                  <div key={product.id} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400 font-medium w-3">{i + 1}</span>
                      <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-lg">{product.image}</div>
                      <div>
                        <div className="text-sm font-semibold text-[#0D1117]">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.stock}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-[#0D1117]">{product.sales}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[300px]">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <h2 className="font-bold text-[#0D1117] mb-6">Sales by Payment Method</h2>
              <div className="flex-1 flex items-center justify-between px-8">
                <div className="w-48 h-48 relative">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {paymentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs text-gray-500">Total</span>
                      <span className="font-bold text-lg text-[#0D1117]">100%</span>
                    </div>
                </div>
                
                <div className="space-y-4 flex-1 ml-10">
                  {paymentData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-[#0D1117]">{Math.round((item.value / stats.transactions)*100) || 0}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <h2 className="font-bold text-[#0D1117] mb-6">Recent Activity</h2>
              <div className="flex-1 flex flex-col justify-center items-center text-gray-400 space-y-2">
                 <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                    <MoreHorizontal className="w-8 h-8 text-gray-300" />
                 </div>
                 <p className="text-sm">More detailed activity feed coming soon</p>
              </div>
            </div>
          </div>
        </>
      )}
      
    </div>
  );
}
