import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash } from 'react-icons/fa';
import api from '../../service/api';
import { toast } from 'sonner';

const CreateQuiz = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [courseName, setCourseName] = useState('');
    const [questions, setQuestions] = useState([{ text: '', answers: [{ text: '', isCorrect: false }] }]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await api.get(`/tutor/courses/${courseId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCourseName(response.data.title);
            } catch (error) {
                console.error('Error fetching course details:', error);
                setError('Failed to fetch course details');
            }
        };
        fetchCourseDetails();
    }, [courseId]);

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].text = value;
        setQuestions(newQuestions);
    };

    const handleAnswerChange = (questionIndex, answerIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers[answerIndex].text = value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers.forEach((answer, index) => {
            answer.isCorrect = index === answerIndex;
        });
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { text: '', answers: [{ text: '', isCorrect: false }] }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const addAnswer = (questionIndex) => {
        if (questions[questionIndex].answers.length < 4) {
            const newQuestions = [...questions];
            newQuestions[questionIndex].answers.push({ text: '', isCorrect: false });
            setQuestions(newQuestions);
        }
    };

    const removeAnswer = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.filter((_, i) => i !== answerIndex);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const token = localStorage.getItem('accessToken');
            const response = await api.post(`tutor/courses/${courseId}/quiz/`, {
                questions: questions.map(q => ({
                    text: q.text,
                    answers: q.answers.map(a => ({ text: a.text, is_correct: a.isCorrect }))
                }))
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Quiz created:', response.data);
            toast.success('Quiz created successfully!');
            navigate(`/tutor/courses/${courseId}`);
        } catch (error) {
            console.error('Error creating quiz:', error);
            toast.error('Failed to create quiz. Please try again.');
        }
    };

    return (
        
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Create Quiz for {courseName}</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Question {questionIndex + 1}</h2>
                            <button
                                type="button"
                                onClick={() => removeQuestion(questionIndex)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FaTrash />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={question.text}
                            onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                            placeholder="Enter question"
                            className="w-full p-2 border rounded mb-4"
                            required
                        />
                        <div className="space-y-2">
                            {question.answers.map((answer, answerIndex) => (
                                <div key={answerIndex} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={answer.text}
                                        onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
                                        placeholder={`Answer ${answerIndex + 1}`}
                                        className="flex-grow p-2 border rounded"
                                        required
                                    />
                                    <input
                                        type="radio"
                                        name={`correct-answer-${questionIndex}`}
                                        checked={answer.isCorrect}
                                        onChange={() => handleCorrectAnswerChange(questionIndex, answerIndex)}
                                        className="mr-2"
                                        required
                                    />
                                    <label className="mr-2">Correct</label>
                                    {question.answers.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeAnswer(questionIndex, answerIndex)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {question.answers.length < 4 && (
                            <button
                                type="button"
                                onClick={() => addAnswer(questionIndex)}
                                className="mt-2 text-indigo-600 hover:text-indigo-800"
                            >
                                <FaPlus className="inline mr-1" /> Add Answer
                            </button>
                        )}
                    </div>
                ))}
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300"
                    >
                        <FaPlus className="inline mr-1" /> Add Question
                    </button>
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-300"
                    >
                        Create Quiz
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuiz;