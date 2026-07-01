import { useEffect, useState } from "react";
import { Plus, Search, Loader2, ArrowRightLeft, Pencil } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Create Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const [minStock, setMinStock] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  // --- NEW: Stock Adjustment Modal State ---
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockType, setStockType] = useState("IN");
  const [stockQuantity, setStockQuantity] = useState("");
  const [stockReason, setStockReason] = useState("");
  const [stockSubmitting, setStockSubmitting] = useState(false);

  // --- NEW: Edit Product Modal State ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    sku: "",
    price: "",
    minStock: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/products?search=${search}&status=${statusFilter}`,
      );
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch inventory records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter]);

  //Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
        // Automatically select the first category as default if it exists
        if (response.data.length > 0) {
          setCategoryId(response.data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []); // Empty array means this runs exactly once on page load

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/products", {
        name,
        sku,
        price: parseFloat(price),
        categoryId,
        minStockLevel: parseInt(minStock),
      });
      toast.success("Product provisioned successfully!");
      setIsModalOpen(false);
      setName("");
      setSku("");
      setPrice("");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Product creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // --- NEW: Handle Stock IN/OUT API Call ---
  const handleStockAdjust = async (e) => {
    e.preventDefault();
    setStockSubmitting(true);
    try {
      await api.post("/stock/adjust", {
        productId: selectedProduct.id,
        type: stockType,
        quantity: parseInt(stockQuantity),
        reason:
          stockReason ||
          (stockType === "IN" ? "Supplier Delivery" : "Standard Checkout"),
      });

      toast.success(`Stock successfully updated!`);
      setIsStockModalOpen(false);
      setStockQuantity("");
      setStockReason("");
      fetchProducts(); // Refresh the table to show new stock numbers
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to adjust stock");
    } finally {
      setStockSubmitting(false);
    }
  };

  const openStockModal = (product) => {
    setSelectedProduct(product);
    setStockType("IN");
    setIsStockModalOpen(true);
  };

  // Open modal and pre-fill data
  const openEditModal = (product) => {
    setEditForm({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      minStock: product.minStockLevel,
    });
    setIsEditModalOpen(true);
  };

  // Submit the edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      await api.put(`/products/${editForm.id}`, {
        name: editForm.name,
        sku: editForm.sku,
        price: editForm.price,
        minStockLevel: editForm.minStock,
      });
      toast.success("Product updated successfully!");
      setIsEditModalOpen(false);
      fetchProducts(); // Refresh the table
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header (Search & Filters) stays the same */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-1 w-full sm:max-w-md gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-3.5 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-all shadow-sm"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={20} /> Fetching records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">CreatedAt</th>
                  <th className="px-6 py-4 text-right">Actions</th>{" "}
                  {/* NEW COLUMN */}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {products.map((product) => {
                  const isLow =
                    product.currentStock <= product.minStockLevel &&
                    product.currentStock > 0;
                  const isOut = product.currentStock === 0;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        {product.sku}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(product.price)}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {product.currentStock} units
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
                            isOut
                              ? "bg-red-100 text-red-700"
                              : isLow
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {isOut
                            ? "Out of Stock"
                            : isLow
                              ? "Low Stock"
                              : "Healthy"}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      {/* NEW: Action Button  & edit button*/}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-xs font-medium transition-colors"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() => openStockModal(product)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors"
                          >
                            <ArrowRightLeft size={14} /> Adjust
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- NEW: EDIT PRODUCT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 bg-blue-50 rounded-t-xl">
              <h3 className="text-xl font-bold text-slate-900">Edit Product</h3>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1.5 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    SKU
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1.5 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                    value={editForm.sku}
                    onChange={(e) =>
                      setEditForm({ ...editForm, sku: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    className="mt-1.5 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Minimum Alert Threshold
                </label>
                <input
                  type="number"
                  className="mt-1.5 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  value={editForm.minStock}
                  onChange={(e) =>
                    setEditForm({ ...editForm, minStock: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  {editSubmitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EXISTING ADD PRODUCT MODAL (Collapsed for brevity, keep your previous one here!) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* Same code as before for the Create Product Modal */}
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                Add New Product
              </h3>
            </div>
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1.5 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category
                </label>
                <select
                  required
                  className="mt-1.5 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    SKU
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1.5 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    className="mt-1.5 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Minimum Alert Threshold
                </label>
                <input
                  type="number"
                  className="mt-1.5 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Save Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- NEW: STOCK ADJUSTMENT MODAL --- */}
      {isStockModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 bg-slate-50 rounded-t-xl">
              <h3 className="text-lg font-bold text-slate-900">
                Adjust Inventory
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Modifying stock for{" "}
                <span className="font-semibold text-slate-700">
                  {selectedProduct.name}
                </span>
              </p>
            </div>

            <form onSubmit={handleStockAdjust} className="p-6 space-y-5">
              {/* Type Toggle */}
              <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setStockType("IN")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${stockType === "IN" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                  + Stock In
                </button>
                <button
                  type="button"
                  onClick={() => setStockType("OUT")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${stockType === "OUT" ? "bg-white shadow-sm text-red-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                  - Stock Out
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  className="mt-1.5 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. 50"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Reason / Reference (Optional)
                </label>
                <input
                  type="text"
                  className="mt-1.5 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={
                    stockType === "IN"
                      ? "e.g. Supplier Delivery #1234"
                      : "e.g. Damaged / Production Use"
                  }
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={stockSubmitting}
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium flex items-center gap-2 ${stockType === "IN" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}`}
                >
                  {stockSubmitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    `Confirm ${stockType}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
