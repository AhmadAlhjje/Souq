import React from "react";

const StatItem = ({ value, label, className = "" }) => {
  return (
    <div className={`group space-y-3 p-3 lg:p-4 rounded-2xl hover:bg-white/20 transition-all duration-300 ${className}`}>
      <div className="text-2xl lg:text-3xl xl:text-4xl font-black text-[#004D5A] group-hover:scale-110 transition-transform duration-300">
        {value}
      </div>
      <div className="text-xs lg:text-sm text-[#004D5A]/70 font-medium">
        {label}
      </div>
    </div>
  );
};

export default StatItem;