import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCoursePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        language: 'English',
        duration: '',
        price: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Course Created:', formData);
        navigate('/courses'); // Redirect to the courses page after submission
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <header className="w-full bg-gray-800 shadow-md py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-400">Lexiwaves</h1>
                    <nav className="flex space-x-4">
                        <Link to="/profile" className="text-sm font-medium hover:text-gray-400">Profile</Link>
                        <Link to="/courses" className="text-sm font-medium hover:text-gray-400">My Courses</Link>
                        <button onClick={() => navigate('/')} className="text-sm font-medium hover:text-gray-400">Log Out</button>
                    </nav>
                </div>
            </header>

            {/* Main Section */}
            <main className="flex-grow w-full flex justify-center items-center">
                <div className="max-w-4xl bg-gray-800 rounded-lg shadow-lg p-8 md:p-16">
                    <h2 className="text-3xl font-semibold text-center mb-8 text-gray-200">Create a New Course</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-lg font-medium text-gray-300">Course Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-lg font-medium text-gray-300">Course Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                required
                                className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="language" className="block text-lg font-medium text-gray-300">Language</label>
                            <select
                                id="language"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="Arabic">Arabic</option>
                                {/* Add more languages as needed */}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="duration" className="block text-lg font-medium text-gray-300">Duration (in hours)</label>
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-lg font-medium text-gray-300">Price ($)</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition-colors"
                            >
                                Create Course
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full bg-gray-800 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm text-gray-400">© 2024 Lexiwaves. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default CreateCoursePage;
