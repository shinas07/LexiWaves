import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DotBackground } from '../../components/Background'; // Adjust path as needed
import { AlertCircle } from 'lucide-react';
import api from '../../service/api';
import { toast } from 'sonner';
import Layout from './Layout';

const AdminLanguages = () => {
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState({ name: '', code: '' });
  const [errors, setErrors] = useState({}); // Define errors state

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    
    api.get('/lexi-admin/languages/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(response => setLanguages(response.data))
    .catch(error => {
      const errorMsg = error.response?.data?.error || "Failed to fetch languages";
      toast.error(errorMsg);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLanguage(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, code } = newLanguage;

    if (!name.trim() || !code.trim()) {
      toast.error('All fields are required');
      return;
    }

    api.post('/lexi-admin/languages/', newLanguage)
      .then(response => {
        setLanguages([...languages, response.data]);
        setNewLanguage({ name: '', code: '' });
        setErrors({}); // Clear errors if the submission is successful
        toast.success("Language successfully created and added to the list!");
      })
      .catch(error => {
        const errorMsg = error.response?.data?.error || "An error occurred";
        toast.error(errorMsg);
      });
  };

  return (
    <Layout>
    {/* // <DotBackground> */}
      <div className="mt-16 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Manage Languages</h1>
        <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-300 mb-2">Language Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newLanguage.name}
                onChange={handleChange}
                className="block w-full text-lg rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
                placeholder="Enter language name"
                required
              />
            </div>
            <div>
              <label htmlFor="code" className="block text-lg font-medium text-gray-300 mb-2">Language Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={newLanguage.code}
                onChange={handleChange}
                className="block w-full text-lg rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
                placeholder="Enter language code"
                required
              />
            </div>
            {errors.form && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.form}
              </p>
            )}
            <div className="text-center">
              <button 
                type='submit'
                className="shadow-[inset_0_0_0_2px_#616467] text-sm text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200"
              >
                Add Language
              </button>
            </div>
          </div>
        </form>

        <div className="mt-12 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Existing Languages</h2>
          <hr className='mb-6' />
          <ul className="flex flex-wrap gap-2 justify-center">
            {Array.isArray(languages) && languages.length > 0 ? (
              languages.map(lang => (
                <li key={lang.id} className="text-gray-300 flex items-center">
                  <span className="inline-block px-4 py-2 rounded-full bg-gray-800 text-white text-sm font-semibold mr-2">
                    {lang.name} ({lang.code})
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-400 text-center mt-4">No languages available</p>
            )}
          </ul>
        </div>

      </div>
   </Layout>
  );
};

export default AdminLanguages;
