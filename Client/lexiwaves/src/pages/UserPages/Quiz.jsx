// src/pages/UserPages/QuizPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';
import FloatingNavbar from '../../components/Navbar';
import { FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'sonner';

const Countdown = ({ startTime, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(startTime);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="text-2xl text-white">
            Starting in {timeLeft} seconds...
        </div>
    );
};

const QuizPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [quizStarted, setQuizStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(100); 
    const [quizCompleted, setQuizCompleted] = useState(false);

    useEffect(() => {
        fetchQuizQuestions();
    }, []);

    const fetchQuizQuestions = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.get(`/student/course-quiz/${courseId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuestions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to load quiz questions:', error);
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, selectedAnswer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedAnswer,
        }));
    };

    const handleQuizStart = () => {
        setQuizStarted(true);
        setTimeLeft(600); // Reset timer to 10 minutes
    };

    const handleTimeUp = () => {
        setQuizCompleted(true);
        setQuizStarted(false);
        setAnswers({}); // Reset answers
        // Show time up message
        alert("Time's up! Please try again.");
        // Reset timer
        setTimeLeft(600);
    };

    const handleSubmitQuiz = async () => {
        // Check if the current question is the last one
        if (currentQuestion === questions.length - 1) {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await api.post(`/student/course-quiz/validate`, answers, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (response.data.passed) {
                    toast.success("Congratulations! You passed the quiz.");
                } else {
                    toast.alert("You didn't pass. Try again.");
                }
    
                setQuizCompleted(true); // Mark quiz as completed
                setQuizStarted(false);  // Stop the quiz
            } catch (error) {
                console.error('Failed to validate answers:', error);
            }
        } else {
            // Move to the next question and deduct time
            setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1));
            setTimeLeft(prev => prev - 10); // Deduct time on each question
        }
    };
    

    // Timer effect
    useEffect(() => {
        let timer;
        if (quizStarted && !quizCompleted && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        // Time's up - reset everything
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [quizStarted, quizCompleted]);

    if (loading) {
        return <div className="text-white">Loading questions...</div>;
    }

    if (!quizStarted) {
        return (
            <DotBackground>
                <FloatingNavbar />
                <div className="container mx-auto p-6 mt-16 text-center">
                    <h1 className="text-3xl text-white mb-4">Welcome to the Quiz!</h1>
                    <Countdown startTime={5} onComplete={handleQuizStart} />
                </div>
            </DotBackground>
        );
    }

    if (quizCompleted) {
        const totalQuestions = questions.length;
        const correctAnswers = Object.keys(answers).filter(qid => answers[qid].isCorrect).length;
        const passingScore = totalQuestions * 0.7; // Example: 70% to pass

        return (
            <DotBackground>
                <FloatingNavbar />
                <div className="container mx-auto p-6 mt-16 text-center bg-gray-800 rounded-lg">
                    <h2 className="text-2xl text-white mb-4">Quiz Completed!</h2>
                    <p className="text-white">You answered {correctAnswers} out of {totalQuestions} correctly.</p>
                    {correctAnswers >= passingScore ? (
                        <div className="text-green-500 mt-4">
                            <h3>Congratulations! 🎉 You passed!</h3>
                            {/* Add certificate generation logic here */}
                        </div>
                    ) : (
                        <div className="text-red-500 mt-4">
                            <h3>Keep trying! You can do better next time.</h3>
                        </div>
                    )}
                    <button 
                        onClick={() => navigate('/')} 
                        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </DotBackground>
        );
    }

    return (
        <DotBackground>
            <FloatingNavbar />
            <div className="container mx-auto p-6 mt-16">
                <div className="bg-gray-800 rounded-lg p-6">
                    {/* Enhanced Timer Display */}
                    <div className="mb-6 flex justify-between items-center">
                        <p className="text-white">
                            Question {currentQuestion + 1} of {questions.length}
                        </p>
                        <div className={`
                            flex items-center gap-2 px-4 py-2 rounded-full 
                            ${timeLeft <= 60 ? 'bg-red-500 animate-pulse' : 'bg-gray-700'}
                        `}>
                            <FaClock className={`
                                ${timeLeft <= 60 ? 'text-white' : 'text-blue-400'}
                            `} />
                            <span className="font-mono text-xl text-white">
                                {Math.floor(timeLeft / 60)}:
                                {(timeLeft % 60).toString().padStart(2, '0')}
                            </span>
                        </div>
                    </div>

                    {/* Warning message when time is running out */}
                    {timeLeft <= 60 && (
                        <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-4">
                            <p className="text-red-500 text-center flex items-center justify-center gap-2">
                                <FaExclamationTriangle />
                                Less than a minute remaining!
                            </p>
                        </div>
                    )}

                    {questions[currentQuestion] && (
                        <div className="mb-6">
                            <h2 className="text-xl text-white mb-4">
                                {questions[currentQuestion]?.text}
                            </h2>
                            
                            <div className="space-y-4">
                                {questions[currentQuestion]?.answers?.map(answer => (
                                    <label 
                                        key={answer.id} 
                                        className="flex items-center space-x-3 text-white cursor-pointer p-3 rounded hover:bg-gray-700"
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${questions[currentQuestion].id}`} 
                                            value={answer.text} 
                                            onChange={() => handleAnswerSelect(questions[currentQuestion].id, answer)} 
                                            className="form-radio text-blue-500"
                                        />
                                        <span>{answer.text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <button
                            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestion === 0}
                            className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        
                        {currentQuestion === questions.length - 1 ? (
                            <button
                                onClick={handleSubmitQuiz}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1));
                                    setTimeLeft(prev => prev - 10); // Deduct some time on each question
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </DotBackground>
    );
};

export default QuizPage;
