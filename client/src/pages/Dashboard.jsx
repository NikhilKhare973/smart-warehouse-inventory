import { useEffect, useState } from "react";
import { Package, AlertTriangle, XCircle, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        Loading metrics...
      </div>
    );
  }

   // NEW: Safety check - if data is null or doesn't have metrics, show an error state instead of crashing
  if (!data || !data.metrics) {
    return (
      <div className="flex flex-col h-64 items-center justify-center text-red-500 bg-red-50 rounded-xl border border-red-100 p-6">
        <h3 className="text-lg font-bold mb-2">
          Unable to connect to database
        </h3>
        <p className="text-sm text-red-400">
          The server is waking up or temporarily unavailable. Please refresh the
          page in 10 seconds.
        </p>
      </div>
    );
  }

  // Format data for the Recharts BarChart
  const chartData = [
    {
      name: "Healthy Stock",
      value:
        data.metrics.totalProducts -
        data.metrics.lowStock -
        data.metrics.outOfStock,
      fill: "#3b82f6",
    }, // Blue
    { name: "Low Stock", value: data.metrics.lowStock, fill: "#f59e0b" }, // Amber
    { name: "Out of Stock", value: data.metrics.outOfStock, fill: "#ef4444" }, // Red
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Products"
          value={data.metrics.totalProducts}
          icon={<Package className="text-blue-600" size={24} />}
          bg="bg-blue-100"
        />
        <MetricCard
          title="Low Stock Alerts"
          value={data.metrics.lowStock}
          icon={<AlertTriangle className="text-amber-600" size={24} />}
          bg="bg-amber-100"
        />
        <MetricCard
          title="Out of Stock"
          value={data.metrics.outOfStock}
          icon={<XCircle className="text-red-600" size={24} />}
          bg="bg-red-100"
        />
        <MetricCard
          title="Total Transactions"
          value={data.recentActivity.length}
          icon={<TrendingUp className="text-emerald-600" size={24} />}
          bg="bg-emerald-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">
            Inventory Health
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b" }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {data.recentActivity.length === 0 ? (
              <p className="text-slate-500 text-sm">
                No recent transactions found.
              </p>
            ) : (
              data.recentActivity.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div
                    className={`p-2 rounded-lg mt-1 ${log.type === "IN" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {log.type === "IN" ? "+" : "-"}
                    {log.quantity}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {log.product.name}
                    </p>
                    <p className="text-xs text-slate-500">{log.reason}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      by {log.user.name}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Small helper component for the top cards
function MetricCard({ title, value, icon, bg }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
      <div className={`p-4 rounded-full ${bg}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
