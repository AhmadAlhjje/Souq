// components/templates/MainLayout.jsx
import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default MainLayout;