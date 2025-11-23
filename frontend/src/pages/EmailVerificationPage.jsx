import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/AuthStore";

export default function EmailVerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const {
    verifyEmail,
    emailForVerification,
    resendVerificationEmail,
    error,
    setError,
  } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30); // 30 seconds cooldown

  // Countdown effect
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (value, index) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== "" && index < 5) inputRefs.current[index + 1].focus();

    if (error) setError(null); // clear previous error
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const pasteHandler = (e) => {
    e.preventDefault();
    const clipboard =
      e.clipboardData?.getData("text") ||
      e.nativeEvent.clipboardData?.getData("text") ||
      "";
    if (!/^\d+$/.test(clipboard)) return;
    const digits = clipboard.slice(0, 6).split("");
    setCode((prev) => prev.map((_, i) => digits[i] || ""));
    const lastIndex = Math.min(digits.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const otp = code.join("");
    if (!emailForVerification) {
      alert("Missing email for verification");
      return;
    }

    try {
      setLoading(true);
      await verifyEmail(emailForVerification, otp);
      setLoading(false);
      alert("Email verified successfully!");
      navigate("/");
    } catch (err) {
      setLoading(false);
      // Error is automatically displayed from store
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await resendVerificationEmail(emailForVerification);
      setLoading(false);
      setResendTimer(30); // reset timer
      alert("Verification code resent!");
    } catch (err) {
      setLoading(false);
      console.error("Resend error:", err);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-6 bg-linear-to-br from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>

        <p className="text-gray-300 mb-6">
          Enter the 6-digit code sent to your email address
        </p>

        <div className="flex justify-center gap-3 mb-4">
          {code.map((value, i) => (
            <input
              key={i}
              inputMode="numeric"
              type="text"
              value={value}
              onPaste={pasteHandler}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              ref={(el) => (inputRefs.current[i] = el)}
              className="w-12 h-12 text-center text-xl text-white bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold mb-4"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="text-gray-300 text-sm">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resendTimer > 0 || loading}
            className={`font-semibold ${
              resendTimer > 0 ? "text-gray-500 cursor-not-allowed" : "text-green-400 hover:underline"
            }`}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
