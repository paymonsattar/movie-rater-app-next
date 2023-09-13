import React from 'react';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';

// These styles apply to every route in the application
import './global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
