import Navbar from '@/components/navbar/Navbar';
import './globals.css';
import { Inter } from 'next/font/google';
import Footer from '@/components/footer/Footer';
import ThemeProvider from './providers/ThemeProvider';
import { ThemeContextProvider } from '@/context/ThemeContext';
import ParticleBg from '@/components/particleBg/ParticleBg';
import AuthProvider from './providers/AuthProvider';
import { AuthProvider as CustomAuthProvider } from '@/context/AuthContext';
import ViewportSetter from '@/components/ViewportSetter';
import PageViewTracker from '@/components/PageViewTracker';
import TokenValidator from '@/components/TokenValidator';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ThoughtEcho',
  description: 'The best blog app!',
  viewport: {
    width: 'device-width',
    initialScale: 0.80,
    minimumScale: 0.80,
    maximumScale: 5.0,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ViewportSetter />
        <PageViewTracker />
        <AuthProvider>
          <CustomAuthProvider>
            <TokenValidator />
            <ThemeContextProvider>
              <ThemeProvider>
                <ParticleBg />
                <div className="container">
                  <div className="wrapper">
                    <Navbar />
                    {children}
                    <Footer />
                  </div>
                </div>
              </ThemeProvider>
            </ThemeContextProvider>
          </CustomAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}