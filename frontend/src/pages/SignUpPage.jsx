import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../components/Input';
import { User, Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import PasswordCriteria from '../components/PasswordStrengthMeter';
import { useAuthStore } from '../store/AuthStore';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup, error, setError } = useAuthStore();
  const [password, setPassword] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Call signup from store
      const res = await signup(data.email, data.password, data.name);

      // If signup succeeds, navigate to email verification page
      if (res?.success) {
        navigate('/verify-email');
      }
    } catch (err) {
      // Error is already set in the store
      console.log("Signup failed", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 bg-linear-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text flex justify-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <Input
            icon={User}
            field="name"
            type="text"
            placeholder="Full name"
            register={register}
            errors={errors}
            validations={{ required: "Full name is required" }}
            onChange={() => error && setError(null)}
          />

          {/* Email */}
          <Input
            icon={Mail}
            field="email"
            type="email"
            placeholder="Email Address"
            register={register}
            errors={errors}
            validations={{ required: "Email is required" }}
            onChange={() => error && setError(null)}
          />

          {/* Password */}
          <Input
            icon={Lock}
            field="password"
            type="password"
            placeholder="Password"
            register={register}
            errors={errors}
            validations={{
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            }}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
          />

          {/* Password strength */}
          <PasswordCriteria password={password} />

          {/* Display error */}
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}

          {/* Submit button */}
          <motion.button
            type="submit"
            className="mt-5 w-full py-3 px-4 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit
          </motion.button>
        </form>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">Login</Link>
        </p>
      </div>
    </motion.div>
  );
}
