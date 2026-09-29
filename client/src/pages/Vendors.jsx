import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Star, AlertTriangle, PlusCircle } from 'lucide-react';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get('/vendors');
        setVendors(res.data);
      } catch (err) {
        console.error("Error fetching vendors", err);
        // Fallback demo data
        if(err.response?.status === 404 || true) {
            setVendors([
                { _id: '1', name: 'TechWholesalers India', gstNumber: '27AABCU9603R1ZM', rating: 4.8, defectivePercentage: 2.1, contactPerson: 'Rahul Verma' },
                { _id: '2', name: 'Global Asset Recovery', gstNumber: '29ABCDE1234F2Z5', rating: 3.5, defectivePercentage: 8.4, contactPerson: 'John Smith' },
                { _id: '3', name: 'Metro IT Disposals', gstNumber: '07BXZPR4567L1Z9', rating: 4.2, defectivePercentage: 4.5, contactPerson: 'Amit Shah' }
            ]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-full bg-gray-50">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Users className="text-indigo-600" size={32} />
            Vendor Management
          </h1>
          <p className="text-gray-500 mt-2">Manage supplier performance, quality ratings, and compliance.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <PlusCircle size={20} /> Add Vendor
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Loading vendors...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 bg-white border border-gray-200 rounded-xl">No vendors found. Please add a vendor.</div>
          ) : (
            vendors.map(vendor => (
              <div key={vendor._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-bold text-gray-900">{vendor.name}</h2>
                  <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold">
                    <Star size={12} className="fill-current" /> {vendor.rating}/5
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">GSTIN</span>
                    <span className="font-mono font-medium text-gray-800">{vendor.gstNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Contact</span>
                    <span className="font-medium text-gray-800">{vendor.contactPerson || 'N/A'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Defective Return Rate</span>
                  <div className={`flex items-center gap-1 text-sm font-bold ${vendor.defectivePercentage > 5 ? 'text-rose-600 bg-rose-50 px-2 py-1 rounded-md' : 'text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md'}`}>
                    {vendor.defectivePercentage > 5 && <AlertTriangle size={14} />}
                    {vendor.defectivePercentage}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
export default Vendors;
