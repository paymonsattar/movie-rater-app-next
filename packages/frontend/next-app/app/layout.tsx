import React from 'react';
import { Provider } from 'react-redux';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import store from './store';

// These styles apply to every route in the application
import './global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </Provider>
  );
}
