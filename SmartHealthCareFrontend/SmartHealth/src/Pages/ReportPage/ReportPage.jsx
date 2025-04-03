import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../Components/Fotter/Fotter';
import DoctorNav from '../../Components/Navbar/DoctorNav';
import Navbar from '../../Components/Navbar/Navbar';

const ReportPage = () => {
  const [formData, setFormData] = useState({
    category: '',
    urgency: 'Low',
    reportType: '',
    subject: '',
    description: '',
    photo: null,
  });

  const [isDoctor, setIsDoctor] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Check user role on component mount
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUserId(decodedToken.userId);
        setIsDoctor(decodedToken.Role === "Doctor");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      photo: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const data = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'photo' && formData[key]) {
          data.append('photo', formData[key]);
        } else if (key !== 'photo') {
          data.append(key, formData[key]);
        }
      });
      
      // Add UserId to FormData
      if (userId) {
        data.append('userId', userId);
      }

      const response = await axios.post('https://localhost:7070/api/Admin/DoReport', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if(response.status === 200) {
        toast.success('Report submitted successfully!');
      }

      setMessage({ text: 'Report submitted successfully!', type: 'success' });
      // Reset form
      setFormData({
        category: '',
        urgency: 'Low',
        reportType: '',
        subject: '',
        description: '',
        photo: null,
      });
      
      // Reset file input
      document.getElementById('photo').value = '';
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(error.response?.data?.message || 'Failed to submit report. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setMessage({ 
        text: error.response?.data?.message || 'Failed to submit report. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Technical', 'Medical', 'Administrative', 'Billing', 'Other'];
  const urgencyLevels = ['Low', 'Medium', 'High', 'Critical'];
  const reportTypes = ['Issue', 'Request', 'Feedback', 'Complaint', 'Suggestion'];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <>
      {isDoctor ? <DoctorNav /> : <Navbar />}

      <div className="min-h-screen bg-gradient-to-br  py-12 px-4 sm:px-6 lg:px-8">
        <ToastContainer />
        <motion.div 
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-6">
            <h1 className="text-3xl font-bold text-white">Submit a Report</h1>
            <p className="text-blue-100 mt-2">Please fill in the details below to submit your report</p>
          </div>

          <motion.form 
            onSubmit={handleSubmit}
            className="px-8 py-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category */}
              <motion.div className="col-span-1" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </motion.div>

              {/* Urgency */}
              <motion.div className="col-span-1" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Urgency <span className="text-red-500">*</span>
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm"
                >
                  {urgencyLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </motion.div>

              {/* Report Type */}
              <motion.div className="col-span-1" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Report Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="reportType"
                  value={formData.reportType}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm"
                >
                  <option value="">Select report type</option>
                  {reportTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </motion.div>

              {/* Subject */}
              <motion.div className="col-span-1" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  maxLength={200}
                  required
                  className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm"
                  placeholder="Brief subject of your report"
                />
              </motion.div>

              {/* Description */}
              <motion.div className="col-span-2" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm"
                  placeholder="Please provide detailed information about your report..."
                ></textarea>
              </motion.div>

              {/* Photo */}
              <motion.div className="col-span-2" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Supporting Photo (Optional)
                </label>
                <div className="mt-1 flex items-center">
                  <label className="w-full flex items-center justify-center px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition duration-200">
                    <span className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    {formData.photo ? (
                      <span className="text-indigo-600 font-medium">{formData.photo.name}</span>
                    ) : (
                      <span>Upload a photo</span>
                    )}
                    <input
                      id="photo"
                      name="photo"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">JPG, PNG or GIF up to 10MB</p>
              </motion.div>
            </div>

            

            {/* Submit button */}
            <motion.div 
              className="mt-10"
              variants={itemVariants}
            >
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-70"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loading ? 'Submitting Report...' : 'Submit Report'}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default ReportPage;