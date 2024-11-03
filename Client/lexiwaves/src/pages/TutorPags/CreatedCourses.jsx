import React, { useEffect, useState } from 'react';
import { Video, Book, Users, DollarSign, Plus } from 'lucide-react';
import api from '../../service/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import { VanishSearchBarUi } from '../../components/ui/vanish-SearchBar';
import TutorDashboardLayout from './TutorDashboardLayout';

const TutorCreatedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 10 courses per page
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading courses...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
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
              placeholders={[
                "Search by course title...",
                "Find specific courses...",
                "Search by description...",
                "Looking for something?",
              ]}
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
            

            {/* Grid of courses */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getCurrentCourses().map((course) => (
                <div key={course.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl">
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2 text-white">{course.title}</h2>
                    <p className="text-gray-400 mb-4 overflow-hidden line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-yellow-400 font-semibold">{course.difficulty}</span>
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
                      <Link 
                        to={`/create-quiz/${course.id}?courseTitle=${encodeURIComponent(course.title)}`}
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
              Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, 
                showAllCourses ? courses.length : filteredCourses.length)} of {
                showAllCourses ? courses.length : filteredCourses.length
              } courses
            </p>
          </>
        )}
      </div>
      </TutorDashboardLayout>
  );
};

export default TutorCreatedCourses;
