'use client';
import { usePathname } from 'next/navigation';
import Footer from './organisms/Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // الصفحات التي لا تحتاج Footer
  const hideFooterPages = ['/login', '/LoginPage', '/auth/login', '/register', '/auth/register'];
  
  if (hideFooterPages.includes(pathname)) {
    return null;
  }
  
  return <Footer />;
}
