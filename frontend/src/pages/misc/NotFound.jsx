import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-100 via-white to-indigo-100">
    <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-8xl font-extrabold text-indigo-600 mb-4 select-none">404</h1>
      <p className="text-2xl font-semibold text-gray-700 mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <p className="text-gray-600 mb-10">
        It might have been removed or moved to another URL. Please check the address or go back home.
      </p>
      <Link
        to="/"
        className="inline-block px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-indigo-700 transition"
        aria-label="Go back to homepage"
      >
        Go Home
      </Link>
    </div>
  </main>
);

export default NotFound;
