import React, { useEffect, useState } from 'react';
import { Video, Book, Users, DollarSign, Plus } from 'lucide-react';
import api from '../../service/api';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import { VanishSearchBarUi } from '../../components/ui/vanish-SearchBar';
import TutorDashboardLayout from './TutorDashboardLayout';
import Loader from '../Loader';

const TutorCreatedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // 10 courses per page
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showAllCourses, setShowAllCourses] = useState(true);

  // Calculate pagination indexes
  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;

  // Get current courses
  const getCurrentCourses = () => {
    const currentCourses = showAllCourses ? courses : filteredCourses;
    return currentCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await api.get('/tutor/created-courses/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          setCourses(response.data);
        } else {
          toast.error('Failed to fetch courses');
        }
      } catch (err) {
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    
    if (!term.trim()) {
      setFilteredCourses(courses);
      setShowAllCourses(true);
      return;
    }

    const filtered = courses.filter(course => {
      const searchWords = term.toLowerCase().split(' ');
      const courseText = `${course.title} ${course.description}`.toLowerCase();
      return searchWords.every(word => courseText.includes(word));
    });

    setFilteredCourses(filtered);
    setShowAllCourses(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (filteredCourses.length === 0) {
        setSearchTerm('');
        setFilteredCourses(courses);
        setShowAllCourses(true);
      }
    } else if (e.key === 'Backspace' && searchTerm.length <= 1) {
      setFilteredCourses(courses);
      setShowAllCourses(true);
    }
  };

  const navigate = useNavigate();

  const handleRowClick = (courseId) => {
    navigate(`/tutor/courses/details/${courseId}`);
  };

  if (loading) {
    return (
      <TutorDashboardLayout>
      <div className="h-screen text-white">
      <Loader/>
      </div>
      </TutorDashboardLayout>
    );
  }


  return (
    <TutorDashboardLayout>
      <div className="container mt-12 mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-4xl font-bold mt-6 text-white mb-4 md:mb-0">
            Your Created Courses
          </h1>

          {/* Search Bar */}
          <div className="w-full md:w-1/3">
            <VanishSearchBarUi
              placeholders={['Search courses...', 'Find by title...']}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
        </div>

        {/* No results message */}
        {filteredCourses.length === 0 && !showAllCourses ? (
          <div className="text-center text-gray-400 py-8">
            <p className="text-xl">No courses found matching "{searchTerm}"</p>
            <p className="mt-2">Press Enter to show all courses</p>
          </div>
        ) : (
          <>
            {/* Table of courses */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Students</th>
                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentCourses().map((course) => (
                    <tr
                      key={course.id}
                      onClick={() => handleRowClick(course.id)}
                      className="hover:bg-gray-700 transition duration-300 cursor-pointer"
                    >
                      <td className="px-6 py-4 font-medium">{course.title}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {course.students_count}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {course.price}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          course.is_approved 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {course.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                          <Link
                            to={`/course/${course.id}/edit`}
                            className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                          >
                            Edit
                          </Link>
                          <Link
                            to={`/create-quiz/${course.id}?courseTitle=${encodeURIComponent(course.title)}&isApproved=${course.is_approved}`}
                            className="text-green-400 hover:text-green-300 transition duration-300"
                          >
                            Quiz
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {(showAllCourses ? courses.length : filteredCourses.length) > itemsPerPage && (
              <Pagination
                totalItems={showAllCourses ? courses.length : filteredCourses.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
            {/* Course count display */}
            <p className="text-center text-gray-400 mt-6 mb-8">
              Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, showAllCourses ? courses.length : filteredCourses.length)} of{' '}
              {showAllCourses ? courses.length : filteredCourses.length} courses
            </p>
          </>
        )}
      </div>
    </TutorDashboardLayout>
  );
};

export default TutorCreatedCourses;