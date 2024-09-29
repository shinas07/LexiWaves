import React, { useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { DotBackground } from "../../components/Background";
import { Link, useNavigate } from "react-router-dom";
import api from "../../service/api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";


const TutorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/tutor/login/", {
        email,
        password,
      });

      // dispatch(tutorLogin({
      //   user : {email},
      //   accessToken: response.data.access,
      //   refreshToken: response.data.refresh,
      // }))
      

      localStorage.setItem("tutor", JSON.stringify({ email }));
      sessionStorage.setItem("access", response.data.access);
      sessionStorage.setItem("refresh", response.data.refresh);

      console.log('backend responce', response.data.has_submitted_details)
      if (response.data.has_submitted_details) {
        toast.success('Tutor Login Successful');
        navigate("/tutor-dashboard");
      } else {
        toast.info('Please complete your details');
        navigate("/tutor-details");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <DotBackground>
      <div className="max-w-md mt-32 w-full mx-auto rounded-lg md:rounded-2xl p-4 md:p-12 shadow-input bg-white dark:bg-black border broder-black dark:border-neutral-800">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Tutor Login
        </h2>
        <div className="mt-2">
          <p className="text-xs text-sm text-neutral-600 dark:text-neutral-400 ">
          Welcome back, Tutor! Sign in to inspire and guide your students today.
          </p>
        </div>

        <div>
          {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
        </div>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="tutoremail@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </LabelInputContainer>
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-base text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Sign In &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="text-sm text-center mt-4">
            <Link
              to="/tutor-signup"
              className="text-white hover:underline hover:decoration-cyan-500"
            >
              Don't have an account? Sign up as Tutor
            </Link>
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

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const radius = 100;
  const [visible, setVisible] = useState(false);
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
          radial-gradient(
            ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
            var(--blue-500),
            transparent 80%
          )
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="p-[2px] rounded-lg transition duration-300 group/input"
    >
      <input
        type={type}
        className={cn(
          `flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent 
          file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
          focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
          disabled:cursor-not-allowed disabled:opacity-50
          dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
          group-hover/input:shadow-none transition duration-400`,
          className
        )}
        ref={ref}
        {...props}
      />
    </motion.div>
  );
});

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export default TutorLogin;
