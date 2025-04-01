import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../../Components/Fotter/Fotter';
import Navbar from '../../Components/Navbar/Navbar';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book an appointment online?",
      answer: "Booking an appointment is simple. Create an account or log in, select your preferred doctor, choose an available time slot from the calendar, and confirm your booking. You'll receive a confirmation email with all the details."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, and health insurance (verify coverage before booking). All payments are processed securely through our encrypted platform."
    },
    {
      question: "How do virtual consultations work?",
      answer: "Virtual consultations take place through our secure video platform. Once booked, you'll receive a link to join the call at your appointment time. Ensure you have a good internet connection and a private space for your consultation."
    },
    {
      question: "Can I reschedule or cancel my appointment?",
      answer: "Yes, you can reschedule or cancel appointments through your account dashboard. Please note that cancellations made less than 24 hours before the appointment may incur a fee as per our cancellation policy."
    },
    {
      question: "How can I access my medical records?",
      answer: "Your medical records are available in your secure patient portal. Log in to your account, navigate to 'Medical Records,' and you can view or download your consultation history, prescriptions, and test results."
    },
    {
      question: "Is my personal and medical information secure?",
      answer: "Absolutely. We use industry-standard encryption and security protocols to protect your data. Our platform is HIPAA-compliant, and we never share your information with third parties without your explicit consent."
    },
    {
      question: "Can I message my doctor between appointments?",
      answer: "Yes, our secure messaging feature allows you to communicate with your doctor between appointments. This is ideal for quick questions, updates, or clarifications. Most doctors respond within 24-48 hours for non-urgent matters."
    },
    {
      question: "How do I get a prescription through the platform?",
      answer: "During your consultation, your doctor can prescribe medications if necessary. Prescriptions will be sent electronically to your preferred pharmacy or can be accessed in your patient portal for you to download and print."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (

    <>
    <Navbar />
    <div className="w-full max-w-7xl mx-auto p-6 mt-12 mb-2 border bg-white rounded-lg shadow-lg">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h2 className="text-3xl font-bold text-blue-800 mb-2">Frequently Asked Questions</h2>
        <p className="text-gray-600">Find answers to common questions about our online doctor services</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-4"
      >
        {faqs.map((faq, index) => (
          <motion.div 
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.01 }}
          >
            <button
              className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 flex justify-between items-center transition-colors duration-300"
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-medium text-blue-900">{faq.question}</span>
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-blue-800"
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </motion.svg>
            </button>
            
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-white text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="mt-10 p-4 bg-blue-50 rounded-lg border border-blue-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-blue-800 mb-2">Still have questions?</h3>
        <p className="text-gray-700 mb-4">Our support team is here to help you with any other questions you may have.</p>
        <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300">
          Contact Support
        </button>
      </motion.div>
    </div>

    <Footer />
    </>
  );
};

export default FAQSection;