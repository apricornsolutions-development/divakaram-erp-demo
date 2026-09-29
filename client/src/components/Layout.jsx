import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, MapPin, Box, Wrench, ClipboardCheck, CheckCircle, Menu } from 'lucide-react';
import api from '../services/api';

const getPipelineDetails = (status) => {
  if (status === 'Received') return { loc: 'Receiving Bay - Zone A', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Box };
  if (status === 'Under Repair') return { loc: 'Repair Lab - Station 4', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Wrench };
  if (status === 'QC Pending') return { loc: 'QC Testing - Zone C', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: ClipboardCheck };
  if (status === 'Ready to Sell') return { loc: 'Outbound Storage - Rack B2', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle };
  return { loc: 'Unknown Zone', color: 'bg-gray-50 text-gray-700 border-gray-200', icon: MapPin };
};

const Layout = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('divakaram_auth');
    navigate('/login');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      const response = await api.get(`/devices/search/${searchQuery}`);
      setSearchResult(response.data);
      setSearchError('');
      setIsModalOpen(true);
    } catch (error) {
      setSearchError(error.response?.data?.message || 'Device not found in system.');
      setSearchResult(null);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchQuery('');
  };

  const pipeInfo = searchResult ? getPipelineDetails(searchResult.status) : null;
  const StatusIcon = pipeInfo ? pipeInfo.icon : MapPin;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="font-semibold text-gray-700 tracking-wide hidden sm:block">Divakaram ERP</h1>
            
            <form onSubmit={handleSearch} className="relative w-64 md:w-96">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                autoFocus 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Scan RFID or enter Serial Number..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900" 
              />
            </form>
          </div>

          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-md flex-shrink-0"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
          <Outlet />
        </main>
      </div>

      {/* Global Search Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-gray-100">
            {searchError ? (
              <div>
                <h2 className="text-xl font-bold text-red-600 mb-2">Search Failed</h2>
                <p className="text-gray-700 mb-6">{searchError}</p>
                <button onClick={closeModal} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded-lg">Close</button>
              </div>
            ) : (
              searchResult && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{searchResult.brand} {searchResult.model}</h2>
                  <p className="text-gray-500 font-mono text-sm mb-6">SN: {searchResult.serialNumber} | EPC: {searchResult.rfidEpc}</p>
                  
                  <div className={`p-4 rounded-xl flex items-center gap-4 mb-4 border ${pipeInfo.color}`}>
                    <div className="bg-white/50 p-2 rounded-lg mix-blend-multiply">
                      <StatusIcon size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wider opacity-80">Current Location</p>
                      <p className="text-lg font-bold">{pipeInfo.loc}</p>
                    </div>
                  </div>

                  {searchResult.status === 'Under Repair' && searchResult.repairContext && (
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl mb-4">
                      <p className="text-sm text-gray-700"><span className="font-semibold">Assigned Technician:</span> {searchResult.repairContext.technician}</p>
                    </div>
                  )}

                  {searchResult.status === 'QC Pending' && (
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl mb-4">
                      <p className="text-sm text-gray-700 mb-1 font-semibold">Awaiting Final Quality Check</p>
                      <p className="text-sm text-gray-600">Added Parts Cost: ₹{searchResult.repairContext?.partsUsed?.reduce((sum, p) => sum + p.cost, 0) || 0}</p>
                    </div>
                  )}

                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 bg-gray-50 border border-gray-200 p-3 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                      <p className="font-bold text-gray-900">{searchResult.status}</p>
                    </div>
                    <div className="flex-1 bg-gray-50 border border-gray-200 p-3 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Total Cost</p>
                      <p className="font-bold text-emerald-600">₹{searchResult.landedCost?.total?.toFixed(2)}</p>
                    </div>
                  </div>

                  {searchResult.grade && (
                    <div className="mb-6 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Refurbished Grade</span>
                      <span className="text-xl font-extrabold text-indigo-700">Grade {searchResult.grade}</span>
                    </div>
                  )}

                  <button onClick={closeModal} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition-colors">
                    Close & Clear
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
