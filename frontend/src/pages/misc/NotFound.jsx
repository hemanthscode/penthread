import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="flex flex-col items-center justify-center min-h-screen p-6">
    <h1 className="text-5xl font-bold mb-4">404</h1>
    <p className="mb-6">Page not found</p>
    <Link to="/" className="text-blue-600 hover:underline">Go to Home</Link>
  </main>
);

export default NotFound;
