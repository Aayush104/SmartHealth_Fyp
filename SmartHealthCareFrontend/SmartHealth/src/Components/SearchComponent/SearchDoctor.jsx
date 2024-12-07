import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import Location from '../../Assets/Data/Location.json';
import Speciality from '../../Assets/Data/Speciality.json';
import { CiLocationOn } from "react-icons/ci";
import axios from 'axios';
import Select from 'react-select';

const SearchDoctor = () => {
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setSpecialties(Speciality);
      } catch (err) {
        console.error('Error fetching specialties:', err);
        setError('Failed to load specialties');
      }
    };
    fetchSpecialties();
  }, []);

  const handleSearch = async () => {
    if (!location || !specialty) {
      setError('Please select both location and specialty.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await axios.get('https://localhost:7070/api/Doctor/SearchDoctor', {
        params: { Location: location, Speciality: specialty },
      });

      console.log(response.data.$values)

      const doctorsData = response.data.$values || [];
      if (response.status === 200) {
        setError('');
      
        navigate('/searched_doctor', { state: { doctors: doctorsData } });
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setError('Specialty and Location are required for the search.');
        } else if (err.response.status === 404) {
       navigate('/NotFound')
        } else {
          setError('An unexpected error occurred.');
        }
      } else {
        console.error('Error during search:', err);
        setError('Failed to perform search. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <p>Searching...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className='flex gap-2 mt-4 mb-24'>
        <div className='relative flex items-center'>
          <Select
            options={Location.map((loc) => ({ value: loc.name, label: loc.name }))}
            onChange={(selectedOption) => setLocation(selectedOption.value)}
            placeholder="Select Location"
            className='rounded w-64 h-16'
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
              DropdownIndicator: () => <CiLocationOn className='absolute left-3 text-gray-600' />,
            }}
          />
        </div>

        <div className='relative'>
          <Select
            options={specialties.map((spec) => ({ value: spec.name, label: spec.name }))}
            onChange={(selectedOption) => setSpecialty(selectedOption.value)}
            placeholder="Select Specialty"
            className='rounded w-64 h-12'
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
          className='bg-sky-600 px-5 rounded-sm text-white hover:bg-sky-400 h-12'
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchDoctor;
