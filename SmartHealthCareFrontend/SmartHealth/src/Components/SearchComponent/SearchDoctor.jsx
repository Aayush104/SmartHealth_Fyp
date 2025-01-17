import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Location from '../../Assets/Data/Location.json';
import Speciality from '../../Assets/Data/Speciality.json';
import { CiLocationOn } from "react-icons/ci";
import axios from 'axios';
import Select, { components } from 'react-select';
import { toast } from 'react-toastify';
import { Spinner } from '@chakra-ui/react';

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
          navigate('/NotFound');
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

  // Custom input with icon for location field
  const CustomSingleValue = (props) => (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        <CiLocationOn className="text-blue-500" />
        {props.data.label}
      </div>
    </components.SingleValue>
  );

  const CustomPlaceholder = (props) => (
    <components.Placeholder {...props}>
      <div className="flex items-center gap-2 text-gray-500">
        <CiLocationOn />
        {props.children}
      </div>
    </components.Placeholder>
  );

  return (
    <div className="relative">
      <div className="flex gap-2 mt-4 mb-10">
      
        <div className="relative flex items-center">
          <Select
            options={Location.map((loc) => ({ value: loc.name, label: loc.name }))}
            onChange={(selectedOption) => setLocation(selectedOption.value)}
            placeholder="Select Location"
            components={{ SingleValue: CustomSingleValue, Placeholder: CustomPlaceholder }}
            className="rounded w-48  md:w-64 md:h-16 lg:w-96"
            styles={{
              control: (provided) => ({
                ...provided,
                height: '49px',
              }),
              dropdownIndicator: (provided) => ({
                ...provided,
                display: 'block',
              }),
            }}
          />
        </div>

        {/* Specialty Select */}
        <div className="relative">
          <Select
            options={specialties.map((spec) => ({ value: spec.name, label: spec.name }))}
            onChange={(selectedOption) => setSpecialty(selectedOption.value)}
            placeholder="Select Specialty"
            className="rounded w-48  md:w-64 md:h-16 lg:w-96"
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
          {isLoading ? <Spinner size="md" color="white" /> : "Search"}
        </button>
      </div>
    </div>
  );
};

export default SearchDoctor;
