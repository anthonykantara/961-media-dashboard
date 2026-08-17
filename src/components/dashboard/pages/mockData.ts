import { Page } from './types';

export const initialPages: Page[] = [
  { id: '1', title: 'About Us', slug: '/about', status: 'Published', author: 'Anthony Rahayel', date: 'Mar 12, 2026', time: '10:30 AM', language: 'en', locationId: 'lb' },
  { id: '2', title: 'Contact', slug: '/contact', status: 'Published', author: 'Anthony Rahayel', date: 'Mar 10, 2026', time: '02:15 PM', language: 'en', locationId: 'lb' },
  { id: '3', title: 'Privacy Policy', slug: '/privacy', status: 'Published', author: 'Legal Team', date: 'Jan 05, 2026', time: '09:00 AM', language: 'en', locationId: 'lb' },
  { id: '4', title: 'Terms of Service', slug: '/terms', status: 'Published', author: 'Legal Team', date: 'Jan 05, 2026', time: '09:00 AM', language: 'en', locationId: 'lb' },
  { id: '5', title: 'Advertise with Us', slug: '/advertise', status: 'Draft', author: 'Sales Team', date: 'Mar 28, 2026', time: '11:45 AM', language: 'en', locationId: 'lb' },
  { id: '6', title: 'من نحن', slug: '/ar/about', status: 'Published', author: 'سارة خوري', date: 'Mar 15, 2026', time: '01:20 PM', language: 'ar', locationId: 'lb' },
  { id: '7', title: 'اتصل بنا', slug: '/ar/contact', status: 'Published', author: 'سارة خوري', date: 'Mar 14, 2026', time: '04:10 PM', language: 'ar', locationId: 'lb' },
  { id: '8', title: 'سياسة الخصوصية', slug: '/ar/privacy', status: 'Published', author: 'الفريق القانوني', date: 'Jan 10, 2026', time: '11:00 AM', language: 'ar', locationId: 'lb' },
  { id: '9', title: 'À Propos de Nous', slug: '/fr/about', status: 'Published', author: 'Sarah Khoury', date: 'Mar 16, 2026', time: '11:30 AM', language: 'fr', locationId: 'lb' },
  { id: '10', title: 'O nás', slug: '/sk/about', status: 'Published', author: 'Sarah Khoury', date: 'Mar 18, 2026', time: '03:45 PM', language: 'sk', locationId: 'sk' },
];
