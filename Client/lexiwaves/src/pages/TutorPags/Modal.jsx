import React from 'react';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-b-gray-800"></div>
        <h2 className="text-lg font-bold mb-4">Request In Progress</h2>
        <p className="text-sm mb-6">Your request is being processed. Please wait a moment while we handle your submission.</p>
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/tutor-dashboard')}
            className="bg-gradient-to-br from-blue-500 to-blue-700 text-sm text-white font-medium py-2 px-4 rounded-md shadow-lg hover:from-blue-600 hover:to-blue-800 transition ease-in-out duration-300 flex items-center"
          >
            Home &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
