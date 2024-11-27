import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';
import { Clock, BarChart, DollarSign, BookOpen, Play, BookX, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import FloatingNavbar from '../../components/Navbar';
import PaymentEnrollButton from './CoursePayment';
import { useSelector } from 'react-redux';
import Loader from '../Loader';

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isLoggedIn = useSelector(((state) => state.auth.isAuthenticated))
    const navigate = useNavigate()

    // Prevent right click
    const preventRightClick = (e) => {
        e.preventDefault();
    };

    // Prevent keyboard shortcuts
    const preventKeyboardShortcuts = (e) => {
        if (
            (e.ctrlKey && e.key === 's') || // Prevent Ctrl + S
            (e.ctrlKey && e.key === 'c') || // Prevent Ctrl + C
            (e.ctrlKey && e.key === 'u') || // Prevent Ctrl + U
            e.key === 'F12'                 // Prevent F12
        ) {
            e.preventDefault();
        }
    };

    useEffect(() => {
        // Add keyboard event listener
        document.addEventListener('keydown', preventKeyboardShortcuts);
        
        // Cleanup
        return () => {
            document.removeEventListener('keydown', preventKeyboardShortcuts);
        };
    }, []);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`/user/course/details/${id}/`);
                setCourse(response.data);
           
                setLoading(false);
          

            } catch (err) {
                setError('Failed to load course details');
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);
    



    if (loading) return (
    <DotBackground>
    <Loader/>
    </DotBackground>
)
    ;
    if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

    return (
        <DotBackground>
            <FloatingNavbar />
            <div className="max-w-7xl mx-auto p-6 mt-24">
                {/* Hero Section */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {course.title}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl">
                        {course.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Secured Video Player */}
                        <div className="rounded-3xl overflow-hidden border border-white/5">
                            <div className="relative">
                                <video 
                                    // Basic controls
                                    controls
                                    playsInline
                                    
                                    // Prevent download
                                    controlsList="nodownload noplaybackrate"
                                    
                                    // Prevent right-click
                                    onContextMenu={preventRightClick}
                                    
                                    // Prevent picture-in-picture
                                    disablePictureInPicture
                                    
                                    // Prevent copying
                                    onCopy={preventRightClick}
                                    
                                    // Additional security attributes
                                    disableRemotePlayback
                                    
                                    // Styling
                                    className="w-full h-[480px] object-cover"
                                    
                                    // Source
                                    src={course.video_url}
                                    
                                    // Prevent selection
                                    draggable="false"
                                    
                                    // Additional properties to prevent interaction
                                    {...{
                                        'onDragStart': preventRightClick,
                                        'onDragEnd': preventRightClick,
                                        'onDragEnter': preventRightClick,
                                        'onDragOver': preventRightClick,
                                        'onDragLeave': preventRightClick,
                                        'onDrop': preventRightClick,
                                    }}
                                >
                                    Your browser does not support the video tag.
                                </video>
                                <div 
                                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" 
                                    onContextMenu={preventRightClick}
                                />
                            </div>
                        </div>

                        {/* Course Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                                <div className="p-2.5 bg-blue-500/10 rounded-xl">
                                    <Clock className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Duration</p>
                                    <p className="text-lg font-semibold text-white">{course.duration}h</p>
                                </div>
                            </div>
                            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                                <div className="p-2.5 bg-purple-500/10 rounded-xl">
                                    <BarChart className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Level</p>
                                    <p className="text-lg font-semibold text-white">{course.difficulty}</p>
                                </div>
                            </div>
                            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                                <div className="p-2.5 bg-green-500/10 rounded-xl">
                                    <DollarSign className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Price</p>
                                    <p className="text-lg font-semibold text-white">${course.price}</p>
                                </div>
                            </div>
                        </div>

                        {/* Course Content */}
                        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-indigo-400" />
                                Course Content
                            </h2>
                            <div className="space-y-4">
                                {course.lessons && course.lessons.length > 0 ? (
                                    course.lessons.map((lesson, lessonIndex) => (
                                        <div 
                                            key={lesson.id} 
                                            className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-4 rounded-xl transition-all duration-200"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 font-semibold group-hover:bg-indigo-500/20 transition-colors">
                                                    {lessonIndex + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-white font-medium mb-1 group-hover:text-indigo-400 transition-colors">
                                                        {lesson.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-400">
                                                        {lesson.description}
                                                    </p>
                                                </div>
                                                <Play className="w-5 h-5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <BookX className="w-8 h-8 text-gray-600" />
                                        </div>
                                        <p className="text-gray-400">No lessons available yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Enrollment Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
                                <div className="p-8">
                                    <div className="flex items-baseline justify-center gap-2 mb-6">
                                        <span className="text-4xl font-bold text-white">${course.price}</span>
                                        <span className="text-gray-400">USD</span>
                                    </div>
                                    
                                    {isLoggedIn ? (
                                        <PaymentEnrollButton courseId={course.id} />
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-center text-gray-400 text-sm">
                                                Please log in to enroll in this course
                                            </p>
                                            <Link 
                                                to="/login" 
                                                className="block w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-center transition-colors"
                                            >
                                                Log In to Continue
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="border-t border-white/5 p-6">
                                    <h3 className="text-white font-medium mb-4">What you'll get:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <Check className="w-5 h-5 text-green-400" />
                                            Full lifetime access
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <Check className="w-5 h-5 text-green-400" />
                                            Access on mobile and desktop
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <Check className="w-5 h-5 text-green-400" />
                                            Certificate of completion
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DotBackground>
    );
};

export default CourseDetail;