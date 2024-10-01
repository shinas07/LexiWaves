import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';
import { Clock, BarChart, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import FloatingNavbar from '../../components/Navbar';
import PaymentEnrollButton from './CoursePayment';
import { useSelector } from 'react-redux';

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isLoggedIn = useSelector(((state) => state.auth.isAuthenticated))
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`/user/course/${id}/`);
                setCourse(response.data);
           
                setLoading(false);
          

            } catch (err) {
                setError('Failed to load course details');
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);
    



    if (loading) return <div className="text-white text-center mt-8">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

    return (
        <DotBackground>
            <FloatingNavbar />

            <div className="max-w-4xl mx-auto p-6 mt-32 bg-gray-900 rounded-lg shadow-lg">
                {/* Video Player */}
                <video 
                    controls 
                    className="w-full h-64 object-cover rounded-t-lg"
                    src={course.video_url} // Use the video URL here
                >
                    Your browser does not support the video tag.
                </video>
                
                <div className="p-6">
                    <h2 className="text-4xl font-semibold text-white mb-4">{course.title}</h2>
                    <p className="text-gray-300 text-sm mb-4">{course.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-300 mb-4">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{course.duration} hours</span>
                        </div>
                        <div className="flexitems-center">
                            <BarChart className="w-4 h-4 mr-1" />
                            <span>{course.difficulty}</span>
                        </div>
                        <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>{course.price}</span>
                        </div>
                    </div>

                {/* Course Content */}
                <div className="mb-6 mt-6">
                    <h2 className="text-2xl font-semibold text-white mb-4">
                        Course Content
                    </h2>
                    <div>
                    {course.lessons && course.lessons.length > 0 ? (
                            course.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="mb-4">
                                    <h4 className="text-lg font-semibold text-gray-200">
                                        Lesson {lessonIndex + 1}: {lesson.title}
                                    </h4>
                                    <p className="text-sm text-gray-200">
                                        {lesson.description}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-600">No lessons available</p>
                        )}


                    </div>
                </div>
               
                <div className='flex text-sm justify-center'>
            <button
                className={` 
                            ${isLoggedIn ? '' : ' mt-6 text-red-800 cursor-not-allowed'}`}
                disabled={!isLoggedIn} 
            >
                {isLoggedIn ? <PaymentEnrollButton courseId={course.id} /> : 'Log in to Enroll'}
            </button>
        </div>
                </div>
            </div>
        </DotBackground>
    );
};

export default CourseDetail;