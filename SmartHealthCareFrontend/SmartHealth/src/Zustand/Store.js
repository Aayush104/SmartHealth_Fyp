// import { create } from 'zustand';
// import axios from 'axios';

// const useStore = create((set) => ({
//   userId: null,

//   registerPatient: async (userData) => {
//     try {
//       const response = await axios.post(
//         'https://localhost:7070/api/User/RegisterPatient',
//         userData
//       );

//       console.log(response);
//       if (response.status === 201) {
//         return response.data.data;
//       }
//     } catch (error) {
//       console.error('Error registering patient:', error);
//       throw new Error(error.response?.data?.message || 'Registration failed');
//     }
//   },

//   registerDoctor: async (userData) => {
//     try {
//       const response = await axios.post(
//         'https://localhost:7070/api/User/RegisterDoctor',
//         userData,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );

// console.log(response);

//       if (response.status === 200) {
//         return response.data.message;
//       }
//     } catch (error) {
//       console.error('Error registering doctor:', error);
//       throw new Error(error.response?.data?.message || 'Registration failed');
//     }
//   }
// }));

// export default useStore;


// import { create } from 'zustand';
// import axios from 'axios';

// const useStore = create((set) => ({
//   userId: null,
//   login: async (email, password) => {
//     try {
//       const response = await axios.post('https://localhost:7070/api/User/Login', {
//         email,
//         password,
//       });
//       if (response.data.isSuccess) {
//         const token = response.data.data;
//         const userRole = JSON.parse(atob(token.split('.')[1])).Role;

//         console.log(response.data.data);
      

//         return { token, userRole, userId: response.data.data};
//       }
//     } catch (error) {
//       if (error.response) {
//         throw new Error(error.response.data.message || 'Login failed');
//       } else {
//         throw new Error('Unable to reach the server. Please check your connection.');
//       }
//     }
//   },
//   registerPatient: async (userData) => {
//     try {
//       const response = await axios.post(
//         'https://localhost:7070/api/User/RegisterPatient',
//         userData
//       );

//       if (response.status === 201) {
//         return response.data.data;
//       }
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Registration failed');
//     }
//   },
//   registerDoctor: async (userData) => {
//     try {
//       const response = await axios.post(
//         'https://localhost:7070/api/User/RegisterDoctor',
//         userData,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );

//       if (response.status === 200) {
//         return response.data.message;
//       }
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Registration failed');
//     }
//   }
// }));

// export default useStore;

import { create } from 'zustand';
import axios from 'axios';

const useStore = create((set) => ({
 token: null, 
  userRole: null, 
  userId: null,

  
  login: async (email, password) => {
    try {
      const response = await axios.post('https://localhost:7070/api/User/Login', {
        email,
        password,
      });
  
      console.log(response)

      if (response.data.isSuccess) {
        const token = response.data.data;
        const userRole = JSON.parse(atob(token.split('.')[1])).Role;

        set({ token, userRole,  userId: response.data.data  });
        return { token, userRole, userId: response.data.data };
      } else if (response.status === 401) {
        throw { message: 'Unauthorized', userId: response.data.data }; 
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      } else {
        throw new Error('Unable to reach the server. Please check your connection.');
      }
    }
  },
  registerPatient: async (userData) => {
    try {
      const response = await axios.post(
        'https://localhost:7070/api/User/RegisterPatient',
        userData
      );

      if (response.status === 201) {
        return response.data.data;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
  registerDoctor: async (userData) => {
    try {
      const response = await axios.post(
        'https://localhost:7070/api/User/RegisterDoctor',
        userData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.status === 200) {
        return response.data.message;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
}));

export default useStore;

