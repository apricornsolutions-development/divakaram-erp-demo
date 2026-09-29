import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText, ShieldAlert } from 'lucide-react';

const AuditTrail = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/devices/audit-logs');
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-full bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <FileText className="text-indigo-600" size={32} />
          System Audit Trail
        </h1>
        <p className="text-gray-500 mt-2">Immutable record of all critical system events and status changes.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-indigo-50 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
          <ShieldAlert className="text-indigo-600" size={18} />
          <span className="text-sm font-semibold text-indigo-900 uppercase tracking-wider">Compliance Mode Active</span>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading audit logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="px-6 py-4 font-semibold">Timestamp</th>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold">Entity ID (EPC)</th>
                  <th className="px-6 py-4 font-semibold">Before</th>
                  <th className="px-6 py-4 font-semibold">After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No audit logs found.</td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.user}</td>
                      <td className="px-6 py-4 text-sm text-indigo-700 font-semibold">{log.action}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">{log.entityId || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-rose-600">{log.beforeValue ? String(log.beforeValue) : 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-emerald-600">{log.afterValue ? String(log.afterValue) : 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AuditTrail;
