import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'HouseHunt Chuka - 100% Scam-Free Student Housing Around Chuka University | Mariani, Tharaka Nithi',
  description: 'Find verified bedsitters, single rooms, and 1-bedroom student apartments around Chuka University. Gate A (Nairobi-Meru Hwy B6), Gate B (KK Mwendwa Reservoir), Ndia Ndoro, Mutunguruni-Ndagani Market, and Mariani Ridge. Zero fake listings, verified landlords.',
  keywords: [
    'Chuka University student housing',
    'Bedsitter near Gate A Chuka University',
    'Rent near Gate B KK Mwendwa Reservoir',
    'Ndia Ndoro student rooms Chuka',
    'Mutunguruni Ndagani bedsitter rental',
    'Mariani Ridge apartments Chuka',
    'Chuka Town Center student flats',
    'Student hostel Tharaka Nithi County',
    'Chuka University Mariani housing',
    'Nairobi Meru Highway B6 student rentals',
    'Verified student accommodation Kenya',
    'HouseHunt Chuka'
  ],
  authors: [{ name: 'HouseHunt Kenya Team' }],
  openGraph: {
    title: 'HouseHunt Chuka - Verified Student Housing',
    description: 'Stop rental scams. Find verified student accommodation around Chuka University with interactive campus distance maps.',
    siteName: 'HouseHunt Chuka',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
