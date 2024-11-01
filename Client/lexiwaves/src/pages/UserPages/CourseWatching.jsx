import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';
import FloatingNavbar from '../../components/Navbar';
import { FaCheckCircle, FaLock } from 'react-icons/fa';
import Quiz from './Quiz';

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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const courseResponse = await api.get(`/user/watch-course/${courseId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                setCourse(courseResponse.data);
                setCurrentLessonVideo(courseResponse.data.video_url);
    
                // Fetch completed lessons

                const completedLessonsResponse = await api.get(`/student/completed-lessons/${courseResponse.data.id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCompletedLessons(completedLessonsResponse.data.completed_lessons);
                // setCompletedLessons(completedLessonsResponse.data.map(lesson => lesson.id));
                setLoading(false);
            } catch (err) {
                console.log(err)
                setError('Failed to load course');
                setLoading(false);
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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCompletedLessons(prev => [...prev, lessonId]);
        } catch (error) {
            console.error('Failed to mark lesson as completed:', error);
        }
    };

    const fetchQuizQuestions = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.get(`/student/course-quiz/${courseId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data)
            setQuizQuestions(response.data);
        } catch (error) {
            console.error('Failed to load quiz questions:', error);
        }
    };

    const handleLessonClick = async (lesson) => {
        setCurrentLessonVideo(lesson.lesson_video_url);
        setExpandedLessonId(lesson.id);
        if (!completedLessons.includes(lesson.id)) {
            await markLessonAsCompleted(lesson.id);
        }
    };

    const handleQuizComplete = async (answers) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.post('/student/submit-quiz/', {
                courseId,
                answers
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuizScore(response.data.score);
            setQuizCompleted(true);
            if (response.data.passed) {
                setShowCertificate(true);
            }
        } catch (error) {
            console.error('Failed to submit quiz:', error);
        }
    };

    const handleStartQuiz = () => {
        navigate(`/quiz/${courseId}`);
    };

    const handleGenerateCertificate = () => {
        alert('Certificate generated! Check your downloads.');
    };

    const allLessonsCompleted = course && completedLessons.length === course.lessons.length;

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

    return (
        <DotBackground>
            <FloatingNavbar />
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
            </div>
        </DotBackground>
    );
};

export default CourseWatchingPage;
