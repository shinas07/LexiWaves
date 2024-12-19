import React, { useEffect, useLayoutEffect } from "react";
import Layout from "../components/Layout";
import { FlipWords } from "../components/ui/flip-words";
import TypewriterEffect from "./TutorPags/TypeWriterEffect";
import { useSelector } from "react-redux";
import LatestCourses from "./UserPages/LatestCourse";
import { useNavigate } from "react-router-dom";


function Home() {
  const isAuthenticatedUser = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const  userRole = localStorage.getItem('userRole')
    if(isAuthenticatedUser && userRole){
      switch (userRole){
        case 'tutor':
          navigate('/tutor/dashboard')
          break;
      case 'admin':
        navigate('/admin-dashboard')
        break;
      case 'student':
        break;
      }
    }

  },[isAuthenticatedUser])

  

  const handleChatRedirect = () => {
    navigate('/community-chat');
  };

  const handleGetStart  = () => {
    navigate('/courses')
  }

  return (
    <Layout>
        <div className="relative mt-32 w-full min-h-screen flex flex-col">
        <div className="flex-grow flex flex-col md:flex-row items-center justify-between px-2 md:px-6">
          {/* Text Section */}
          <div className="max-w-2xl text-left ml-8 md:ml-20 mr-8 md:mr-20 mb-8 md:mb-0">
            <div className="text-2xl md:text-6xl font-semibold text-neutral-600 dark:text-neutral-400 mb-6 md:mb-12">
              Learn
              <span className="text-2xl md:text-4xl font-normal">
                <FlipWords
                  words={["Effectively", "Globally", "Confidently", "Effortlessly"]}
                />
              </span>
              <br />
              <div className="text-xl md:text-2xl font-semibold pt-3 text-neutral-600 dark:text-neutral-400">
                Multiple Languages with Expert Tutorials
              </div>
            </div>
            <button onClick={handleGetStart} className="shadow-[inset_0_0_0_2px_#616467] text-black text-base px-8 py-3 rounded-full tracking-widest uppercase bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-300">
              Get started
            </button>
          </div>

          {/* Image Grid - Enhanced styling for your existing images */}
          <div className="w-full md:w-1/2 grid grid-cols-3 gap-6 p-4">
            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl group">
              <img
                src="https://learningforward.org/wp-content/uploads/2020/05/GettyImages-1220226088-scaled-1-2048x1366.jpg"
                alt="People chatting"
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="relative overflow-hidden rounded-2xl group">
              <img
                src="https://images.unsplash.com/photo-1584697964358-3e14ca57658b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Car view"
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="relative overflow-hidden rounded-2xl group">
              <img
                src="https://plus.unsplash.com/premium_photo-1663046035793-679dd6138c08?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Coffee"
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>

        {/* Community Chat Section */}
        <div className="w-full flex flex-col items-center justify-center mt-44 mb-8 px-4">
          <p className="text-lg text-neutral-400 mb-6">
            Connect with learners from around the world
          </p>
          <button 
            onClick={handleChatRedirect}
            className="group px-8 py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-3"
          >
            <span>Join Community Chat</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Dynamic Content Section */}
        {!isAuthenticatedUser ? (
          <div className="flex justify-center mt-12">
            <TypewriterEffect />
          </div>
        ) : (
          <div className="w-full mt-4 p-4">
            <div className="flex justify-center mt-8">
              <LatestCourses /> 
             </div>
           </div>
        )}

        {/* Features Section */}
        <div className="text-white px-4 md:px-10 py-20 text-center max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-400">
            Sharpen your language skills
          </h1>
          <p className="text-lg mb-16 text-neutral-400 max-w-3xl mx-auto">
            Engage in bite-sized language exercises, meticulously designed to strengthen various language techniques.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Gain fresh perspectives",
                description: "Tackle challenges and explore diverse solutions. Learn new techniques from some of the globe's most skilled language Trainers."
              },
              {
                title: "Pick up new languages",
                description: "Tackle challenges in your preferred language, then conquer them in a language you're eager to learn. Elevate your proficiency across diverse languages."
              },
              {
                title: "Compete with peers",
                description: "Face off against friends, colleagues, and a thriving community. Let the spirit of competition drive you toward mastering your language skills."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] rounded-2xl p-8 hover:bg-white/[0.05] transition-colors">
                <h2 className="text-2xl font-semibold mb-4">{feature.title}</h2>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
