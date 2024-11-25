"use client";;
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "../lib/utils";
import {  motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


// import { useOutsideClick } from "@/hooks/use-outside-click";

export const CarouselContext = createContext({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({
  items,
  initialScroll = 0
}) => {
  const carouselRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  return (
    (<CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll py-8 md:py-8 scroll-smooth [scrollbar-width:none] relative"
          ref={carouselRef}
          onScroll={checkScrollability}>

          <div
            className={cn(
              "flex flex-row justify-start gap-6 pl-8",
              "max-w-7xl mx-auto"
            )}>
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.1 * index,
                    ease: [0.23, 1, 0.32, 1]
                  },
                }}
                key={"card" + index}
                className="last:pr-[5%] md:last:pr-[33%]  rounded-3xl">
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 mr-10">
          <button
            className={cn(
              "relative z-40 h-10 w-10 rounded-full border border-white/10",
              "flex items-center justify-center transition-all duration-300",
              "",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              canScrollLeft ? "bg-white/5" : "bg-white/5"
            )}
            onClick={scrollLeft}
            disabled={!canScrollLeft}>
            <IconArrowNarrowLeft className="h-5 w-5 text-white" />
          </button>
          <button
            className={cn(
              "relative z-40 h-10 w-10 rounded-full border border-white/10 backdrop-blur-sm",
              "flex items-center justify-center transition-all duration-300",
              
              "disabled:opacity-50 disabled:cursor-not-allowed",
              canScrollRight ? "bg-white/5" : "bg-white/5"
            )}
            onClick={scrollRight}
            disabled={!canScrollRight}>
            <IconArrowNarrowRight className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>)
  );
};

export const Card = ({ card, index, layout = false }) => {
  const navigate = useNavigate();

  // const handleCardClick = () => {
  //   navigate(`/course/${card.id}`);
  // };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/course/${card.id}`)}
      className="group relative cursor-pointer"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
      
      <div className="relative rounded-3xl bg-neutral-900/50 backdrop-blur-sm border border-white/[0.05] h-[420px] w-[300px] overflow-hidden flex flex-col">
        <div className="relative w-full h-56 overflow-hidden">
          <BlurImage
            src={card.thumbnail_url}
            alt={card.title}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
          
          <div className="absolute top-4 right-4">
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-black/30 backdrop-blur-sm border border-white/10 text-white">
              {card.difficulty}
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
            {card.title}
          </h3>
          
          <div className="flex items-center gap-3 mt-2">
            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {card.tutor_name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-neutral-300">
                {card.tutor_name}
              </p>
              <p className="text-xs text-neutral-500">
                Instructor
              </p>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-neutral-400">Active Course</span>
            </div>
            <motion.div
              whileHover={{ x: 5 }}
              className="text-indigo-400 text-sm flex items-center gap-1"
            >
              View Course
              <IconArrowNarrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}) => {
  const [isLoading, setLoading] = useState(true);
  
  return (
    <img
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      alt={alt || "Background of a beautiful view"}
      {...rest}
    />
  );
};
