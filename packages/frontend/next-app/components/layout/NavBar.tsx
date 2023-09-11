import React from 'react';
import { useRouter } from 'next/router';

const NavBar: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="bg-blue-500 p-4 text-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-2xl cursor-pointer" onClick={() => router.push('/')}>
            MovieRater
          </div>
          <div className="space-x-4">
            <button onClick={() => router.push('/')}>Home</button>
            {/* Add more links as needed */}
            <button>Sign In</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
