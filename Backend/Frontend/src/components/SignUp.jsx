import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { authUser, setAuthUser } = useAuth();

  const password = watch("password", "");

  const validatePasswordMatch = (value) =>
    value === password || "Passwords do not match";

  const onSubmit = async (data) => {
    const userInfo = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword, // Ensure the name matches backend
    };

    try {
      const response = await axios.post("http://localhost:5002/user/signup", userInfo);
      console.log("Signup Success:", response.data);
      alert("Signup Successful!");
      localStorage.setItem("authUser", JSON.stringify(response.data));
      setAuthUser(response.data);
    } catch (error) {
      console.error("Signup Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="border border-black px-8 py-6 rounded-md bg-white shadow-lg w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-bold text-center mb-4">Create a New Account</h1>
        <h2 className="text-sm text-center text-gray-600 mb-6">It's free and always will be</h2>

        <div className="space-y-4">
          {/* Name Field */}
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Name"
              {...register("name", { required: "Name is required" })}
            />
          </label>
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}

          {/* Email Field */}
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="email"
              className="grow"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@]+@[^@]+\.[^@]+$/,
                  message: "Invalid email address"
                }
              })}
            />
          </label>
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}

          {/* Password Field */}
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="password"
              className="grow"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
          </label>
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}

          {/* Confirm Password Field */}
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="password"
              className="grow"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: validatePasswordMatch,
              })}
            />
          </label>
          {errors.confirmPassword && (
            <span className="text-red-500">{errors.confirmPassword.message}</span>
          )}
        </div>

        <p className="text-sm text-center mt-4">
          Have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>

        <input
          type="submit"
          value="Sign Up"
          className="block w-full bg-blue-500 text-white mt-6 py-2 rounded-md cursor-pointer hover:bg-blue-600"
        />
      </form>
    </div>
  );
};

export default SignUp;
