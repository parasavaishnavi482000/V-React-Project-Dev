import React, { useState } from 'react';
import Home from './homepage';  // Ensure this exports a component named HomePage
import Signup from './Signup';      // Ensure this exports a component named Signup
import Login from './Login';        // Ensure this exports a component named Login
import LandingPage from './components/landing';  // Ensure this exists
 
function App() {
  // Set initial page to 'homePage' so HomePage is rendered first.
  const [page, setPage] = useState('homePage');
 
  return (
    <div>
      {page === 'homePage' && <Home setPage={setPage} />}
      {page === 'Signup' && <Signup setPage={setPage} />}
      {page === 'Login' && <Login setPage={setPage} />}
      {page === 'landing' && <LandingPage setPage={setPage} />}
    </div>
  );
}
 
export default App;
 
 