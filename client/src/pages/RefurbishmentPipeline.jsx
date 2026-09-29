import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle2, Star, X } from 'lucide-react';

const RefurbishmentPipeline = () => {
  const [devices, setDevices] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // QC Modal States
  const [qcModalOpen, setQcModalOpen] = useState(false);
  const [selectedDeviceForQc, setSelectedDeviceForQc] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState('A');

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

  useEffect(() => {
    fetchData();
  }, []);

  const [repairModal, setRepairModal] = useState({ isOpen: false, repairId: null, partsCost: '', labourCost: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const startRepair = async (deviceId) => {
    try {
      await api.post('/repairs', { device: deviceId, technician: 'Demo Tech' });
      fetchData();
    } catch (error) {
      console.error("Error starting repair:", error);
      setErrorMsg("Failed to start repair");
    }
  };

  const openRepairModal = (repairId) => {
    setRepairModal({ isOpen: true, repairId, partsCost: '0', labourCost: '0' });
    setErrorMsg('');
  };

  const closeRepairModal = () => {
    setRepairModal({ isOpen: false, repairId: null, partsCost: '', labourCost: '' });
    setErrorMsg('');
  };

  const submitRepair = async () => {
    if (repairModal.partsCost === '' || repairModal.labourCost === '') {
      setErrorMsg("Please fill in both costs.");
      return;
    }
    try {
      await api.put(`/repairs/${repairModal.repairId}`, {
        partsUsed: [{ name: 'Demo Part', cost: Number(repairModal.partsCost) }],
        labourCost: Number(repairModal.labourCost),
        status: 'Completed'
      });
      fetchData();
      closeRepairModal();
    } catch (error) {
      console.error("Error completing repair:", error);
      setErrorMsg("Failed to complete repair");
    }
  };

  const submitQC = async () => {
    if (!selectedDeviceForQc) return;
    try {
      await api.put(`/devices/${selectedDeviceForQc._id}`, { status: 'Ready to Sell', grade: selectedGrade });
      setQcModalOpen(false);
      setSelectedDeviceForQc(null);
      setSelectedGrade('A');
      fetchData();
    } catch (error) {
      console.error("Error submitting QC:", error);
      setErrorMsg("Failed to pass QC");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((colIndex) => (
            <div key={colIndex} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 min-h-[600px]">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6 animate-pulse"></div>
              {[1, 2].map((cardIndex) => (
                <div key={cardIndex} className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 mb-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-100 rounded w-full"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const receivedDevices = devices.filter(d => d.status === 'Received');
  const repairingDevices = devices.filter(d => d.status === 'Under Repair');
  const qcPendingDevices = devices.filter(d => d.status === 'QC Pending');

  return (
    <div className="p-6 bg-gray-50 min-h-full relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Refurbishment Pipeline</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Received */}
        <div className="bg-gray-100/50 border border-gray-200 rounded-2xl p-4 md:h-[calc(100vh-160px)] min-h-[400px] flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">Received (Initial QC)</h2>
          <div className="overflow-y-auto flex-1 space-y-4 pr-2">
            {receivedDevices.map(device => (
              <div key={device._id} className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
                <p className="text-sm text-gray-500 font-mono mb-1">EPC: {device.rfidEpc}</p>
                <p className="font-medium text-gray-900 mb-2">SN: {device.serialNumber}</p>
                <div className="border-t border-gray-200 pt-2 mb-4">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md inline-block mt-2">
                    Total Landed Cost: ₹{device.landedCost?.total.toFixed(2)}
                  </span>
                </div>
                <button 
                  onClick={() => startRepair(device._id)}
                  className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors rounded-lg font-medium shadow-sm py-2"
                >
                  Start Repair
                </button>
              </div>
            ))}
            {receivedDevices.length === 0 && <p className="text-gray-500 text-center">No devices</p>}
          </div>
        </div>

        {/* Column 2: Under Repair */}
        <div className="bg-gray-100/50 border border-gray-200 rounded-2xl p-4 md:h-[calc(100vh-160px)] min-h-[400px] flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700 border-b border-gray-200 pb-2">Under Repair</h2>
          <div className="overflow-y-auto flex-1 space-y-4 pr-2">
            {repairingDevices.map(device => {
              // Repairs might populate 'device' as an object or just store ID
              const repair = repairs.find(r => 
                (r.device?._id === device._id || r.device === device._id) && r.status !== 'Completed'
              );
              
              return (
                <div key={device._id} className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
                  <p className="text-sm text-gray-500 font-mono mb-1">EPC: {device.rfidEpc}</p>
                  <p className="font-medium text-gray-900 mb-2">SN: {device.serialNumber}</p>
                  <div className="border-t border-gray-200 pt-2 mb-4">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md inline-block mt-2">
                      Total Landed Cost: ₹{device.landedCost?.total.toFixed(2)}
                    </span>
                  </div>
                  {repair ? (
                    <button 
                      onClick={() => openRepairModal(repair._id)}
                      className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors rounded-lg font-medium shadow-sm py-2"
                    >
                      Complete Repair & Add Cost
                    </button>
                  ) : (
                    <p className="text-xs text-red-500 font-medium">No active repair job found</p>
                  )}
                </div>
              );
            })}
            {repairingDevices.length === 0 && <p className="text-gray-500 text-center">No devices</p>}
          </div>
        </div>

        {/* Column 3: QC Pending */}
        <div className="bg-gray-100/50 border border-gray-200 rounded-2xl p-4 md:h-[calc(100vh-160px)] min-h-[400px] flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-purple-700 border-b border-gray-200 pb-2">QC Pending</h2>
          <div className="overflow-y-auto flex-1 space-y-4 pr-2">
            {qcPendingDevices.map(device => (
              <div key={device._id} className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
                <p className="text-sm text-gray-500 font-mono mb-1">EPC: {device.rfidEpc}</p>
                <p className="font-medium text-gray-900 mb-2">SN: {device.serialNumber}</p>
                <div className="border-t border-gray-200 pt-2 mb-4">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md inline-block mt-2">
                    Total Landed Cost: ₹{device.landedCost?.total.toFixed(2)}
                  </span>
                </div>
                <button 
                  onClick={() => { setSelectedDeviceForQc(device); setQcModalOpen(true); }}
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors rounded-lg font-medium shadow-sm py-2"
                >
                  Pass Final QC
                </button>
              </div>
            ))}
            {qcPendingDevices.length === 0 && <p className="text-gray-500 text-center">No devices</p>}
          </div>
        </div>
      </div>

      {/* QC Grading Modal */}
      {qcModalOpen && selectedDeviceForQc && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-600" size={24} /> Final QC & Grading
              </h2>
              <button onClick={() => { setQcModalOpen(false); setSelectedDeviceForQc(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-gray-500">Device EPC</p>
                <p className="font-mono text-gray-900 font-medium">{selectedDeviceForQc.rfidEpc}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500">Total Landed Cost</p>
                <p className="text-2xl font-bold text-emerald-600">₹{selectedDeviceForQc.landedCost?.total?.toFixed(2)}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700 mb-2">Select Refurbished Grade</p>
                
                {/* Grade A */}
                <div 
                  onClick={() => setSelectedGrade('A')}
                  className={`p-4 border rounded-xl cursor-pointer transition-all flex gap-3 ${selectedGrade === 'A' ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-indigo-300'}`}
                >
                  <div className={`mt-0.5 ${selectedGrade === 'A' ? 'text-indigo-600' : 'text-gray-400'}`}>
                    <Star size={20} fill={selectedGrade === 'A' ? "currentColor" : "none"} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${selectedGrade === 'A' ? 'text-indigo-900' : 'text-gray-700'}`}>Grade A</h3>
                    <p className={`text-sm ${selectedGrade === 'A' ? 'text-indigo-700' : 'text-gray-500'}`}>Excellent Condition. High Margin.</p>
                  </div>
                </div>

                {/* Grade B */}
                <div 
                  onClick={() => setSelectedGrade('B')}
                  className={`p-4 border rounded-xl cursor-pointer transition-all flex gap-3 ${selectedGrade === 'B' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <div className={`mt-0.5 ${selectedGrade === 'B' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <Star size={20} fill={selectedGrade === 'B' ? "currentColor" : "none"} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${selectedGrade === 'B' ? 'text-blue-900' : 'text-gray-700'}`}>Grade B</h3>
                    <p className={`text-sm ${selectedGrade === 'B' ? 'text-blue-700' : 'text-gray-500'}`}>Minor Wear. Standard Margin.</p>
                  </div>
                </div>

                {/* Grade C */}
                <div 
                  onClick={() => setSelectedGrade('C')}
                  className={`p-4 border rounded-xl cursor-pointer transition-all flex gap-3 ${selectedGrade === 'C' ? 'border-gray-500 bg-gray-50 ring-1 ring-gray-500' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className={`mt-0.5 ${selectedGrade === 'C' ? 'text-gray-600' : 'text-gray-400'}`}>
                    <Star size={20} fill={selectedGrade === 'C' ? "currentColor" : "none"} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${selectedGrade === 'C' ? 'text-gray-900' : 'text-gray-700'}`}>Grade C</h3>
                    <p className={`text-sm ${selectedGrade === 'C' ? 'text-gray-700' : 'text-gray-500'}`}>Heavy Wear. Clearance.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={submitQC}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors shadow-sm"
              >
                Approve & Mark Ready to Sell
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Repair Modal */}
      {repairModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Repair</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Parts Cost (₹)</label>
              <input 
                type="number"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={repairModal.partsCost}
                onChange={(e) => setRepairModal({...repairModal, partsCost: e.target.value})}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Labour Cost (₹)</label>
              <input 
                type="number"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={repairModal.labourCost}
                onChange={(e) => setRepairModal({...repairModal, labourCost: e.target.value})}
              />
            </div>

            {errorMsg && <p className="text-rose-600 text-sm font-medium mb-4">{errorMsg}</p>}

            <div className="flex gap-3 justify-end">
              <button 
                onClick={closeRepairModal}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitRepair}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                Submit Costs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {errorMsg && !repairModal.isOpen && !qcModalOpen && (
        <div className="fixed bottom-4 right-4 bg-rose-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium z-50">
          {errorMsg}
          <button onClick={() => setErrorMsg('')} className="ml-4 text-rose-200 hover:text-white">&times;</button>
        </div>
      )}

    </div>
  );
};

export default RefurbishmentPipeline;
