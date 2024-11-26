import React, { useEffect, useState } from 'react';
import { Trophy, Flame, Calendar, BookOpen } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../../service/api';

const StudyStreak = () => {
    const user = useSelector((state) => state.auth.user);
    const [streakData, setStreakData] = useState({
        currentStreak: 0,
        longestStreak: 0,
        totalStudyDays: 0,
        coursesCompleted: 0,
        totalWatchTime: 0
    });

    useEffect(() => {
        fetchStreakData();
    }, []);

    const fetchStreakData = async () => {
        try {
            const response = await api.get('student/study-streak/');
            console.log(response.data)
            setStreakData(response.data);
        } catch (error) {
            console.error('Failed to fetch streak data:');
        }
    };

    const stats = [
        {
            title: "Current Streak",
            value: streakData.current_streak|| 0,
            unit: "days",
            icon: <Flame className="w-6 h-6 text-orange-500" />,
            description: "Keep learning daily!",
            color: "from-orange-500/20 to-transparent"
        },
        {
            title: "Longest Streak",
            value: streakData.max_streak || 0,
            unit: "days",
            icon: <Trophy className="w-6 h-6 text-yellow-500" />,
            description: "Your best record",
            color: "from-yellow-500/20 to-transparent"
        },
        {
            title: "Total Study Days",
            value: streakData.total_study_days || 0,
            unit: "days",
            icon: <Calendar className="w-6 h-6 text-blue-500" />,
            description: "Days of learning",
            color: "from-blue-500/20 to-transparent"
        },
        {
            title: "Last Active",
            value: streakData.last_study_date ? 
            new Date(streakData.last_study_date).toLocaleDateString() : 
            'Never',
            unit: "day",
            icon: <Calendar className="w-6 h-6 text-purple-500" />,
            description: "Your last study session",
            color: "from-purple-500/20 to-transparent"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Welcome back, {streakData.first_name || 'Learner'}!
                        </h2>
                        <p className="text-gray-400 mt-1">
                            Track your learning progress and maintain your streak
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div 
                        key={index}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 relative overflow-hidden group hover:bg-gray-800/70 transition-all"
                    >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-20`} />
                        
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-gray-700/50 rounded-xl">
                                    {stat.icon}
                                </div>
                                <span className="text-xs text-gray-400 bg-gray-700/30 px-2 py-1 rounded-full">
                                    {stat.unit}
                                </span>
                            </div>
                            
                            <h3 className="text-gray-400 text-sm font-medium mb-1">
                                {stat.title}
                            </h3>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold text-white">
                                    {stat.value}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {stat.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Achievement Banner */}
            {streakData.currentStreak > 0 && (
                <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/20 rounded-xl">
                                <BookOpen className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">
                                    Keep up the great work!
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    You're on a {streakData.currentStreak}-day learning streak
                                </p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-xl hover:bg-indigo-500/30 transition-colors">
                            View Progress
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyStreak;