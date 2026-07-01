import { useEffect, useState } from "react";
import { History, Loader2, Search } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get("/stock/history");
        setLogs(response.data);
      } catch (error) {
        toast.error("Failed to fetch audit logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Simple client-side filtering for the logs
  const filteredLogs = logs.filter(
    (log) =>
      log.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 text-slate-800">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <History size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold">System Audit Logs</h2>
            <p className="text-sm text-slate-500">
              Immutable record of all inventory transactions
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Filter by product, SKU, or user..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={20} /> Loading ledger...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Item & SKU</th>
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Reason / Reference</th>
                  <th className="px-6 py-4">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(log.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {log.product.name}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {log.product.sku}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                            log.type === "IN"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {log.type === "IN" ? "STOCK IN" : "STOCK OUT"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {log.type === "IN" ? "+" : "-"}
                        {log.quantity}
                      </td>
                      <td
                        className="px-6 py-4 text-slate-600 max-w-xs truncate"
                        title={log.reason}
                      >
                        {log.reason}
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {log.user.name}
                      </td>
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
}
