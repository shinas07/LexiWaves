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
        <div className="flex flex-col items-center p-6  text-white min-h-screen">
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
                <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-4xl">
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                        <img 
                            src={course.thumbnail_url} 
                            alt={course.title} 
                            className="w-full md:w-1/3 h-64 object-cover rounded-xl" 
                        />
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                            <p className="text-gray-300 text-lg mb-6">{course.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-800 p-4 rounded-lg text-center">
                                    <span className="block text-indigo-400 text-sm">Category</span>
                                    <span className="text-xl md:text-sm font-semibold">{course.category}</span>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-lg text-center">
                                    <span className="block text-indigo-400 text-sm">Price</span>
                                    <span className="text-xl md:text-sm font-semibold">${course.price}</span>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-lg text-center">
                                    <span className="block text-indigo-400 text-sm">Duration</span>
                                    <span className="text-xl md:text-sm font-semibold">{course.duration}h</span>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-lg text-center">
                                    <span className="block text-indigo-400 text-sm">Difficulty</span>
                                    <span className="text-xl md:text-sm font-semibold">{course.difficulty}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Course Preview</h2>
                        <video 
                            controls 
                            className="w-full rounded-lg" 
                            src={course.video_url}
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Course Lessons</h2>
                        {course.lessons.length > 0 ? (
                            <div className="space-y-4">
                                {course.lessons.map((lesson, index) => (
                                    <div key={lesson.id} className="bg-gray-800 rounded-lg overflow-hidden">
                                        <div className="p-4 border-b border-gray-700">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm">
                                                    Lesson {index + 1}
                                                </span>
                                                <h3 className="text-xl font-bold">{lesson.title}</h3>
                                            </div>
                                            <p className="text-gray-300">{lesson.description}</p>
                                        </div>
                                        <div className="p-4">
                                            <video 
                                                controls 
                                                className="w-full rounded-lg" 
                                                src={lesson.lesson_video_url}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-800 rounded-lg">
                                <p className="text-gray-300">No lessons available for this course.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
        </Layout>
    );
}
