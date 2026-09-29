import React, { useState } from 'react';
import { User, Shield, Database, Bell, Save } from 'lucide-react';

const Settings = () => {
  const [companyName, setCompanyName] = useState('Divakaram ERP Demo');
  const [gstNumber, setGstNumber] = useState('GSTIN-DEMO-1234');
  const [warehouseLocation, setWarehouseLocation] = useState('Main Warehouse - Mumbai');
  const [rfidAuth, setRfidAuth] = useState(true);
  const [duplicateBlocking, setDuplicateBlocking] = useState(true);

  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = () => {
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Settings</h1>
        <p className="text-gray-500 mt-2">Manage company configurations, role permissions, and system preferences.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
          <User className="text-indigo-600" size={20} />
          <h2 className="text-xl font-semibold text-gray-800">Company Profile</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input 
              type="text" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
            <input 
              type="text" 
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Warehouse Location</label>
            <input 
              type="text" 
              value={warehouseLocation}
              onChange={(e) => setWarehouseLocation(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
          <Shield className="text-emerald-600" size={20} />
          <h2 className="text-xl font-semibold text-gray-800">Security & Access</h2>
        </div>
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Require RFID Gate Authorization</p>
              <p className="text-sm text-gray-500">Enable strict checking at physical warehouse exit gates.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={rfidAuth} onChange={() => setRfidAuth(!rfidAuth)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Strict Duplicate Tag Blocking</p>
              <p className="text-sm text-gray-500">Prevent multiple devices from sharing the same RFID EPC.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={duplicateBlocking} onChange={() => setDuplicateBlocking(!duplicateBlocking)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button 
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {saveMessage && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium z-50 transition-opacity">
          {saveMessage}
        </div>
      )}
    </div>
  );
};

export default Settings;
