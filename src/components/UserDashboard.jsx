import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Table,
  IconButton,
} from '@material-tailwind/react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { api } from '../utils/api';
import { EyeIcon } from '@heroicons/react/24/outline';
import './UserDashboard.css'; // Import the CSS file

const UserDashboard = () => {
  const { user } = useUser();
  const [resumes, setResumes] = useState([]);
  const [allResumes, setAllResumes] = useState([]); // To store all fetched resumes for admin
  const [selectedResume, setSelectedResume] = useState(null);
  const [showModal, setShowModal] = useState(false); // Using basic HTML modal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [candidateNames, setCandidateNames] = useState([]);
  const [emailIds, setEmailIds] = useState([]);

  const ADMIN_USER_ID = 'user_2tigW5R55TpwNr6EMewCrhcH6vK';
  const isAdmin = user?.id === ADMIN_USER_ID;

  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);
      setError('');
      try {
        const currentUserId = user?.id;
        const response = await api.get(`/resumes?user_id=${isAdmin ? '' : currentUserId}&current_user_id=${currentUserId}`);
        if (response.status === 200) {
          if (isAdmin) {
            setAllResumes(response.data);
            setResumes(response.data); // Initially show all for admin
          } else {
            setResumes(response.data);
            setAllResumes(response.data); // Keep a copy for consistency
          }
        } else {
          setError('Failed to fetch resume data.');
          console.error('Failed to fetch resume data:', response.statusText);
          setResumes([]);
          setAllResumes([]);
        }
      } catch (err) {
        setError('Error fetching resume data.');
        console.error('Error fetching resume data:', err);
        setResumes([]);
        setAllResumes([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchResumes();
    }
  }, [user?.id, isAdmin]);

  useEffect(() => {
    if (allResumes.length > 0) {
      const names = [...new Set(allResumes.map((r) => r.candidate_name).filter(Boolean))];
      const emails = [...new Set(allResumes.map((r) => r.email_id).filter(Boolean))];
      setCandidateNames(names);
      setEmailIds(emails);
    } else {
      setCandidateNames([]);
      setEmailIds([]);
    }
  }, [allResumes]);

  const handleOpenModal = (resume) => {
    setSelectedResume(resume);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedResume(null);
  };

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    setFilterValue(''); // Reset filter value when type changes
    setResumes(allResumes); // Reset displayed resumes
  };

  const handleFilterValueChange = (value) => {
    setFilterValue(value);
    if (value) {
      let filtered;
      if (filterType === 'candidate_name') {
        filtered = allResumes.filter((r) =>
          r.candidate_name?.toLowerCase().includes(value.toLowerCase())
        );
      } else if (filterType === 'email_id') {
        filtered = allResumes.filter((r) =>
          r.email_id?.toLowerCase().includes(value.toLowerCase())
        );
      }
      setResumes(filtered);
    } else {
      setResumes(allResumes); // Show all when filter value is empty
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" color="blue-gray">
          User Dashboard
        </Typography>
        <UserButton afterSignOutUrl="/" />
      </div>
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-4 p-6">
          <Typography variant="h5" color="white">
            Resume Data
          </Typography>
        </CardHeader>
        <CardBody className="p-6">
          {error && <Typography color="red" className="mb-4">{error}</Typography>}
          {loading ? (
            <Typography>Loading resume data...</Typography>
          ) : (
            <>
              <div className="mb-4 flex items-center space-x-4">
                <div>
                  <label htmlFor="filterType" className="block text-sm font-medium text-gray-700">
                    Filter By
                  </label>
                  <select
                    id="filterType"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={filterType}
                    onChange={(e) => handleFilterTypeChange(e.target.value)}
                  >
                    {isAdmin && <option value="">Show All</option>}
                    <option value="candidate_name">Candidate Name</option>
                    <option value="email_id">Email ID</option>
                  </select>
                </div>

                {filterType === 'candidate_name' && (
                  <div>
                    <label htmlFor="filterValueName" className="block text-sm font-medium text-gray-700">
                      Select Candidate Name
                    </label>
                    <select
                      id="filterValueName"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={filterValue}
                      onChange={(e) => handleFilterValueChange(e.target.value)}
                    >
                      <option value="">All Candidate Names</option>
                      {candidateNames.sort().map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {filterType === 'email_id' && (
                  <div>
                    <label htmlFor="filterValueEmail" className="block text-sm font-medium text-gray-700">
                      Select Email ID
                    </label>
                    <select
                      id="filterValueEmail"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={filterValue}
                      onChange={(e) => handleFilterValueChange(e.target.value)}
                    >
                      <option value="">All Email IDs</option>
                      {emailIds.sort().map((email) => (
                        <option key={email} value={email}>
                          {email}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <Typography variant="h6" color="blue-gray" className="mb-4">
                Uploaded Resumes:
              </Typography>

              {resumes.length > 0 ? (
                <div className="table-responsive">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-4 border-b border-blue-gray-200">Candidate Name</th>
                        <th className="p-4 border-b border-blue-gray-200">Email ID</th>
                        <th className="p-4 border-b border-blue-gray-200">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumes.map((resume, index) => (
                        <tr key={index} className="text-center">
                          <td className="p-4 border-b border-blue-gray-200">{resume.candidate_name}</td>
                          <td className="p-4 border-b border-blue-gray-200">{resume.email_id}</td>
                          <td className="p-4 border-b border-blue-gray-200">
                            <IconButton size="sm" onClick={() => handleOpenModal(resume)}>
                              <EyeIcon className="h-5 w-5" />
                            </IconButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Typography>No resume data found.</Typography>
              )}

              {showModal && selectedResume && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white rounded-md p-6 max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                      <Typography variant="h6" color="blue-gray">
                        {selectedResume.candidate_name || 'Candidate Information'}
                      </Typography>
                      <Button size="sm" color="blue-gray" onClick={handleCloseModal}>
                        Close
                      </Button>
                    </div>
                    <div style={{ overflowY: 'auto', maxHeight: '70vh' }}>
                      <Typography>
                        <strong>Candidate Name:</strong> {selectedResume.candidate_name || 'N/A'}
                      </Typography>
                      <Typography>
                        <strong>Phone Number:</strong> {selectedResume.phone_number || 'N/A'}
                      </Typography>
                      <Typography>
                        <strong>Email Address:</strong> {selectedResume.email_id || 'N/A'}
                      </Typography>
                      {selectedResume.education && Array.isArray(selectedResume.education) && selectedResume.education.length > 0 && (
                        <div>
                          <Typography className="font-semibold">Education:</Typography>
                          <ul>
                            {selectedResume.education.map((edu, index) => (
                              <li key={index}>
                                <Typography>
                                  <strong>Institution:</strong> {edu.institution_name || 'N/A'}
                                </Typography>
                                <Typography>
                                  <strong>Degree:</strong> {edu.degree_obtained || 'N/A'}
                                </Typography>
                                <Typography>
                                  <strong>CGPA:</strong> {edu.cgpa || 'N/A'}
                                </Typography>
                                <Typography>
                                  <strong>Duration:</strong> {edu.duration || 'N/A'}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selectedResume.workExperience && Array.isArray(selectedResume.workExperience) && selectedResume.workExperience.length > 0 && (
                        <div>
                          <Typography className="font-semibold">Work Experience:</Typography>
                          <ul>
                            {selectedResume.workExperience.map((exp, index) => (
                              <li key={index}>
                                <Typography>
                                  <strong>Company:</strong> {exp.company_name || 'N/A'}
                                </Typography>
                                <Typography>
                                  <strong>Title:</strong> {exp.job_title || 'N/A'}
                                </Typography>
                                <Typography>
                                  <strong>Duration:</strong> {exp.duration || 'N/A'}
                                </Typography>
                                <Typography>
                                  <strong>Experience (Years):</strong> {exp.years_of_experience || 'N/A'}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selectedResume.skills && Array.isArray(selectedResume.skills) && selectedResume.skills.length > 0 && (
                        <div>
                          <Typography className="font-semibold">Skills:</Typography>
                          <Typography>{selectedResume.skills.join(', ') || 'N/A'}</Typography>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default UserDashboard;