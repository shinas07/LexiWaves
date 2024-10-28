import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../service/api';
import { toast } from 'sonner';
import { DotBackground } from '../../components/Background';

const CourseEdit = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState({
        title: '',
        description: '',
        thumbnail_url: '',
        difficulty: '',
        price: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await api.get(`/tutor/course/details/${courseId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response.data)
                setCourse(response.data);
            } catch (error) {
                console.error('Error fetching course details:', error);
                setError('Failed to fetch course details');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse((prevCourse) => ({
            ...prevCourse,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.put(`/tutor/courses/${courseId}/`, course, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Course updated successfully!');
            navigate(`/tutor/courses/${courseId}`); // Redirect to the course details page after editing
        } catch (error) {
            console.error('Error updating course:', error);
            toast.error('Failed to update course. Please try again.');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-white">Loading course details...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <DotBackground>
            <div className="container mx-auto p-4 mt-12 min-h-screen">
                <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Edit Course</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-neutral-200">Course Title</label>
                        <input
                            type="text"
                            name="title"
                            value={course.title}
                            onChange={handleChange}
                            className="w-full p-2 border rounded text-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-neutral-200">Description</label>
                        <textarea
                            name="description"
                            value={course.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded text-black"
                            required
                        />
                    </div>
                    {/* <div>
                        <label className="block text-neutral-200">Thumbnail URL</label>
                        <input
                            type="text"
                            name="thumbnail_url"
                            value={course.thumbnail_url}
                            onChange={handleChange}
                            className="w-full p-2 border rounded text-black"
                        />
                    </div> */}
                    <div>
                        <label className="block text-neutral-200">Difficulty</label>
                        <select
                            name="difficulty"
                            value={course.difficulty}
                            onChange={handleChange}
                            className="w-full p-2 border text-black rounded"
                        >
                            {/* <option value="">Select Difficulty</option> */}
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-neutral-200">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={course.price}
                            onChange={handleChange}
                            className="w-full p-2 border text-black rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-300"
                        >
                            Update Course
                        </button>
                    </div>
                </form>
            </div>
        </DotBackground>
    );
};

export default CourseEdit;