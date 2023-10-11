import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
const Alert = ({ type, message }) => {

  const alertClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    danger: 'bg-red-100 border-red-400 text-red-700',
  }[type];

  return (
    <div className={`border ${alertClasses} p-4 my-2 rounded-md flex items-center`}>
      <FiAlertCircle className="mr-2" />
      <span>Error in YAML file: Please check the line number {message?.mark?.line} above or below</span>
    </div>
  );
};

export default Alert;