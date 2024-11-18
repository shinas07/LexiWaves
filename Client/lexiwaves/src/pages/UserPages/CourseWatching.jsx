import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useAsyncError } from 'react-router-dom';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';
import FloatingNavbar from '../../components/Navbar';
import { FaCheckCircle, FaLock } from 'react-icons/fa';
import Quiz from './Quiz';
import Loader from '../Loader';

const CourseWatchingPage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentLessonVideo, setCurrentLessonVideo] = useState(null);
    const [expandedLessonId, setExpandedLessonId] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizScore, setQuizScore] = useState(null);
    const [courseDataId, setCourseDataId] = useState()
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const watchTimeRef = useRef(0);
    const MINIMUM_WATCH_TIME = 300;


    

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const courseResponse = await api.get(`/user/watch-course/${courseId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                setCourse(courseResponse.data);
                setCourseDataId(courseResponse.data.id)
                setCurrentLessonVideo(courseResponse.data.video_url);
           
                // Fetch completed lessons
                const completedLessonsResponse = await api.get(`/student/completed-lessons/${courseResponse.data.id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCompletedLessons(completedLessonsResponse.data.completed_lessons);
                setLoading(false);
            } catch (err) {
              
                setError('Failed to load course');
                setLoading(false);
            }
            finally{
                setLoading(false)
            }
        };
    
        fetchCourse();
    }, [courseId]);

    const markLessonAsCompleted = async (lessonId) => {
        try {
            const token = localStorage.getItem('accessToken');
            await api.post('/student/mark-lesson-watched/', {
                lesson_id: lessonId,
                course_id: courseId
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCompletedLessons(prev => [...prev, lessonId]);
        } catch (error) {
            console.error('Failed to mark lesson as completed:', error);
        }
    };

    const handleStartQuiz = () => {
        navigate(`/quiz/${courseId}`);
    };

    const allLessonsCompleted = course && completedLessons.length === course.lessons.length;
    // console.log('tutorid',course.tutor)
    const handleTutorInteraction = () => {
     
        if (course && course.tutor) {
            navigate('/connect-tutor', { state: { tutorId: course.tutor,courseId:courseDataId } });
        }
    };

    const handleTimeUpdate = async () => {
        if (videoRef.current) {
            const currentTime = Math.floor(videoRef.current.currentTime);
            watchTimeRef.current = currentTime;

            // Check if watched for minimum time (5 minutes)
            if (currentTime >= MINIMUM_WATCH_TIME) {
                try {
                    const token = localStorage.getItem('accessToken');
                    await api.post('/student/record-watch-time/', {
                        course_id: courseId,
                        watch_time: currentTime,
                    }, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                } catch (error) {
                    console.error('Failed to record watch time:', error);
                }
            }
        }
    };
    

    if (loading) return(
        <DotBackground>
            <FloatingNavbar/>
    <div className="flex justify-center items-center h-screen">
        <Loader/>
    </div>
    </DotBackground>
    )

    if (error) return (
    <DotBackground>
    <FloatingNavbar />
    <div className="flex justify-center items-center h-screen text-red-500">{error}
    </div>;
    </DotBackground>
    )


    return (
        <DotBackground>
            <FloatingNavbar />
            {/* Interaction Button at Top Left */}
         
            <div className="container mx-auto p-6 mt-16">
                <h1 className="text-3xl font-bold mb-6 text-white">{course.title}</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* Video Player */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-4 text-white">
                                {expandedLessonId ? 'Lesson Video' : 'Course Preview'}
                            </h2>
                            {currentLessonVideo && (
                                <video 
                                    ref={videoRef}
                                    key={currentLessonVideo} 
                                    controls 
                                    className="w-full rounded-lg shadow-lg" 
                                    style={{ aspectRatio: '16/9' }}
                                >
                                    <source src={currentLessonVideo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>

                        {/* Quiz Section */}
                        <div className="mt-6 bg-gray-800 rounded-lg p-6 transition-all duration-300 ease-in-out">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
                                Course Quiz
                                {allLessonsCompleted ? (
                                    <FaCheckCircle className="ml-2 text-green-500" />
                                ) : (
                                    <FaLock className="ml-2 text-yellow-500" />
                                )}
                            </h2>
                            {!allLessonsCompleted ? (
                                <p className="text-yellow-300 text-sm mb-4">
                                    Complete all lessons to unlock the quiz!
                                </p>
                            ) : !quizCompleted ? (
                                <>
                                    <p className="text-white text-sm mb-4">
                                        Congratulations on completing all lessons! You're now ready to take the quiz.
                                    </p>
                                    <button 
                                        onClick={handleStartQuiz}
                                        className="bg-blue-500 text-sm hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                                    >
                                        Start Quiz
                                    </button>
                                </>
                            ) : (
                                <p className="text-green-300 text-sm mb-4">
                                    Quiz completed! You can now generate your certificate.
                                </p>
                            )}
                        </div>

                        {/* Certificate Generator */}
                        {showCertificate && (
                            <div className="mt-6 bg-gray-800 rounded-lg p-6 transition-all duration-300 ease-in-out">
                                <h2 className="text-2xl font-bold mb-4 text-white">Congratulations!</h2>
                                <p className="text-gray-300 text-sm mb-4">You've completed the course and passed the quiz. Generate your certificate now!</p>
                                <button 
                                    onClick={handleGenerateCertificate}
                                    className="bg-yellow-500 text-sm hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Generate Certificate
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Lesson List */}
                    <div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-4 text-white">Lessons</h2>
                            <ul className="space-y-2">
                                {course.lessons.length > 0 ? (
                                    course.lessons.map((lesson) => (
                                        <li key={lesson.id} className="border border-gray-700 rounded-md">
                                            <button
                                                className="w-full text-left p-3 hover:bg-gray-700 transition duration-150 ease-in-out"
                                                onClick={() => handleLessonClick(lesson)}
                                            >
                                                <h3 className="text-lg text-white font-semibold flex items-center">
                                                    {lesson.title}
                                                    {completedLessons.includes(lesson.id) && (
                                                        <FaCheckCircle className="ml-2 text-green-500" />
                                                    )}
                                                </h3>
                                                {expandedLessonId === lesson.id && (
                                                    <p className="mt-2 text-sm text-gray-300">{lesson.description}</p>
                                                )}
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-md text-sm text-gray-400">No lessons available.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                <button
    onClick={handleTutorInteraction}
    className="fixed bottom-6 right-6 bg-blue-600 text-white text-sm font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700 z-50"
>
    Need help? Click for interaction!
</button>


            </div>
        </DotBackground>
    );
};

export default CourseWatchingPage;
