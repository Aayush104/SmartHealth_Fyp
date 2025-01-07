import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import Location from '../../Assets/Data/Location.json';
import Speciality from '../../Assets/Data/Speciality.json';
import { CiLocationOn } from "react-icons/ci";
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Spinner } from '@chakra-ui/react'; // Import Chakra spinner

const SearchDoctor = () => {
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setSpecialties(Speciality);
      } catch (err) {
        console.error('Error fetching specialties:', err);
        toast.error('Failed to load specialties');
      }
    };
    fetchSpecialties();
  }, []);

  const handleSearch = async () => {
    if (!location || !specialty) {
      toast.error('Please select both location and specialty.');
      return;
    }

    try {
      setIsLoading(true);
    
      const response = await axios.get('https://localhost:7070/api/Doctor/SearchDoctor', {
        params: { Location: location, Speciality: specialty },
      });

      const doctorsData = response.data.$values || [];
      if (response.status === 200) {
        navigate('/searched_doctor', { state: { doctors: doctorsData } });
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          toast.error('Specialty and Location are required for the search.');
        } else if (err.response.status === 404) {
          navigate('/NotFound')
        } else {
          toast.error('An unexpected error occurred.');
        }
      } else {
        toast.error('Failed to perform search. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
     

      <div className="flex gap-2 mt-4 mb-10">
        <div className="relative flex items-center">
          <Select
            options={Location.map((loc) => ({ value: loc.name, label: loc.name }))} 
            onChange={(selectedOption) => setLocation(selectedOption.value)}
            placeholder="Select Location"
            className="rounded w-64 h-16 z-100"
            styles={{
              control: (provided) => ({
                ...provided,
                paddingLeft: '30px',
                height: '49px',
              }),
              dropdownIndicator: (provided) => ({
                ...provided,
                display: 'none',
              }),
            }}
            components={{
              DropdownIndicator: () => <CiLocationOn className="absolute left-3 text-gray-600" />,
            }}
          />
        </div>

        <div className="relative">
          <Select
            options={specialties.map((spec) => ({ value: spec.name, label: spec.name }))} 
            onChange={(selectedOption) => setSpecialty(selectedOption.value)}
            placeholder="Select Specialty"
            className="rounded w-64 h-12"
            styles={{
              control: (provided) => ({
                ...provided,
                height: '49px',
              }),
            }}
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-sky-600 px-5 py-2 rounded-sm text-white hover:bg-sky-400 h-12 transition ease-out flex items-center justify-center"
        >
          {isLoading ? <Spinner size="md" color="white" />
         
           : "Search"}
        </button>
      </div>
    </div>
  );
};

export default SearchDoctor;
