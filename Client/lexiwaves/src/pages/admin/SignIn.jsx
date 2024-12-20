import React, { useState, useEffect, useReducer } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { DotBackground } from "../../components/Background";
import { Link, useNavigate } from 'react-router-dom';
import api from "../../service/api";
import { toast } from "sonner";
import { login } from "../../redux/authSlice";
import { useDispatch } from "react-redux";

const AdminSignin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigator = useNavigate();





    useEffect(() => {
        // Check if access token exists
        const accessToken = localStorage.getItem('access');
        if (accessToken) {
            navigator('/admin-dashboard');
        }
    }, [navigator]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/lexi-admin/admin-login/', {
                email,
                password
            });
            if (response.status === 401){
                toast.error('Invalid credentials or not a staff user')
            }

            // Check if the response is successful
            if (response.status === 200) {
                const { refresh, access, user } = response.data;

                dispatch(login({
                    accessToken: access,
                    refreshToken: refresh,
                    user: user,
                    userRole: user.user_type,
                }));

                toast.success('SignIn Successful');
                navigator('/admin-dashboard');
            } else {
                // Handle unexpected response status
                toast.error('Unexpected response from server');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'An error occurred, please try again';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
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
            <div className="max-w-md mt-32 w-full mx-auto rounded-lg md:rounded-2xl p-4 md:p-12 shadow-input bg-white dark:bg-black border border-black dark:border-neutral-800">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Admin Sign In for LexiWaves
                </h2>

                <div>
                    {message && (
                        <p className="text-green-600 text-sm mt-2">
                            {message}
                        </p>
                    )}
                </div>

                <form className="my-8" onSubmit={handleSubmit}>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            placeholder="admin@example.com"
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
                           {loading ? 'Sign In....' : 'Sign In ➔'}
                        <BottomGradient />
                    </button>

                    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                  
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
        <div className={`flex flex-col space-y-2 w-full ${className}`}>
            {children}
        </div>
    );
};

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
                className={`flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent 
                file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
                focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
                disabled:cursor-not-allowed disabled:opacity-50
                dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
                group-hover/input:shadow-none transition duration-400`}
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

export default AdminSignin;
