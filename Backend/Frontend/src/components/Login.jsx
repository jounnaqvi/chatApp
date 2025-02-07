import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie"; // Import Cookies

function Login() {
  const [authUser, setAuthUser] = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await axios.post(
        "http://localhost:5002/user/login", // Change the URL as per your API
        userInfo,
        { withCredentials: true } // Ensure credentials are sent with the request
      );

      if (response.data.token) {
        toast.success("Login successful");

        // Store token and user data in localStorage
        localStorage.setItem("jwt", response.data.token); // Store access token
       // Store refresh token
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user data

        // Store token and user data in cookies (Optional)
        Cookies.set("jwt", response.data.token, { expires: 1 }); // 1 day expiration for access token
     // 7 days for refresh token

        // Update global auth state
        setAuthUser({
          user: response.data.user,
          token: response.data.token,
        });

        navigate("/"); // Redirect to home after login
      } else {
        toast.error("Authentication failed. No token received.");
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      toast.error("Error: " + (error.response?.data.error || error.message));
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-gray-300 px-6 py-4 rounded-md bg-white shadow-md space-y-4 w-96"
      >
        <h1 className="text-3xl text-center text-blue-600 font-bold mb-2">
          Messenger
        </h1>
        <h2 className="text-xl text-center">
          Login with your{" "}
          <span className="text-blue-600 font-semibold">Account</span>
        </h2>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Login
          </button>
        </div>

        {/* Signup Redirect */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
