// components/atoms/Text.jsx
import React from 'react';

const Text = ({ text, className }) => {
  return <p className={`text-xl text-center mb-8 ${className}`}>{text}</p>;
};

export default Text;