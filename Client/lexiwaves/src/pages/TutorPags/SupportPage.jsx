import React, { useState } from "react";
import { DotBackground } from "../../components/Background";
import { motion, AnimatePresence } from "framer-motion";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className="mb-4 bg-white/5 rounded-lg overflow-hidden border border-white/10"
      initial={false}
    >
      <motion.button
        className="w-full px-6 py-4 flex items-center justify-between text-left text-gray-200 hover:bg-white/10 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 text-gray-300 bg-white/5">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SupportPage = () => {
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const faqs = [
        {
            question: "How long does it take for my account to be approved?",
            answer: "Account approval typically takes 24-48 hours. Our admin team reviews each application thoroughly to ensure quality standards."
        },
        {
            question: "What should I do if I forgot my password?",
            answer: "Click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to reset your password."
        },
        {
            question: "How can I update my profile information?",
            answer: "Go to your profile settings page. You can update your information there. Some changes may require admin approval."
        }
    ];

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-black">
            <DotBackground />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-10 w-full max-w-4xl mx-auto px-4 py-8"
            >
                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-4xl font-bold text-white mb-4"
                    >
                        How can we help?
                    </motion.h2>
                    <p className="text-gray-400 text-lg">
                        Get support from our team or browse through frequently asked questions
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* FAQ Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
                    >
                        <h3 className="text-2xl font-semibold text-white mb-6">
                            Frequently Asked Questions
                        </h3>
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} {...faq} />
                        ))}
                    </motion.div>

                    {/* Contact Form Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
                    >
                        <h3 className="text-2xl font-semibold text-white mb-6">
                            Send us a message
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Your Message</label>
                                <textarea 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full h-40 bg-black/50 border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="How can we help you?"
                                    required
                                />
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Send Message
                            </motion.button>
                        </form>
                        <AnimatePresence>
                            {submitted && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400"
                                >
                                    Message sent successfully!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Quick Links */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 text-center"
                >
                    <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                        ← Return to Home Page
                    </a>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SupportPage;