
import React from "react";
import { Link } from "react-router-dom";

export function DotBackground({ children }) {
  return (
    <div className="min-h-screen w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative">
      <div className="fixed top-8 left-6 p-4 text-3xl font-Poppins text-white z-10">
          <Link to='/'>
      LexiWaves
    </Link>

        <span className="block w-full h-px bg-gradient-to-r from-transparent via-teal-700 to-transparent"></span>
      </div>
      

      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        {children}
      </p>
    </div>
  );
}

