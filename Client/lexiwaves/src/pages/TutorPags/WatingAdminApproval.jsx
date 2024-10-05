import React from "react";
import { DotBackground } from "../../components/Background";

const WaitingForApproval = () => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center text-center bg-black">
            <DotBackground />
            <div className="absolute z-10 bg-transparent shadow-lg rounded-lg p-8 md:p-12 lg:p-16">
                <h2 className="text-3xl font-semibold text-white mb-4">Waiting for Admin Approval</h2>
                <p className="text-lg text-gray-300 mb-6">
                    Your profile is under review. You will be notified once the admin has approved your account. Please check back later.
                </p>
                <p className="text-sm text-gray-200">
                    If you forgot to complete your details, please 
                    <a href="/tutor-details" className="text-white underline"> click here</a> to finish your profile.
                </p>
            </div>
            <footer className="absolute bottom-4 text-sm text-gray-500">
                <p>
                    Need help? <a href="/tutor-support" className="text-blue-600 hover:underline">Contact Support</a> 
                </p>
            </footer>
        </div>
    );
};

export default WaitingForApproval;
