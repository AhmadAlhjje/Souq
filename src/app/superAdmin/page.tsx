"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard as the main admin page
    router.replace('/superAdmin/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">جاري التحويل إلى لوحة التحكم...</p>
      </div>
    </div>
  );
};

export default AdminPage;