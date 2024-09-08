import React from "react";
import Layout from "../components/Layout";
import { FlipWords } from "../components/ui/flip-words";
import TypewriterEffect from "./TutorPags/TypeWriterEffect";

function Home() {
  return (
    <Layout>
      <div className="relative mt-16 w-full min-h-screen flex flex-col">
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
                src="https://learningforward.org/wp-content/uploads/2020/05/GettyImages-1220226088-scaled-1-2048x1366.jpg"
                alt="Car view"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <img
                src="	https://learningforward.org/wp-content/uploads/2020/05/GettyImages-1220226088-scaled-1-2048x1366.jpg"
                alt="Coffee"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="col-span-2">
              <div className="bg-green-400 rounded-lg p-4 h-full flex items-center justify-center">
                <p className="text-white text-lg font-semibold">Share your weekend plans</p>
              </div>
            </div>
            {/* <div>
              <img
                src="https://learningforward.org/wp-content/uploads/2020/05/GettyImages-1220226088-scaled-1-2048x1366.jpg"
                alt="Airplane view"
                className="w-full h-full object-cover rounded-lg"
              />
            </div> */}
            <div>
              <div className="bg-yellow-400 rounded-lg p-4 h-full flex items-center justify-center">
                <p className="text-black text-lg font-semibold">Newcomer<br />10 courses</p>
              </div>
            </div>
            <div>
              <img
                src="https://learningforward.org/wp-content/uploads/2020/05/GettyImages-1220226088-scaled-1-2048x1366.jpg"
                alt="Garden view"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* TypewriterEffect Section */}
        <div className="flex justify-center mt-12">
          <TypewriterEffect />
        </div>
      </div>
    </Layout>
  );
}

export default Home;