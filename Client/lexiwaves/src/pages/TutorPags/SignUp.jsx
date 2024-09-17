import React, { useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
// import { DotBackground } from "../components/Background";
// import { }
import { Link, useNavigate } from "react-router-dom";
import api from "../../service/api";
import { toast } from "sonner";
import { DotBackground } from "../../components/Background";


const TutorSignUP = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        user_type:'tutor'
    })
  

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);



    const validate = () => {
        const errors = {};
        const { first_name, last_name, email, password, confirm_password } = formData;
    
        if (!first_name.trim()) errors.first_name = "First name is required";
        if (!last_name.trim()) errors.last_name = "Last name is required";
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = "Invalid email address";
        if (password.length < 8) errors.password = "Password must be at least 8 characters";
        if (!password.match(/[!@#$%^&*(),.?":{}|<>]/)) errors.password = "Password must contain a special character";
        if (password !== confirm_password) errors.confirm_password = "Passwords do not match";
    
        setErrors(errors);

        removeErrorsAfterTimeout(errors);
        return Object.keys(errors).length === 0;
      };

      const removeErrorsAfterTimeout = (errors) => {
        Object.keys(errors).forEach((key) => {
          setTimeout(() => {
            setErrors((prevErrors) => {
              const updatedErrors = { ...prevErrors };
              delete updatedErrors[key];
              return updatedErrors;
            });
          }, 4000); // Adjust the timeout duration (3000 ms = 3 seconds) as needed
        });
      };


    const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [id]: value,
    }));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validate()) return;
    setIsSubmitting(true);

    const { email } = formData
    localStorage.setItem('tutorEmail', email);
    console.log(formData)
    try {

    const response = await api.post('/tutor/signup/', formData);
    sessionStorage.setItem('tempTutorData', JSON.stringify(formData));
      navigate('/tutor-otp')
    } catch (error) {
      let errorMessage = 'Signup failed. Please try again.';
        
      if (error.response && error.response.data) {
          // Handle specific backend error messages
          const data = error.response.data;
          if (data.error) {
              errorMessage = data.error;
          } else if (data.email) {
              errorMessage = 'Email already registered.';
          } else if (data.password) {
              errorMessage = 'Passwords do not match.';
          }
      }

      toast.error(errorMessage);
    };
  }

  return (
    <DotBackground>
    <div className="max-w-md mt-10 w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
 
        
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to LexiWaves Tutor Portal
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Sign up as a tutor on LexiWaves to start teaching.
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="first_name">First name</Label>
              <Input id="first_name" value={formData.first_name} onChange={handleChange} placeholder="John" type="text" />
              {errors.firstname && <p className="text-red-500 text-sm">{errors.first_name}</p>}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="last_name">Last name</Label>
              <Input id="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe" type="text" />
              {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" value={formData.email} onChange={handleChange} placeholder="johndoe@example.com" type="email" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" value={formData.password} onChange={handleChange} placeholder="••••••••" type="password" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input id="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="••••••••" type="password" />
            {errors.confirm_password && <p className="text-red-500 text-sm">{errors.confirm_password}</p>}
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-base text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign up "}
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <SocialButton icon={<IconBrandGithub />} label="GitHub" />
            <SocialButton icon={<IconBrandGoogle />} label="Google" />
          </div>
      </form>
      <div className="text-sm text-center mt-4">
            <Link to="/tutor-signin" className="text-white hover:underline hover:decoration-cyan-500 ">
            Already have an account? Sign in
            </Link>
        </div>
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

const SocialButton = ({ icon, label }) => (
  <button
    className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
    type="button"
  >
    {React.cloneElement(icon, { className: "h-4 w-4 text-neutral-800 dark:text-neutral-300" })}
    <span className="text-neutral-700 dark:text-neutral-300 text-sm">{label}</span>
    <BottomGradient />
  </button>
);

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const radius = 100;
  const [visible, setVisible] = React.useState(false);
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

export default TutorSignUP;