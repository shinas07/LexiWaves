import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book, DollarSign, BarChart, Save, ArrowLeft } from 'lucide-react';
import api from '../../service/api';
import { toast } from 'sonner';
import TutorDashboardLayout from './TutorDashboardLayout';
import Loader from '../Loader';

const CourseEdit = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState({
        title: '',
        description: '',
        thumbnail_url: '',
        difficulty: '',
        price: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await api.get(`/tutor/course/details/${courseId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCourse(response.data);
            } catch (error) {
                setError('Failed to fetch course details');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse((prevCourse) => ({
            ...prevCourse,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.put(`/tutor/course/details/${courseId}/`, course, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Course updated successfully!');
            // Optionally, navigate to course details after updating
            // navigate(`/tutor/courses/${courseId}`);
        } catch (error) {
            toast.error('Failed to update course. Please try again.');
        }
    };

    if (loading) {

        return(
        <TutorDashboardLayout>
         <div className="flex justify-center items-center h-screen text-white"><Loader/></div>;
         </TutorDashboardLayout>
        )
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <TutorDashboardLayout>
            <div className="container mx-auto p-6 mt-8">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Courses
                    </button>
                    <h1 className="text-3xl font-bold text-white">Edit Course</h1>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Preview Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 sticky top-24">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                                <Book className="w-5 h-5 mr-2" />
                                Course Preview
                            </h2>
                            <div className="space-y-6">
                                <img 
                                    src={course.thumbnail_url} 
                                    alt="Course Thumbnail" 
                                    className="w-full h-48 object-cover rounded-xl shadow-lg"
                                />
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Difficulty</span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            course.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                            course.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>
                                            {course.difficulty}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Price</span>
                                        <span className="text-white font-medium flex items-center">
                                            <DollarSign className="w-4 h-4 mr-1" />
                                            {course.price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Title Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Course Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={course.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                                             text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 
                                             focus:border-transparent transition duration-200"
                                    placeholder="Enter course title"
                                    required
                                />
                            </div>

                            {/* Description Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Description</label>
                                <textarea
                                    name="description"
                                    value={course.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                                             text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 
                                             focus:border-transparent transition duration-200 resize-none"
                                    rows="6"
                                    placeholder="Describe your course..."
                                    maxLength="500"
                                    required
                                />
                                <p className="text-sm text-gray-500 text-right">
                                    {course.description.length} / 500
                                </p>
                            </div>

                            {/* Difficulty Select */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Difficulty Level</label>
                                <select
                                    name="difficulty"
                                    value={course.difficulty}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                                             text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                             transition duration-200"
                                >
                                    <option value="easy">Beginner</option>
                                    <option value="medium">Intermediate</option>
                                    <option value="hard">Advanced</option>
                                </select>
                            </div>

                            {/* Price Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Course Price</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        name="price"
                                        value={course.price}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 
                                                 rounded-xl text-white placeholder-gray-400 focus:ring-2 
                                                 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-6">
                                <button
                                    type="submit"
                                    className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl
                                             hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/50 
                                             transition duration-300"
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </TutorDashboardLayout>
    );
};

export default CourseEdit;
