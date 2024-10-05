// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import api from '../../service/api';
// import { DotBackground } from '../../components/Background';

// export default function TutorDetail() {
//   const { tutorId } = useParams();
//   const [tutor, setTutor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchTutorDetail = async () => {
//       try {
//         const token = localStorage.getItem('accessToken');
//         const response = await api.get(`/lexi-admin/tutor-details/${tutorId}/`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setTutor(response.data);
//         setLoading(false);
//       } catch (error) {
//         setError('Failed to fetch tutor details');
//         setLoading(false);
//       }
//     };

//     fetchTutorDetail();
//   }, [tutorId]);
//   console.log('id', tutorId)

//   const handleApproval = async (status) => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       await api.patch(`/lexi-admin/tutor-approve/${tutorId}/`, 
//         { 
//           admin_approved: status 
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       // Hand
//     } catch (error) {
//       setError('Failed to update approval status');
//     }
//   };

  
//   return (
//     <DotBackground>
//      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-32">
//      <h1 className="text-3xl color-black font-bold mb-6 text-center">Tutor Details</h1>
//         {loading && <p className="text-sm text-center text-gray-500">Loading details...</p>}
//         {error && <p className="text-sm text-center text-red-500">{error}</p>}
//         {tutor && (
//           <div>
//             {/* <div className="flex items-center mb-6 text-sm">
//               <img
//                 src={tutor.profile_picture || '/path/to/default-image.jpg'}
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full object-cover mr-6"
//               /> */}
//               {/* <div>
//                 <h1 className="text-2xl font-bold mb-2">{tutor.tutor.user.first_name} {tutor.tutor.user.last_name}</h1>
//                 <p className="text-gray-700"><strong>Phone:</strong> {tutor.phone_number}</p>
//                 <p className="text-gray-700"><strong>Address:</strong> {tutor.address}</p>
//               </div> */}
//             {/* </div> */}
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead>
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Degrees</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tutor.degrees}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Certifications</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tutor.certifications}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Institutions</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tutor.educational_institutions}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Relevant Courses</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tutor.relevant_courses}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Work History</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tutor.work_history}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Current Position</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tutor.current_position}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Teaching Experience</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tutor.teaching_experience}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Subjects Offered</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tutor.subjects_offered}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Skill Levels</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tutor.skill_levels}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Hourly Rate</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">${tutor.hourly_rate}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Payment Methods</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tutor.payment_methods}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Personal Statement</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tutor.personal_statement}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Identity Proof</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tutor.identity_proof ? 'Uploaded' : 'Not Uploaded'}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Terms Accepted</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tutor.terms_of_service ? 'Yes' : 'No'}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">Privacy Policy Accepted</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tutor.privacy_policy ? 'Yes' : 'No'}</td>
//                 </tr>
//               </tbody>
//             </table>
//             <div className="flex justify-center space-x-4 mt-8 text-sm">
//               <button
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//                 onClick={() => handleApproval(true)}
//               >
//                 Approve
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                 onClick={() => handleApproval(false)}
//               >
//                 Disapprove
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </DotBackground>
//   );

// }


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../service/api';
import Layout from './Layout';

export default function TutorDetail() {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutorDetail = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get(`/lexi-admin/tutor-details/${tutorId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTutor(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch tutor details');
        setLoading(false);
      }
    };

    fetchTutorDetail();
  }, [tutorId]);

  const handleApproval = async (status) => {
    try {
      const token = localStorage.getItem('accessToken');
      await api.patch(`/lexi-admin/tutor-approve/${tutorId}/`, 
        { 
          admin_approved: status 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Handle successful approval update
    } catch (error) {
      setError('Failed to update approval status');
    }
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Tutor Details</h1>
        {loading && <p className="text-sm text-center text-gray-500">Loading details...</p>}
        {error && <p className="text-sm text-center text-red-500">{error}</p>}
        {tutor && (
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Table rows here (same as in your original code) */}
              </tbody>
            </table>
            <div className="flex justify-center space-x-4 mt-8">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => handleApproval(true)}
              >
                Approve
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleApproval(false)}
              >
                Disapprove
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}