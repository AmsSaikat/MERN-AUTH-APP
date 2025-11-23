import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/AuthStore";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const { 
    resetPassword, 
    error, 
    message, 
    setError, 
    setMessage, 
    loading 
  } = useAuthStore();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    setError(null);
    setMessage(null);
  }, [setError, setMessage]);

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await resetPassword(token, data.password);
      // Navigate after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.log("Reset password failed", err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Reset Your Password</h2>

        {message && <p className="text-green-400 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        {!message && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              icon={Lock}
              field="password"
              register={register}
              errors={errors}
              type="password"
              placeholder="Enter new password"
              validations={{
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              }}
            />

            <Input
              icon={Lock}
              field="confirmPassword"
              register={register}
              errors={errors}
              type="password"
              placeholder="Confirm password"
              validations={{
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              }}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 py-2 rounded-lg font-semibold ${
                loading ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
