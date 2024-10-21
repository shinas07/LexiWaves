"use client";
import React, { useEffect, useState } from "react";
import { Carousel, Card } from "../../components/Latest-course-cards";
import api from "../../service/api";

export function LatestCourses() {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/student/latest-courses/'); 
        
        
        setData(response.data); 
      } catch (error) {
        setError(error.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchCourses(); 
  }, []);

  if (loading) return <div>Loading...</div>; 
  if (error) return <div>Error: {error}</div>; 

  const cards = data.map((card) => (
    <Card key={card.id} card={card} /> 
  ));
  return (
    <div className="w-full h-full py-20">
      <p className="text-sm md:text-4xl font-semibold text-neutral-600 dark:text-neutral-400 mt-12 ml-8">
        Latest Courses
      </p>
      <Carousel items={cards} />
    </div>
  );
}

export default LatestCourses;