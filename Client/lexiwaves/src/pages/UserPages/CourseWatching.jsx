import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';
import FloatingNavbar from '../../components/Navbar';
import { resolveMotionValue } from 'framer-motion';

const CourseWatchingPage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentLessonVideo, setCurrentLessonVideo] = useState(null);
    const [expandedLessonId, setExpandedLessonId] = useState(null); // To manage expanded lesson
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const token = localStorage.getItem('accessToken'); 
                const response = await api.get(`/user/watch-course/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCourse(response.data);
                setLoading(false)
                console.log(response.data)
            } catch (err) {
                setError('Failed to load course');
            } finally {
                setLoading(false);
            }
        };

        // const fetchReviews = async () => {
        //     try {
        //         const response = await api.get(`/course/${courseId}/reviews/`);
        //         setReviews(response.data);
        //     } catch (err) {
        //         console.error('Failed to load reviews:', err);
        //     }
        // };


        fetchCourse();
    }, [courseId]);

    const handleLessonClick = (lesson) => {
        // If the same lesson is clicked again, close it
        if (currentLessonVideo === lesson.lesson_video_url) {
            setCurrentLessonVideo(null);
            setExpandedLessonId(null);
        } else {
            setCurrentLessonVideo(lesson.lesson_video_url);
            setExpandedLessonId(lesson.id);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <DotBackground>
            <FloatingNavbar />
            <div className="container mt-12 mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
                <div className="mb-4">
                    <video controls className="w-full h-64">
                        <source src={currentLessonVideo || course.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <h2 className="text-xl  font-semibold mb-2">Lessons</h2>
                <ul className="space-y-4">
                    {course.lessons.length > 0 ? (
                        course.lessons.map((lesson) => (
                            <li key={lesson.id} className="border p-4 rounded-md shadow-sm bg-neutral-800">
                                <h3
                                    className="text-lg text-white font-semibold cursor-pointer"
                                    onClick={() => handleLessonClick(lesson)}
                                >
                                    {lesson.title}
                                </h3>
                                {expandedLessonId === lesson.id && (
                                    <div className="mt-2">
                                        <p className="text-lg text-white">{lesson.description}</p>
                                    </div>
                                )}
                            </li>
                        ))
                    ) : (
                        <li className="text-md text-gray-400">No lessons available.</li>
                    )}
                </ul>

                    {/* <h3>Reviews:</h3>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.id} className="border p-4 mb-2">
                            <p><strong>{review.user.first_name}:</strong> {review.comment}</p>
                            <p>Rating: {review.rating}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )} */}
        
            </div>
        </DotBackground>
    );
};

export default CourseWatchingPage;
