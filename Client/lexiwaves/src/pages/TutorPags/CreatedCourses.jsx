import React, { useEffect, useState } from 'react';
import { Video, Book, Users, DollarSign, Plus } from 'lucide-react';
import { DotBackground } from '../../components/Background';
import api from '../../service/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const TutorCreatedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await api.get('/tutor/created-courses/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });

        if (response.status === 200) {
          setCourses(response.data);
        } else {
          toast.error('Failed to fetch courses');
        }
      } catch (err) {
        console.error('Error fetching courses', err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading courses...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <DotBackground>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Your Created Courses</h1>
        {courses.length === 0 ? (
          <div className="text-center text-gray-400 bg-gray-800 p-8 rounded-lg shadow-lg">
            <p className="mb-4">No courses found</p>
            <Link to="/create-course" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300">
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl">
                <img src={course.thumbnail_url} alt={course.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-white">{course.title}</h2>
                  <p className="text-gray-400 mb-4 overflow-hidden">{course.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    {/* <span className="text-indigo-400 font-semibold">{course.language_name}</span> */}
                    <span className="text-yellow-400  font-semibold">{course.difficulty}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-400">
                      <Video className="w-4 h-4 mr-2" />
                      <span>{course.duration} hours</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Book className="w-4 h-4 mr-2" />
                      <span>{course.lessons_count} lessons</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{course.students_count} students</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>{course.price}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link to={`/course/${course.id}/edit`} className="text-indigo-400 hover:text-indigo-300 transition duration-300">
                      Edit Course
                    </Link>
                    <Link to={`/create-quiz/${course.id}?courseTitle=${encodeURIComponent(course.title)}`}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Quiz
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DotBackground>
  );
};

export default TutorCreatedCourses;
