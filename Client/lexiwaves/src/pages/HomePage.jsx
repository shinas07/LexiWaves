import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { FlipWords } from "../components/ui/flip-words";
import TypewriterEffect from "./TutorPags/TypeWriterEffect";
import { useSelector } from "react-redux";
import LatestCourses from "./UserPages/LatestCourse";

function Home() {
  const isAuthenticatedUser = useSelector((state) => state.auth.isAuthenticated);
  console.log(isAuthenticatedUser)
  return (
    <Layout>
      {/* <FloatingNavbar/> */}
      <div className="relative mt-32 w-full min-h-screen flex flex-col">
        <div className="flex-grow flex flex-col md:flex-row items-center justify-between px-2 md:px-6">
          {/* Text Section */}
          <div className="max-w-2xl text-left ml-8 md:ml-20 mr-8 md:mr-20 mb-8 md:mb-0">
            <div className="text-4xl md:text-6xl font-semibold text-neutral-600 dark:text-neutral-400 mb-6 md:mb-12">
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
            <button className="shadow-[inset_0_0_0_2px_#616467] text-black text-base px-8 py-3 rounded-full tracking-widest uppercase bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-300">
              Get started
            </button>
          </div>

          {/* Image Grid Section */}
          <div className="w-full md:w-1/2 grid grid-cols-3 gap-4 p-4">
            <div className="col-span-2 row-span-2">
              <img
                src="https://learningforward.org/wp-content/uploads/2020/05/GettyImages-1220226088-scaled-1-2048x1366.jpg"
                alt="People chatting"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1584697964358-3e14ca57658b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Car view"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <img
                src="	https://plus.unsplash.com/premium_photo-1663046035793-679dd6138c08?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Coffee"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          
          </div>
        </div>

        {/* TypewriterEffect Section */}
  
       
        {!isAuthenticatedUser ? (
            <div className="flex justify-center mt-12">
              <TypewriterEffect />
            </div>
          ) : (
            <div className="w-full mt-8 p-4">
              <div className="flex justify-center mt-12">
              <LatestCourses /> {/* Show the carousel when user is not logged in */}
            </div>
            </div>
          )}
      </div>
    </Layout>
  );
}

export default Home;