import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ScanBarcode, Wrench, Settings, Truck, ShieldAlert, MapPin, BarChart, FileText, ClipboardCheck, Users, SearchX, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 text-xl font-bold border-b border-gray-200 text-gray-900 tracking-tight flex justify-between items-center">
          ERP Dashboard
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <Link to="/" onClick={onClose} className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-all">
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link to="/receiving" onClick={onClose} className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-all">
          <ScanBarcode size={20} />
          <span className="font-medium">Smart Receiving</span>
        </Link>
        <Link to="/rack-placement" onClick={onClose} className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-all">
          <MapPin size={20} />
          <span className="font-medium">Rack Placement</span>
        </Link>
        <Link to="/pipeline" onClick={onClose} className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-all">
          <Wrench size={20} />
          <span className="font-medium">Refurbishment Pipeline</span>
        </Link>
        <Link to="/dispatch" onClick={onClose} className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-all">
          <Truck size={20} />
          <span className="font-medium">Sales & Dispatch</span>
        </Link>
        <Link to="/security-gate" onClick={onClose} className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-all">
          <ShieldAlert size={20} />
          <span className="font-medium">RFID Gate Security</span>
        </Link>
        <Link to="/owner" onClick={onClose} className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-emerald-600 rounded-lg transition-all">
          <BarChart size={20} />
          <span className="font-medium">Owner Dashboard</span>
        </Link>
        <Link to="/audit" onClick={onClose} className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-all">
          <FileText size={20} />
          <span className="font-medium">Audit Trail</span>
        </Link>
        <Link to="/bulk-audit" onClick={onClose} className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-all">
          <ClipboardCheck size={20} />
          <span className="font-medium">Bulk RFID Audit</span>
        </Link>
        <Link to="/vendors" onClick={onClose} className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-all">
          <Users size={20} />
          <span className="font-medium">Vendor Management</span>
        </Link>
        <Link to="/missing" onClick={onClose} className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-rose-600 rounded-lg transition-all">
          <SearchX size={20} />
          <span className="font-medium">Missing Devices</span>
        </Link>
        <Link to="/settings" onClick={onClose} className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-all">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;
