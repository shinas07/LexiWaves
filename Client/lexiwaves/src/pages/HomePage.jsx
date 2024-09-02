import React from "react";
import Layout from "../components/Layout";
import { FlipWords } from "../components/ui/flip-words";

function Home() {
    return (
      <Layout>
        <div className="relative w-full h-screen flex items-center justify-between px-2 md:px-6">
          {/* Text Section */}
          <div className="max-w-2xl text-left ml-8 md:ml-20">
            <div className="text-6xl font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
              Learn 
              <span className="text-4xl font-normal">
                <FlipWords words={["Effectively", "Globally", "Confidently", "Effortlessly"]} />
              </span>
              <br />
              <div className="text-2xl font-semibold pt-3 text-neutral-600 dark:text-neutral-400">
                Multiple Languages with Expert Tutorials
              </div>
            </div>
            <button className="mt-6 shadow-[inset_0_0_0_2px_#616467] text-black text-base px-8 py-3 rounded-full tracking-widest uppercase bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-300">
              Get started 
            </button>
          </div>
          
          {/* Image Section */}
          <div className="flex-1 flex justify-center items-center p-8">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4">
              <img 
                src="https://specialistlanguagecourses.com/wp-content/uploads/2022/09/Online-Learning-1000x1024.png"
                alt="Educational Image"
                className="w-full h-auto object-cover rounded-lg shadow-md" 
              />
              
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <img 
                  src="https://specialistlanguagecourses.com/wp-content/uploads/2022/09/Online-Learning-1000x1024.png"
                  alt="Educational Image"
                  className="w-full h-48 object-cover rounded-lg shadow-md" 
                />
              </div>
            </div>
          </div>

        </div>
      </Layout>
    );
}

export default Home;
