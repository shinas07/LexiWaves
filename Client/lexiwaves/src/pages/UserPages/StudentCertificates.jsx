import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DotBackground } from '../../components/Background';
import FloatingNavbar from '../../components/Navbar';
import api from '../../service/api';
import { FaCertificate, FaDownload, FaSearch, FaFilter } from 'react-icons/fa';
import { toast } from 'sonner';
import Loader from '../Loader';

const StudentCertificates = () => {
   const [certificates, setCertificates] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [filterStatus, setFilterStatus] = useState('all');
   const [sortBy, setSortBy] = useState('recent');
    useEffect(() => {
       fetchCertificates();
   }, []);
    const fetchCertificates = async () => {
       try {
           const response = await api.get('/student/all/certificates/')
           setCertificates(response.data);
       } catch (error) {
           toast.info("No certificates found");
       } finally {
           setLoading(false);
       }
   };
    // Filter and sort certificates
   const filteredCertificates = certificates
       .filter(cert => {
           const matchesSearch = cert.course_title.toLowerCase().includes(searchTerm.toLowerCase());
           const matchesFilter = filterStatus === 'all' ? true : cert.status === filterStatus;
           return matchesSearch && matchesFilter;
       })
       .sort((a, b) => {
           if (sortBy === 'recent') {
               return new Date(b.completion_date) - new Date(a.completion_date);
           }
           return a.course_title.localeCompare(b.course_title);
       });
    if (loading) {
       return (
           <DotBackground>
               <div className="flex justify-center items-center h-screen">
                   <Loader />
               </div>
           </DotBackground>
       );
   }
    return (
       <DotBackground>
           <FloatingNavbar />
           <div className="container mx-auto px-4 py-8 mt-16">
               {/* Header Section */}
               <div className="mb-8">
                   <h1 className="text-3xl font-bold text-gray-800 mb-2">
                       My Certificates
                   </h1>
                   <p className="text-gray-600">
                       View and download your course completion certificates
                   </p>
               </div>
                {/* Search and Filter Section */}
               <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {/* Search */}
                       <div className="relative">
                           <FaSearch className="absolute left-3 top-3 text-gray-400" />
                           <input
                               type="text"
                               placeholder="Search certificates..."
                               className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                               value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                           />
                       </div>
                        {/* Filter */}
                       <div className="relative">
                           <FaFilter className="absolute left-3 top-3 text-gray-400" />
                           <select
                               className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                               value={filterStatus}
                               onChange={(e) => setFilterStatus(e.target.value)}
                           >
                               <option value="all">All Certificates</option>
                               <option value="completed">Completed</option>
                               <option value="pending">Pending</option>
                           </select>
                       </div>
                        {/* Sort */}
                       <div>
                           <select
                               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                               value={sortBy}
                               onChange={(e) => setSortBy(e.target.value)}
                           >
                               <option value="recent">Most Recent</option>
                               <option value="title">Course Title</option>
                           </select>
                       </div>
                   </div>
               </div>
                {/* Certificates Grid */}
               {filteredCertificates.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {filteredCertificates.map((certificate) => (
                           <div
                               key={certificate.id}
                               className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                           >
                               {/* Certificate Card */}
                               <div className="p-6">
                                   <div className="flex items-start justify-between mb-4">
                                       <div className="flex-1">
                                           <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                               {certificate.course_title}
                                           </h3>
                                           <p className="text-gray-500 text-sm">
                                               Completed on {new Date(certificate.completion_date).toLocaleDateString()}
                                           </p>
                                       </div>
                                       <FaCertificate className="text-blue-500 text-3xl" />
                                   </div>
                                    <div className="space-y-2">
                                       <p className="text-gray-600 text-sm">
                                           <span className="font-semibold">Instructor:</span> {certificate.tutor_name}
                                       </p>
                                       <p className="text-gray-600 text-sm">
                                           <span className="font-semibold">Certificate ID:</span>
                                           <span className="text-xs ml-1">{certificate.certificate_id}</span>
                                       </p>
                                   </div>
                                    {/* Actions */}
                                   <div className="mt-6 flex justify-between items-center">
                                       <Link
                                           to={`/certificate/download/${certificate.course_id}`}
                                           className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                       >
                                           View Details
                                       </Link>
                                   </div>
                               </div>
                           </div>
                       ))}
                   </div>
               ) : (
                   <div className="text-center py-12">
                       <FaCertificate className="text-gray-400 text-5xl mx-auto mb-4" />
                       <h3 className="text-xl font-semibold text-gray-600 mb-2">
                           No Certificates Found
                       </h3>
                       <p className="text-gray-500">
                           Complete courses to earn certificates
                       </p>
                   </div>
               )}
           </div>
       </DotBackground>
   );
};
export default StudentCertificates;