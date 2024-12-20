import React, { useState, useEffect} from "react";
import { motion } from "framer-motion";
import { DotBackground } from "../../components/Background";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import { toast } from "sonner";

const TutorOtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [showResendButton, setShowResendButton] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);


  useEffect(() => {
    const savedTime = localStorage.getItem('otpRequestTime');
    if (savedTime) {
      const elapsed = Math.floor((Date.now() - parseInt(savedTime)) / 1000);
      const remaining = 120 - elapsed; // 120 seconds (2 minutes)
  
      if (remaining > 0) {
        setTimeLeft(remaining);
        setShowResendButton(false);
        startTimer();
      } else {
        setShowResendButton(true);
      }
    } else {
      setShowResendButton(true);
    }
  }, []);

    // Add this effect to handle navigation
    useEffect(() => {
      // Check if user is already verified
      const isVerified = sessionStorage.getItem('isVerified');
      if (isVerified === 'true') {
        navigate('/tutor-signin', { replace: true });
      }
  
      // Prevent going back
      window.history.pushState(null, '', window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, '', window.location.href);
      };
  
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }, [navigate]);

  const startTimer = () => {
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

  const handleResendOtp = async () => {
    setLoading(true);
  
    const email = localStorage.getItem('userEmail');
    console.log(email)
  
    try {
      const response = await api.post('/tutor/resend-otp/', { email });
      toast.success(response.data.message || 'OTP sent successfully!');
      setShowResendButton(false);
      setTimeLeft(120);
      localStorage.setItem('otpRequestTime', Date.now().toString());
      startTimer();
    } catch (err) {
      toast.error(err.response?.data.error || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tutorData = JSON.parse(sessionStorage.getItem('tempTutorData'));
    console.log('userdata', tutorData)
    setLoading(true);

    const email = localStorage.getItem("tutorEmail")
    if (!email){
        setErrorMessage('No email found. Pleace try again.');
        setLoading(false);
        return;
    }

    try {
        const response = await api.post('/tutor/verify_email/', {
            email,
            otp,
            tutor_data: tutorData
        });

       
        if (response.status === 201) {
            sessionStorage.removeItem('tempTutorData');
            toast.success('User created, log in to continue')
            navigate('/tutor-signin');
        } else{
      
            setErrorMessage(response.data.error || "Verification failed. Please check your OTP.");
        }
    } catch (error) {
        if (error.response && error.response.data) {
      
            setErrorMessage(error.response.data.error || "An error occurred. Please try again.");
            
        } else {
            setErrorMessage("An unexpected error occurred.");
        }
    } finally {
        setLoading(false);
    }
};
  return (
    <DotBackground>
      <div className="max-w-md mt-16 w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Verify Your Account
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        We have sent a verification code to your email. Please enter the code below to verify your account.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="•••••"
            />
          </div>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-base text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Verify &rarr;
            <BottomGradient />
          </button>
          <div className="text-sm text-neutral-600 dark:text-neutral-300 mt-4">
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {!showResendButton ? (
        <p className="text-gray-500">You can request a new OTP in {timeLeft} seconds.</p>
      ) : (
        <>
          Didn’t receive the code? 
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); handleResendOtp(); }} 
            className="text-cyan-500 hover:underline"
          >
            Resend
          </a>
        </>
      )}
      {loading && <p>Loading...</p>}
    </div>
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

export default TutorOtpVerification;
