
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function DotBackground({ children }) {
  const [showHeader, setShowHeader] = useState(true)
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowHeader(false)
      } else {
        setShowHeader(true);    
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className=" min-h-screen w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative">
          {showHeader && (
      <div className="fixed top-8 left-6 p-4 text-3xl font-Poppins text-white z-10">
          <Link to='/'>
      LexiWaves
    </Link>

        <span className="block w-full h-px bg-gradient-to-r from-transparent via-teal-700 to-transparent"></span>
      </div>

)}
      

      {/* <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="relative z-20 bg-clip-text text-transparent bg-gradient-to-b py-8">
        {children}
      </p> */}
       <div className="relative z-20 bg-clip-text text-transparent bg-gradient-to-b py-8">
        {children}
      </div>
    </div>
  );
}

