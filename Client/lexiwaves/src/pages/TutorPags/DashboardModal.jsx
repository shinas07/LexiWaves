// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { FaTimes } from "react-icons/fa";

// const TutorDetailsModal = ({ showModal, setShowModal }) => {
//   // Close modal function
//   const handleClose = () => setShowModal(false);

//   if (!showModal) return null; // If modal is closed, return nothing

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm"
//         onClick={handleClose}
//       ></div>

//       {/* Modal Box */}
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -50 }}
//         transition={{ duration: 0.3 }}
//         className="fixed z-50 inset-0 flex items-center justify-center"
//       >
//         <div className="relative bg-white dark:bg-black rounded-lg shadow-lg max-w-md w-full p-6">
//           {/* Close Button */}
//           <button
//             className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
//             onClick={handleClose}
//           >
//             <FaTimes />
//           </button>

//           {/* Modal Content */}
//           <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
//             Complete Your Tutor Details
//           </h3>
//           <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
//             Please fill in all the required tutor details. Once completed, the
//             admin will review and approve your account. After approval, you can
//             create courses and access additional features.
//           </p>

//           {/* Action Button */}
//           <button
//             onClick={() => {
//               handleClose();
//               // Navigate to the tutor details page
//               // Replace with your actual navigation logic
//               window.location.href = "/tutor-details";
//             }}
//             className="w-full bg-gradient-to-br from-black to-gray-800 text-white rounded-md py-2 px-4 text-sm font-medium"
//           >
//             Go to Tutor Details Page
//           </button>
//         </div>
//       </motion.div>
//     </>
//   );
// };

// export default TutorDetailsModal;
