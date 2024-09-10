import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { DotBackground } from '../../components/Background';


const TutorSetup = () => {
  const navigate = useNavigate()


  const handleContinue = () => {
    console.log('button cliked');
    
    navigate('/tutor-details')

  };


  return (

    <div className="flex justify-center items-center min-h-screen">
      <DotBackground>
      <div className="max-w-md mt-36 w-full mx-auto rounded-lg md:rounded-2xl p-4 md:p-16 shadow-input bg-white dark:bg-black border border-black dark:border-neutral-800">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Tutor Profile Setup
        </h2>
        <div className="mt-2">
        <p className="text-xs text-sm text-neutral-600 dark:text-neutral-400">
  Welcome, Tutor! Complete your profile to unlock course creation. Approval is required for course setup.
  
</p>

        </div>

        <div className="mt-8">
          <button
            onClick={handleContinue}
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-base text-white rounded-md h-12  font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] "
          >
            Continue &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="text-sm text-center mt-4">
            <Link
              to="/"
              className="text-white hover:underline hover:decoration-cyan-500"
            >
              Skip to Homepage
            </Link>
          </div>
        </div>
      </div>
  
    </DotBackground>
    </div>


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


export default TutorSetup;
