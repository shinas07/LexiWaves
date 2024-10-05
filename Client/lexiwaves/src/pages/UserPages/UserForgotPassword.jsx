// Client/lexiwaves/src/pages/UserPages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { DotBackground } from "../../components/Background";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import { Toaster, toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResendButton, setShowResendButton] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Invalid email address");
      return; // Exit if the email is invalid
    }
    setLoading(true);

    try {
      const response = await api.post('/user/password-change-otp/', { email });
      toast.success(response.data.message || 'OTP sent successfully!');
      setStep(2);
      startTimer();
    } catch (err) {
      toast.error(err.response?.data.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = {};

    // Validate passwords
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (newPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!newPassword.match(/[!@#$%^&*(),.?":{}|<>]/)) {
      newErrors.password = "Password must contain a special character";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return; // Exit if there are validation errors
    }

    try {
      const response = await api.post('/user/password-verify-otp/', { email, otp, newPassword });
      toast.success('Password changed successfully!');
      navigate('/signin');
    } catch (err) {
      toast.error(err.response?.data.error || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimeLeft(120); // 2 minutes
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setShowResendButton(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  };

  return (
    <DotBackground>
      <div className="max-w-md mt-16 w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          {step === 1 ? "Forgot Password" : "Verify Your OTP"}
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          {step === 1
            ? "Enter your email to receive a verification code."
            : "We have sent a verification code to your email. Please enter the code below to reset your password."}
        </p>

        <form className="my-8" onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}>
          {step === 1 ? (
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="•••••"
                  required
                />
              </div>
         
                <div className="mb-4 ">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <div className="mb-8 flex flex-col gap-4 ">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
           
            </>
          )}

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-base text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] "
            type="submit"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Loading..." : (step === 1 ? "Send OTP" : "Verify & Change Password")}
            <BottomGradient />
          </button>

          {step === 2 && (
            <div className="text-sm text-neutral-600 dark:text-neutral-300 mt-4">
              {!showResendButton ? (
                <p className="text-gray-500">You can request a new OTP in {timeLeft} seconds.</p>
              ) : (
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleSendOtp(); }}
                  className="text-cyan-500 hover:underline"
                >
                  Resend OTP
                </a>
              )}
            </div>
          )}
        </form>
      </div>
    </DotBackground>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <motion.div className="p-[2px] rounded-lg transition duration-300 group/input">
      <input
        type={type}
        className={`flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent 
          file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
          focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
          disabled:cursor-not-allowed disabled:opacity-50
          dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
          group-hover/input:shadow-none transition duration-400 ${className}`}
        ref={ref}
        {...props}
      />
    </motion.div>
  );
});

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
));

export default ForgotPassword;