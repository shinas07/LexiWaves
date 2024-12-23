import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../service/api';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';

const stripePromise = loadStripe('pk_test_51Q2wk7CGFE5oUgojRgoXQYx6kbaDqzRb4WKMn8eByS7USdVY8cB3DnUTmi0TuTX96e2MlF70kAXGPunwLh7IWWhi00GErJnoX2');

const PaymentEnrollButton = ({ courseId }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleClick = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');

        try {
            // Check if the user is already enrolled
            const checkResponse = await api.get(`/user/check-enrollment/${courseId}/`, {
              headers: {
                  'Authorization': `Bearer ${accessToken}`,
              },
          });

            if (checkResponse.data.enrolled) {
                // Redirect to the enrolled courses page if already enrolled
                toast.info('You have already purchased this course!')
                navigate('/enrolled-courses');
            } else {
                // Call your backend to create a Checkout Session
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
                    console.log(result.error)
                    toast.error('Failed to redirect to payment. Please try again.');
                } else {
                    // Handle successful enrollment (if needed)
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
            {loading ? 'Processing...' : 'Enroll Now'}
        </button>
    );
};

export default PaymentEnrollButton;