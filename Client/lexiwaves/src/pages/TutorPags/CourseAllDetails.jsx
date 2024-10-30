import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import api from '../../service/api';
import { toast } from 'sonner';
import { DotBackground } from '../../components/Background';

const CourseAndQuizDetails = () => {
    const { courseId } = useParams()
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

    if (loading){
        return<div className='flex justify-center items-center h-screen text-white'>Loading course details...</div>
    }
    return (
        <DotBackground>
            <div className="container mx-auto p-4 mt-12 min-h-screen">
                <h1 className="text-4xl font-bold mb-6 text-center text-neutral-300">{course.title}</h1>
                <img src={course.thumbnail_url} alt={course.title} className="w-full h-64 object-cover mb-4 rounded" />
                <p className="text-lg mb-4 text-neutral-200">{course.description}</p>
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-neutral-300">Course Details</h2>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                        <p className="text-neutral-200">Category: <span className="font-bold">{course.category}</span></p>
                        <p className="text-neutral-200">Difficulty: <span className="font-bold">{course.difficulty}</span></p>
                        <p className="text-neutral-200">Price: <span className="font-bold">${course.price}</span></p>
                        <p className="text-neutral-200">Duration: <span className="font-bold">{course.duration} hours</span></p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-neutral-300">Lessons</h2>
                    <ul className="list-disc list-inside bg-gray-800 p-4 rounded-lg shadow-md">
                        {course.lessons.map((lesson) => (
                            <li key={lesson.id} className="text-neutral-200">{lesson.title}</li>
                        ))}
                    </ul>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-neutral-300">Quizzes</h2>
                    <ul className="list-disc list-inside bg-gray-800 p-4 rounded-lg shadow-md">
                        {course.questions.map((question) => (
                            <li key={question.id} className="text-neutral-200">{question.text}</li>
                        ))}
                    </ul>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-neutral-300">Certifications</h2>
                    <p className="text-neutral-200">{course.certification ? 'This course provides a certification upon completion.' : 'No certification provided for this course.'}</p>
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => window.location.href = `/course/${courseId}/edit`}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                        Edit Course
                    </button>
                </div>
            </div>
        </DotBackground>
    );
};

export default CourseAndQuizDetails;
