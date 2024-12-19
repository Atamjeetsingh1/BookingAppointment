
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, CircularProgress, Box, Divider } from '@mui/material';
import { FiLogOut, FiChevronDown } from 'react-icons/fi';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { getSpecificAdmin } from '../../api/Function';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        if (!userId) {
          setError("User ID not found in localStorage.");
          setLoading(false);
          return;
        }
        const response = await getSpecificAdmin(userId);
        
        if (response.status === 200) {
          setUser(response.data.data);
        } else {
          setError("Failed to fetch User.");
        }
      } catch (err) {
        console.error("Error fetching User Details:", err);
        setError("An error occurred while fetching User Details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar  sx={{width:"100%",height:"60px",position:"relative",backgroundColor:"white"}}>
      <Toolbar >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        <MenuItem onClick={handleLogout}>
                  <FiLogOut size={16} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Logout
                  </Typography>
                </MenuItem>
        </Typography>
        <div>
          {loading ? (
            <CircularProgress color="inherit" size={24} />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : user ? (
            
            <Box>
               <MenuItem onClick={handleLogout}>
                  <FiLogOut size={16} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Logout
                  </Typography>
                </MenuItem>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{color:"black"}}
              >
                <AccountCircle />
                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                  {user.email}
                </Typography>
                <FiChevronDown size={20} className={`dropdown-icon ${anchorEl ? "open" : ""}`} />
                
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem>
                  <strong>Email:</strong> {user.email}
                </MenuItem>
                <MenuItem>
                  <strong>Status:</strong> {user.status}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <FiLogOut size={16} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Typography variant="h6" component="div">
              Guest
            </Typography>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiLogOut, FiChevronDown } from 'react-icons/fi';
// import './Navbar.css';
// import { getSpecificAdmin } from '../../api/Function';

// const Navbar = ({ onLogout }) => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   const handleLogout = () => {
//     onLogout();
//     navigate("/login");
//   };
//   const userId = localStorage.getItem("id");
//   console.log(userId,"userId")
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       setLoading(true);  
//       try {
//         if (!userId) {
//           setError("User ID not found in localStorage.");
//           setLoading(false);
//           return;
//         }
//         const response = await getSpecificAdmin(userId);
//         console.log(response,"repo");  // Log the response
//         if (response.status === 200) {
//           setUser(response.data.data);
//           console.log("data",response.data.data)
//         } else {
//           setError("Failed to fetch User.");
//         }
//       } catch (err) {
//         console.error("Error fetching User Details:", err);
//         setError("An error occurred while fetching User Details.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserDetails();
//   }, []);

//   const toggleDropdown = () => {
//     setDropdownOpen((prev) => !prev);
//   };
//   return (
//     <header className="navbar">
//       <div className="navbar-logo">AS</div>
//       <div className="navbar-info">
//       <div className="dropdown-item logout" onClick={handleLogout}>
//                     <FiLogOut size={16} />
//                     <span>Logout</span>
//                   </div>
//         <div className="navbar-right">
//           {loading ? (
//             <h4>Loading Data...</h4>
//           ) : error ? (
//             <p className="error-message">{error}</p>
//           ) : user ? (
//             <div className="profile-dropdown">
//               <div className="profile-header" onClick={toggleDropdown}>
//                 <span className="user-name">{user.name}</span>
//                 <FiChevronDown size={20} className={`dropdown-icon ${dropdownOpen ? "open" : ""}`} />
//               </div>
//               {dropdownOpen && (
//                 <div className="dropdown-menu">
//                   <div className="dropdown-item">
//                     <strong>Email:</strong> {user.email}
//                   </div>
//                   <div className="dropdown-item">
//                     <strong>Status:</strong> {user.status}
//                   </div>
//                   <div className="dropdown-divider" />
//                   <div className="dropdown-item logout" onClick={handleLogout}>
//                     <FiLogOut size={16} />
//                     <span>Logout</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <span className="user-name">Guest</span>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
