import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';
import { Clock, BarChart, DollarSign, Layout } from 'lucide-react';
import FloatingNavbar from '../../components/Navbar';
import { VanishSearchBarUi } from '../../components/ui/vanish-SearchBar';



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
  const VanishSearchBar = ({ onSearch }) => {
    const placeholders = [
    "Search for Spanish beginner courses...",
    "Find French conversation classes...",
    "Look up Japanese writing tutorials...",
    "Discover German grammar lessons...",
    "Explore Chinese character courses...",
    "Search for English pronunciation guides...",
    "Find Italian cooking and language classes...",
    "Explore Arabic calligraphy and language tutorials...",
    "Search for Portuguese for travelers courses...",
    "Find Swedish language and culture classes...",
    "Look up Hindi Bollywood and language courses...",
    "Discover Turkish language for beginners...",
    "Explore Vietnamese street food and language lessons..."
    ];

    const handleChange = (e) => {
      // You can add debounce here if needed
      onSearch(e.target.value);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      // You can trigger an immediate search here if needed
    };

    return (
      <div className=" mb-4 ">
        <VanishSearchBarUi 
          placeholders={placeholders} 
          onChange={handleChange} 
          onSubmit={handleSubmit} 
        />
      </div>
    );
  };


const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('user/courses/');

        setCourses(response.data);
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
  };

  if (loading) return <div className="text-white text-center mt-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (

    <DotBackground>
      <FloatingNavbar/>
      
      <div className="max-w-7xl text-sm mx-auto p-6 mt-16">
        
        <div className='flex flex-row mt-12 justify-between mb-4'>    
        <h1 className="text-3xl font-extrabold mb-4 text-center text-gray-200 tracking-wide leading-tight">
        Explore Our Courses
      </h1>

        <div className='flex justify-end mb-6'>
        <VanishSearchBar onSearch={handleSearch} />
        </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
       
      </div>


    
      
    </DotBackground>

  );
};

export default CourseList;