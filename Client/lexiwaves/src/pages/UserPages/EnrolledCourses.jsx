import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';
import FloatingNavbar from '../../components/Navbar';
import Pagination from '../../components/Pagination';
import { VanishSearchBarUi } from '../../components/ui/vanish-SearchBar';
import { Clock, BookOpen, Award, DollarSign } from 'lucide-react';

const CourseCard = ({ enrolledCourse }) => {
  const { course, amount_paid, created_at } = enrolledCourse;
  
  const enrollmentDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-gray-900 mt-4 rounded-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-48">
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className={`text-sm font-medium ${
            course.difficulty === 'beginner' ? 'text-green-400' :
            course.difficulty === 'intermediate' ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
              {course.category.toUpperCase()}
            </span>
            <span className="text-xs text-gray-400">
              {enrollmentDate}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {course.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{course.duration}h Duration</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm ml-16">${amount_paid} Paid</span>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold">
              {course.tutor_name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-white font-medium">{course.tutor_name}</p>
            <p className="text-sm text-gray-400">Instructor</p>
          </div>
        </div>
        <div className="flex gap-3">
        {/* <div className="mt-4 flex items-center justify-between py-3 border-t border-gray-800"> */}
  {/* <div className="flex items-center gap-4">
    <BookOpen className="w-5 h-5 text-gray-400" />
    <span className="text-gray-400">12/24 Lessons</span>
  </div>
  <Link 
    to={`/watch-course/${enrolledCourse.id}`}
    className="text-blue-400 hover:underline"
  >
    Continue →
  </Link> */}
{/* </div> */}

  <Link 
    to={`/watch-course/${enrolledCourse.id}`}
    className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium text-center border border-gray-700 hover:bg-gray-800 hover:border-gray-600 transition-all duration-300"
  >
    Continue Learning
  </Link>
</div>
      </div>
    </div>
  );
};

const UserEnrolledCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [showAllCourses, setShowAllCourses] = useState(true);
    const itemsPerPage = 12;

    const indexOfLastCourse = currentPage * itemsPerPage;
    const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;

    const getCurrentCourses = () => {
        const currentCourses = showAllCourses ? courses : filteredCourses;
        return currentCourses.slice(indexOfFirstCourse, indexOfLastCourse);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            const accessToken = localStorage.getItem('accessToken');
            try {
                const response = await api.get('/user/enrolled-courses/', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setCourses(response.data);
                setFilteredCourses(response.data);
            } catch (err) {
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
        
        if (!term.trim()) {
            setFilteredCourses(courses);
            setShowAllCourses(true);
            return;
        }

        const filtered = courses.filter(course => {
            const searchWords = term.toLowerCase().split(' ');
            const courseText = `${course.course.title} ${course.course.description}`.toLowerCase();
            return searchWords.every(word => courseText.includes(word));
        });

        setFilteredCourses(filtered);
        setShowAllCourses(false);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return (
        <DotBackground>
            <FloatingNavbar />
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading your courses...</div>
            </div>
        </DotBackground>
    );

    if (error) return (
        <DotBackground>
            <FloatingNavbar />
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        </DotBackground>
    );

    if (courses.length === 0) return (
        <DotBackground>
            <FloatingNavbar />
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-white mb-4">No Courses Yet</h1>
                <p className="text-gray-400 mb-8">You haven't enrolled in any courses yet.</p>
                <Link 
                    to="/courses" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-300"
                >
                    Browse Courses
                </Link>
            </div>
        </DotBackground>
    );

    return (
        <DotBackground>
            <FloatingNavbar />
            <div className="min-h-screen p-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mt-20 mb-12">
                    <h1 className="text-4xl font-bold text-white mb-8">Your Learning Journey</h1>
                    
                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-800/50 rounded-xl p-6">
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-6 h-6 text-blue-400" />
                                <div>
                                    <p className="text-gray-400 text-sm">Total Courses</p>
                                    <p className="text-2xl font-bold text-white">{courses.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-6">
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-6 h-6 text-green-400" />
                                <div>
                                    <p className="text-gray-400 text-sm">Total Invested</p>
                                    <p className="text-2xl font-bold text-white">
                                        ${courses.reduce((total, course) => total + parseFloat(course.amount_paid), 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-6">
                            <div className="flex items-center gap-3">
                                <Award className="w-6 h-6 text-purple-400" />
                                <div>
                                    <p className="text-gray-400 text-sm">Latest Enrollment</p>
                                    <p className="text-2xl font-bold text-white">
                                        {courses.length > 0 ? new Date(courses[0].created_at).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full md:w-1/2 lg:w-1/3">
                        <VanishSearchBarUi
                            placeholders={["Search your enrolled courses..."]}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>

                {filteredCourses.length === 0 && !showAllCourses ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Results Found</h3>
                        <p className="text-gray-400">
                            No courses found matching "{searchTerm}". Try a different search term.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {getCurrentCourses().map((enrolledCourse) => (
                                <CourseCard 
                                    key={enrolledCourse.id} 
                                    enrolledCourse={enrolledCourse} 
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {(showAllCourses ? courses.length : filteredCourses.length) > itemsPerPage && (
                            <div className="mt-12 flex justify-center">
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={showAllCourses ? courses.length : filteredCourses.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}

                        {/* Course count */}
                        <p className="text-center mt-6 text-gray-400 mb-8">
                            Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, 
                                showAllCourses ? courses.length : filteredCourses.length)} of {
                                showAllCourses ? courses.length : filteredCourses.length
                            } courses
                        </p>
                    </>
                )}
            </div>
        </DotBackground>
    );
};

export default UserEnrolledCoursesPage;