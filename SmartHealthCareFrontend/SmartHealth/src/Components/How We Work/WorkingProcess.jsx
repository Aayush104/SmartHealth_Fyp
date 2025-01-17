import React from 'react';
import { motion } from 'framer-motion';

const WorkingProcess = () => {
  return (
    <div className="flex gap-12 flex-col items-center lg:flex-row lg:items-center  mt-4 mb-10 lg:mx-40 lg:gap-32">
      <div className=" flex items-center justify-center ">
        <motion.img
          src="https://medidove-nextjs.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fabout-img.c26e62ed.jpg&w=1200&q=75"
          alt="About us"
          className="rounded-lg shadow-sm shadow-gray-500 w-full "
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="mt-8">
        <motion.p
          className="text-gray-500 font-semibold capitalize text-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          How We Work
        </motion.p>

        <motion.div
          className="flex flex-col capitalize font-bold text-Subheading mt-2 text-gray-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span>Using Smart Health is As</span>
          <span>Easy As One Two Three</span>
        </motion.div>

        <div className="mt-12 flex flex-col gap-12">
          {/* Step 1 */}
          <motion.div
            className="flex gap-8 items-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <img
              src="https://www.mdlive.com/sites/default/files/styles/icon/public/2023-05/Register-icon.png?itok=pfU0aPge"
              alt="Register Icon"
              className="h-24"
            />
            <div>
              <p className="text-sky-600 font-semibold text-2xl uppercase">Step 1</p>
              <p className="text-sky-800 font-bold mt-3 text-1.8rem capitalize">Create Your Account</p>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="flex gap-8 items-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <img
              src="https://www.mdlive.com/sites/default/files/styles/icon/public/2023-05/Calendar-icon.png?itok=cvzn0rjz"
              alt="Calendar Icon"
              className="h-20"
            />
            <div>
              <p className="text-sky-600 font-semibold text-2xl uppercase">Step 2</p>
              <p className="text-sky-800 font-bold mt-3 text-1.8rem capitalize">Choose An Appointment Date</p>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="flex gap-8 items-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <img
              src="https://www.mdlive.com/sites/default/files/styles/icon/public/2023-05/doctor-icon_0.png?itok=I2kCXzNm"
              alt="Doctor Icon"
              className="h-24"
            />
            <div>
              <p className="text-sky-600 font-semibold text-2xl uppercase">Step 3</p>
              <p className="text-sky-800 font-bold mt-3 text-1.8rem capitalize">Consult with Doctor</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorkingProcess;
