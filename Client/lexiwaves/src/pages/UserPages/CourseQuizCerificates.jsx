import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';
import FloatingNavbar from '../../components/Navbar';
import { FaDownload, FaSpinner, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import Loader from '../Loader';

const CertificateDownload = () => {
   const { courseId } = useParams();
   const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
   const [certificateData, setCertificateData] = useState(null);
   const [downloading, setDownloading] = useState(false);
   const certificateRef = useRef(null);
    useEffect(() => {
       const fetchCertificateData = async () => {
           try {
               const token = localStorage.getItem('accessToken');
               const response = await api.get(`/student/course-quiz/${courseId}/`, {
                   headers: { Authorization: `Bearer ${token}` },
               });
                if (!response.data.quiz_data.passed) {
                   toast.error("You haven't passed the quiz yet!");
                   navigate(`/courses/${courseId}`);
                   return;
               }
                // Fetch certificate data
               const certResponse = await api.get(`/student/certificate/${courseId}/`, {
                   headers: { Authorization: `Bearer ${token}` },
               });
               setCertificateData(certResponse.data);
           } catch (error) {
               toast.error("Failed to fetch certificate data");
               navigate(-1);
           } finally {
               setLoading(false);
           }
       };
        fetchCertificateData();
   }, [courseId, navigate]);
   const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);

    try {
        const certificate = certificateRef.current;
        
        // Configure html2canvas options for better quality
        const canvas = await html2canvas(certificate, {
            scale: 4, // Increase the scale for better resolution (adjust as needed)
            useCORS: true, // Handle cross-origin images
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: certificate.scrollWidth,
            windowHeight: certificate.scrollHeight
        });

        // Create PDF with proper dimensions
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
            orientation: 'landscape', // Landscape for wider certificates
            unit: 'mm',
            format: 'a4',
            hotfixes: ['px_scaling'] // Fixes for high DPI scaling issues
        });

        // Calculate dimensions to fit A4 landscape
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const aspectRatio = canvas.width / canvas.height;

        // Set image width and height based on aspect ratio
        let imgWidth = pageWidth - 10; // 10mm margins on each side
        let imgHeight = imgWidth / aspectRatio;

        // Adjust if the image height exceeds the page height
        if (imgHeight > pageHeight - 10) {
            imgHeight = pageHeight - 10;
            imgWidth = imgHeight * aspectRatio;
        }

        // Center the image on the page
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        // Add the image to the PDF
        pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);

        // Clean and format the course title
        const cleanCourseTitle = (certificateData?.data?.course_title || certificateData?.course_title || 'Course')
            .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '_')           // Replace spaces with underscores
            .trim();                        // Remove extra spaces

        // Create filename with 'Certificate' prefix and course title
        const filename = `Certificate_${cleanCourseTitle}.pdf`;

        // Save the PDF with a clean filename
        pdf.save(filename);
        toast.success("Certificate downloaded successfully!");
    } catch (error) {
        console.error('Download error:', error);
        toast.error("Failed to download certificate. Please try again.");
    } finally {
        setDownloading(false);
    }
};

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
           <div className="container mx-auto p-6 mt-16">
               {/* Instructions Card */}
               <div className="bg-gray-800 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                   <h2 className="text-xl font-bold text-white flex items-center mb-4">
                       <FaInfoCircle className="mr-2" />
                       Certificate Instructions
                   </h2>
                   <ul className="space-y-3 text-gray-300">
                       <li className="flex items-start">
                           <FaCheckCircle className="mt-1 mr-2 text-green-500" />
                           Your certificate is ready to download in PDF format
                       </li>
                       <li className="flex items-start">
                           <FaCheckCircle className="mt-1 mr-2 text-green-500" />
                           The certificate includes a unique verification ID
                       </li>
                       <li className="flex items-start">
                           <FaCheckCircle className="mt-1 mr-2 text-green-500" />
                           You can download it multiple times if needed
                       </li>
                   </ul>
               </div>
                {/* Certificate Preview - Reduced size container */}
               <div className="max-w-3xl mx-auto">
                   <div 
                       ref={certificateRef}
                       className="bg-white p-8 rounded-lg shadow-2xl"
                   >
                       <div className="border-[10px] border-double border-gray-200 p-6">
                           <div className="relative text-center">
                               {/* Logo and Header Section - Fixed Alignment */}
                               <div className="mb-6">
                                   <div className="flex items-center justify-center mb-4">
                                       <div className="flex items-center gap-3 w-fit">
                                           <img 
                                               src="https://i.imghippo.com/files/qJMT7659cYw.jpg" 
                                               alt="LexiWaves" 
                                               className="h-12 w-12 object-cover rounded-full"
                                           />
                                           <h1 className="text-2xl font-serif text-gray-800 tracking-wide border-l-2 border-gray-300 pl-3">
                                               LexiWaves
                                           </h1>
                                       </div>
                                   </div>

                                   {/* Certificate Title */}
                                   <div className="text-center mt-4">
                                       <h2 className="text-3xl font-serif text-gray-800 tracking-wide">
                                           Certificate of Completion
                                       </h2>
                                       <div className="h-px w-36 bg-gray-300 mx-auto mt-2"></div>
                                   </div>
                               </div>

                               {/* Certificate Content */}
                               <div className="space-y-4 my-6">
                                   <p className="text-base text-gray-600 font-serif">
                                       This is to certify that
                                   </p>
                                   
                                   <p className="text-2xl font-serif font-bold text-gray-800 my-2 capitalize">
                                       {certificateData?.data?.student_name}
                                   </p>
                                   
                                   <p className="text-base text-gray-600 font-serif">
                                       has successfully completed
                                   </p>
                                   
                                   <p className="text-xl font-serif font-bold text-blue-800 my-2 capitalize">
                                       {certificateData?.data?.course_title}
                                   </p>
                                   
                                   <p className="text-base text-gray-600 font-serif">
                                       Guided by
                                   </p>
                                   
                                   <p className="text-lg font-serif font-semibold text-gray-800 capitalize">
                                       {certificateData?.data?.tutor_name}
                                   </p>
                               </div>

                               {/* Seal Section - Smaller size */}
                               <div className="flex justify-center mt-6 mb-4">
                                   <div className="relative">
                                       <div className="w-24 h-24 relative">
                                           <div className="absolute inset-0 border-4 border-blue-800 rounded-full flex items-center justify-center transform hover:rotate-12 transition-transform duration-500">
                                               <div className="absolute inset-2 border-2 border-blue-600 rounded-full"></div>
                                               <div className="absolute inset-3 border border-blue-500 rounded-full flex items-center justify-center">
                                                   <div className="text-center">
                                                       <div className="text-blue-800 font-bold text-lg">LW</div>
                                                       <div className="text-blue-600 text-[8px] font-serif">LEXIWAVES</div>
                                                       <div className="text-blue-500 text-[6px]">OFFICIAL</div>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               </div>

                               {/* Certificate Footer - Compact */}
                               <div className="mt-4 text-gray-600 text-center">
                                   <div className="border-t border-gray-200 pt-2 max-w-md mx-auto">
                                       <div className="grid grid-cols-3 gap-3 text-[10px]">
                                           <div>
                                               <p className="font-serif text-gray-500">Course</p>
                                               <p className="font-serif font-semibold capitalize">
                                                   {certificateData?.data?.course_title}
                                               </p>
                                           </div>
                                           <div>
                                               <p className="font-serif text-gray-500">ID</p>
                                               <p className="font-serif font-semibold break-all">
                                                   {certificateData?.data?.certificate_id}
                                               </p>
                                           </div>
                                           <div>
                                               <p className="font-serif text-gray-500">Date</p>
                                               <p className="font-serif font-semibold">
                                                   {certificateData?.data?.completion_date}
                                               </p>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
                {/* Download Button */}
               <div className="mt-8 text-center">
                   <button
                       onClick={handleDownload}
                       disabled={downloading}
                       className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                   >
                       {downloading ? (
                           <>
                               <FaSpinner className="animate-spin" />
                               Generating PDF...
                           </>
                       ) : (
                           <>
                               <FaDownload />
                               Download Certificate
                           </>
                       )}
                   </button>
               </div>
           </div>
       </DotBackground>
   );
};
export default CertificateDownload;