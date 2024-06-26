import Header from '@/components/header';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Image Upload App',
  description: 'Image upload apps with Next.js and Supabase',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <body className='bg-background text-foreground'>
        <Header />
        <main className='min-h-screen flex flex-col items-center px-2'>{children}</main>
      </body>
    </html>
  );
}
