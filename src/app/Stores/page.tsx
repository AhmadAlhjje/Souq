"use client";
import React, { useState } from "react";
import StoresSection from "../../components/templates/StoresSection";
import { Store } from "../../types/store";
import { SAMPLE_STORES } from "../../utils/constants";

const StoresPage: React.FC = () => {
  const handleViewDetails = (store: Store) => {
    alert(`زيارة متجر ${store.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#96EDD9]/20 via-[#96EDD9]/10 to-white pt-20">
      {/* pt-20 لحساب مسافة الـ navbar */}
      <StoresSection stores={SAMPLE_STORES} onViewDetails={handleViewDetails} />
    </div>
  );
};

export default StoresPage;
