import React, { useState } from 'react';
import api from '../services/api';
import { ShieldAlert, CheckCircle, Radio } from 'lucide-react';

const SecurityGate = () => {
  const [epcInput, setEpcInput] = useState('');
  const [scanResult, setScanResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!epcInput.trim()) return;

    try {
      const response = await api.post('/devices/gate-scan', { epc: epcInput.trim() });
      setScanResult(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setScanResult(error.response.data);
      } else {
        setScanResult({ authorized: null, message: "System error or tag not found." });
      }
    } finally {
      setEpcInput('');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gray-50">
      
      <form onSubmit={handleScan} className="w-full max-w-2xl mb-12">
        <h2 className="text-xl font-bold text-gray-700 text-center mb-4 uppercase tracking-widest">RFID Gate Terminal - Scanning in Progress...</h2>
        <input 
          type="text" 
          value={epcInput} 
          onChange={(e) => setEpcInput(e.target.value)} 
          autoFocus 
          placeholder="Awaiting RFID scan..." 
          className="w-full bg-white border-4 border-gray-200 text-3xl text-center rounded-2xl py-6 shadow-sm focus:border-indigo-500 focus:ring-0 outline-none text-gray-900 transition-colors"
        />
      </form>

      <div className="w-full max-w-2xl flex flex-col items-center">
        {!scanResult && (
          <div className="flex flex-col items-center text-gray-400">
            <Radio size={80} className="animate-pulse mb-6" />
            <p className="text-xl font-medium tracking-wide">System Armed. Awaiting RFID tags...</p>
          </div>
        )}

        {scanResult && scanResult.authorized === true && (
          <div className="w-full bg-emerald-50 border-4 border-emerald-500 rounded-3xl p-10 flex flex-col items-center shadow-lg transform transition-all">
            <CheckCircle size={80} className="text-emerald-500 mb-6" />
            <h1 className="text-4xl font-black text-emerald-700 tracking-tight text-center">AUTHORIZED: Gate Open</h1>
            <p className="text-emerald-600 mt-4 text-xl font-medium">{scanResult.message}</p>
          </div>
        )}

        {scanResult && scanResult.authorized === false && scanResult.alert && (
          <div className="w-full bg-red-50 border-4 border-red-600 rounded-3xl p-10 flex flex-col shadow-2xl animate-pulse">
            <div className="flex items-center justify-center gap-6 mb-8 border-b-2 border-red-200 pb-8">
              <ShieldAlert size={80} className="text-red-600" />
              <h1 className="text-4xl sm:text-5xl font-black text-red-700 tracking-tight leading-tight uppercase text-center sm:text-left">Security Breach<br/><span className="text-3xl text-red-600">Unauthorized Exit</span></h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl p-6 border border-red-100 shadow-inner">
              <div>
                <p className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">Device Detected</p>
                <p className="text-xl font-bold text-gray-900">{scanResult.alert.device}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">Tag ID (EPC)</p>
                <p className="text-xl font-mono font-bold text-gray-900">{scanResult.alert.epc}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">Detection Gate</p>
                <p className="text-xl font-bold text-gray-900">{scanResult.alert.gate}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">Known Location</p>
                <p className="text-xl font-bold text-gray-900">{scanResult.alert.lastLocation}</p>
              </div>
              <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">Timestamp</p>
                <p className="text-lg font-medium text-gray-700">{new Date(scanResult.alert.time).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-8 text-center bg-red-600 py-3 rounded-xl">
               <p className="text-white font-black tracking-widest uppercase">Status: {scanResult.alert.securityStatus}</p>
            </div>
          </div>
        )}

        {scanResult && scanResult.authorized === null && (
          <div className="w-full bg-yellow-50 border-4 border-yellow-500 rounded-3xl p-10 flex flex-col items-center shadow-lg">
             <ShieldAlert size={80} className="text-yellow-600 mb-6" />
             <h1 className="text-3xl font-black text-yellow-700 tracking-tight text-center">Scan Failed</h1>
             <p className="text-yellow-600 mt-4 text-xl font-medium">{scanResult.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityGate;
