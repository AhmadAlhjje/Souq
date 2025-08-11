'use client';
import { usePathname } from 'next/navigation';
import Header from './organisms/Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // مسارات محددة لإخفاء Header
  const specificHidePages = ['/login', '/LoginPage'];
  
  // مسارات تبدأ بـ (prefixes) لإخفاء Header
  const hideHeaderPrefixes = ['/admin', '/auth'];
  
  // التحقق من المسارات
  const shouldHideHeader = 
    specificHidePages.includes(pathname) || 
    hideHeaderPrefixes.some(prefix => pathname.startsWith(prefix));
  
  if (shouldHideHeader) {
    return null;
  }
  
  return <Header />;
}