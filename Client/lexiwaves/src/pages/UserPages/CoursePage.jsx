import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';
import { Clock, BarChart, DollarSign, Layout } from 'lucide-react';
import FloatingNavbar from '../../components/Navbar';
import { VanishSearchBarUi } from '../../components/ui/vanish-SearchBar';
import Pagination from '../../components/Pagination';



const CourseCard = ({ course }) => (


  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
    
    <img src={course.thumbnail_url} alt={course.title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
      <p className="text-gray-400 mb-4 line-clamp-2">{course.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-300 mb-4">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{course.duration} hours</span>
        </div>
        <div className="flex items-center">
          <BarChart className="w-4 h-4 mr-1" />
          <span>{course.difficulty}</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1" />
          <span>${course.price}</span>
        </div>
      </div>
      <Link 
        to={`/course/${course.id}`} 
        className="block w-full text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
      >
        View Course
      </Link>
    </div>
  </div>
  
);

// Search Bar
  const VanishSearchBar = ({ onSearch, onKeyDown }) => {
    const placeholders = [
   "Spanish beginner courses..",  
"French conversation classes..",  
"Japanese writing tutorials..",  
"German grammar lessons..",  
"Chinese character courses..",  
"English pronunciation guides..",  
"Italian cooking and language classes..",  
"Arabic calligraphy and language tutorials..",  
"Portuguese for travelers courses..",  
"Swedish language and culture classes..",  
"Hindi Bollywood and language courses..",  
"Turkish for beginners..",  
"Vietnamese street food and language lessons..",  
    ];


    const handleChange = (e) => {
      // You can add debounce here if needed
      onSearch(e.target.value);
    };

    const handleKeyDown = (e) => {
        onKeyDown(e); // Pass the event to parent component
    };

    return (
      <div className=" mb-4 ">
        <VanishSearchBarUi 
          placeholders={placeholders} 
          onChange={handleChange} 
          onSubmit={(e) => e.preventDefault()}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  };


const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showAllCourses, setShowAllCourses] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination indexes
  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;

  // Get current courses function
  const getCurrentCourses = () => {
    const currentCourses = showAllCourses ? courses : filteredCourses;
    return currentCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('user/courses/');
        setCourses(response.data);
        setFilteredCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
      const courseText = `${course.title}`.toLowerCase();
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="text-white text-center mt-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <DotBackground>
      <FloatingNavbar />
      <div className="max-w-7xl text-sm mx-auto p-6 mt-16">
        <div className='flex flex-row mt-12 justify-between mb-4'>    
          <h1 className="text-3xl font-extrabold mb-4 text-center text-gray-200 tracking-wide leading-tight">
            Explore Our Courses
          </h1>
          <div className='flex justify-end mb-6'>
            <VanishSearchBar 
              onSearch={handleSearch} 
              onKeyDown={handleKeyPress}
            />
          </div>
        </div>

        {filteredCourses.length === 0 && !showAllCourses ? (
          <div className="text-center text-gray-400 py-8">
            <p className="text-xl">No courses found matching "{searchTerm}"</p>
            <p className="mt-2">Press Enter to show all courses</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getCurrentCourses().map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            
            <Pagination 
              totalItems={showAllCourses ? courses.length : filteredCourses.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </DotBackground>
  );
};

export default CourseList;
