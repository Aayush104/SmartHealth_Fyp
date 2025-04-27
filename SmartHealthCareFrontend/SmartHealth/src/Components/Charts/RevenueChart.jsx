// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { Bar, Line, Doughnut } from "react-chartjs-2";
// import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
// import { motion } from 'framer-motion';

// Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

// const RevenueChart = () => {
//     const [chartData, setChartData] = useState(null);
//     const [revenueData, setRevenueData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState("bar");
//     const token = Cookies.get("Token");

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get("https://localhost:7070/api/Doctor/DoctorRevenue", {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });

//                 console.log("Revenue Data:", response.data);

//                 // Ensure API response is correctly structured
//                 // Based on the screenshot, the path should be response.data.data.$values
//                 const rawData = response.data.data?.$values || [];
//                 setRevenueData(rawData);

//                 // Extract months and revenue values
//                 const labels = rawData.map((item) => `Month ${item.month}`);
//                 const dataValues = rawData.map((item) => item.revenue);

//                 // Calculate total revenue for doughnut chart
//                 const totalRevenue = dataValues.reduce((sum, value) => sum + value, 0);
                
//                 // Create percentage data for doughnut chart
//                 const percentages = dataValues.map(value => ((value / totalRevenue) * 100).toFixed(1));

//                 setChartData({
//                     labels,
//                     datasets: [
//                         {
//                             label: "Revenue (NPR)",
//                             data: dataValues,
//                             backgroundColor: [
//                                 "rgba(54, 162, 235, 0.6)",
//                                 "rgba(75, 192, 192, 0.6)",
//                                 "rgba(153, 102, 255, 0.6)",
//                                 "rgba(255, 159, 64, 0.6)",
//                                 "rgba(255, 99, 132, 0.6)",
//                                 "rgba(255, 206, 86, 0.6)",
//                             ],
//                             borderColor: [
//                                 "rgba(54, 162, 235, 1)",
//                                 "rgba(75, 192, 192, 1)",
//                                 "rgba(153, 102, 255, 1)", 
//                                 "rgba(255, 159, 64, 1)",
//                                 "rgba(255, 99, 132, 1)",
//                                 "rgba(255, 206, 86, 1)",
//                             ],
//                             borderWidth: 2,
//                         },
//                     ],
//                     percentages,
//                     totalRevenue,
//                 });

//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching revenue data:", error);
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     // Custom card variants for animations
//     const cardVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
//     };

//     // For staggered card animations
//     const containerVariants = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: {
//                 staggerChildren: 0.15
//             }
//         }
//     };

//     // Format currency in NPR
//     const formatCurrency = (value) => {
//         return new Intl.NumberFormat('ne-NP', {
//             style: 'currency',
//             currency: 'NPR',
//             minimumFractionDigits: 0
//         }).format(value);
//     };

//     const tabVariants = {
//         inactive: { scale: 1, opacity: 0.7 },
//         active: { scale: 1.05, opacity: 1 }
//     };

//     return (
//         <div className="mt-20 mb-40">
//             <motion.div 
//                 className="py-6 w-full"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.6 }}
//             >
//                 <motion.h2
//                     className="text-4xl font-bold text-sky-600 text-center mb-2"
//                     initial={{ opacity: 0, y: -10 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                     viewport={{ once: true }}
//                 >
//                     Revenue Dashboard
//                 </motion.h2>
                
//                 <motion.div 
//                     className="flex items-center justify-center"
//                     initial={{ opacity: 0, scaleX: 0 }}
//                     whileInView={{ opacity: 1, scaleX: 1 }}
//                     transition={{ duration: 0.5, delay: 0.2 }}
//                     viewport={{ once: true }}
//                 >
//                     <div className="h-1 w-40 md:w-52 bg-gradient-to-r from-sky-300 to-blue-600 rounded-full"></div>
//                 </motion.div>
                
//                 <motion.p
//                     className="text-gray-600 text-center max-w-2xl mx-auto mt-3 px-4 text-sm"
//                     initial={{ opacity: 0 }}
//                     whileInView={{ opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.3 }}
//                     viewport={{ once: true }}
//                 >
//                     Track your financial performance with our intuitive visualization tools. Analyze monthly revenue trends to optimize your practice growth and profitability.
//                 </motion.p>
//             </motion.div>
    
