import React, { useEffect, useState } from "react";
import api from "../../service/api";
import { useParams } from "react-router-dom"; 
import { Loader } from "lucide-react";
import Layout from "./Layout";

export default function CourseDetailsCheckPage() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await api.get(`/user/course/details/${courseId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCourse(response.data);
            } catch (error) {
                setError("Failed to fetch course details.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetail();
    }, [courseId]);

    return (
        <Layout>
        <div className="flex flex-col items-center p-6 text-white min-h-screen">
            {loading && (
                <div className="flex items-center justify-center h-40">
                    <Loader className="animate-spin h-10 w-10 text-indigo-500" />
                    <span className="ml-2 text-lg">Loading course details...</span>
                </div>
            )}

            {error && (
                <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {!loading && !error && course && (
                <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-3xl">
                    <img 
                        src={course.thumbnail_url} 
                        alt={course.title} 
                        className="w-full h-48 object-cover rounded-lg mb-4" 
                    />
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                    <p className="text-lg mb-4">{course.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <h2 className="text-lg font-semibold">Category:</h2>
                            <p>{course.category}</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Price:</h2>
                            <p>${course.price}</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Duration:</h2>
                            <p>{course.duration} hours</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Difficulty:</h2>
                            <p>{course.difficulty}</p>
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold mb-2">Preview Video:</h2>
                    <video 
                        controls 
                        className="w-full mb-4" 
                        src={course.video_url} 
                        alt="Course Preview"
                    />

                    <h2 className="text-lg font-semibold mb-2">Lessons:</h2>
                    {course.lessons.length > 0 ? (
                        <ul className="list-disc list-inside mb-4">
                            {course.lessons.map((lesson) => (
                                <li key={lesson.id} className="mb-4">
                                    <div className="p-4 bg-gray-800 rounded-lg mb-2">
                                        <strong className="text-lg">{lesson.title}</strong>
                                        <p>{lesson.description}</p>
                                        <h3 className="font-semibold mt-2">Lesson Video:</h3>
                                        <video 
                                            controls 
                                            className="w-full mb-2" 
                                            src={lesson.lesson_video_url} 
                                            alt={lesson.title}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No lessons available for this course.</p>
                    )}
                </div>
            )}
        </div>
        </Layout>
    );
}
