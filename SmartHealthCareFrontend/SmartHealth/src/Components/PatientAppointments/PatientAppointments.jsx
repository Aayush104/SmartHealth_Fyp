import axios from 'axios'
import React, { useEffect } from 'react'
import Cookies from 'js-cookie'

const PatientAppointments = () => {

    const token = Cookies.get("Token");

    useEffect(()=>
    {
        const fetchData = async ()=>
        {
            const response = await axios.get("https://localhost:7070/api/Appointment/UserAppointments",
                {
                    headers :
                    {
                        Authorization : `Bearer ${token}`
                    }
                }
            )

            console.log("UserAppointments",response);
        }
       fetchData()
    },[])

   
  return (
    <div>
      
    </div>
  )
}

export default PatientAppointments
