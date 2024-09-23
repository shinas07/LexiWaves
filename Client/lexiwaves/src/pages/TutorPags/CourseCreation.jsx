import React, { useEffect, useState } from 'react';
import { AlertCircle, Clock, BarChart } from 'lucide-react';
import { DotBackground } from '../../components/Background';  // Ensure this path is correct
import api from '../../service/api';
import { toast } from 'sonner';

const CourseCreationForm = () => {
  const [languages, setLanguages] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null,
    video: null,
    thumbnail: null,
    price: '',
    duration: '',
    difficulty: 'beginner',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

    useEffect(() => {
      const fetchLanguages = async () => {
        try {
          const response = await api.get('/lexi-admin/languages/');
      
          setLanguages(response.data);
        } catch (error) {
          toast.error('Failed to load languages');

        }
      };

      fetchLanguages();
    }, []);


  

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Required';
    if (!formData.description.trim()) newErrors.description = 'Required';
    if (!formData.category.trim()) newErrors.category = 'Required';
    if (!formData.price.trim()) newErrors.price = 'Required';
    else if (isNaN(formData.price) || parseFloat(formData.price) < 0) newErrors.price = 'Invalid price';
    if (!formData.video) newErrors.video = 'Required';
    if (!formData.thumbnail) newErrors.thumbnail = 'Required';
    if (!formData.duration.trim()) newErrors.duration = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const accessToken = sessionStorage.getItem('access')
      const refreshToken = sessionStorage.getItem('refresh')
      console.log(formData)

        try {
          const response = await api.post('/tutor/courses-create/', {
            formData
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            }
        });
        
          if (response.status === 201) {
              console.log('Course created successfully!', response.data);
          } else {
              console.log('Something went wrong', response);
          }
      } catch (error) {
          console.error('Error creating course', error);
      }
  } else {
      console.log('Form validation failed');
  }
  };



  // const imageUrl = 'https://lexiwaves-bucket.s3.eu-north-1.amazonaws.com/Microservices-scaled.jpeg';
  // console.log(imageUrl)




  return (
    <DotBackground>
        {/* <div>
            <h1>Uploaded Image</h1>
            <img src={imageUrl} alt="Uploaded from S3" style={{ width: '300px', height: 'auto' }} />
        </div> */}

      <div className="mt-16 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Create New Course</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-gray-300 mb-2">Course Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="block w-full text-lg rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
                required
              />
              {errors.title && <p className="mt-1 text-sm text-red-400 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-lg font-medium text-gray-300 mb-2">Language</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full text-lg rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
                required
              >
                <option value="">Select a language</option>
                {languages.map(lang => (
                <option key={lang.id} value={lang.code}>
                  {lang.name}
                </option>
              ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-400 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-lg font-medium text-gray-300 mb-2">Course Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="block w-full text-lg rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
                required
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-400 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.description}</p>}
            </div>

   

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-lg font-medium text-gray-300 mb-2">Price ($)</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="block w-full text-lg rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
                  placeholder="0.00"
                  required
                />
                {errors.price && <p className="mt-1 text-sm text-red-400 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="duration" className="block text-lg font-medium text-gray-300 mb-2">
                  <Clock className="w-5 h-5 inline mr-2" />
                  Course Duration (hours)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="block w-full text-lg rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
                  required
                />
                {errors.duration && <p className="mt-1 text-sm text-red-400 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.duration}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-lg font-medium text-gray-300 mb-2">
                <BarChart className="w-5 h-5 inline mr-2" />
                Difficulty Level
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="block w-full text-lg rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
              <div>
                <label htmlFor="thumbnail" className="block text-lg font-medium text-gray-300 mb-2">Course Thumbnail</label>
                <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  onChange={handleChange}
                  accept="image/*"
                  className="block w-full text-sm text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-600 file:text-white
                    hover:file:bg-indigo-700
                    cursor-pointer"
                  required
                />
                {errors.thumbnail && <p className="mt-1 text-sm text-red-400 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.thumbnail}</p>}
              </div>
              <div>
                <label htmlFor="video" className="block text-lg font-medium text-gray-300 mb-2">Course Video</label>
                <input
                  type="file"
                  id="video"
                  name="video"
                  onChange={handleChange}
                  accept="video/*"
                  className="block w-full text-sm text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-600 file:text-white
                    hover:file:bg-indigo-700
                    cursor-pointer"
                  required
                />
                {errors.video && <p className="mt-1 text-sm text-red-400 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.video}</p>}
              </div>
            </div>
          </div>

          <div className="text-center">
          <button 
          type='submit'
          className="shadow-[inset_0_0_0_2px_#616467] text-sm text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200">
          Create Course
        </button>
          </div>
        </form>
      </div>
    </DotBackground>
  );
};

export default CourseCreationForm;