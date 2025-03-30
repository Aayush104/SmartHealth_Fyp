import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Announcement = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const response = await axios.post('https://localhost:7070/api/Admin/DoAnnouncement', {
        title,
        description
      });
      
      toast.success('Announcement created successfully!');
    
      setTitle('');
      setDescription('');
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to create announcement', 
        type: 'error' 
      });
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" p-8 flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Create New Announcement
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
              

          
                    <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none font-normal text-black focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm"
                  placeholder="Enter title"
                />
              </div>
              
              <div>
           
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-normal text-black  focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 resize-none text-sm"
                  placeholder="Enter description"
                ></textarea>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                isLoading ? 'bg-sky-300' : 'bg-sky-500 hover:bg-sky-600'
              } transition-colors duration-200 shadow-sm text-sm mt-2`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Create Announcement'
              )}
            </button>
          </form>
          
          {message.text && (
            <div
              className={`mt-4 p-3 rounded-md text-sm ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}
            >
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                )}
                {message.text}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcement;