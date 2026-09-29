import React, { useState } from 'react';
import api from '../services/api';
import { ScanLine, MapPin, CheckCircle2 } from 'lucide-react';

const RackPlacement = () => {
  const [step, setStep] = useState(1);
  const [deviceEpc, setDeviceEpc] = useState('');
  const [rackId, setRackId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDeviceScan = (e) => {
    e.preventDefault();
    if (!deviceEpc.trim()) return;
    setErrorMessage('');
    setStep(2);
  };

  const handleRackScan = async (e) => {
    e.preventDefault();
    if (!rackId.trim()) return;

    try {
      setErrorMessage('');
      const response = await api.post('/devices/rack-placement', { 
        deviceEpc: deviceEpc.trim(), 
        rackId: rackId.trim() 
      });
      
      setSuccessMessage(response.data.message);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setStep(1);
        setDeviceEpc('');
        setRackId('');
        setSuccessMessage('');
      }, 2000);
      
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error mapping device to rack.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-[80vh] flex flex-col justify-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center uppercase tracking-wider">RFID Rack Placement</h1>

      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center font-medium shadow-sm">
          {errorMessage}
        </div>
      )}

      {successMessage ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-10 flex flex-col items-center justify-center shadow-sm transform transition-all duration-300">
          <CheckCircle2 size={80} className="mb-4 text-emerald-500" />
          <h2 className="text-2xl font-bold tracking-tight">Success!</h2>
          <p className="text-lg font-medium mt-2">Successfully placed Device in Rack!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {step === 1 && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 transform transition-all duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
                  <ScanLine size={48} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Step 1: Scan Device Tag</h2>
              
              <form onSubmit={handleDeviceScan}>
                <input 
                  type="text" 
                  value={deviceEpc}
                  onChange={(e) => setDeviceEpc(e.target.value)}
                  autoFocus
                  placeholder="Enter Device EPC..." 
                  className="w-full bg-gray-50 border-2 border-gray-300 text-2xl text-center rounded-xl py-4 shadow-inner focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-gray-900 transition-colors"
                />
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 transform transition-all duration-300">
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Device Loaded</p>
                <p className="text-lg font-mono font-bold text-indigo-700">{deviceEpc}</p>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                  <MapPin size={48} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Step 2: Scan Rack Location</h2>
              
              <form onSubmit={handleRackScan}>
                <input 
                  type="text" 
                  value={rackId}
                  onChange={(e) => setRackId(e.target.value)}
                  autoFocus
                  placeholder="e.g. ZONE-A-RACK-03" 
                  className="w-full bg-gray-50 border-2 border-gray-300 text-2xl text-center rounded-xl py-4 shadow-inner focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none text-gray-900 transition-colors"
                />
              </form>
              <button onClick={() => setStep(1)} type="button" className="mt-6 w-full text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
                Cancel & Scan Another Device
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RackPlacement;
