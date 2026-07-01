import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package2, Loader2, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useAuthStore from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");

    const result = await login(email, password);
    if (result.success) {
      toast.success("Welcome back!");
      navigate("/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Toaster position="top-right" />

      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[560px] bg-cyan-100">
        <div className="mx-auto w-full max-w-sm lg:w-[360px]">
          <div className="flex items-center gap-2 text-blue-600 mb-8">
            <Package2 size={40} strokeWidth={2} />
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              Smart ERP
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage your enterprise inventory efficiently.
          </p>

          <div className="mt-8">
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-slate-700 ">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-md placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="admin@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="mt-1 appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-md placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign in to Dashboard <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side: Marketing/Graphic Panel (Hidden on mobile) */}
      <div className="hidden lg:block relative w-full flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
        <div className="absolute inset-0 flex flex-col justify-center px-20 text-white z-10">
          <h1 className="text-5xl font-bold mb-6">Real-time stock control.</h1>
          <p className="text-xl text-blue-100 max-w-lg leading-relaxed">
            Stop guessing your inventory levels. Our automated ERP handles
            low-stock alerts, purchase requests, and complete audit logging—all
            in one place.
          </p>

          {/* Decorative abstract elements */}
          <div className="mt-16 grid grid-cols-2 gap-6 opacity-80">
            <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-blue-200 mt-1">Audit Traceability</div>
            </div>
            <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold">0ms</div>
              <div className="text-blue-200 mt-1">Data Desync</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
