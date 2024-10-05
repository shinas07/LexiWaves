import React, { useState, useEffect } from 'react';
// ... other imports ...
import { motion } from 'framer-motion';

// ... existing code ...

const Loader = ({ progress }) => {
  const [message, setMessage] = useState('Course is being created...');

  useEffect(() => {
    if (progress === 100) {
      setMessage('Course successfully created!');
    }
  }, [progress]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">{message}</h3>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <motion.div 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <p className="text-sm text-gray-600 text-center">{progress}% Complete</p>
      </div>
    </div>
  );
};

export default Loader;
