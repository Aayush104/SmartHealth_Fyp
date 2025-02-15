import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { motion } from 'framer-motion';

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const RevenueChart = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = Cookies.get("Token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://localhost:7070/api/Doctor/DoctorRevenue", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Revenue Data:", response.data);

                // Ensure API response is correctly structured
                const revenueData = response.data.data?.$values || response.data;

                // Extract months and revenue values
                const labels = revenueData.map((item) => `Month ${item.month}`);
                const dataValues = revenueData.map((item) => item.revenue);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Revenue ($)",
                            data: dataValues,
                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                            borderColor: "rgba(54, 162, 235, 1)",
                            borderWidth: 2,
                        },
                    ],
                });

                setLoading(false);
            } catch (error) {
                console.error("Error fetching revenue data:", error);
            }
        };

        fetchData();
    }, []);

    return (

      <>
      <motion.h2
        className="text-gray-600 font-bold text-2xl md:text-[2.3rem] mx-10 uppercase mt-20"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        Revenue Overview
      </motion.h2>
      <div className="relative flex items-center mx-1">
        <div className="w-8 h-8 bg-sky-600 rounded-full"></div>
        <div className="h-1 w-96 bg-sky-600"></div>
      </div>
    
        <div className="max-w-8xl mx-auto mt-8 px-6 pb-6 bg-white  rounded-lg">
        

            {loading ? (
                <p className="text-center">Loading charts...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bar Chart: Monthly Revenue */}
                    <div className="p-4 bg-gray-100 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-center mb-4">Revenue Per Month</h3>
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: true, position: "top" },
                                    tooltip: { enabled: true },
                                },
                                scales: { y: { beginAtZero: true } },
                                animation: { duration: 1500, easing: "easeInOutBounce" },
                            }}
                        />
                    </div>

                    {/* Line Chart: Revenue Trends */}
                    <div className="p-4 bg-gray-100 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-center mb-4">Revenue Trends</h3>
                        <Line
                            data={chartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: true, position: "top" },
                                    tooltip: { enabled: true },
                                },
                                scales: { y: { beginAtZero: true } },
                                animation: { duration: 1500, easing: "easeInOutBounce" },
                            }}
                        />
                    </div>

                 
                </div>
            )}
        </div>
      
      </>
    );
};

export default RevenueChart;
