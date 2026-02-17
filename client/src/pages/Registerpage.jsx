 import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Registerpage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      console.log("Error while registering:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
      
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-200 rounded-full blur-3xl opacity-40"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-slate-200">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Create account</h1>
          <p className="text-slate-500 text-sm mt-2">
            Join us and start your journey  
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label className="text-sm text-slate-600 font-medium">
              Full name
            </label>
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              placeholder="John Doe"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 font-medium">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-cyan-500 hover:bg-cyan-600 active:scale-[0.98] transition-all text-white font-semibold py-3 rounded-xl shadow-lg shadow-cyan-200"
          >
            Create account
          </button>

          <p className="text-center text-sm text-slate-600 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registerpage;
