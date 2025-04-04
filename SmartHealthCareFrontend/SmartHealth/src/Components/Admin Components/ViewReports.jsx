import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRole, setActiveRole] = useState('all');
  const [activeUrgency, setActiveUrgency] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://localhost:7070/api/Admin/GetReport");
        if (response.data.isSuccess) {
          setReports(response.data.data.$values);
        } else {
          setError("Failed to fetch reports");
        }
      } catch (err) {
        setError("Error connecting to the server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Get unique filter options from data
  const urgencyOptions = ['all', ...new Set(reports.map(report => report.urgency))];
  const categoryOptions = ['all', ...new Set(reports.map(report => report.category))];

  // Apply filters
  const filteredReports = reports.filter(report => {
    const matchesRole = activeRole === 'all' || report.role === activeRole;
    const matchesUrgency = activeUrgency === 'all' || report.urgency === activeUrgency;
    const matchesCategory = activeCategory === 'all' || report.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      report.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesRole && matchesUrgency && matchesCategory && matchesSearch;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const expandVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const filterVariants = {
    hidden: { height: 0, opacity: 0, overflow: 'hidden' },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch(urgency) {
      case 'Critical':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'High':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        );
      case 'Medium':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const FilterButton = ({ active, onClick, children }) => (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
        active 
          ? 'bg-indigo-600 text-white shadow-sm' 
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
      }`}
    >
      {children}
    </motion.button>
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-red-50 p-6 rounded-lg text-red-700 shadow-md max-w-lg w-full">
          <h3 className="font-bold text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Error
          </h3>
          <p className="mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border-b border-gray-200 top-0 z-10 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-gray-900">Reports Dashboard</h1>
              <p className="text-gray-600 text-sm">
                {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'} found
              </p>
            </motion.div>
            
            <div className="flex items-center space-x-3">
              <motion.div
                className="relative w-64"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-black  font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-color font-medium"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </motion.button>
            </div>
          </div>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="pb-6"
              >
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Filter by Role</h3>
                  <div className="flex space-x-2">
                    <FilterButton 
                      active={activeRole === 'all'} 
                      onClick={() => setActiveRole('all')}
                    >
                      All Roles
                    </FilterButton>
                    <FilterButton 
                      active={activeRole === 'Doctor'} 
                      onClick={() => setActiveRole('Doctor')}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Doctors
                      </div>
                    </FilterButton>
                    <FilterButton 
                      active={activeRole === 'Patient'} 
                      onClick={() => setActiveRole('Patient')}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Patients
                      </div>
                    </FilterButton>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Filter by Urgency</h3>
                  <div className="flex flex-wrap gap-2">
                    <FilterButton 
                      active={activeUrgency === 'all'} 
                      onClick={() => setActiveUrgency('all')}
                    >
                      All Urgency Levels
                    </FilterButton>
                    {urgencyOptions.filter(option => option !== 'all').map(option => (
                      <FilterButton 
                        key={option}
                        active={activeUrgency === option} 
                        onClick={() => setActiveUrgency(option)}
                      >
                        <div className="flex items-center">
                          {getUrgencyIcon(option)}
                          {option}
                        </div>
                      </FilterButton>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Filter by Category</h3>
                  <div className="flex flex-wrap gap-2">
                    <FilterButton 
                      active={activeCategory === 'all'} 
                      onClick={() => setActiveCategory('all')}
                    >
                      All Categories
                    </FilterButton>
                    {categoryOptions.filter(option => option !== 'all').map(option => (
                      <FilterButton 
                        key={option}
                        active={activeCategory === option} 
                        onClick={() => setActiveCategory(option)}
                      >
                        {option}
                      </FilterButton>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-12 rounded-xl shadow-sm text-center border border-gray-200"
          >
            <img 
              src="/api/placeholder/200/200" 
              alt="No reports found" 
              className="mx-auto h-32 w-32 mb-4 opacity-50"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No reports found</h3>
            <p className="text-gray-500 mb-6">There are no reports matching your current filters.</p>
            <button
              onClick={() => {
                setActiveRole('all');
                setActiveUrgency('all');
                setActiveCategory('all');
                setSearchTerm('');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredReports.map((report) => (
              <motion.div
                key={report.$id}
                variants={itemVariants}
                layoutId={`report-${report.$id}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {report.profileget ? (
                        <img 
                          src={report.profileget} 
                          alt={report.userName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                          {report.userName?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{report.userName}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              report.role === 'Doctor' 
                                ? 'bg-indigo-100 text-indigo-800' 
                                : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {report.role}
                          </span>
                          {report.specialization && (
                            <span className="ml-2 text-gray-500">{report.specialization}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(report.urgency)}`}>
                          {getUrgencyIcon(report.urgency)}
                          {report.urgency}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 rounded-full text-xs font-medium">
                          {report.category}
                        </span>
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full text-xs font-medium">
                          {report.reportType}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-lg text-gray-900">{report.subject}</h4>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleExpand(report.$id)}
                    className={`${
                      expandedId === report.$id 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'bg-white text-indigo-600 border border-indigo-200'
                    } px-4 py-2 rounded-lg font-medium flex items-center justify-center hover:bg-indigo-100 transition-colors w-full`}
                  >
                    {expandedId === report.$id ? 'Hide Details' : 'View Details'}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 ml-1 transition-transform ${expandedId === report.$id ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>
                </div>
                
                <AnimatePresence>
                  {expandedId === report.$id && (
                    <motion.div
                      variants={expandVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="px-6 pb-6 border-t border-gray-100"
                    >
                      <div className="pt-4">
                        <h5 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Description
                        </h5>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                          {report.description || "No description provided."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {filteredReports.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredReports.length} of {reports.length} reports
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReports;