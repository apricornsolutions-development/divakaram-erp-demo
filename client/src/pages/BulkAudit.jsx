import React, { useState } from 'react';
import api from '../services/api';
import { Search, AlertCircle, CheckCircle, HelpCircle, XCircle } from 'lucide-react';

const BulkAudit = () => {
  const [location, setLocation] = useState('Main Warehouse - Mumbai');
  const [tagsInput, setTagsInput] = useState('');
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAudit = async (e) => {
    e.preventDefault();
    if (!tagsInput.trim()) return;
    
    const scannedTags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await api.post('/devices/audit/bulk-scan', {
        expectedLocation: location,
        scannedTags
      });
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error running audit scan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-full bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <Search className="text-indigo-600" size={32} />
          Bulk RFID Cycle Count
        </h1>
        <p className="text-gray-500 mt-2">Simulate a handheld RFID sweep to audit warehouse locations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Scanner Settings</h2>
          <form onSubmit={handleAudit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Location / Zone</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Detected RFID EPCs (comma separated)</label>
              <textarea 
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                rows={6}
                placeholder="e.g. TAG-001, TAG-002, UNKNOWN-999"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              {isLoading ? 'Running Audit...' : 'Execute Sweep'}
            </button>
          </form>
          {error && <p className="text-red-600 text-sm mt-4 font-medium">{error}</p>}
        </div>

        <div className="lg:col-span-2">
          {report ? (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Audit Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expected</p>
                    <p className="text-2xl font-black text-gray-900">{report.expectedCount}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Matched</p>
                    <p className="text-2xl font-black text-emerald-600">{report.detectedCount}</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Missing</p>
                    <p className="text-2xl font-black text-red-600">{report.missingCount}</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Wrong Loc.</p>
                    <p className="text-2xl font-black text-amber-600">{report.extraCount}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">Unknown</p>
                    <p className="text-2xl font-black text-purple-600">{report.unknownCount}</p>
                  </div>
                </div>
              </div>

              {report.missingCount > 0 && (
                <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-red-600 mb-4 border-b border-red-100 pb-2">
                    <XCircle size={20} />
                    <h2 className="text-lg font-bold">Missing Devices</h2>
                  </div>
                  <ul className="space-y-2">
                    {report.missing.map(d => (
                      <li key={d._id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg text-sm">
                        <span className="font-semibold text-gray-900">{d.model || d.brand || d.serialNumber}</span>
                        <span className="font-mono text-red-700">{d.rfidEpc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.extraCount > 0 && (
                <div className="bg-white border border-amber-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-600 mb-4 border-b border-amber-100 pb-2">
                    <AlertCircle size={20} />
                    <h2 className="text-lg font-bold">Misplaced Devices (Belong elsewhere)</h2>
                  </div>
                  <ul className="space-y-2">
                    {report.extraWrongLocation.map(d => (
                      <li key={d._id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-amber-50 rounded-lg text-sm">
                        <span className="font-semibold text-gray-900">{d.model || d.brand || d.serialNumber}</span>
                        <div className="flex items-center gap-4 mt-2 sm:mt-0">
                          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">Expected: {d.location}</span>
                          <span className="font-mono text-amber-700">{d.rfidEpc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.unknownCount > 0 && (
                <div className="bg-white border border-purple-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-purple-600 mb-4 border-b border-purple-100 pb-2">
                    <HelpCircle size={20} />
                    <h2 className="text-lg font-bold">Unknown Tags</h2>
                  </div>
                  <ul className="space-y-2">
                    {report.unknownTags.map((tag, i) => (
                      <li key={i} className="p-3 bg-purple-50 rounded-lg text-sm font-mono text-purple-700">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full bg-white border border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center text-gray-400">
              <Search size={64} className="mb-4 opacity-20" />
              <p className="text-xl font-medium">Run a sweep to see the audit report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkAudit;