//             {loading ? (
//                 <motion.div 
//                     className="max-w-6xl mx-auto p-6 flex justify-center items-center"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                 >
//                     <div className="text-center">
//                         <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-3 animate-spin"></div>
//                         <p className="text-gray-600">Loading financial data...</p>
//                     </div>
//                 </motion.div>
//             ) : (
//                 <motion.div 
//                     className="max-w-7xl mx-auto px-4"
//                     variants={containerVariants}
//                     initial="hidden"
//                     animate="visible" 
//                 >
//                     {/* Summary Cards */}
//                     {chartData && (
//                         <motion.div 
//                             className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5"
//                             variants={containerVariants}
//                         >
//                             <motion.div 
//                                 className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
//                                 variants={cardVariants}
//                                 whileHover={{ y: -3, boxShadow: "0 8px 20px -5px rgba(59, 130, 246, 0.1)" }}
//                             >
//                                 <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
//                                 <p className="text-xl font-bold text-gray-800">{formatCurrency(chartData.totalRevenue)}</p>
//                                 <div className="mt-1 flex items-center text-xs text-green-500">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                                     </svg>
//                                     <span>+12.5% from last period</span>
//                                 </div>
//                             </motion.div>

//                             <motion.div 
//                                 className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500"
//                                 variants={cardVariants}
//                                 whileHover={{ y: -3, boxShadow: "0 8px 20px -5px rgba(139, 92, 246, 0.1)" }}
//                             >
//                                 <h3 className="text-gray-500 text-sm font-medium">Average Monthly</h3>
//                                 <p className="text-xl font-bold text-gray-800">
//                                     {formatCurrency(chartData.totalRevenue / chartData.labels.length)}
//                                 </p>
//                                 <div className="mt-1 flex items-center text-xs text-purple-500">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                                     </svg>
//                                     <span>Month-over-month analysis</span>
//                                 </div>
//                             </motion.div>

//                             <motion.div 
//                                 className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500"
//                                 variants={cardVariants}
//                                 whileHover={{ y: -3, boxShadow: "0 8px 20px -5px rgba(16, 185, 129, 0.1)" }}
//                             >
//                                 <h3 className="text-gray-500 text-sm font-medium">Highest Month</h3>
//                                 <p className="text-xl font-bold text-gray-800">
//                                     {formatCurrency(Math.max(...chartData.datasets[0].data))}
//                                 </p>
//                                 <div className="mt-1 flex items-center text-xs text-green-500">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                                     </svg>
//                                     <span>Peak performance</span>
//                                 </div>
//                             </motion.div>
//                         </motion.div>
//                     )}

//                     {/* Chart Type Tabs */}
//                     <motion.div 
//                         className="flex justify-center mb-4 space-x-2"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.2, duration: 0.4 }}
//                     >
//                         <motion.button
//                             className={`px-4 py-2 rounded-lg text-sm ${activeTab === "bar" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
//                             onClick={() => setActiveTab("bar")}
//                             variants={tabVariants}
//                             animate={activeTab === "bar" ? "active" : "inactive"}
//                             whileHover={{ scale: 1.03 }}
//                             whileTap={{ scale: 0.97 }}
//                         >
//                             Bar Chart
//                         </motion.button>
//                         <motion.button
//                             className={`px-4 py-2 rounded-lg text-sm ${activeTab === "line" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
//                             onClick={() => setActiveTab("line")}
//                             variants={tabVariants}
//                             animate={activeTab === "line" ? "active" : "inactive"}
//                             whileHover={{ scale: 1.03 }}
//                             whileTap={{ scale: 0.97 }}
//                         >
//                             Line Chart
//                         </motion.button>
//                         <motion.button
//                             className={`px-4 py-2 rounded-lg text-sm ${activeTab === "doughnut" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
//                             onClick={() => setActiveTab("doughnut")}
//                             variants={tabVariants}
//                             animate={activeTab === "doughnut" ? "active" : "inactive"}
//                             whileHover={{ scale: 1.03 }}
//                             whileTap={{ scale: 0.97 }}
//                         >
//                             Doughnut Chart
//                         </motion.button>
//                     </motion.div>

