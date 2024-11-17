import React from 'react';

// Modal Component
export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-96">
        {children}
      </div>
      <div className="absolute top-0 right-0 p-2">
        <button onClick={onClose} className="text-gray-500">X</button>
      </div>
    </div>
  );
};

// Modal Header Component
export const ModalHeader = ({ children }) => (
  <div className="text-lg font-semibold">{children}</div>
);

// Modal Body Component
export const ModalBody = ({ children }) => (
  <div className="mt-4">{children}</div>
);

// Modal Footer Component
export const ModalFooter = ({ children }) => (
  <div className="mt-4 flex justify-between">{children}</div>
);

// Base Button Component
export const Button = React.forwardRef(({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-gray-900 text-gray-50 shadow hover:bg-gray-900/90",
    outline: "border border-gray-200 bg-white shadow-sm hover:bg-gray-100",
    premium: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow hover:from-purple-700 hover:to-pink-700",
    secondary: "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-100/80",
  };

  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

// Badge Component
export const Badge = ({ variant = "default", className = "", children }) => {
  const variants = {
    default: "bg-gray-900 text-gray-50",
    secondary: "bg-gray-100 text-gray-900",
    outline: "text-gray-950 border border-gray-200",
    success: "bg-green-500 text-white",
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Progress Component
export const Progress = ({ value = 0, className = "" }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}>
    <div
      className="h-full w-full flex-1 bg-purple-500 transition-all"
      style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
    />
  </div>
);

// Card Components
export const Card = ({ className = "", children }) => (
  <div className={`rounded-xl border border-gray-200 bg-white text-gray-950 shadow ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ className = "", children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ className = "", children }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ className = "", children }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Alert Component
export const Alert = ({ variant = "default", className = "", children }) => {
  const variants = {
    default: "bg-white text-gray-950",
    warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
  };

  return (
    <div className={`relative w-full rounded-lg border p-4 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

// Separator Component
export const Separator = ({ className = "" }) => (
  <div className={`h-[1px] w-full bg-gray-100 ${className}`} />
);

export default Modal;
