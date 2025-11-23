import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/AuthStore";
import Input from "../components/Input";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const { forgotPassword, error, message } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 🔥 Clear old error/message when entering this page
  useEffect(() => {
    useAuthStore.setState({ error: null, message: null });
  }, []);

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
    } catch (err) {
      console.log("Forgot password error:", err);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-xl 
      rounded-2xl shadow-xl p-8 mt-20">

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text 
          bg-linear-to-br from-green-400 to-emerald-500">
          Forgot Password
        </h2>

        {/* SUCCESS MESSAGE */}
        {message ? (
          <div className="text-center">
            <p className="text-green-400 text-lg font-semibold mb-4">
              {message}
            </p>
            <p className="text-gray-300">
              Please check your inbox for the reset link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>

            <Input
              icon={Mail}
              field="email"
              type="email"
              placeholder="Enter your email"
              register={register}
              errors={errors}
              validations={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              }}
            />

            {/* ERROR MESSAGE */}
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2 mt-4 bg-green-500 hover:bg-green-600 
              rounded-lg text-white font-semibold"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
