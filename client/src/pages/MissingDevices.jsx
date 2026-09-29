import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { SearchX, Clock, MapPin, AlertOctagon } from 'lucide-react';

const MissingDevices = () => {
  const [missing, setMissing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMissing = async () => {
      try {
        const res = await api.get('/devices/metrics/missing');
        setMissing(res.data);
      } catch (err) {
        console.error("Error fetching missing devices", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMissing();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-full bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <SearchX className="text-rose-600" size={32} />
          Missing Device Investigation
        </h1>
        <p className="text-gray-500 mt-2">Track unauthorized movements and locate missing inventory.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-rose-50 border-b border-rose-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="text-rose-600" size={20} />
            <span className="font-bold text-rose-900">Active Investigations: {missing.length}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-gray-500">Loading missing devices...</div>
        ) : missing.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="p-4 bg-emerald-50 text-emerald-500 rounded-full mb-4">
              <SearchX size={48} />
            </div>
            <p className="text-xl font-bold text-gray-900">No Missing Devices</p>
            <p className="text-gray-500 mt-2">All inventory is accounted for.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {missing.map(device => (
              <div key={device._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-bold text-gray-900">{device.model || device.brand || 'Unknown Device'}</h2>
                    <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-1 rounded">MISSING</span>
                  </div>
                  <p className="font-mono text-sm text-gray-500">EPC: {device.rfidEpc} | SN: {device.serialNumber}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 md:text-right">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1 md:justify-end mb-1"><MapPin size={12}/> Last Known Location</p>
                    <p className="font-semibold text-gray-800">{device.location}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1 md:justify-end mb-1"><Clock size={12}/> Security Trigger Time</p>
                    <p className="font-medium text-gray-800">{new Date(device.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default MissingDevices;
