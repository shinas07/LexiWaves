

import React from 'react';
import { Link } from 'react-router-dom';
import { DotBackground } from '../../components/Background';

const TutorLearnMore = () => {
  return (
    <DotBackground>
      <div className="max-w-5xl mx-auto p-8 mt-12 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Learn More About LexiWaves</h1>
        
        <section className="mb-8 text-white">
          <h2 className="text-3xl font-semibold mb-4">About LexiWaves</h2>
          <p className="text-lg mb-4">
            LexiWaves is an innovative online platform designed to connect students with qualified tutors. 
            Our mission is to provide personalized learning experiences that empower students to achieve their academic goals.
          </p>
        </section>

        <section className="mb-8 text-white">
          <h2 className="text-3xl font-semibold mb-4">How to Become a Tutor</h2>
          <p className="text-lg mb-4">
            Becoming a tutor on LexiWaves is simple and rewarding. Follow these steps to get started:
          </p>
          <ol className="list-decimal list-inside text-lg space-y-2">
            <li>Sign up on our website and create your tutor profile.</li>
            <li>Complete the application process, including submitting your qualifications.</li>
            <li>Once approved, you can start offering your tutoring services to students.</li>
            <li>Set your own schedule and rates to fit your availability and expertise.</li>
          </ol>
        </section>

        <section className="mb-8 text-white">
          <h2 className="text-3xl font-semibold mb-4">What You Will Get</h2>
          <p className="text-lg mb-4">
            As a tutor on LexiWaves, you will enjoy numerous benefits, including:
          </p>
          <ul className="list-disc list-inside text-lg space-y-2">
            <li>Flexible scheduling to accommodate your availability.</li>
            <li>Access to a wide range of students seeking help in various subjects.</li>
            <li>Competitive pay rates based on your qualifications and experience.</li>
            <li>Support from our dedicated team to help you succeed.</li>
            <li>Opportunities for professional development and training.</li>
          </ul>
        </section>

        <section className="mb-8 text-white">
          <h2 className="text-3xl font-semibold mb-4">Join Us Today!</h2>
          <p className="text-lg mb-4">
            Ready to make a difference in students' lives? Join LexiWaves today and start your journey as a tutor!
          </p>
          <Link 
            to="/tutor-signup" 
            className="mt-4 inline-block bg-blue-600 text-white rounded-md px-6 py-3 transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Sign Up Now
          </Link>
        </section>

        <div className="text-center">
          <Link to="/" className="text-blue-400 text-sm hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </DotBackground>
  );
};

export default TutorLearnMore;
