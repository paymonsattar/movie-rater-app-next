import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            &copy; {currentYear} MovieRater. All rights reserved.
          </div>
          <div className="space-x-4 text-sm">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
