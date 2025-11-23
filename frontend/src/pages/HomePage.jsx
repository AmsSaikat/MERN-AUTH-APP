import React from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/AuthStore";
import { LogOut, User } from "lucide-react";

export default function HomePage() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-gray-900 bg-opacity-60 backdrop-blur-xl 
        rounded-2xl shadow-2xl border border-gray-700 p-8"
      >
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text
          bg-linear-to-r from-green-400 to-emerald-500 mb-6">
          Dashboard
        </h1>

        {/* USER CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/60 p-6 rounded-xl shadow-lg border border-gray-700"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex justify-center items-center bg-green-500/20 
            rounded-full border border-green-500">
              <User size={34} className="text-green-400" />
            </div>

            <div>
              <p className="text-gray-300 text-sm">Welcome back,</p>
              <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <p className="text-gray-400">
              <span className="font-semibold text-gray-300">Name: </span>
              {user?.name}
            </p>

            <p className="text-gray-400">
              <span className="font-semibold text-gray-300">Email: </span>
              {user?.email}
            </p>
          </div>
        </motion.div>

        {/* LOGOUT BUTTON */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full mt-6 flex items-center justify-center gap-2 
          bg-linear-to-r from-red-500 to-red-600 text-white font-semibold py-3 
          rounded-lg shadow-lg hover:from-red-600 hover:to-red-700"
        >
          <LogOut size={20} /> Logout
        </motion.button>
      </motion.div>
    </div>
  );
}
