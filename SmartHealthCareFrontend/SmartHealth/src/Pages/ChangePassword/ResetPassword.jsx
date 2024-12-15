import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = ({ userId }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword === confirmPassword) {
      try {
        const response = await axios.post("https://localhost:7070/api/User/ChangePassword", {
          userId: userId,
          password: newPassword,
        });

      if (response.data.statusCode == 200)
      {
        navigateTo('/login')
        toast.success("Your Passowrd has been updated")
        

      }
       
      } catch (error) {
        console.error('Error updating password', error.response?.data || error.message);
      }
    } else {
      console.log('Passwords do not match');
    }
  };

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
        
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
