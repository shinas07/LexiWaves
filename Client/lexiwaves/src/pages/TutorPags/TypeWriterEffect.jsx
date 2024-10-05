
"use client";
import { TypewriterEffectSmooth } from "../../components/ui/typewriter-effect";
import { Link } from "react-router-dom";

function TypewriterEffect() {
  const words = [
    {
      text: "Become ",
    },
    {
      text: "a ",
    },
    {
      text: "Tutor ",
    },
    {
      text: "with ",
    },
    {
      text: "LexiWaves.",  // No trailing space needed for the last word
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[40rem]">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base mb-4">
        Your journey to becoming a world-class tutor begins here.
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-8">
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          <Link to='tutor-learn-more'>
            Learn More
            </Link>
        </button>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm">
        <Link to="/tutor-signin" className="text-black">
    Tutor Sign In
  </Link>
          
        </button>
      </div>
    </div>
  );
}

export default TypewriterEffect;
