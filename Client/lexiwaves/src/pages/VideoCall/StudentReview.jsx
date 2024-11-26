import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Send, X, Heart, ThumbsUp, Medal, Trophy, Award } from 'lucide-react';
import api from '../../service/api';
import { toast } from 'sonner';
import { DotBackground } from '../../components/Background';
import confetti from 'canvas-confetti';

const ReviewSession = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRating = (value) => {
    setRating(value);
    // Trigger confetti on 5-star rating
    if (value === 5) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const submitReview = async () => {
    try {
      setLoading(true);
      await api.post('/reviews/submit', {
        sessionId: requestId,
        rating,
        review
      });
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.8 }
      });
      toast.success('Thank you for your valuable feedback! 🎉');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const getRatingIcon = (star) => {
    switch(star) {
      case 1: return <Heart className="w-6 h-6" />;
      case 2: return <ThumbsUp className="w-6 h-6" />;
      case 3: return <Medal className="w-6 h-6" />;
      case 4: return <Trophy className="w-6 h-6" />;
      case 5: return <Award className="w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <DotBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl 
                      rounded-3xl p-8 w-full max-w-md shadow-2xl 
                      border border-gray-700/50">
          {/* Header with Animation */}
          <div className="text-center mb-10 space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                         bg-clip-text text-transparent animate-gradient">
              Rate Your Experience
            </h2>
            <p className="text-gray-400 text-sm">
              Your feedback helps us create better learning experiences
            </p>
          </div>

          {/* Star Rating with Icons */}
          <div className="flex justify-center gap-4 mb-10">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className="group relative transform transition-all duration-200 
                         hover:scale-110 focus:outline-none"
              >
                <div className={`p-3 rounded-xl ${
                  star <= rating 
                    ? 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20' 
                    : 'hover:bg-gray-700/30'
                } transition-all`}>
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-500 hover:text-gray-400'
                    } transition-colors`}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Review Text */}
          <div className="mb-10 space-y-3">
            <label className="block text-gray-300 text-sm font-medium">
              Share your thoughts
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What made this session special? Any suggestions for improvement?"
              className="w-full p-4 rounded-xl bg-gray-700/50 text-white 
                       placeholder:text-gray-500 border border-gray-600 
                       focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                       transition-all outline-none resize-none"
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/enrolled-courses')}
              className="flex-1 px-6 py-3.5 rounded-xl border border-gray-600
                       hover:bg-gray-700/50 text-gray-300 transition-all duration-200
                       flex items-center justify-center gap-2 group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span>Skip</span>
            </button>
            <button
              onClick={submitReview}
              disabled={!rating || loading}
              className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r 
                       from-blue-600 to-blue-700 text-white font-medium
                       hover:from-blue-500 hover:to-blue-600
                       transition-all duration-200 flex items-center 
                       justify-center gap-2 disabled:opacity-50 
                       disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent 
                              rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </DotBackground>
  );
};

export default ReviewSession;