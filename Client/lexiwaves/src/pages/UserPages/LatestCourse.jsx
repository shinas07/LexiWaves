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
        console.log("Fetched Courses:", response.data); 
        
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
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl mt-4 font-bold text-neutral-800 dark:text-neutral-200">
        Latest Courses
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

export default LatestCourses;