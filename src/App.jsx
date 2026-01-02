import React from 'react';
import './App.css';
import TableColumns from './TableColumns';
import Registration from './Registration';
import authUsers from './Authentication.json';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
    // Check if user is already logged in (using sessionStorage for current session)
    return sessionStorage.getItem('isLoggedIn') === 'true';
  });

  React.useEffect(() => {
    // Initialize users in localStorage if not already present
    if (!localStorage.getItem('auth-users')) {
      localStorage.setItem('auth-users', JSON.stringify(authUsers));
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem('isLoggedIn', 'true');
  };

  return (
    <div className="app-container">
      {isLoggedIn ? (
        <TableColumns />
      ) : (
        <Registration onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
