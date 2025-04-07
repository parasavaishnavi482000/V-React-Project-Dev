import React, { useState } from 'react';
import HomePage from './components/homepage';  // Ensure this exports a component named HomePage
import Signup from './components/signup';      // Ensure this exports a component named Signup
import Login from './components/login';        // Ensure this exports a component named Login
import LandingPage from './components/landing';  // Ensure this exists
 
function App() {
  // Set initial page to 'homePage' so HomePage is rendered first.
  const [page, setPage] = useState('homePage');
 
  return (
    <div>
      {page === 'homePage' && <HomePage setPage={setPage} />}
      {page === 'signup' && <Signup setPage={setPage} />}
      {page === 'login' && <Login setPage={setPage} />}
      {page === 'landing' && <LandingPage setPage={setPage} />}
    </div>
  );
}
 
export default App;
 
 