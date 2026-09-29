import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Truck, CheckCircle, Package, TrendingUp } from 'lucide-react';

const DispatchCard = ({ device, onDispatch }) => {
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await api.get(`/devices/${device._id}/pricing`);
        setPricing(res.data);
      } catch (err) {
        console.error("Error fetching pricing for", device._id);
      }
    };
    fetchPricing();
  }, [device._id]);

  return (
    <div className="flex flex-col p-4 border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="mb-4 sm:mb-0">
          <p className="font-mono text-gray-900 font-medium">{device.rfidEpc}</p>
          <div className="flex gap-3 mt-1 text-sm">
            <span className="text-indigo-700 font-semibold">Grade {device.grade || 'N/A'}</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">Total Cost: ₹{device.landedCost?.total?.toFixed(2)}</span>
          </div>
        </div>
        <button 
          onClick={() => onDispatch(device._id, pricing?.recommendedPrice)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          Dispatch Order
        </button>
      </div>
      
      {pricing && (
        <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap items-center gap-4 text-sm bg-white p-3 rounded-lg shadow-sm border border-emerald-100">
          <div className="flex items-center gap-1 text-emerald-700 font-semibold">
            <TrendingUp size={16} /> Recommended Price: ₹{pricing.recommendedPrice}
          </div>
          <div className="text-gray-500 text-xs">
            (Markup: {pricing.markupPercentage}%)
          </div>
          <div className="text-gray-500 text-xs ml-auto">
            Proj. Profit: ₹{pricing.projectedProfit}
          </div>
        </div>
      )}
    </div>
  );
};

const Dispatch = () => {
  const [readyDevices, setReadyDevices] = useState([]);
  const [dispatchedDevices, setDispatchedDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await api.get('/devices');
      const allDevices = response.data;
      setReadyDevices(allDevices.filter(d => d.status === 'Ready to Sell'));
      setDispatchedDevices(allDevices.filter(d => d.status === 'Dispatched'));
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [dispatchModal, setDispatchModal] = useState({ isOpen: false, deviceId: null, recommendedPrice: 0, salePrice: '', buyer: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const openDispatchModal = (id, recommendedPrice) => {
    setDispatchModal({ isOpen: true, deviceId: id, recommendedPrice: recommendedPrice || 0, salePrice: recommendedPrice || '', buyer: '' });
    setErrorMsg('');
  };

  const closeDispatchModal = () => {
    setDispatchModal({ isOpen: false, deviceId: null, recommendedPrice: 0, salePrice: '', buyer: '' });
    setErrorMsg('');
  };

  const submitDispatch = async () => {
    if (!dispatchModal.buyer.trim() || !dispatchModal.salePrice) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    try {
      await api.put(`/devices/${dispatchModal.deviceId}/sell`, { 
        salePrice: Number(dispatchModal.salePrice), 
        buyer: dispatchModal.buyer.trim() 
      });
      fetchData();
      closeDispatchModal();
    } catch (error) {
      console.error("Error dispatching device:", error);
      setErrorMsg("Failed to dispatch device.");
    }
  };

  if (isLoading) {
    return <div className="p-6 bg-gray-50 min-h-full flex items-center justify-center text-gray-500">Loading Dispatch Module...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3">
        <Truck className="text-indigo-600" size={32} />
        B2B Sales & Dispatch
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <Package className="text-emerald-600" size={24} /> 
            Available to Dispatch
          </h2>
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 space-y-4 min-h-[400px]">
            {readyDevices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No devices ready to sell.</p>
            ) : (
              readyDevices.map(device => (
                <DispatchCard key={device._id} device={device} onDispatch={openDispatchModal} />
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <CheckCircle className="text-blue-600" size={24} /> 
            Dispatch History
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto">
            {dispatchedDevices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No dispatch history.</p>
            ) : (
              dispatchedDevices.map(device => {
                const totalCost = device.landedCost?.total || 0;
                const salePrice = device.salePrice || 0;
                const profit = salePrice - totalCost;
                
                return (
                  <div key={device._id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <p className="font-mono text-gray-900 font-medium">{device.rfidEpc}</p>
                      <p className="text-sm text-gray-600 mt-1">Buyer: <span className="font-semibold text-gray-800">{device.buyer || 'Unknown'}</span></p>
                    </div>
                    <div className="mt-3 sm:mt-0 text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${profit >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {profit >= 0 ? '+' : ''}₹{profit.toFixed(2)} Profit
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Sold for ₹{salePrice.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {dispatchModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={24} /> Complete Dispatch
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹)</label>
              <input 
                type="number"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={dispatchModal.salePrice}
                onChange={(e) => setDispatchModal({...dispatchModal, salePrice: e.target.value})}
                placeholder={`Recommended: ₹${dispatchModal.recommendedPrice}`}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Name / Company</label>
              <input 
                type="text"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={dispatchModal.buyer}
                onChange={(e) => setDispatchModal({...dispatchModal, buyer: e.target.value})}
                placeholder="Enter buyer details"
              />
            </div>

            {errorMsg && <p className="text-rose-600 text-sm font-medium mb-4">{errorMsg}</p>}
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={closeDispatchModal}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitDispatch}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dispatch;
