// pages/Support.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Mail, 
  Send,
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import UserDashboardLayout from './UserPages/DashboardLayout';
import { toast } from 'sonner';

const LexiSupportPage = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasActiveTicket, setHasActiveTicket] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);

  useEffect(() => {
    const ticket = localStorage.getItem('supportTicket');
    if (ticket) {
      setHasActiveTicket(true);
      setActiveTicket(JSON.parse(ticket));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for existing ticket
    const existingTicket = localStorage.getItem('supportTicket');
    if (existingTicket) {
      toast.error('You already have an active support ticket');
      return;
    }

    setIsSubmitting(true);

    try {
      const newTicket = {
        ...formData,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      localStorage.setItem('supportTicket', JSON.stringify(newTicket));
      setActiveTicket(newTicket);
      setHasActiveTicket(true);
      toast.success('Support ticket submitted successfully!');
      setFormData({ subject: '', message: '', priority: 'normal' });
    } catch (error) {
      toast.error('Failed to submit support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Your existing JSX remains the same until the conditional rendering
  return (
    <UserDashboardLayout>
      <div className="min-h-screen bg-neutral-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header - same as before */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-4">
              Contact Support
            </h1>
            <p className="text-neutral-400">
              We're here to help! Send us your questions or concerns.
            </p>
          </motion.div>

          {/* Support Cards - same as before */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Response Time</h3>
                  <p className="text-neutral-400 text-sm">Within 48 hours</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-indigo-500/10">
                  <Mail className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Email Support</h3>
                  <p className="text-neutral-400 text-sm">support@lexiwaves.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Rendering based on ticket status */}
          {hasActiveTicket ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-medium text-white">Active Support Ticket</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-400">Subject</p>
                  <p className="text-white">{activeTicket?.subject}</p>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-400">Priority</p>
                  <p className="text-white capitalize">{activeTicket?.priority}</p>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-400">Message</p>
                  <p className="text-white">{activeTicket?.message}</p>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-400">Submitted</p>
                  <p className="text-white">
                    {new Date(activeTicket?.timestamp).toLocaleString()}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.05]">
                  <p className="text-neutral-400 text-sm">
                    Your ticket is being processed. We'll respond within 48 hours.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            // Support Form - your existing form JSX
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Your existing form fields */}
                <div>
                  <label className="block text-white mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/[0.05] border border-white/[0.05] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/[0.05] border border-white/[0.05] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="normal" className="bg-neutral-800">Normal</option>
                    <option value="high" className="bg-neutral-800">High</option>
                    <option value="urgent" className="bg-neutral-800">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/[0.05] border border-white/[0.05] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[150px]"
                    placeholder="Describe your issue in detail"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* Note */}
          <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">
                {hasActiveTicket 
                  ? "You already have an active support ticket. Please wait for our response."
                  : "For immediate assistance, please include as much detail as possible in your message."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default LexiSupportPage;