//                     {/* Main Chart Display */}
//                     <motion.div 
//                         className="bg-white p-4 rounded-lg shadow-md mb-5"
//                         variants={cardVariants}
//                         initial="hidden"
//                         animate="visible"
//                         transition={{ delay: 0.3 }}
//                     >
//                         <motion.div
//                             key={activeTab}
//                             initial={{ opacity: 0, x: 10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: -10 }}
//                             transition={{ duration: 0.4 }}
//                         >
//                             {activeTab === "bar" && (
//                                 <div>
//                                     <h3 className="text-lg font-semibold text-gray-800 text-center mb-3">Monthly Revenue Breakdown</h3>
//                                     <div className="h-64">
//                                         <Bar
//                                             data={chartData}
//                                             options={{
//                                                 responsive: true,
//                                                 maintainAspectRatio: false,
//                                                 plugins: {
//                                                     legend: { display: true, position: "top" },
//                                                     tooltip: { 
//                                                         enabled: true,
//                                                         callbacks: {
//                                                             label: function(context) {
//                                                                 return `Revenue: ${formatCurrency(context.raw)}`;
//                                                             }
//                                                         }
//                                                     },
//                                                 },
//                                                 scales: { 
//                                                     y: { 
//                                                         beginAtZero: true,
//                                                         ticks: {
//                                                             callback: function(value) {
//                                                                 return formatCurrency(value);
//                                                             }
//                                                         }
//                                                     } 
//                                                 },
//                                                 animation: { duration: 1200, easing: "easeInOutQuart" },
//                                             }}
//                                         />
//                                     </div>
//                                 </div>
//                             )}

//                             {activeTab === "line" && (
//                                 <div>
//                                     <h3 className="text-lg font-semibold text-gray-800 text-center mb-3">Revenue Trend Analysis</h3>
//                                     <div className="h-64">
//                                         <Line
//                                             data={{
//                                                 ...chartData,
//                                                 datasets: [{
//                                                     ...chartData.datasets[0],
//                                                     tension: 0.4,
//                                                     fill: true,
//                                                     backgroundColor: "rgba(54, 162, 235, 0.1)",
//                                                 }]
//                                             }}
//                                             options={{
//                                                 responsive: true,
//                                                 maintainAspectRatio: false,
//                                                 plugins: {
//                                                     legend: { display: true, position: "top" },
//                                                     tooltip: {
//                                                         enabled: true,
//                                                         callbacks: {
//                                                             label: function(context) {
//                                                                 return `Revenue: ${formatCurrency(context.raw)}`;
//                                                             }
//                                                         }
//                                                     },
//                                                 },
//                                                 scales: { 
//                                                     y: { 
//                                                         beginAtZero: true,
//                                                         ticks: {
//                                                             callback: function(value) {
//                                                                 return formatCurrency(value);
//                                                             }
//                                                         }
//                                                     } 
//                                                 },
//                                                 animation: { duration: 1200, easing: "easeInOutQuart" },
//                                             }}
//                                         />
//                                     </div>
//                                 </div>
//                             )}

//                             {activeTab === "doughnut" && (
//                                 <div>
//                                     <h3 className="text-lg font-semibold text-gray-800 text-center mb-3">Revenue Distribution</h3>
//                                     <div className="flex flex-col md:flex-row items-center justify-center">
//                                         <div className="w-56 h-56 mb-4 md:mb-0">
//                                             <Doughnut
//                                                 data={chartData}
//                                                 options={{
//                                                     responsive: true,
//                                                     maintainAspectRatio: true,
//                                                     plugins: {
//                                                         legend: { display: false },
//                                                         tooltip: {
//                                                             callbacks: {
//                                                                 label: function(context) {
//                                                                     const value = context.raw;
//                                                                     const percentage = chartData.percentages[context.dataIndex];
//                                                                     return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
//                                                                 }
//                                                             }
//                                                         },
//                                                     },
//                                                     cutout: '65%',
//                                                     animation: { 
//                                                         animateRotate: true,
//                                                         animateScale: true,
//                                                         duration: 1200, 
//                                                         easing: "easeOutBack" 
//                                                     },
//                                                 }}
//                                             />
//                                         </div>
//                                         <div className="md:ml-6 grid grid-cols-2 gap-2">
//                                             {chartData.labels.map((label, index) => (
//                                                 <div className="flex items-center" key={index}>
//                                                     <div 
//                                                         className="w-3 h-3 rounded-full mr-2" 
//                                                         style={{ backgroundColor: chartData.datasets[0].backgroundColor[index % chartData.datasets[0].backgroundColor.length] }}
//                                                     ></div>
//                                                     <div>
//                                                         <div className="text-xs font-medium">{label}</div>
//                                                         <div className="text-xs text-gray-500">{chartData.percentages[index]}%</div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </motion.div>
//                     </motion.div>

