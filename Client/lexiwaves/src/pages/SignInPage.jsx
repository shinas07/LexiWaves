import React, {useState, useEffect} from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { DotBackground } from "../components/Background";
import { Link, useLocation, useNavigate} from 'react-router-dom';
import api from "../service/api";
import { toast } from "react-toastify";

// import { useLocation, useNavigate } from 'react-router-dom';


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigator = useNavigate()
    // const location = useLocation();
    // const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await api.post('/api/login/', {
                email,
                password
            })
            localStorage.setItem('user', JSON.stringify({ email }));
            sessionStorage.setItem('access', response.data.access);
            sessionStorage.setItem('refresh', response.data.refresh);
            toast.success('Login successful');
            navigator('/');
        }catch(error){
            if (error.response && error.response.status === 401) {
                toast.error('Wrong email or password');
            } else {
                toast.error('Login faild. Try again');
            }
        }
    };


    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(''); 
            }, 5000);

            return () => clearTimeout(timer); 
        }
    }, [message]);
    

    return (
        <DotBackground>
          <div className="max-w-md mt-16 w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
              Welcome Back to LexiWaves
            </h2>
            {/* <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
              Sign in to continue
            </p> */}

            <div>
            {message && (
                <p className="text-green-600 text-sm mt-2">
                    {message}
                </p>
            )}
            {/* Your login form here */}
        </div>

            <form className="my-8" onSubmit={handleSubmit}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="johndoe@example.com" type="email"  value={email}
                            onChange={(e) => setEmail(e.target.value)}/>

              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="••••••••" type="password"  value={password}
                            onChange={(e) => setPassword(e.target.value)}/>
              </LabelInputContainer>
              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-base text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                type="submit"
              >
                Sign In &rarr;
                <BottomGradient />
              </button>
    
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
    
              <div className="flex flex-col space-y-4">
                <SocialButton icon={<IconBrandGithub />} label="GitHub" />
                <SocialButton icon={<IconBrandGoogle />} label="Google" />
              </div>
            </form>
    
            <div className="text-sm text-center mt-4">
              <Link to="/signup" className="text-white hover:underline hover:decoration-cyan-500">
                Don't have an account? Sign up
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
    
    export default Login;