import React from 'react';

function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-10">
      {/* Social Media Section */}
      <div className="container mx-auto flex justify-center space-x-6 mb-6">
        {/* Social Media Links */}
        <a href="https://github.com" className="text-gray-400 hover:text-white transition duration-200">
          <i className="fab fa-github text-2xl"></i>
        </a>
        {/* Add other social icons similarly */}
      </div>

      {/* Links Section */}
      <div className="container mx-auto flex justify-center space-x-8 text-sm mb-6">
        <a href="#" className="text-gray-400 hover:text-white transition duration-200">About Us</a>
        {/* Add other footer links similarly */}
      </div>

      {/* Logo and Rights Section */}
      <div className="container mx-auto flex justify-center items-center">
        <img src="https://yourprojectlogo.com/logo.png" alt="Project Logo" className="w-10 h-10 mr-4" />
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Your Project Name. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
