import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

const SmartReceiving = () => {
  const [expectedQty, setExpectedQty] = useState(0);
  const [scannedDevices, setScannedDevices] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [epcInput, setEpcInput] = useState('');
  
  const inputRef = useRef(null);

  useEffect(() => {
    // Autofocus input on load
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const generateRandomSerial = () => {
    return 'SN' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!epcInput.trim()) return;

    const currentInput = epcInput.trim();
    setEpcInput('');

    try {
      const response = await api.post('/devices', {
        rfidEpc: currentInput,
        serialNumber: generateRandomSerial(),
        brand: 'Dell',
        model: 'Latitude',
        landedCost: { purchaseCost: 150 }
      });

      if (response.status === 201) {
        setScannedDevices((prev) => [response.data, ...prev]);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setExceptions((prev) => [
          `Duplicate Tag Rejected: ${currentInput}`,
          ...prev
        ]);
      } else {
        setExceptions((prev) => [
          `System Error for Tag ${currentInput}: ${error.message}`,
          ...prev
        ]);
      }
    }
    
    // Refocus input after submission
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Smart Receiving (GRN)</h1>
      
      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Expected Quantity</h2>
            <input 
              type="number" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-3xl font-bold mt-2 w-32 px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={expectedQty}
              onChange={(e) => setExpectedQty(e.target.value)}
              min="0"
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
          <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Received Quantity</h2>
          <p className="text-4xl font-bold mt-2 text-indigo-600">{scannedDevices.length}</p>
        </div>
      </div>

      {/* Simulator Input */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2 text-gray-900">Simulate RFID/Barcode Scan</h2>
        <form onSubmit={handleScan} className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-white border-2 border-indigo-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 shadow-sm p-4 text-2xl rounded-xl transition-all"
            placeholder="Scan or enter EPC/Barcode here..."
            value={epcInput}
            onChange={(e) => setEpcInput(e.target.value)}
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors shadow-sm">
            Process Scan
          </button>
        </form>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Success Log */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">Successful Receivings</h2>
          <div className="overflow-y-auto max-h-96 pr-2">
            {scannedDevices.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No devices received yet.</p>
            ) : (
              <ul className="space-y-3">
                {scannedDevices.map((device, idx) => (
                  <li key={idx} className="bg-gray-50 p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-200 text-gray-800">
                    <div>
                      <span className="block font-mono text-sm text-gray-500">EPC: {device.rfidEpc}</span>
                      <span className="block font-bold text-gray-900">SN: {device.serialNumber}</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase border border-emerald-200">
                      {device.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Exception List */}
        <div className="bg-red-50 border border-red-200 shadow-sm rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-red-700 border-b border-red-200 pb-2">Exception Logs</h2>
          <div className="overflow-y-auto max-h-96 pr-2">
            {exceptions.length === 0 ? (
              <p className="text-red-400/70 text-center py-4">No exceptions recorded.</p>
            ) : (
              <ul className="space-y-3">
                {exceptions.map((exc, idx) => (
                  <li key={idx} className="bg-white border border-red-100 text-red-700 p-3 rounded-xl shadow-sm flex items-start space-x-2">
                    <span className="mt-0.5">⚠️</span>
                    <span className="font-medium">{exc}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartReceiving;
