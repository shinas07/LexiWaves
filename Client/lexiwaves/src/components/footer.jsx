import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-gray-300 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between mb-8">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-4">LexiWaves</h2>
            <p className="text-sm">
              LexiWaves helps language learners improve their skills through expert tutorials and interactive exercises.
            </p>
            <div className="mt-4 flex items-center">
              <span className="mr-2 text-green-500">●</span>
              <span className="text-sm">All systems online</span>
            </div>
          </div>

          <div className="w-full md:w-1/5 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
            <ul className="text-sm">
              <li className="mb-2"><a href="#" className="hover:text-white">Community Forum</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white">Language Apps</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white">Learning Resources</a></li>
            </ul>
          </div>

          <div className="w-full md:w-1/5 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="text-sm">
              <li className="mb-2"><a href="#" className="hover:text-white">Support</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white">Contact</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div className="w-full md:w-1/5 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Miscellaneous</h3>
            <ul className="text-sm">
              <li className="mb-2"><a href="#" className="hover:text-white">Developer Docs</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white">Blog</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white">Partnerships</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center pt-8 border-t border-gray-700">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Legal Information</h3>
            <ul className="text-sm flex flex-wrap">
              <li className="mr-4 mb-2"><a href="#" className="hover:text-white">Terms & Service</a></li>
              <li className="mr-4 mb-2"><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li className="mb-2"><a href="#" className="hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
          <div className="w-full md:w-auto text-sm">
            © {new Date().getFullYear()} LexiWaves. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;