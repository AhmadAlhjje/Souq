import React from "react";

const IconWrapper = ({ icon, gradient = "from-[#5CA9B5] to-[#4a9aa7]", size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };
  
  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300`}>
      <div className="text-white">{icon}</div>
    </div>
  );
};

export default IconWrapper;