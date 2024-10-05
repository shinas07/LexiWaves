import React, { useEffect, useState } from 'react';
import { AlertCircle, Video } from 'lucide-react'; // Optional icons for styling
import { DotBackground } from '../../components/Background';  // Ensure this path is correct
import api from '../../service/api';
import { toast } from 'sonner';

const TutorCreatedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses created by the tutor
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
          setCourses(response.data); // Assuming the API returns an array of courses
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
    return <p className="text-center text-white">Loading courses...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <DotBackground>
      <div className="mt-16 text-sm max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Your Created Courses</h1>
        {courses.length === 0 ? (
          <p className="text-center text-gray-400">No courses found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-gray-800 p-6 rounded-lg shadow-md text-white">
                <div className="mb-4">
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-40 object-cover rounded-lg" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                <p className="text-gray-400 mb-2">{course.description}</p>
                <p className="text-indigo-400 font-semibold mb-4">{course.language_name} • {course.difficulty}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    <Video className="inline w-4 h-4 mr-2" />{course.duration} hours
                  </p>
                  <p className="text-sm font-bold">${course.price}</p>
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
