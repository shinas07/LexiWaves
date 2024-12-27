import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../service/api';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';

// const stripePromise = loadStripe('pk_test_51Q2wk7CGFE5oUgojRgoXQYx6kbaDqzRb4WKMn8eByS7USdVY8cB3DnUTmi0TuTX96e2MlF70kAXGPunwLh7IWWhi00GErJnoX2');
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
const PaymentEnrollButton = ({ courseId }) => {
    const [loading, setLoading] = useState(false);
    const [enrolled, setEnrolled] = useState(false)
    const [enrolledId, SetEnrolledId] = useState()
    const navigate = useNavigate();

    // Check enrollment status on component mount
    useEffect(() => {
        const checkEnrollment = async () => {
            const accessToken = localStorage.getItem('accessToken');
            try {
                const checkResponse = await api.get(`/user/check-enrollment/${courseId}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
    
                if (checkResponse.data.enrolled) {
                    setEnrolled(true);
                    SetEnrolledId(checkResponse.data.enrollment_id)
                    toast.info('You are already enrolled in this course!');
                }
            } catch (error) {
                toast.error('Failed to check enrollment status. Please try again.');
            }
        };

        checkEnrollment();
    }, [courseId, navigate]); // Dependencies: courseId and navigate

    const handleClick = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');

        try {
            // Only proceed if not already enrolled
            if (enrolled) {
                navigate(`/watch-course/${enrolledId}`)
                // Call your backend to create a Checkout Session
            }else {
                const response = await api.post('/user/course-checkout-session/', {
                    course_id: courseId,
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                const session = response.data;

                // Redirect to Stripe Checkout
                const stripe = await stripePromise;
                const result = await stripe.redirectToCheckout({
                    sessionId: session.id,
                });

                if (result.error) {
                    toast.error('Failed to redirect to payment. Please try again.');
                } else {
                    toast.success('Redirecting to payment...');
                }
            }
        } catch (error) {
            toast.error('Failed to enroll in the course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`shadow-[inset_0_0_0_2px_#616467] text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
        >
            {loading ? 'Processing...' : (enrolled ? 'Continue Learning' : 'Enroll Now')}
        </button>
    );
};

export default PaymentEnrollButton;