// المسارات التي لا اردي ان تظهر بها ال Header
'use client';
import { usePathname } from 'next/navigation';
import Header from './organisms/Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // الصفحات التي لا تحتاج Header
  const hideHeaderPages = ['/login', '/LoginPage', '/auth/login', '/register', '/auth/register'];
  
  if (hideHeaderPages.includes(pathname)) {
    return null;
  }
  
  return <Header />;
}
