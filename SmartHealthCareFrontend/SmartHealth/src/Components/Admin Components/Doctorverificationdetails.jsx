import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Stethoscope, 
  MapPin, 
  GraduationCap, 
  Phone, 
  FileText, 
  Shield, 
  AlertCircle 
} from 'lucide-react';
import DoctorNav from '../Navbar/DoctorNav';
import AdminNav from '../Navbar/AdminNav';
import Footer from '../Fotter/Fotter';

const DoctorVerificationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7070/api/Doctor/GetDoctorDetails/${id}`);
        setDoctorDetails(response.data?.data.doctor || {});
        console.log(response.data?.data);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        setError('Failed to fetch doctor details.');
      }
    };

    fetchDoctorDetails();
  }, [id]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="p-6 bg-white rounded-lg shadow-md flex items-center space-x-4">
          <AlertCircle className="text-red-500" size={32} />
          <p className="text-red-600 font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!doctorDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-pulse text-center">
          <Stethoscope className="mx-auto mb-4 text-blue-500" size={48} />
          <p className="text-gray-600 font-semibold">Loading Doctor Details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-white-100  py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white border shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <Stethoscope className="mr-4 text-blue-600" size={36} />
              Doctor Verification Details
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <DetailRow icon={User} label="Name" value={doctorDetails.fullName} />
                <DetailRow icon={Mail} label="Email" value={doctorDetails.email} />
                <DetailRow icon={Stethoscope} label="Specialization" value={doctorDetails.specialization} />
              </div>
              <div className="space-y-4">
                <DetailRow icon={MapPin} label="Location" value={doctorDetails.loction} />
                <DetailRow icon={GraduationCap} label="Qualification" value={doctorDetails.qualifications} />
                <DetailRow icon={Phone} label="Phone Number" value={doctorDetails.phoneNumber} />
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FileText className="mr-3 text-green-600" size={28} />
                Uploaded Documents
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <DocumentPreview 
                  icon={Shield} 
                  label="Government ID" 
                  src={doctorDetails.governmentIdFile} 
                  onClick={() => doctorDetails.governmentIdFile && window.open(doctorDetails.governmentIdFile, '_blank')}
                />
                <DocumentPreview 
                  icon={GraduationCap} 
                  label="Qualifications" 
                  src={doctorDetails.qualificationsFile} 
                  onClick={() => doctorDetails.qualificationsFile && window.open(doctorDetails.qualificationsFile, '_blank')}
                />
                <DocumentPreview 
                  icon={Stethoscope} 
                  label="License" 
                  src={doctorDetails.licenseFile} 
                  onClick={() => doctorDetails.licenseFile && window.open(doctorDetails.licenseFile, '_blank')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-md">
    <Icon className="text-blue-500" size={24} />
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-900 font-semibold">{value || 'Not provided'}</p>
    </div>
  </div>
);

const DocumentPreview = ({ icon: Icon, label, src, onClick }) => (
  <div 
    className="bg-gray-50 rounded-lg overflow-hidden shadow-md cursor-pointer"
    onClick={onClick}
  >
    <div className="p-4 flex items-center border-b border-gray-200">
      <Icon className="mr-3 text-green-600" size={24} />
      <h3 className="text-md font-semibold text-gray-700">{label}</h3>
    </div>
    {src ? (
      <img 
        src={src} 
        alt={`${label} document`} 
        className="w-full h-48 object-cover hover:scale-105 transition-transform"
      />
    ) : (
      <div className="h-48 flex items-center justify-center text-gray-500">
        No document uploaded
      </div>
    )}
  </div>
);

export default DoctorVerificationDetails;
