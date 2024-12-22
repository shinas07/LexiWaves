import React from 'react';
import { Link } from 'react-router-dom';
import { DotBackground } from '../../components/Background';
import { BookOpen, Clock, DollarSign, Users, Award, ChevronRight } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
 <div className="bg-gray-800/50 backdrop-blur-sm p-6  rounded-xl border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300">
   <div className="flex items-start space-x-4">
     <div className="p-3 bg-indigo-500/10 rounded-lg">
       <Icon className="w-6 h-6 text-indigo-400" />
     </div>
     <div>
       <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
       <p className="text-gray-400 leading-relaxed">{description}</p>
     </div>
   </div>
 </div>
);
const TutorLearnMore = () => {
 const features = [
   {
     icon: Clock,
     title: "Flexible Schedule",
     description: "Set your own hours and work when it's convenient for you."
   },
   {
     icon: DollarSign,
     title: "Competitive Pay",
     description: "Earn competitive rates based on your expertise and experience."
   },
   {
     icon: Users,
     title: "Global Reach",
     description: "Connect with students from around the world."
   },
   {
     icon: Award,
     title: "Professional Growth",
     description: "Access training and development opportunities."
   }
 ];
  return (
   <DotBackground>
     <div className="max-w-6xl mx-auto p-6  lg:p-8 space-y-16 py-16">
       {/* Hero Section */}
       <div className="text-center mt-8 space-y-6">
         <h1 className="text-4xl lg:text-5xl font-bold text-white">
           Begin Your Teaching Journey with{" "}
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
             LexiWaves
           </span>
         </h1>
         <p className="text-xl text-gray-400 max-w-2xl mx-auto">
           Join our community of expert tutors and make a difference in students' lives while growing your teaching career.
         </p>
       </div>
        {/* Features Grid */}
       <div className="grid md:grid-cols-2 gap-6">
         {features.map((feature, index) => (
           <FeatureCard key={index} {...feature} />
         ))}
       </div>
        {/* How to Become a Tutor */}
       <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
         <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
           <BookOpen className="w-8 h-8 mr-3 text-indigo-400" />
           How to Become a Tutor
         </h2>
         <div className="space-y-6">
           {[
             "Create your professional profile",
             "Submit your qualifications for review",
             "Get approved and set up your courses",
             "Start teaching and earning"
           ].map((step, index) => (
             <div key={index} className="flex items-center space-x-4">
               <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                 {index + 1}
               </div>
               <p className="text-gray-300">{step}</p>
             </div>
           ))}
         </div>
       </div>
        {/* CTA Section */}
       <div className="text-center space-y-6">
         <h2 className="text-3xl font-bold text-white">Ready to Start Teaching?</h2>
         <p className="text-gray-400 max-w-2xl mx-auto">
           Join LexiWaves today and become part of our growing community of educators making a difference.
         </p>
         <div className="space-x-4">
           <Link 
             to="/tutor-signup" 
             className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
           >
             Get Started
             <ChevronRight className="w-5 h-5 ml-2" />
           </Link>
           <Link 
             to="/" 
             className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
           >
              Home
           </Link>
         </div>
       </div>
     </div>
   </DotBackground>
 );
};
export default TutorLearnMore;