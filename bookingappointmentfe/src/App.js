import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import SidebarContent from "./pages/Sidebar/SidebarContent";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Signup from "./pages/Signup/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dashboards from "./pages/Dashboard/Dashboards";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("access_token"))
  );

  const handleLogin = (loggedIn) => {
    setIsLoggedIn(loggedIn);
    window.location.replace("/dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };
  const theme = createTheme({ palette: {
    primary: {
      main: '#0052cc',
    },
    secondary: {
      main: '#8F50FB',
    },
  }, typography: { fontFamily: 'Poppins, sans-serif',
   h6: { fontSize: '1.2rem',  fontWeight: 600, lineHeight: 1.5,  }, body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6, }
   ,}, });
  return (
    <ThemeProvider theme={theme}>
    <Router>
      {isLoggedIn ? (
        <SidebarContent>
          <Navbar onLogout={handleLogout} />
          <div className="main-content">
            <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboards" element={<Dashboards/>} />
            </Routes>
          </div>
        </SidebarContent>
      ) : (
        <Routes>
          
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      )}
      <ToastContainer />
    </Router>
  </ThemeProvider>
  );
}

export default App;
