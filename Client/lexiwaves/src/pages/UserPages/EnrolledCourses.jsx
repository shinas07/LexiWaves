import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';
import FloatingNavbar from '../../components/Navbar';

const UserEnrolledCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            const accessToken = localStorage.getItem('accessToken')
            try {
                const response = await api.get('/user/enrolled-courses/',{
                    headers : {
                        Authorization: `Bearer ${accessToken}`
                    },
                    
                }); // Adjust the URL as needed
                setCourses(response.data);
                console.log(response.data)
            } catch (err) {
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);
    console.log('courses',courses)
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <DotBackground>
            <FloatingNavbar/>
         <div className="min-h-screen mt-12 p-6">
            <h1 className="text-3xl font-bold  mb-6 mt-4 text-center">Your Enrolled Courses</h1>
            <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="shadow-md mt-6 bg-neutral-200 rounded-lg overflow-hidden transition-all hover:scale-105">
                        <div className="p-4">
                            <img
                                className="w-full h-40 rounded-lg object-cover"
                                src={course.course.thumbnail_url}
                                alt={course.course_title}
                            />
                            <h2 className="text-xl font-bold mt-4">{course.course_title}</h2>
                            <p className="text-gray-600 mt-2">{course.course_description}</p>
                            <p className="mt-4 text-sm text-gray-600">
                                Tutor: {course.course.tutor_name}
                            </p>
                            <p className="mt-2 text-sm text-gray-600">
                                Duration: {course.course.duration} hours
                            </p>
                            <p className="mt-2 text-sm text-gray-600">
                                Difficulty: {course.course.difficulty}
                            </p>
                            <p className="mt-4 text-sm text-gray-600 font-semibold">
                                Amount Paid: ${course.amount_paid}
                            </p>
                            <Link to={`/watch-course/${course.id}`} className='mt-2 text-sm inline-block bg-green-500 text-white py-2  px-4 rounded-lg hover:bg-green-600 transition duration-300'>Watch Course</Link>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </DotBackground>
    );
};

export default UserEnrolledCoursesPage;