import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
} from '@material-tailwind/react';
import { api } from '../utils/api';
import Swal from 'sweetalert2'; // Import SweetAlert2

function ResumeParser() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const [file, setFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [uploading, setUploading] = useState(false); // State to track upload status
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' ||
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(selectedFile);
      setUploadError(''); // Clear any previous error
    } else {
      setFile(null);
      setUploadError('Please upload a valid PDF or DOCX file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // Add the user_id from Clerk
    if (user?.id) {
      formData.append('user_id', user.id);
    } else {
      setUploadError('User authentication information is missing.');
      setUploading(false);
      return;
    }

    setUploading(true);
    setUploadError('');
    setExtractedData(null);
    setIsFileUploaded(false);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setExtractedData(response.data.extracted_data);
        setIsFileUploaded(true);
        console.log('Extracted Data (Frontend Console):', response.data.extracted_data);
        Swal.fire({ // Show SweetAlert on completion
          icon: 'success',
          title: 'Resume Parsed!',
          text: 'The resume data has been extracted successfully.',
        });
      } else {
        console.error('File upload failed:', response.statusText);
        setUploadError(`File upload failed: ${response.data?.error || response.statusText}. Please try again.`);
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed!',
          text: `Error: ${response.data?.error || response.statusText}`,
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Error uploading file. Please try again.');
      Swal.fire({
        icon: 'error',
        title: 'Upload Error!',
        text: 'An unexpected error occurred during upload.',
      });
    } finally {
      setUploading(false);
    }
  };
  const handleViewProfile = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col gap-10 mx-auto my-auto">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h4" color="blue-gray">
            Welcome, {user?.firstName || 'User'}!
          </Typography>
          <UserButton afterSignOutUrl="/" />
        </div>
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Resume Parser
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="w-full">
                <Input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="w-full"
                  label="Upload Resume"
                />
                <Typography variant="small" color="gray" className="mt-2">
                  Supported formats: PDF, DOCX
                </Typography>
                {uploadError && (
                  <Typography variant="small" color="red" className="mt-2">
                    {uploadError}
                  </Typography>
                )}
              </div>
              <Button type="submit" disabled={!file || uploading}>
                {uploading ? 'Parsing...' : 'Parse Resume'}
              </Button>
            </form>

            {/* View Profile button is now always visible for logged-in users */}
            {isSignedIn && (
              <Button color="blue" onClick={handleViewProfile} className="mt-4">
                View Your Profile
              </Button>
            )}

            {/* Display Extracted Data */}
            {/* {extractedData && typeof extractedData === 'object' && (
              <div className="mt-4">
                <Typography variant="h6" color="blue-gray">
                  Extracted Data:
                </Typography>
                <Typography variant="paragraph" color="blue-gray">
                  <strong>Candidate Name:</strong> {extractedData.candidate_name || 'N/A'}
                </Typography>
                <Typography variant="paragraph" color="blue-gray">
                  <strong>Email:</strong> {extractedData.email_id || 'N/A'}
                </Typography>
                <Typography variant="paragraph" color="blue-gray">
                  <strong>Phone:</strong> {extractedData.phone_number || 'N/A'}
                </Typography>

                {extractedData.education && Array.isArray(extractedData.education) && extractedData.education.length > 0 && (
                  <div>
                    <Typography variant="h6" color="blue-gray" className="mt-2">
                      Education:
                    </Typography>
                    <ul>
                      {extractedData.education.map((edu, index) => (
                        <li key={index}>
                          <Typography variant="paragraph" color="blue-gray">
                            <strong>Institution:</strong> {edu.institution_name || 'N/A'}
                          </Typography>
                          <Typography variant="paragraph" color="blue-gray">
                            <strong>Degree:</strong> {edu.degree_obtained || 'N/A'}
                          </Typography>
                          <Typography variant="paragraph" color="blue-gray">
                            <strong>CGPA:</strong> {edu.cgpa || 'N/A'}
                          </Typography>
                          <Typography variant="paragraph" color="blue-gray">
                            <strong>Duration:</strong> {edu.duration || 'N/A'}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {extractedData.workExperience && Array.isArray(extractedData.workExperience) && extractedData.workExperience.length > 0 && (
                  <div>
                    <Typography variant="h6" color="blue-gray" className="mt-2">
                      Work Experience:
                    </Typography>
                    <ul>
                      {extractedData.workExperience.map((exp, index) => (
                        <li key={index}>
                          <Typography variant="paragraph" color="blue-gray">
                            <strong>Company:</strong> {exp.company_name || 'N/A'}
                          </Typography>
                          <Typography variant="paragraph" color="blue-gray">
                            <strong>Title:</strong> {exp.job_title || 'N/A'}
                          </Typography>
                          <Typography variant="paragraph" color="blue-gray">
                            <strong>Duration:</strong> {exp.duration || 'N/A'}
                          </Typography>
                          <Typography variant="paragraph" color="blue-gray">
                            <strong>Experience (Years):</strong> {exp.years_of_experience || 'N/A'}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {extractedData.skills && Array.isArray(extractedData.skills) && extractedData.skills.length > 0 && (
                  <div>
                    <Typography variant="h6" color="blue-gray" className="mt-2">
                      Skills:
                    </Typography>
                    <Typography variant="paragraph" color="blue-gray">
                      {extractedData.skills.join(', ') || 'N/A'}
                    </Typography>
                  </div>
                )}

                
                {extractedData && extractedData.error && (
                  <Typography variant="small" color="red" className="mt-2">
                    <strong>Error:</strong> {extractedData.error}
                  </Typography>
                )}
              </div>
            )} */}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default ResumeParser;