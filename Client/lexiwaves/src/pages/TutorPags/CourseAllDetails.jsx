import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book, Clock, DollarSign, BarChart, Edit, ArrowLeft, GraduationCap, List, BrainCircuit } from 'lucide-react';
import api from '../../service/api';
import { toast } from 'sonner';
import TutorDashboardLayout from './TutorDashboardLayout';
import Loader from '../Loader';

const CourseAndQuizDetails = () => {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const [course, setCourse] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try{
                const token = localStorage.getItem('accessToken')
                const response = await api.get(`/tutor/qiuz-course/details/${courseId}/`, {
                                                     
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCourse(response.data);
            } catch (error) {
                console.log('error ',error)
                toast.error('Failed to fetch course details');
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetails()

    },[courseId]);

    if (loading) {
        return (
            <TutorDashboardLayout>
                <div className="h-screen flex items-center justify-center">
                    <Loader />
                </div>
            </TutorDashboardLayout>
        );
    }

    return (
        <TutorDashboardLayout>
            <div className="container mx-auto p-6 mt-8">
                {/* Header with Navigation */}
                <div className="flex justify-between items-center mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Courses
                    </button>
                    <button
                        onClick={() => navigate(`/course/${courseId}/edit`)}
                        className="flex items-center px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Course
                    </button>
                </div>

                {/* Course Header */}
                <div className="relative mb-8">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden">
                        <img 
                            src={course.thumbnail_url} 
                            alt={course.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
                    <div className="absolute bottom-0 left-0 p-8">
                        <h1 className="text-4xl font-bold text-white mb-2">{course.title}</h1>
                        <div className="flex items-center space-x-4 text-gray-200">
                            <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {course.duration} hours
                            </span>
                            <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {course.price}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                course.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                course.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                                {course.difficulty}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Course Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <Book className="w-5 h-5 mr-2" />
                                Course Description
                            </h2>
                            <p className="text-gray-300 leading-relaxed">{course.description}</p>
                        </div>

                        {/* Lessons */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <List className="w-5 h-5 mr-2" />
                                Course Lessons
                            </h2>
                            <div className="space-y-3">
                                {course.lessons.map((lesson, index) => (
                                    <div 
                                        key={lesson.id}
                                        className="flex items-center p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        <span className="w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-lg mr-3">
                                            {index + 1}
                                        </span>
                                        <span className="text-gray-200">{lesson.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quizzes */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <BrainCircuit className="w-5 h-5 mr-2" />
                                Course Quizzes
                            </h2>
                            <div className="space-y-3">
                                {course.questions.map((question, index) => (
                                    <div 
                                        key={question.id}
                                        className="p-4 bg-gray-700/50 rounded-lg"
                                    >
                                        <p className="text-gray-200">Q{index + 1}: {question.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Course Stats */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <BarChart className="w-5 h-5 mr-2" />
                                    Course Stats
                                </h2>
                                {/* Add course stats here */}
                            </div>

                            {/* Course Certification */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <GraduationCap className="w-5 h-5 mr-2" />
                                    Course Certification
                                </h2>
                                <p className="text-gray-300 leading-relaxed">{course.certification ? 'This course provides a certification upon completion.' : 'No certification provided for this course.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TutorDashboardLayout>
    );
};

export default CourseAndQuizDetails;
