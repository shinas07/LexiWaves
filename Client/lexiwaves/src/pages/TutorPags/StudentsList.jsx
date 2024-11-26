import React, { useEffect, useState } from 'react';
import api from '../../service/api';
import { toast } from 'sonner';
import Pagination from '../../components/Pagination';
import { VanishSearchBarUi } from '../../components/ui/vanish-SearchBar';
import TutorDashboardLayout from './TutorDashboardLayout';
import Loader from '../Loader';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showAllStudents, setShowAllStudents] = useState(true);

  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;

  const getCurrentStudents = () => {
    return showAllStudents ? students : filteredStudents;
  };

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get('student/students-details/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(response.data);
      } catch {
        toast.error('Problem fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDetails();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    
    if (!term.trim()) {
      setFilteredStudents(students);
      setShowAllStudents(true);
      return;
    }

    const filtered = students.filter((student) => {
      const searchWords = term.toLowerCase().split(' ');
      const studentText = `${student.user_first_name} ${student.user_last_name} ${student.course_title}`.toLowerCase();
      return searchWords.every((word) => studentText.includes(word));
    });

    setFilteredStudents(filtered);
    setShowAllStudents(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (filteredStudents.length === 0) {
        setSearchTerm('');
        setFilteredStudents(students);
        setShowAllStudents(true);
      }
    }
  };

  if (loading) {
    return (
      <TutorDashboardLayout>
        <div className="flex justify-center p-12"><Loader /></div>
      </TutorDashboardLayout>
    );
  }

  return (
    <TutorDashboardLayout>
      <div className="container mt-12 mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-4xl font-bold mt-6 text-white mb-4 md:mb-0">Student Details</h1>
          <div className="w-full md:w-1/3">
            <VanishSearchBarUi
              placeholders={['Search by student name...', 'Search by course title...', 'Looking for someone?']}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
        </div>

        {filteredStudents.length === 0 && !showAllStudents ? (
          <div className="text-center text-gray-400 py-8">
            <p className="text-xl">No students found matching "{searchTerm}"</p>
            <p className="mt-2">Press Enter to show all students</p>
          </div>
        ) : (
          <>
            <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left">First Name</th>
                  <th className="px-6 py-3 text-left">Last Name</th>
                  <th className="px-6 py-3 text-left">Course Title</th>
                  <th className="px-6 py-3 text-left">Course Category</th>
                  <th className="px-6 py-3 text-left">Payment Status</th>
                  <th className="px-6 py-3 text-left">Amount Paid</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentStudents()
                  .slice(indexOfFirstStudent, indexOfLastStudent)
                  .map((student) => (
                    <tr key={student.id} className="hover:bg-gray-700 transition duration-300">
                      <td className="px-6 py-4">{student.user_first_name}</td>
                      <td className="px-6 py-4">{student.user_last_name}</td>
                      <td className="px-6 py-4">{student.course_title}</td>
                      <td className="px-6 py-4">{student.course_category}</td>
                      <td className="px-6 py-4">{student.payment_status}</td>
                      <td className="px-6 py-4">${student.amount_paid}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {(showAllStudents ? students.length : filteredStudents.length) > itemsPerPage && (
              <Pagination
                totalItems={showAllStudents ? students.length : filteredStudents.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
            <p className="text-center text-gray-400 mt-6 mb-8">
              Showing {indexOfFirstStudent + 1}-{Math.min(indexOfLastStudent, showAllStudents ? students.length : filteredStudents.length)} of{' '}
              {showAllStudents ? students.length : filteredStudents.length} students
            </p>
          </>
        )}
      </div>
    </TutorDashboardLayout>
  );
};

export default StudentsList;
