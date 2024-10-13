import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="flex space-x-2">
        <div className="dot bg-blue-600"></div>
        <div className="dot bg-blue-700 animation-delay-75"></div>
        <div className="dot bg-blue-800 animation-delay-150"></div>
      </div>
      <p className="mt-4 text-blue-600 text-lg font-semibold"></p>
      <style jsx>{`
        .dot {
          width: 16px; /* Dot size */
          height: 16px; /* Dot size */
          border-radius: 50%; /* Make it a circle */
          animation: dot-pulse 1s infinite ease-in-out;
        }

        .animation-delay-75 {
          animation-delay: 0.075s; /* Delay for the second dot */
        }

        .animation-delay-150 {
          animation-delay: 0.15s; /* Delay for the third dot */
        }

        @keyframes dot-pulse {
          0%, 80%, 100% {
            transform: scale(1);
          }
          40% {
            transform: scale(1.5); /* Scale up the dot */
          }
        }

        @media (max-width: 768px) {
          .dot {
            width: 12px; /* Smaller size for mobile */
            height: 12px; /* Smaller size for mobile */
          }
          .mt-4 {
            margin-top: 2px; /* Reduce spacing for mobile */
          }
          .text-lg {
            font-size: 1rem; /* Smaller font size for mobile */
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
