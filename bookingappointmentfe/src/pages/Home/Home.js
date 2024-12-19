import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <h1>Welcome to Acuity Scheduling</h1>
      <p>Manage your appointments and availability with ease. Sign in to get started!</p>
      <button className="home-button" onClick={() => navigate('/login')}>
        Login
      </button>
    </div>
  );
};

export default Home;
