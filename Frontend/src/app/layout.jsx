import Navbar from '@/components/navbar/Navbar';
import './globals.css';
import { Inter } from 'next/font/google';
import Footer from '@/components/footer/Footer';
import ThemeProvider from './providers/ThemeProvider';
import { ThemeContextProvider } from '@/context/ThemeContext';
import ParticleBg from '@/components/particleBg/ParticleBg';
import AuthProvider from './providers/AuthProvider';
import { AuthProvider as CustomAuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Blog App',
  description: 'The best blog app!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CustomAuthProvider>
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