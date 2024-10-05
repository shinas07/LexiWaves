import React, { useEffect, useState } from 'react';
import api from '../../service/api';
import { loadStripe } from '@stripe/stripe-js';
import { DotBackground } from '../../components/Background';

const EnrolledCoursesListTutorSide = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await api.get('/tutor/enrolled-courses-list/', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                setCourses(response.data);
                c
            } catch (err) {
                setError('Failed to load enrolled courses');
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <DotBackground>
        <div className="container text-sm mt-8 mx-auto px-6 py-8">
            <h2 className="text-3xl font-bold text-white mb-6">Enrolled Courses</h2>
            {courses.length === 0 ? (
                <p>No courses found.</p>
            ) : (
                courses.map(course => (
                    <div key={course.id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h3 className="text-2xl font-semibold text-gray-800">{course.title}</h3>
                        <p className="text-gray-600 mt-2">{course.description}</p>
                        <div className="mt-4">
                            <img src={course.thumbnail_url} alt={course.title} className="w-full h-48 object-cover rounded-md" />
                        </div>
                        <div className="mt-4 text-black">
                            <h4 className="text-xl font-semibold text-gray-700">Course Details</h4>
                            <p><strong>Category:</strong> {course.category}</p>
                            <p><strong>Price:</strong> ${course.price}</p>
                            <p><strong>Duration:</strong> {course.duration} hours</p>
                            <p><strong>Difficulty:</strong> {course.difficulty}</p>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-xl font-semibold text-gray-700">Enrolled Students</h4>
                            {course.enrolled_students.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {course.enrolled_students.map((student, index) => (
                                        <li key={index} className="text-gray-600">
                                            {student.first_name} {student.last_name} - {student.email}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No students enrolled in this course.</p>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
        </DotBackground>
    );
};

export default EnrolledCoursesListTutorSide;