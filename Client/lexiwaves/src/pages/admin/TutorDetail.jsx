import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../service/api';
import Layout from './Layout';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function TutorDetail() {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

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
      setTutor({ ...tutor, admin_approved: status });
      toast.success('approved successful')
      navigate('/admin-tutor-requests')
    } catch (error) {
      setError('Failed to update approval status');
    }
  };

  const renderField = (label, value) => (
    <tr>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{label}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{value}</td>
    </tr>
  );

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-700 text-center">Tutor Details</h1>
        {loading && <p className="text-sm text-center text-gray-500">Loading details...</p>}
        {error && <p className="text-sm text-center text-red-500">{error}</p>}
        {tutor && (
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {renderField("ID", tutor.id)}
                {renderField("Phone Number", tutor.phone_number)}
                {renderField("Address", tutor.address)}
                {renderField("Biography", tutor.biography)}
                {renderField("Current Position", tutor.current_position)}
                {renderField("Degrees", tutor.degrees)}
                {renderField("Educational Institutions", tutor.educational_institutions)}
                {renderField("Hourly Rate", `$${tutor.hourly_rate}`)}
                {renderField("Skill Levels", tutor.skill_levels)}
                {renderField("Subjects Offered", tutor.subjects_offered)}
                {renderField("Teaching Experience", `${tutor.teaching_experience} years`)}
                {renderField("Work History", tutor.work_history)}
                {renderField("Personal Statement", tutor.personal_statement)}
                {renderField("Terms of Service Accepted", tutor.terms_of_service ? "Yes" : "No")}
                {renderField("Admin Approved", tutor.admin_approved ? "Yes" : "No")}
                {renderField("Approval Date", tutor.approval_date ? format(new Date(tutor.approval_date), "PPP") : "Not approved yet")}
                {renderField("Created At", format(new Date(tutor.created_at), "PPP"))}
                {renderField("Identity Proof", 
                  <a href={tutor.identity_proof} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Document
                  </a>
                )}
                {renderField("Profile Picture", 
                  tutor.profile_picture ? 
                    <img src={tutor.profile_picture} alt="Profile" className="w-20 h-20 object-cover rounded-full" /> : 
                    "Not provided"
                )}
              </tbody>
            </table>
            <div className="flex justify-center space-x-4 mt-8">
              <button
                className={`px-4 py-2 ${tutor.admin_approved ? 'bg-gray-300' : 'bg-green-500 hover:bg-green-600'} text-white rounded`}
                onClick={() => handleApproval(true)}
                disabled={tutor.admin_approved}
              >
                {tutor.admin_approved ? 'Approved' : 'Approve'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}