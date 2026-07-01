import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AuditLogs from "./pages/AuditLogs";
import PurchaseRequests from "./pages/PurchaseRequests";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes wrapped in our Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="products" element={<Products />} />

          <Route path="history" element={<AuditLogs />} />

          <Route path="requests" element={<PurchaseRequests />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
