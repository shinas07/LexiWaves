// TutorProfile.js
import React, { useEffect, useState } from 'react';
import { 
    Mail, Phone, MapPin, GraduationCap, 
    BookOpen, Award, Clock, Calendar 
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../service/api';
import TutorDashboardLayout from './TutorDashboardLayout';
import Loader from '../Loader';

const TutorProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await api.get('tutor/profile/', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                console.log(response.data)
                setProfile(response.data);
            } catch (error) {
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return (
        <TutorDashboardLayout>
            <div className="h-screen flex items-center justify-center">
                <Loader />
            </div>
        </TutorDashboardLayout>
    );

    return (
        <TutorDashboardLayout>
            <div className="container mx-auto p-6 mt-8">
                {/* Profile Header */}
                <div className="relative mb-8">
                    <div className="h-48 w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl" />
                    <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
                        <div className="relative">
                            <img
                                src={profile.user.profile_image || '/default-profile.png'}
                                alt="Profile"
                                className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl object-cover"
                            />
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white" />
                        </div>
                        <div className="mb-4">
                            <h1 className="text-3xl font-bold text-white">
                                {profile.user.first_name} {profile.user.last_name}
                            </h1>
                            <p className="text-indigo-200">Professional Educator</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - About & Subjects */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                            <h2 className="text-xl font-semibold text-white mb-4">About Me</h2>
                            <p className="text-gray-300 leading-relaxed">
                                {profile.detials.biography || 'No biography available'}
                            </p>
                        </div>

                        {/* Subjects Section */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <BookOpen className="w-5 h-5 mr-2" />
                                Subjects Offered
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {profile.detials.subjects_offered.split(',').map((subject, index) => (
                                    <span key={index} className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-sm">
                                        {subject.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Education Section */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <GraduationCap className="w-5 h-5 mr-2" />
                                Education
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-300">
                                    <span className="font-semibold mr-2">Degree:</span>
                                    {profile.detials.degrees}
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <span className="font-semibold mr-2">Institution:</span>
                                    {profile.detials.educational_institutions}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Stats & Contact */}
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <Award className="w-5 h-5 mr-2" />
                                Statistics
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-700/50 p-4 rounded-xl">
                                    <div className="text-3xl font-bold text-indigo-400 mb-1">
                                        {profile.total_courses}
                                    </div>
                                    <div className="text-gray-400">Courses</div>
                                </div>
                                <div className="bg-gray-700/50 p-4 rounded-xl">
                                    <div className="text-3xl font-bold text-indigo-400 mb-1">
                                        {profile.student_count}
                                    </div>
                                    <div className="text-gray-400">Students</div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                            <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-300">
                                    <Mail className="w-5 h-5 mr-3" />
                                    {profile.user.email}
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <Phone className="w-5 h-5 mr-3" />
                                    {profile.detials.phone_number}
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <MapPin className="w-5 h-5 mr-3" />
                                    {profile.detials.address}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TutorDashboardLayout>
    );
};

export default TutorProfile;
