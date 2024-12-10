import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';
import { Clock, BarChart, DollarSign, Search, ChevronRight } from 'lucide-react';
import FloatingNavbar from '../../components/Navbar';
import { VanishSearchBarUi } from '../../components/ui/vanish-SearchBar';
import Pagination from '../../components/Pagination';
import Loader from '../Loader';



const CourseCard = ({ course }) => (
  <div className="relative group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
    {/* Image Container */}
    <div className="relative h-52 overflow-hidden">
      <img 
        src={course.thumbnail_url} 
        alt={course.title} 
        className="w-full h-full object-cover transform transition-transform group-hover:scale-110" 
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
      
      {/* Price Tag */}
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1.5 bg-white/90 text-gray-900 text-sm font-medium rounded-full">
          ${course.price}
        </span>
      </div>
      
      {/* Difficulty Badge */}
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 bg-indigo-500/90 text-white text-xs font-medium rounded-full">
          {course.difficulty}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-6 bg-gradient-to-b from-[#13151A] to-[#191D24] border border-white/[0.05] backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
        {course.title}
      </h3>
      
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {course.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-gray-300 text-sm">
          <Clock className="w-4 h-4 mr-1 text-indigo-400" />
          <span>{course.duration} hours</span>
        </div>
        <Link 
          to={`/course/${course.id}`} 
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
        >
          View Details
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
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
  const itemsPerPage = 15;

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
      } catch (err) {
        setError('Failed to load courses');
        setLoading(true);
      }finally{
        setLoading(false)
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

  if (loading) return <div>
    <DotBackground>
      <FloatingNavbar/>
    <Loader/>
    </DotBackground>
  </div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <DotBackground>
      <FloatingNavbar />
      <div className="max-w-7xl mx-auto p-6 mt-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 mt-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Explore Courses
            </h1>
            <p className="text-gray-400">
              Find the perfect course to enhance your language skills
            </p>
          </div>
          <div className="w-full md:w-auto">
            <VanishSearchBar 
              onSearch={handleSearch} 
              onKeyDown={handleKeyPress}
            />
          </div>
        </div>

        {/* No Results Message */}
        {filteredCourses.length === 0 && !showAllCourses ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-white mb-2">
              No courses found matching "{searchTerm}"
            </p>
            <p className="text-gray-400">
              Press Enter to show all courses
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentCourses().map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              <Pagination 
                totalItems={showAllCourses ? courses.length : filteredCourses.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </DotBackground>
  );
};

export default CourseList;
