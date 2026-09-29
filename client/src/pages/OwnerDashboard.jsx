import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { DollarSign, BarChart2, Package, Wrench, ShieldCheck, CheckCircle } from 'lucide-react';

const OwnerDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/devices/metrics/owner');
        setMetrics(res.data);
      } catch (err) {
        console.error("Error fetching metrics", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (isLoading) return <div className="p-6 text-gray-500">Loading Owner Metrics...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-full bg-gray-50">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Owner & Stakeholder Dashboard</h1>
          <p className="text-gray-500 mt-2">High-level ERP overview and financial health summary.</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium border border-indigo-100 shadow-sm">
          <ShieldCheck size={20} /> Executive Access
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">Operational KPIs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Package size={32} /></div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Inventory</p>
            <p className="text-4xl font-black text-gray-900 mt-1">{metrics?.totalInventory || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle size={32} /></div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Ready to Sell</p>
            <p className="text-4xl font-black text-gray-900 mt-1">{metrics?.readyToSell || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Wrench size={32} /></div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Under Repair</p>
            <p className="text-4xl font-black text-gray-900 mt-1">{metrics?.repairCount || 0}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">Financial Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2"><DollarSign size={16}/> Total Costs (Landed)</p>
          <p className="text-4xl font-black text-rose-600">₹{metrics?.financials?.totalCost?.toLocaleString(undefined, {minimumFractionDigits: 2}) || "0.00"}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2"><BarChart2 size={16}/> Sales Revenue</p>
          <p className="text-4xl font-black text-blue-600">₹{metrics?.financials?.totalRevenue?.toLocaleString(undefined, {minimumFractionDigits: 2}) || "0.00"}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-between bg-gradient-to-br from-emerald-50 to-white">
          <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wider mb-4 flex items-center gap-2"><DollarSign size={16}/> Gross Profit</p>
          <p className="text-5xl font-black text-emerald-600">₹{metrics?.financials?.grossProfit?.toLocaleString(undefined, {minimumFractionDigits: 2}) || "0.00"}</p>
        </div>
      </div>
    </div>
  );
};
export default OwnerDashboard;
