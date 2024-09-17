import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DotBackground } from '../../components/Background';
import { toast } from 'sonner';

const CourseCreation = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: '',
    category: '',
    video: null, // State for video file
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    const { title, description, language, category } = formData;
    if (!title.trim()) errors.title = "Course title is required";
    if (!description.trim()) errors.description = "Course description is required";
    if (!language.trim()) errors.language = "Course language is required";
    if (!category.trim()) errors.category = "Course category is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      video: e.target.files[0], // Set the selected file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Course created successfully!");
      setFormData({
        title: '',
        description: '',
        language: '',
        category: '',
        video: null,
      });
    } catch (error) {
      toast.error("Failed to create course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DotBackground>
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-black rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">Create a New Course</h1>
        <p className="text-neutral-600 dark:text-neutral-300 mb-6 text-xs">Fill in the details below to create a new course. Ensure all fields are filled correctly.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col mb-4">
            <label htmlFor="title" className="text-base font-medium text-neutral-800 dark:text-neutral-200">Course Title</label>
            <input id="title" value={formData.title} onChange={handleChange} placeholder="Introduction to Spanish" type="text" className="p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs" />
            {errors.title && <p className="text-red-500 text-xxs mt-1">{errors.title}</p>}
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="description" className="text-base font-medium text-neutral-800 dark:text-neutral-200">Course Description</label>
            <textarea id="description" value={formData.description} onChange={handleChange} placeholder="A comprehensive course on Spanish language..." rows="4" className="p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs" />
            {errors.description && <p className="text-red-500 text-xxs mt-1">{errors.description}</p>}
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="language" className="text-base font-medium text-neutral-800 dark:text-neutral-200">Language</label>
            <input id="language" value={formData.language} onChange={handleChange} placeholder="Spanish" type="text" className="p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs" />
            {errors.language && <p className="text-red-500 text-xxs mt-1">{errors.language}</p>}
          </div>
          <div className="flex flex-col mb-6">
            <label htmlFor="category" className="text-base font-medium text-neutral-800 dark:text-neutral-200">Category</label>
            <input id="category" value={formData.category} onChange={handleChange} placeholder="Language" type="text" className="p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs" />
            {errors.category && <p className="text-red-500 text-xxs mt-1">{errors.category}</p>}
          </div>
          <div className="flex flex-col mb-6 text-sm">
            <label htmlFor="video" className="text-base font-medium text-neutral-800 dark:text-neutral-200">Course Video (optional)</label>
            <input id="video" type="file" accept="video/*" onChange={handleFileChange} className="p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <button type="submit" className="text-lg bg-gradient-to-br from-black dark:from-zinc-900 to-neutral-600 dark:to-zinc-800 text-white rounded-md h-12 font-medium shadow-md hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300" disabled={isSubmitting}>
            {isSubmitting ? "Creating Course..." : "Create Course"}
          </button>
        </form>
        <ToastContainer />
      </div>
    </DotBackground>
  );
};

export default CourseCreation;
