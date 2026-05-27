import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        },
      );

      // SAVE TOKEN
      localStorage.setItem("token", response.data.token);
      toast.success("Login Successful");
      // REDIRECT
      navigate("/teams");
    } catch (error) {
      toast.error("Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Welcome Back</h1>

          <p className="text-gray-500 mt-2">Login to continue</p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-gray-700 mb-2 text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none transition duration-300"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none transition duration-300"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-gray-700 to-gray-500 text-white font-semibold py-3 rounded-xl hover:scale-105 transition duration-300 shadow-lg"
        >
          Login
        </button>

        {/* Register */}
        <p
          className="text-center text-gray-600 mt-6 cursor-pointer hover:text-gray-800 hover:underline transition"
          onClick={() => navigate("/register")}
        >
          Don't have an account? Register
        </p>
      </div>
    </div>
  );
}

export default Login;
