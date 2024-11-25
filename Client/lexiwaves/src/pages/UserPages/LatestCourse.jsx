"use client";
import React, { useEffect, useState } from "react";
import { Carousel, Card } from "../../components/Latest-course-cards";
import api from "../../service/api";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LatestCourses() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/student/latest-courses/');
        setData(response.data);
      } catch (error) {
        setError('Failed to load the latest courses. please refresh the page');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
          <p className="text-neutral-400 text-sm">Loading latest courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 max-w-md text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const cards = data.map((card) => (
    <Card key={card.id} card={card} />
  ));

  return (
    <div className="w-full py-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                Latest Courses
              </h2>
            </div>
            <p className="text-neutral-400">
              Explore our newest additions to expand your knowledge
            </p>
          </div>

          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300 hover:bg-white/10 transition-colors"
            onClick={() => navigate('/courses')}
          >
            View All
            <svg 
              className="w-4 h-4 text-neutral-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H7m6 4v10M6 16v10M6 6h.01M6 12h.01M6 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.button>
        </div>
      </div>

      <Carousel items={cards} />
    </div>
  );
}

export default LatestCourses;