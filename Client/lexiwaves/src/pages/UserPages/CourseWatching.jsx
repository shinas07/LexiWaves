import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useAsyncError } from 'react-router-dom';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';
import FloatingNavbar from '../../components/Navbar';
import { FaCheckCircle, FaLock, FaCertificate } from 'react-icons/fa';
import Quiz from './Quiz';
import Loader from '../Loader';
import { toast } from 'sonner';

const CourseWatchingPage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentLessonVideo, setCurrentLessonVideo] = useState(null);
    const [expandedLessonId, setExpandedLessonId] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [showCertificate, setShowCertificate] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizScore, setQuizScore] = useState(null);
    const [courseDataId, setCourseDataId] = useState()
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const watchTimeRef = useRef(0);
    const MINIMUM_WATCH_TIME = 300;
    const [quizStatus, setQuizStatus] = useState({
        passed: false,
        hasAttempted: false
    });

    const [accumulatedWatchTime, setAccumulatedWatchTime] = useState(0);
    const [dailyStreak, setDailyStreak] = useState({
        hasStreakToday: false,
        streakCount: 0
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const courseResponse = await api.get(`/user/watch-course/${courseId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                setCourse(courseResponse.data);
                setCourseDataId(courseResponse.data.id);
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
        
        // checking status of quiz 
        const checkQuizStatus = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await api.get(`/student/course-quiz/${courseId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (response.data.status === 'success') {
                    setQuizStatus({
                        passed: response.data.quiz_data.passed,
                        hasAttempted: response.data.quiz_data.has_attempted
                    });
                }
            } catch (error) {
                console.error('Failed to fetch quiz status:', error);
            }
        };
         checkQuizStatus()
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
    const handleTutorInteraction = () => {
     
        if (course && course.tutor) {
            navigate('/connect-tutor', { state: { tutorId: course.tutor,courseId:courseDataId } });
        }
    };

    const handleTimeUpdate = async () => {
        if (!videoRef.current) return;
        const currentTime = Math.floor(videoRef.current.currentTime);
        const duration = Math.floor(videoRef.current.duration);
        const today = new Date().toDateString();
        const lastRecordedStreak = localStorage.getItem('lastRecordedStreak');
        const MINIMUM_WATCH_TIME = 20
    
        if (currentTime >= MINIMUM_WATCH_TIME && 
            lastRecordedStreak !== today && 
            !localStorage.getItem('apiCallInProgress')) {
            
            try {
                localStorage.setItem('apiCallInProgress', 'true');
                const response = await api.post('/student/study-streak/', {
                    course_id: course.id,
                    duration: duration
                });
    
                const streakData = response.data;
                
                if (streakData.current_streak) {
                    setDailyStreak({
                        hasStreakToday: true,
                        streakCount: streakData.current_streak
                    });
    
                    localStorage.setItem('lastRecordedStreak', today);
                    videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
                }
            } catch (error) {
                console.error('Failed to update study streak:');
            } finally {
                localStorage.removeItem('apiCallInProgress');
            }
        }
    };

    const handleLessonClick = (lesson) => {
        setExpandedLessonId(expandedLessonId === lesson.id ? null : lesson.id);
        setCurrentLessonVideo(lesson.lesson_video_url);
        
        // Reset video player when switching lessons
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
        
        // If the lesson hasn't been completed yet, mark it as completed
        if (!completedLessons.includes(lesson.id)) {
            markLessonAsCompleted(lesson.id);
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
                                <div className="video-container" onContextMenu={(e) => e.preventDefault()}>
                                    <video 
                                        ref={videoRef}
                                        key={currentLessonVideo} 
                                        controls 
                                        controlsList="nodownload"
                                        disablePictureInPicture
                                        onTimeUpdate={handleTimeUpdate}
                                        className="w-full rounded-lg shadow-lg" 
                                        style={{ aspectRatio: '16/9'}}
                                    >
                                        <source src={currentLessonVideo} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                        </div>

                        {/* Quiz and Certificate Section */}
                        <div className="mt-6 bg-gray-800 rounded-lg p-6">
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
                            ) : quizStatus.passed ? (
                                <div className="space-y-4">
                                    <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
                                        <p className="text-green-400 font-semibold mb-4">
                                            🎉 Congratulations! You've successfully passed the quiz!
                                        </p>
                                        <button 
                                            onClick={() => navigate(`/certificate/download/${courseId}`)}
                                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <FaCertificate className="text-xl" />
                                            Download Your Certificate
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-white text-sm mb-4">
                                        Ready to test your knowledge? Take the quiz now!
                                    </p>
                                    <button 
                                        onClick={handleStartQuiz}
                                        className="bg-blue-500 text-sm hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                                    >
                                        Start Quiz
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Lesson List */}
                    <div>
                        <div className="bg-gray-800 mt-12 rounded-lg p-4">
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
