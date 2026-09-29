import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { TrendingUp, TrendingDown, AlertTriangle, Clock, Info, Boxes, CheckCircle, Wrench, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devicesRes, repairsRes] = await Promise.all([
          api.get('/devices'),
          api.get('/repairs')
        ]);
        setDevices(devicesRes.data);
        setRepairs(repairsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
        
        {/* KPI Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm animate-pulse h-32 flex flex-col justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        
        {/* Lower Widgets Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm animate-pulse h-64"></div>
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5 shadow-sm animate-pulse h-64"></div>
        </div>
      </div>
    );
  }

  // Calculate KPIs
  const totalInventory = devices.length;
  const readyToSell = devices.filter(d => d.status === 'Ready to Sell').length;
  
  const totalRepairCost = repairs.reduce((acc, repair) => {
    const partsCost = repair.partsUsed ? repair.partsUsed.reduce((sum, part) => sum + (part.cost || 0), 0) : 0;
    return acc + (repair.labourCost || 0) + partsCost;
  }, 0);

  const estimatedGrossProfit = (readyToSell * 300) - totalRepairCost;

  // Mock bar chart data
  const mockChartData = [
    { day: 'Mon', value: 45 },
    { day: 'Tue', value: 60 },
    { day: 'Wed', value: 30 },
    { day: 'Thu', value: 80 },
    { day: 'Fri', value: 65 },
    { day: 'Sat', value: 20 },
    { day: 'Sun', value: 10 },
  ];

  const recentActivity = [
    { message: "Demo Tech completed repair on DEMO-TAG-003", time: "2 mins ago", color: "bg-emerald-500" },
    { message: "New batch of 5 devices received via Smart Scan", time: "15 mins ago", color: "bg-blue-500" },
    { message: "Manager approved price override for Dell Latitude", time: "1 hour ago", color: "bg-indigo-500" },
    { message: "Missing device alert triggered at Gate A", time: "3 hours ago", color: "bg-rose-500" }
  ];

  const cardStyle = "bg-white border border-gray-200 shadow-sm rounded-xl p-6";

  return (
    <div className="p-6 min-h-full bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight">Overview</h1>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${cardStyle} flex flex-col justify-between`}>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Inventory</h2>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Boxes size={24} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-auto">
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{totalInventory}</p>
            <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-medium">
              <TrendingUp size={14} className="mr-1" />
              <span>+5%</span>
            </div>
          </div>
        </div>
        
        <div className={`${cardStyle} flex flex-col justify-between`}>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Ready to Sell</h2>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle size={24} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-auto">
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{readyToSell}</p>
            <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-medium">
              <TrendingUp size={14} className="mr-1" />
              <span>+12%</span>
            </div>
          </div>
        </div>
        
        <div className={`${cardStyle} flex flex-col justify-between`}>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Repair Cost</h2>
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
              <Wrench size={24} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-auto">
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight">₹{totalRepairCost.toFixed(2)}</p>
            <div className="flex items-center text-rose-600 bg-rose-50 px-2 py-1 rounded text-xs font-medium">
              <TrendingDown size={14} className="mr-1" />
              <span>-2%</span>
            </div>
          </div>
        </div>
        
        <div className={`${cardStyle} flex flex-col justify-between`}>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Est. Gross Profit</h2>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-auto">
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight">₹{estimatedGrossProfit.toFixed(2)}</p>
            <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-medium">
              <TrendingUp size={14} className="mr-1" />
              <span>+8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Alerts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* System Alerts */}
        <div className={`${cardStyle} col-span-1`}>
          <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-3">System Alerts</h2>
          <div className="space-y-4 mt-4">
            <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-100 rounded-xl">
              <AlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" size={18} />
              <p className="text-sm text-gray-800">2 Devices pending urgent QC rework.</p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <Clock className="text-amber-600 mt-0.5 flex-shrink-0" size={18} />
              <p className="text-sm text-gray-800">RFID Tag Inventory running low (15 remaining).</p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <Info className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
              <p className="text-sm text-gray-800">3 Unassigned repair jobs in queue.</p>
            </div>
          </div>
        </div>

        {/* Live System Activity */}
        <div className={`${cardStyle} lg:col-span-2`}>
          <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-3">Live System Activity</h2>
          <div className="mt-5 relative pl-4 border-l border-gray-200 space-y-6">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="relative">
                <span className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white ${activity.color}`}></span>
                <p className="text-sm text-gray-800 font-medium">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Mock Chart Section */}
      <div className={cardStyle}>
        <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-3">Devices Processed this Week</h2>
        <div className="flex items-end space-x-4 h-56 mt-6 px-4">
          {mockChartData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 h-full justify-end">
              <div 
                className="w-full max-w-[48px] bg-indigo-500 rounded-t-md transition-all duration-500 hover:bg-indigo-600" 
                style={{ height: `${item.value}%` }}
                title={`${item.value} devices`}
              ></div>
              <span className="text-xs text-gray-500 mt-3">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
