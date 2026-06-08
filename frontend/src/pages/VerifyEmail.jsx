import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/verify-email?token=${token}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Verification failed. Please try again.",
          );
        }

        login(data.user, data.token);

        setStatus("success");
        setMessage(data.message || "Email verified successfully!");

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage(error.message);
      }
    };

    verifyEmail();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/40">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-600 to-emerald-400 px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 border border-white/30 mb-5">
            {status === "loading" ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : status === "success" ? (
              <CheckCircle className="w-10 h-10 text-white" />
            ) : (
              <AlertCircle className="w-10 h-10 text-white" />
            )}
          </div>

          <h1 className="text-3xl font-black text-white mb-2">
            Email Verification
          </h1>

          <p className="text-white/80">
            {status === "loading"
              ? "Please wait..."
              : status === "success"
                ? "Verification completed"
                : "Verification failed"}
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          {status === "loading" && (
            <div className="text-center">
              <div className="flex justify-center mb-5">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
              </div>

              <p className="text-gray-700 text-lg">Verifying your account...</p>

              <p className="text-gray-500 mt-2">
                This will only take a moment.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-5" />

              <h2 className="text-2xl font-bold text-green-700 mb-3">
                Success!
              </h2>

              <p className="text-gray-700 mb-5">{message}</p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-700 text-sm">You are now logged in.</p>

                <p className="text-green-700 text-sm mt-1">
                  Redirecting to the homepage...
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-5" />

              <h2 className="text-2xl font-bold text-red-700 mb-3">
                Verification Failed
              </h2>

              <p className="text-gray-700 mb-6">{message}</p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/register")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition"
                >
                  Create New Account
                </button>

                <button
                  onClick={() => navigate("/check-email")}
                  className="w-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-3 rounded-xl font-semibold transition"
                >
                  Back to Email Instructions
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <ShoppingCart size={18} />
            Gro<span className="text-amber-400">Cart</span>
          </div>

          {status === "success" && (
            <button
              onClick={() => navigate("/")}
              className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1 text-sm font-medium"
            >
              Continue
              <ArrowRight size={14} />
            </button>
          )}

          {status === "error" && (
            <button
              onClick={() => navigate("/")}
              className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1 text-sm font-medium"
            >
              Home
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
