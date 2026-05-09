import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Leaf, Loader2 } from "lucide-react";

const API_BASE = "http://localhost:8000/users";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("signup") === "true");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        // ─── SIGNUP ─────────────────────────────────────────
        const res = await fetch(`${API_BASE}/signup/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email,
            password,
            first_name: firstName,
            last_name: lastName,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Signup failed. Please try again.");
          setLoading(false);
          return;
        }

        // Save user info to localStorage
        localStorage.setItem("truetone_user", JSON.stringify(data.data));
        localStorage.setItem(
          "truetone_profile",
          JSON.stringify({
            name: `${firstName} ${lastName}`.trim(),
            email,
            username,
          })
        );

        navigate("/onboarding");
      } else {
        // ─── LOGIN ──────────────────────────────────────────
        const loginPayload = username
          ? { username, password }
          : { email, password };

        const res = await fetch(`${API_BASE}/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginPayload),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Invalid credentials.");
          setLoading(false);
          return;
        }

        // Store token and user id
        localStorage.setItem("truetone_token", data.data.token);
        localStorage.setItem("truetone_user", JSON.stringify(data.data));

        // Fetch full profile using the token
        const profileRes = await fetch(`${API_BASE}/profile/`, {
          method: "GET",
          headers: { Authorization: data.data.token },
        });

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.success) {
            localStorage.setItem(
              "truetone_profile",
              JSON.stringify({
                name: `${profileData.data.first_name} ${profileData.data.last_name}`.trim(),
                email: profileData.data.email,
                username: profileData.data.username,
              })
            );
          }
        }

        const stored = JSON.parse(localStorage.getItem("truetone_profile") || "{}");
        navigate(stored.onboardingComplete ? "/dashboard" : "/onboarding");
      }
    } catch (err) {
      setError("Network error. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-slate-600 mb-8">
            {isSignUp
              ? "Start your personalized skincare journey."
              : "Sign in to continue your skincare journey."}
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username — shown for both signup and login */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12 pl-10 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {isSignUp && (
              <>
                {/* First Name */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-12 pl-10 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Last Name */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-12 pl-10 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </>
            )}

            {/* Email — only for signup */}
            {isSignUp && (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-10 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-10 pr-10 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password hint for signup */}
            {isSignUp && (
              <p className="text-xs text-slate-400 pl-1">
                Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character
              </p>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm text-slate-500">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  Remember me
                </label>
                <button type="button" className="text-emerald-600 hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading
                ? isSignUp ? "Creating Account..." : "Signing In..."
                : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-emerald-600 font-medium hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-emerald-600 px-8 py-12 text-white">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/15">
            <Leaf size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Smart Skin Analysis</h2>
          <p className="text-slate-100/90">
            AI-powered skin assessment and product safety checks for your unique skin needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
