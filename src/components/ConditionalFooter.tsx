'use client';
import { usePathname } from 'next/navigation';
import Footer from './organisms/Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // مسارات محددة لإخفاء Footer
  const specificHidePages = ['/login', '/LoginPage',];
  
  // مسارات تبدأ بـ (prefixes) لإخفاء Footer
  const hideFooterPrefixes = ['/admin', '/auth','/superAdmin'];
  
  // التحقق من المسارات
  const shouldHideFooter = 
    specificHidePages.includes(pathname) || 
    hideFooterPrefixes.some(prefix => pathname.startsWith(prefix));
  
  if (shouldHideFooter) {
    return null;
  }
  
  return <Footer />;
}