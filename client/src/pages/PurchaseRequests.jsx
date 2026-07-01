import { useEffect, useState } from "react";
import {
  ShoppingCart,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";

export default function PurchaseRequests() {
  const [requests, setRequests] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // We use this to check if the logged-in user is an ADMIN or MANAGER
  const { user } = useAuthStore();
  const canApprove = user?.role === "ADMIN" || user?.role === "MANAGER";

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both requests and low stock alerts simultaneously
      const [requestsRes, lowStockRes] = await Promise.all([
        api.get("/purchase-requests"),
        api.get("/purchase-requests/low-stock"),
      ]);
      setRequests(requestsRes.data);
      setLowStock(lowStockRes.data);
    } catch (error) {
      toast.error("Failed to fetch purchase request data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRequest = async (productId, productName) => {
    const quantity = window.prompt(
      `How many units of ${productName} do you want to request?`,
    );
    if (!quantity || isNaN(quantity) || quantity <= 0) return;

    try {
      await api.post("/purchase-requests", {
        productId,
        quantity: parseInt(quantity),
        reason: "Restocking low inventory",
      });
      toast.success("Purchase request submitted to management!");
      fetchData(); // Refresh data
    } catch (error) {
      toast.error("Failed to submit request");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(id);
    try {
      await api.patch(`/purchase-requests/${id}`, { status });
      toast.success(`Request successfully ${status.toLowerCase()}!`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update request status");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        <Loader2 className="animate-spin mr-2" /> Loading workflows...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 text-slate-800 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
          <ShoppingCart size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Purchase Requests</h2>
          <p className="text-sm text-slate-500">
            Manage supplier orders and approval workflows
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Side: Pending & History Table (Takes up 2/3 width on large screens) */}
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Request Ledger
          </h3>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Requested By</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Status</th>
                  {canApprove && (
                    <th className="px-6 py-4 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      No requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {req.product.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Current Stock: {req.product.currentStock}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {req.user.name}
                      </td>
                      <td className="px-6 py-4 font-semibold text-blue-600">
                        +{req.quantity}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            req.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-700"
                              : req.status === "REJECTED"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      {canApprove && (
                        <td className="px-6 py-4 text-right">
                          {req.status === "PENDING" ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() =>
                                  handleStatusUpdate(req.id, "APPROVED")
                                }
                                disabled={actionLoading === req.id}
                                className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors disabled:opacity-50"
                                title="Approve"
                              >
                                {actionLoading === req.id ? (
                                  <Loader2 className="animate-spin" size={18} />
                                ) : (
                                  <CheckCircle size={18} />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(req.id, "REJECTED")
                                }
                                disabled={actionLoading === req.id}
                                className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
                                title="Reject"
                              >
                                <XCircle size={18} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Processed
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Low Stock Action Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} /> Action Needed
          </h3>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-2">
            {lowStock.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                All inventory levels are healthy!
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {lowStock.map((item) => (
                  <li
                    key={item.id}
                    className="p-4 flex flex-col gap-3 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {item.sku}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-bold rounded">
                        {item.currentStock} / {item.minStockLevel}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCreateRequest(item.id, item.name)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Request Restock
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