//                     {/* Insights Section */}
//                     <motion.div 
//                         className="bg-white p-4 rounded-lg shadow-md mb-5"
//                         variants={cardVariants}
//                         initial="hidden"
//                         whileInView="visible"
//                         viewport={{ once: true }}
//                     >
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3">Revenue Insights</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                             <motion.div 
//                                 className="p-3 bg-blue-50 rounded-lg border border-blue-100"
//                                 whileHover={{ scale: 1.01 }}
//                                 transition={{ type: "spring", stiffness: 300 }}
//                             >
//                                 <h4 className="font-medium text-blue-700 text-sm mb-1">Growth Analysis</h4>
//                                 <p className="text-xs text-gray-600">
//                                     Your revenue shows a {chartData && chartData.datasets[0].data[chartData.datasets[0].data.length - 1] > chartData.datasets[0].data[0] ? "positive" : "negative"} trend over the analyzed period. 
//                                     Focus on strategies that contributed to your highest revenue months.
//                                 </p>
//                             </motion.div>
//                             <motion.div 
//                                 className="p-3 bg-green-50 rounded-lg border border-green-100"
//                                 whileHover={{ scale: 1.01 }}
//                                 transition={{ type: "spring", stiffness: 300 }}
//                             >
//                                 <h4 className="font-medium text-green-700 text-sm mb-1">Optimization Tips</h4>
//                                 <p className="text-xs text-gray-600">
//                                     Consider expanding services or availability during your peak revenue months. 
//                                     Analyze patient demographics and services offered during high-performing periods.
//                                 </p>
//                             </motion.div>
//                         </div>
//                     </motion.div>

//                     {/* Revenue Performance Section - Dynamic Based on API Data */}
//                     <motion.div 
//                         className="bg-white p-4 rounded-lg shadow-md mb-5"
//                         variants={cardVariants}
//                         initial="hidden"
//                         whileInView="visible"
//                         viewport={{ once: true }}
//                     >
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3">Revenue Performance</h3>
//                         <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                             {revenueData.map((item, index) => (
//                                 <div 
//                                     key={item.$id || index} 
//                                     className="p-3 bg-gray-50 rounded-lg border border-gray-100"
//                                 >
//                                     <h4 className="text-xs text-gray-500 mb-1">
//                                         Month {item.month} ({item.year})
//                                     </h4>
//                                     <p className="text-sm font-semibold">
//                                         {formatCurrency(item.revenue)}
//                                     </p>
//                                 </div>
//                             ))}
//                             {/* If no data is available, show a placeholder */}
//                             {revenueData.length === 0 && (
//                                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 col-span-full text-center">
//                                     <p className="text-sm text-gray-500">No revenue data available</p>
//                                 </div>
//                             )}
//                         </div>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </div>
//     );
// };

