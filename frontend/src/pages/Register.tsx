import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          name,
          email,
          password,
        },
      );

      alert(response.data.message);

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Create Account</h1>

          <p className="text-gray-500 mt-2">Register to get started</p>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-gray-700 mb-2 text-sm font-medium">
            Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-500 transition duration-300"
          />
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
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-500 transition duration-300"
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
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-500 transition duration-300"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-gray-700 to-gray-500 text-white font-semibold py-3 rounded-xl hover:scale-105 transition duration-300 shadow-lg"
        >
          Register
        </button>

        {/* Login */}
        <p
          className="text-center text-gray-600 mt-6 cursor-pointer hover:text-gray-800 hover:underline transition"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}

export default Register;
