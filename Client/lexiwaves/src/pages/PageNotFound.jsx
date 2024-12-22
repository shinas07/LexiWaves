import React from 'react';
import { Link } from 'react-router-dom';
const PageNotFound = () => {
 return (
   <div className="min-h-screen bg-neutral-900 py-10 px-4 font-['Arvo']">
     <div className="container mx-auto">
       <div className="max-w-4xl mx-auto text-center">
         {/* 404 GIF Background */}
         <div className="flex justify-center items-center">
             <h1 className="text-6xl md:text-7xl font-bold text-white pt-16">
               404
             </h1>
           </div>
         </div>
          {/* Content Box */}
         <div className="mt-12 space-y-6">
           <h3 className="text-2xl md:text-3xl font-bold text-white">
             Looks like you're lost
           </h3>
           
           <p className="text-gray-400 mt-4 text-lg">
             The page you are looking for is not available!
           </p>
           
           <Link
             to="/"
             className="inline-block px-6 py-3 bg-gray-400/50 text-white rounded-lg hover:bg-gray-600/50 transition-colors duration-200 text-lg"
           >
             Go to Home
           </Link>
         </div>
       </div>
     </div>
 );
};
export default PageNotFound;