import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, BarChart, Plus, Trash2 } from 'lucide-react';
import { DotBackground } from '../../components/Background';
import api from '../../service/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import{ motion } from 'framer-motion';

const CourseCreationForm = () => {
  const [languages, setLanguages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnail: null,
    video_url: null,
    price: '',
    duration: '',
    difficulty: 'beginner',
    lessons: [{ title: '', description: '', lesson_video_url: '', order: 1 }]
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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



const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 40 * 1024 * 1024; // 40MB

const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "thumbnail" && files) {
    const file = files[0];
    if (!file) return; 
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Only image files are allowed for the thumbnail.",
      }));
      return;
    } else if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Thumbnail must be less than 5MB.",
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      thumbnail: "",
    }));
  }

  // Video validation
  if (name === "video_url" && files) {
    const file = files[0];
    if (!file.type.startsWith("video/")) {
      setErrors((prev) => ({ ...prev, video_url: "Only video files are allowed." }));
      return;
    } else if (file.size > MAX_VIDEO_SIZE) {
      setErrors((prev) => ({ ...prev, video_url: "Video must be under 40MB." }));
      return;
    }
    setErrors((prev) => ({ ...prev, video_url: "" }));
  }

  // Update the formData with the new value or file
  setFormData((prev) => ({
    ...prev,
    [name]: files ? files[0] : value,
  }));
};

  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: files ? files[0] : value
  //   }));
  // };

  // const handleLessonChange = (index, e) => {
  //   const { name, value, files } = e.target;
  //   const updatedLessons = [...formData.lessons];
  //   if (name === 'lesson_video_url' && files && files[0]) {
  //     updatedLessons[index] = { ...updatedLessons[index], [name]: files[0] };
  //   } else {
  //     updatedLessons[index] = { ...updatedLessons[index], [name]: value };
  //   }
  //   setFormData((prev) => ({ ...prev, lessons: updatedLessons }));
  // };

  const handleLessonChange = (index, e) => {
    const { name, files } = e.target;
    const updatedLessons = [...formData.lessons];

    // Check if the field is for the video upload
    if (name === 'lesson_video_url' && files && files[0]) {
        const file = files[0];
        const isVideo = file.type.startsWith("video/");
        if (!isVideo) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`lesson_${index}_video_url`]: "Please upload a valid video file."
            }));
            return; // Exit the function to prevent further processing
        } else {
            // Clear error message if the file is valid
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`lesson_${index}_video_url`]: null // Clear error if valid
            }));
        }

        const maxSizeInBytes = 100 * 1024 * 1024; // 100MB limit
        if (file.size > maxSizeInBytes) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`lesson_${index}_video_url`]: "File size must be less than 100MB."
            }));
            return;
        }
        // If the file is valid, update the lesson with the file
        updatedLessons[index] = { ...updatedLessons[index], [name]: files[0] };
    } else {
        // For other fields, just update the value
        updatedLessons[index] = { ...updatedLessons[index], [name]: e.target.value };
    }
    setFormData((prev) => ({ ...prev, lessons: updatedLessons }));
};


  const addLesson = () => {
    setFormData((prev) => ({
      ...prev,
      lessons: [...prev.lessons, { title: '', description: '', video_url: '', order: prev.lessons.length + 1 }]
    }));
  };

  const removeLesson = (index) => {
    setFormData((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index).map((lesson, i) => ({ ...lesson, order: i + 1 }))
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Required';
    if (!formData.description.trim()) newErrors.description = 'Required';
    if (!formData.category.trim()) newErrors.category = 'Required';
    if (!formData.price.trim()) newErrors.price = 'Required';
    else if (isNaN(formData.price) || parseFloat(formData.price) < 0) newErrors.price = 'Invalid price';
    if (!formData.thumbnail) newErrors.thumbnail = 'Required';
    if (!formData.duration.trim()) newErrors.duration = 'Required';
    
    formData.lessons.forEach((lesson, index) => {
      if (!lesson.title.trim()) newErrors[`lesson_${index}_title`] = 'Required';
      if (!lesson.lesson_video_url) newErrors[`lesson_${index}_video_url`] = 'Required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setProgress(0);
      const accessToken = localStorage.getItem('accessToken');

      try {
        const formDataToSend = new FormData();
        for (const key in formData) {
          if (key === 'lessons') {
            // Don't append lessons here, we'll handle them separately
          } else if (key === 'thumbnail' || key === 'video_url') {
            if (formData[key]) {
              formDataToSend.append(key, formData[key]);
            }
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }

        // Handle lessons separately
        formData.lessons.forEach((lesson, index) => {
          formDataToSend.append(`lesson_${index + 1}_title`, lesson.title);
          formDataToSend.append(`lesson_${index + 1}_description`, lesson.description);
          formDataToSend.append(`lesson_${index + 1}_order`, lesson.order);
          
          // Check if lesson_video_url is a File object
          if (lesson.lesson_video_url instanceof File) {
            formDataToSend.append(`lesson_${index + 1}_video`, lesson.lesson_video_url, lesson.lesson_video_url.name);
          }
        });

        // Append the number of lessons
        formDataToSend.append('lesson_count', formData.lessons.length);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prevProgress) => {
            if (prevProgress >= 95) {
              clearInterval(progressInterval);
              return 100;
            }
            return prevProgress + Math.random() * 10;
          });
        }, 1000);

        const response = await api.post('/tutor/courses-create/', formDataToSend, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          }
        });
    
        clearInterval(progressInterval);
        setProgress(100);

        if (response.status === 201) {
          toast.success('Course created successfully!');
          navigate('/tutor-course-list');
        } else {
          console.log('Something went wrong', response);
        }
      } catch (error) {
        toast.error('Failed to create course');
     
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Form validation failed');
    }
  };

  // Loader
  const Loader = ({ progress }) => {
    const [message, setMessage] = useState('Preparing your course...');
    console.log(progress)
  
    useEffect(() => {
      if (progress < 20) {
        setMessage('Preparing to upload course materials...');
      } else if (progress < 35) {
        setMessage('Uploading course thumbnail...');
      } else if (progress < 50) {
        setMessage('Uploading course videos...');
      } else if (progress < 75) {
        setMessage('Saving course details...');
      } else if (progress < 90) {
        setMessage('Almost there...');
      } else {
        setMessage('Course successfully created!');
      }
    }, [progress]);
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
        <div className="bg-black rounded-lg p-8 max-w-sm w-full mx-4 shadow-2xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-white text-center">{message}</h3>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
              <motion.div 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-300 text-center">{Math.floor(progress)}% Complete</p>
        </div>
      </div>
    );
  };


  return (
    <DotBackground>
      <div className="mt-16 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Create New Course</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Title */}
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

          {/* Language Selection */}
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

          {/* Course Description */}
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

          {/* Price and Duration */}
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

          {/* Thumbnail Upload */}
          <div className="grid grid-cols-2 gap-6">
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
              <label htmlFor="video_url" className="block text-lg font-medium text-gray-300 mb-2">Preview Video</label>
              <input
                type="file"
                id="video_url"
                name="video_url"
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
              {errors.video_url && <p className='mt-2 text-red-400 flex items-center'><AlertCircle className='w-4 h-4 mr-1'/>{errors.video_url}</p>}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label htmlFor="difficulty" className="block text-lg font-medium text-gray-300 mb-2">Difficulty Level</label>
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

          {/* Lessons Section */}
          <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Lessons</h2>
            <button
              type="button"
              onClick={addLesson}
              className="text-blue-500 hover:text-blue-700 text-sm bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white py-1 px-3 rounded transition duration-300 mt-2"
            >
              + Add Lesson
            </button>
          </div>
            
            {formData.lessons.map((lesson, index) => (
              <div key={index} className="p-4 mb-4 rounded-md">
                <h3 className="text-lg font-semibold text-white mb-2">Lesson {index + 1}</h3>
                <input
                  type="text"
                  name="title"
                  value={lesson.title}
                  onChange={(e) => handleLessonChange(index, e)}
                  placeholder="Lesson Title"
                  className="block w-full mb-2 text-lg rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
                  required
                />
                {errors[`lesson_${index}_title`] && <p className="mt-1 text-sm text-red-400 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors[`lesson_${index}_title`]}</p>}
                
                <textarea
                  name="description"
                  value={lesson.description}
                  onChange={(e) => handleLessonChange(index, e)}
                  placeholder="Lesson Description"
                  rows="3"
                  className="block w-full mb-2 text-lg rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
                ></textarea>

                <div>
                  <label htmlFor={`lesson_video_${index}`} className="block text-lg font-medium text-gray-300 mb-4">Upload Lesson Video</label>
                  <input
                    type="file"
                    id={`lesson_video_${index}`}
                    name="lesson_video_url"
                    onChange={(e) => handleLessonChange(index, e)}
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
                     {errors[`lesson_${index}_video_url`] && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors[`lesson_${index}_video_url`]}
                      </p>
                  )}
                </div>

                <div className="flex mt-6 justify-between">
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove Lesson
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end items-center">
       
      </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="shadow-[inset_0_0_0_2px_#616467] text-sm text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200"
          >
            Create Course
          </button>
        </form>
      </div>
      {loading && <Loader progress={progress} />}
    </DotBackground>
  );
};

export default CourseCreationForm;