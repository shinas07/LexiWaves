import React, { useState, useEffect } from 'react'
import { User, Mail, Lock, Edit2, Check, X, Camera, Shield, Key, Calendar, Eye, EyeOff } from 'lucide-react';
import api from '../../service/api';
import { toast } from 'sonner';
import Loader from '../Loader';
import UserDashboardLayout from './DashboardLayout';
import { logout  } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
    const [userData, setUserData] = useState({ first_name: '', last_name: '', email: '' });
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [loading, setLoading] = useState(true);
    const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState({ first_name: '', last_name: '' });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false)
    const [removing, setRemoving] = useState(false)



            
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('accessToken')
                const response = await api.get('/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(response.data)
                setTempName({ first_name: response.data.first_name, last_name: response.data.last_name });
                setImagePreview(response.data.profile_image)
    
            } catch (error) {
                toast.error('User data is not found')
                dispatch(logout())
                navigate('/')
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [])

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error("New passwords don't match")
            return;
        }
        if (!/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(passwordData.new_password)) {
            toast.error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
            return;
        }

        try {
            const token = localStorage.getItem('accessToken')
            await api.post('/user/change-password/', passwordData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setIsChangingPassword(false)
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
            dispatch(logout())
            navigate('/signin')
            toast.success('Password changed successfully. Pleace log in again');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error); 
            } else {
                toast.error('Failed to change password');
            }
        }
    }

    const handleNameChange = async () => {
        try {
            const trimmedFirstName = tempName.first_name.trim();
            const trimmedLastName = tempName.last_name.trim();
    
            if (trimmedFirstName.length < 2 || trimmedLastName.length < 2) {
                toast.error('First and last name must be at least 2 characters long');
                return;
            }
            if (trimmedFirstName === userData.first_name && trimmedLastName === userData.last_name) {
                toast.error('No changes detected in the name');
                setIsEditingName(false);
                return;
            }
            const token = localStorage.getItem('accessToken');
            await api.patch('/user/profile/', tempName, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserData({ ...userData, ...tempName });
            setIsEditingName(false);
            toast.success('Name updated successfully');
        } catch (error) {
            toast.error('Failed to update name');
        }
    };

    const handleImage = async (event) => {
        const file = event.target.files[0];
        
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/svg+xml'];
            
            if (validImageTypes.includes(file.type)) {
                setUploading(true)
                const reader = new FileReader();
                reader.onload = async () => {
                    setImagePreview(reader.result); // Set the image preview
                    
                    // Prepare to upload the image
                    const formData = new FormData();
                    formData.append('profile_image', file);
                    
                    try {
                        const token = localStorage.getItem('accessToken');
                        await api.post('/user/upload-profile-image/', formData, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        
                        // Update user data to reflect the new profile image
                        const updatedUserData = { ...userData, profile_image: URL.createObjectURL(file) };
                        setUserData(updatedUserData);
                        setUploading(false)
                        toast.success('Profile image uploaded successfully');
                    } catch (error) {
                        setProfileImage(null);
                        setImagePreview(null);
                        // Handle error
                        setUploading(false)
                        toast.error('Failed to upload profile image');
                    }
                };
    
                reader.readAsDataURL(file);
                setProfileImage(file);
            } else {
                // Handle invalid file type
                toast.error('Please upload a valid image file.');
                event.target.value = null;
            }
        }
    };
    
    const handleImageRemove = async () => {
        setRemoving(true)
        try {
            const token = localStorage.getItem('accessToken');
           
            await api.post('/user/remove-profile-image/', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Clear the local state after successful removal
            setProfileImage(null);
            setImagePreview(null);
            setRemoving(false)
            toast.success('Profile image removed successfully');
        } catch (error) {
          
            setRemoving(false)
            toast.error('Failed to remove profile image');
        }
    };

    if (loading){
        return(
        <div>
            <UserDashboardLayout>
            <Loader/>
            </UserDashboardLayout>
        </div>
        )

    }

    return (
        <UserDashboardLayout>
            <div className="max-w-6xl mx-auto mt-10 p-6">
                <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">My Profile</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Summary Card */}
                    <div className="md:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6 dark:bg-neutral-800  text-center">
                        <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md dark:bg-gray-800">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Profile Image</h2>
                <div className="flex items-center justify-center mb-4">
                        <div className="relative">
                            {imagePreview ? (
                                <img
                                src={imagePreview}
                                alt="Profile Preview"
                                className={`${
                                    uploading 
                                        ? 'w-32 h-32 opacity-80 bg-gray-200 border-white' 
                                        : 'w-24 h-24 border-blue-400' 
                                } rounded-full object-cover mr-4 border-4 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl hover:border-blue-600 cursor-pointer`}
                            />
                            
                            ) : (
                                <div
                                    className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mr-4 border-4 border-gray-400 shadow-md transition-transform transform hover:scale-105 cursor-pointer"
                                    onClick={() => document.getElementById('file-upload').click()} // Open file dialog on placeholder click
                                >
                                    <Camera className="text-gray-500" />
                                </div>
                            
                            )}
                            <input
                                type="file"
                                accept="image/*" // Allow all image types
                                onChange={handleImage} // Handle image change
                                className="hidden"
                                id="file-upload"
                                onClick={(e) => { e.target.value = null; }} // Reset input value to allow re-uploading the same file
                            />
                        </div>
                </div>
                <div className="flex items-center justify-center mt-2">
                    {imagePreview ? (
                        
                        <span
                        className={`${removing ? 'text-red-600' : 'text-red-500'} cursor-pointer`}
                        onClick={handleImageRemove}
                    >
                        {removing ? 'Removing...' : 'Remove'}
                    </span>
                    ):(
                    <span className="text-green-500 cursor-pointer" onClick={() => document.getElementById('file-upload').click()}>Update</span>
                    )}
                </div>
                <p className="text-gray-600 mt-1 text-center">Please upload a square image (JPG, PNG) with a minimum resolution of 1,000x1,000 pixels.</p>
            </div>
        


                            <h2 className="text-2xl mt-4 font-semibold text-gray-800 dark:text-white mb-2">
                                {userData.first_name} {userData.last_name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{userData.email}</p>
                            <div className="flex justify-center space-x-2">
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                    Active
                                </span>
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                    {userData.user_type}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information Card */}
                    <div className="md:col-span-2  bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Personal Information</h2>
                                {!isEditingName && (
                                    <button onClick={() => setIsEditingName(true)} className="text-blue-500 hover:text-blue-600 transition duration-150 ease-in-out">
                                        <Edit2 size={20} />
                                    </button>
                                )}
                            </div>
                            {isEditingName ? (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            value={tempName.first_name}
                                            onChange={(e) => setTempName({ ...tempName, first_name: e.target.value })}
                                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="First Name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            value={tempName.last_name}
                                            onChange={(e) => setTempName({ ...tempName, last_name: e.target.value })}
                                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Last Name"
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={handleNameChange} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-150 ease-in-out">
                                            Save Changes
                                        </button>
                                        <button onClick={() => setIsEditingName(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-150 ease-in-out">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <User className="mr-3 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                                            <p className="text-lg font-medium text-gray-800 dark:text-white">{userData.first_name} {userData.last_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="mr-3 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                                            <p className="text-lg font-medium text-gray-800 dark:text-white">{userData.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="mr-3 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                                            <p className="text-lg font-medium text-gray-800 dark:text-white">{new Date(userData.date_joined).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md dark:bg-gray-800">
    <h2 className="text-2xl font-semibold mb-4 mt-4 text-gray-700 dark:text-gray-300">Security</h2>
    {isChangingPassword ? (
        <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current Password Field */}
            <div className="relative">
                <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Current Password"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                >
                    {showCurrentPassword ?  <Eye /> :  <EyeOff />}
                </button>
            </div>

            {/* New Password Field */}
            <div className="relative">
                <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="New Password"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                >
                    {showNewPassword ?  <Eye/> : <EyeOff /> }
                </button>
            </div>

            {/* Confirm New Password Field */}
            <div className="relative">
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm New Password"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                    {showConfirmPassword ? <Eye /> : <EyeOff /> }
                </button>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex space-x-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Change Password
                </button>
                <button type="button" onClick={() => setIsChangingPassword(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
                    Cancel
                </button>
            </div>
        </form>
    ) : (
        <button onClick={() => setIsChangingPassword(true)} className="flex items-center text-blue-500 hover:text-blue-600 focus:outline-none">
            <Lock className="mr-2" />
            Change Password
        </button>
    )}
</div>

                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
};

export default ProfilePage;
