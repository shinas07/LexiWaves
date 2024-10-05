import React, { useState } from "react";
import { DotBackground } from "../../components/Background";

const SupportPage = () => {
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can implement your message sending logic here

        // For demonstration, we will just reset the form and show a submitted message
        setMessage('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000); // Reset after 3 seconds
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center text-center bg-black"> {/* Change bg-gray-50 to bg-black */}
            <DotBackground />
            <div className="absolute z-10 bg-transparent shadow-lg rounded-lg p-8 md:p-12 lg:p-16"> {/* Set bg-transparent */}
                <h2 className="text-3xl font-semibold text-white mb-4">Support Page</h2> {/* Change text color to white */}
                <p className="text-lg text-gray-300 mb-6"> {/* Change text color to a lighter shade for contrast */}
                    If you have any questions or need assistance, you can reach out to us. We're here to help! Please provide detailed information regarding your query, and we will respond as soon as possible.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-200 mb-2">Frequently Asked Questions (FAQs)</h3> {/* Change text color */}
                <ul className="list-disc list-inside text-left mb-6">
                    <li className="text-gray-300">How long does it take for my account to be approved?</li> {/* Change text color */}
                    <li className="text-gray-300">What should I do if I forgot my password?</li> {/* Change text color */}
                    <li className="text-gray-300">How can I update my profile information?</li> {/* Change text color */}
                </ul>

                <h3 className="text-xl font-semibold text-gray-200 mb-2">Send a Message to Admin</h3> {/* Change text color */}
                <form onSubmit={handleSubmit} className="mb-4">
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-32 border border-gray-300 rounded-lg p-2 mb-4 bg-gray-800 text-gray-300" // Set a darker background for the textarea
                        placeholder="Type your message here..."
                        required
                    ></textarea>
                    <button 
                        type="submit" 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Send Message
                    </button>
                </form>
                {submitted && (
                    <p className="text-green-400 mt-2">Your message has been sent successfully!</p>
                )}
            </div>
            <footer className="absolute bottom-4 text-sm text-gray-500">
            <p>
        Need more help? <a href="/" className="text-blue-600 hover:underline">Return to Home Page</a>
    </p>
            </footer>
        </div>
    );
};

export default SupportPage;
