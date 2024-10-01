import React, { useState } from 'react';
import api from '../../service/api';
import { toast } from 'sonner';

const CourseReviewForm = ({ courseId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('accessToken');

        try {
            await api.post(`/course/${courseId}/reviews/`, {
                rating,
                comment,
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            toast.success('Review submitted successfully!');
            onReviewSubmitted(); // Call the parent function to refresh reviews
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <h3 className="text-lg font-semibold">Leave a Review</h3>
            <div>
                <label className="block mb-2">Rating:</label>
                <select value={rating} onChange={(e) => setRating(e.target.value)} className="border rounded p-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <option key={star} value={star}>{star}</option>
                    ))}
                </select>
            </div>
            <div className="mt-2">
                <label className="block mb-2">Comment:</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border rounded p-2 w-full"
                    rows="4"
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-2">Submit Review</button>
        </form>
    );
};

export default CourseReviewForm;