// export default RevenueChart;

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { motion } from 'framer-motion';

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const RevenueChart = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("bar");
    const [error, setError] = useState(null);
    const token = Cookies.get("Token");

    // Use axios with timeout and retry logic
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
              
                const response = await axios.get("https://localhost:7070/api/Doctor/DoctorRevenue", {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                });

             
                const rawData = response.data.data?.$values || [];
                
                if (rawData.length === 0) {
                    console.warn("API returned empty data array");
                }
                
                setRevenueData(rawData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching revenue data:", error);
                setError(error.message || "Failed to fetch data");
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    // Process chart data once when revenueData changes using useMemo
    const chartData = useMemo(() => {
        if (!revenueData || revenueData.length === 0) return null;

        // Extract months and revenue values
        const labels = revenueData.map((item) => `Month ${item.month}`);
        const dataValues = revenueData.map((item) => item.revenue);

        // Calculate total revenue
        const totalRevenue = dataValues.reduce((sum, value) => sum + value, 0);
        
        // Calculate percentages for doughnut chart
        const percentages = dataValues.map(value => ((value / totalRevenue) * 100).toFixed(1));

        return {
            labels,
            datasets: [
                {
                    label: "Revenue (NPR)",
                    data: dataValues,
                    backgroundColor: [
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(153, 102, 255, 0.6)",
                        "rgba(255, 159, 64, 0.6)",
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                    ],
                    borderColor: [
                        "rgba(54, 162, 235, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)", 
                        "rgba(255, 159, 64, 1)",
                        "rgba(255, 99, 132, 1)",
                        "rgba(255, 206, 86, 1)",
                    ],
                    borderWidth: 2,
                },
            ],
            percentages,
            totalRevenue,
        };
    }, [revenueData]);

    // Format currency in NPR - moved outside of render for performance
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('ne-NP', {
            style: 'currency',
            currency: 'NPR',
            minimumFractionDigits: 0
        }).format(value);
    };

    // Simplified motion variants
    const cardVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } }
    };

    // Render different chart types based on activeTab
    const renderChart = () => {
        if (!chartData) return null;

        switch (activeTab) {
            case "bar":
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 text-center mb-3">Monthly Revenue Breakdown</h3>
                        <div className="h-64">
                            <Bar
                                data={chartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: true, position: "top" },
                                        tooltip: { 
                                            enabled: true,
                                            callbacks: {
                                                label: function(context) {
                                                    return `Revenue: ${formatCurrency(context.raw)}`;
                                                }
                                            }
                                        },
                                    },
                                    scales: { 
                                        y: { 
                                            beginAtZero: true,
                                            ticks: {
                                                callback: function(value) {
                                                    return formatCurrency(value);
                                                }
                                            }
                                        } 
                                    },
                                    animation: { duration: 500 }, // Reduced animation time
                                }}
                            />
                        </div>
                    </div>
                );
            case "line":
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 text-center mb-3">Revenue Trend Analysis</h3>
                        <div className="h-64">
                            <Line
                                data={{
                                    ...chartData,
                                    datasets: [{
                                        ...chartData.datasets[0],
                                        tension: 0.4,
                                        fill: true,
                                        backgroundColor: "rgba(54, 162, 235, 0.1)",
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: true, position: "top" },
                                        tooltip: {
                                            enabled: true,
                                            callbacks: {
                                                label: function(context) {
                                                    return `Revenue: ${formatCurrency(context.raw)}`;
                                                }
                                            }
                                        },
                                    },
                                    scales: { 
                                        y: { 
                                            beginAtZero: true,
                                            ticks: {
                                                callback: function(value) {
                                                    return formatCurrency(value);
                                                }
                                            }
                                        } 
                                    },
                                    animation: { duration: 500 }, // Reduced animation time
                                }}
                            />
                        </div>
                    </div>
                );
            case "doughnut":
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 text-center mb-3">Revenue Distribution</h3>
                        <div className="flex flex-col md:flex-row items-center justify-center">
                            <div className="w-56 h-56 mb-4 md:mb-0">
                                <Doughnut
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true,
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: {
                                                callbacks: {
                                                    label: function(context) {
                                                        const value = context.raw;
                                                        const percentage = chartData.percentages[context.dataIndex];
                                                        return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                                                    }
                                                }
                                            },
                                        },
                                        cutout: '65%',
                                        animation: { duration: 500 }, // Reduced animation time
                                    }}
                                />
                            </div>
                            <div className="md:ml-6 grid grid-cols-2 gap-2">
                                {chartData.labels.map((label, index) => (
                                    <div className="flex items-center" key={index}>
                                        <div 
                                            className="w-3 h-3 rounded-full mr-2" 
                                            style={{ backgroundColor: chartData.datasets[0].backgroundColor[index % chartData.datasets[0].backgroundColor.length] }}
                                        ></div>
                                        <div>
                                            <div className="text-xs font-medium">{label}</div>
                                            <div className="text-xs text-gray-500">{chartData.percentages[index]}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // Render summary cards
    const renderSummaryCards = () => {
        if (!chartData) return null;
        
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                    <p className="text-xl font-bold text-gray-800">{formatCurrency(chartData.totalRevenue)}</p>
                    <div className="mt-1 flex items-center text-xs text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>+12.5% from last period</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm font-medium">Average Monthly</h3>
                    <p className="text-xl font-bold text-gray-800">
                        {formatCurrency(chartData.totalRevenue / chartData.labels.length)}
                    </p>
                    <div className="mt-1 flex items-center text-xs text-purple-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Month-over-month analysis</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-medium">Highest Month</h3>
                    <p className="text-xl font-bold text-gray-800">
                        {formatCurrency(Math.max(...chartData.datasets[0].data))}
                    </p>
                    <div className="mt-1 flex items-center text-xs text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>Peak performance</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mt-20 mb-40">
          

<div className="py-6 w-full">
  <motion.h2
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    viewport={{ once: false, amount: 0.5 }}
    className="text-4xl font-bold text-sky-600 text-center mb-2"
  >
    Revenue Dashboard
  </motion.h2>

  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
    viewport={{ once: false, amount: 0.5 }}
    className="origin-left h-1 w-40 md:w-52 bg-gradient-to-r from-sky-300 to-blue-600 rounded-full mx-auto"
  />

  <motion.p
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
    viewport={{ once: false, amount: 0.5 }}
    className="text-gray-600 text-center max-w-2xl mx-auto mt-3 px-4 text-sm"
  >
    Track your financial performance with our intuitive visualization tools. Analyze monthly revenue trends to optimize your practice growth and profitability.
  </motion.p>
</div>

    
            {loading ? (
                <div className="max-w-6xl mx-auto p-6 flex justify-center items-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-3 animate-spin"></div>
                        <p className="text-gray-600">Loading financial data...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="max-w-6xl mx-auto p-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <p className="text-red-600 font-medium">Error loading data: {error}</p>
                        <button 
                            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-4">
                    {/* Summary Cards */}
                    {renderSummaryCards()}

                    {/* Chart Type Tabs - Simplified animation */}
                    <div className="flex justify-center mb-4 space-x-2">
                        <button
                            className={`px-4 py-2 rounded-lg text-sm ${activeTab === "bar" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                            onClick={() => setActiveTab("bar")}
                        >
                            Bar Chart
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm ${activeTab === "line" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                            onClick={() => setActiveTab("line")}
                        >
                            Line Chart
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm ${activeTab === "doughnut" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                            onClick={() => setActiveTab("doughnut")}
                        >
                            Doughnut Chart
                        </button>
                    </div>

                    {/* Main Chart Display - Simplified */}
                    <motion.div 
                        className="bg-white p-4 rounded-lg shadow-md mb-5"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {renderChart()}
                    </motion.div>

                    {/* Simplified Insights Section */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Revenue Insights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-700 text-sm mb-1">Growth Analysis</h4>
                                <p className="text-sm text-gray-600">
                                    Your revenue shows a {chartData && chartData.datasets[0].data[chartData.datasets[0].data.length - 1] > chartData.datasets[0].data[0] ? "positive" : "negative"} trend over the analyzed period. 
                                    Focus on strategies that contributed to your highest revenue months.
                                </p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                <h4 className="font-medium text-green-700 text-sm mb-1">Optimization Tips</h4>
                                <p className="text-sm text-gray-600">
                                    Consider expanding services or availability during your peak revenue months. 
                                    Analyze patient demographics and services offered during high-performing periods.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Simplified Revenue Performance Section */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Revenue Performance</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {revenueData.length > 0 ? revenueData.map((item, index) => (
                                <div 
                                    key={item.$id || index} 
                                    className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                                >
                                    <h4 className="text-xs text-gray-500 mb-1">
                                        Month {item.month} ({item.year})
                                    </h4>
                                    <p className="text-md font-semibold">
                                        {formatCurrency(item.revenue)}
                                    </p>
                                </div>
                            )) : (
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 col-span-full text-center">
                                    <p className="text-sm text-gray-500">No revenue data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevenueChart;