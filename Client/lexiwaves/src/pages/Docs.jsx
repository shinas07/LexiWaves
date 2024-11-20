// pages/Docs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  MessageCircle, 
  GraduationCap,
  Languages ,
  Book,
  ExternalLink
} from 'lucide-react';
import UserDashboardLayout from './UserPages/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const DocCard = ({ title, description, icon: Icon, content }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group relative p-6 rounded-2xl bg-neutral-900 border border-white/[0.05] hover:border-indigo-500/50 transition-colors"
  >
    <div className="relative">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-xl bg-white/[0.05]">
          <Icon className="w-6 h-6 text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-neutral-400 mb-4">{description}</p>
      <div className="text-neutral-300 space-y-2">
        {content.map((item, index) => (
          <p key={index} className="text-sm">• {item}</p>
        ))}
      </div>
    </div>
  </motion.div>
);

const DocsPage = () => {
  const navigate = useNavigate()
  const documentationSections = [
    {
      title: "About LexiWaves",
      description: "Your gateway to interactive language learning",
      icon: Languages,
      content: [
        "Modern platform for effective language learning",
        "Interactive lessons and real-time practice",
        "Focus on practical communication skills",
        "Personalized learning experience"
      ]
    },
    {
      title: "Learning Features",
      description: "Core features that make learning effective",
      icon: GraduationCap,
      content: [
        "Structured language courses for all levels",
        "Progress tracking and achievements",
        "Interactive exercises and quizzes",
        "Regular updates with new content"
      ]
    },
    {
      title: "Community Chat",
      description: "Connect with fellow language learners",
      icon: MessageCircle,
      content: [
        "Real-time language practice rooms",
        "Connect with native speakers",
        "Group discussions and language exchange",
        "Supportive learning environment"
      ]
    },
    {
      title: "Future Plans",
      description: "Upcoming features and improvements",
      icon: Rocket,
      content: [
        "Advanced AI-powered conversation practice",
        "More language options and specialized courses",
        "Enhanced progress tracking features",
        "Mobile app development"
      ]
    }
  ];

  return (
    <UserDashboardLayout>
      <div className="min-h-screen bg-neutral-900 py-12 px-4">
        <div className="max-w-6xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Book className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-neutral-300">Documentation</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              LexiWaves Documentation
            </h1>
            
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Everything you need to know about using LexiWaves for effective language learning.
            </p>
          </motion.div>
        </div>

        {/* Documentation Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentationSections.map((section, index) => (
              <DocCard key={index} {...section} />
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/[0.05]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Need Additional Help?</h3>
                <p className="text-neutral-400">Our support team is here to assist you</p>
              </div>
              <button onClick={() => navigate('/lexi-support')} className="px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors flex items-center gap-2">
                Contact Support
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default DocsPage;