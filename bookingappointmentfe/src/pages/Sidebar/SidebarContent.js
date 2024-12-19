import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { IconButton } from "@mui/material";
import { FiClock} from 'react-icons/fi';

const SidebarContent = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarStyle = {
    sidebar: {
      width: isCollapsed ? "50px" : "200px",
      transition: "width 0.3s",
      overflow: "hidden",
      backgroundColor: "black",
      height: "100vh",
      display: "flex",
    },
    sidebarNav: {
      display: "flex",
      flexDirection: "column",
      padding: "20px",
      width:"160px"
    },
 sidebarHeader: {
      display: 'flex',
      justifyContent: isCollapsed ? 'center' : 'space-between',
      padding: '10px',
    },
   
    navItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      textDecoration: 'none',
      color: '#8E50FB',
      backgroundColor:"white",
      borderRadius:"10px"
    },
    navItemActive: {
      backgroundColor:"white",
      borderRadius:"5px"
    },

    content: {
      width:`calc(100vw-${isCollapsed ? "50px" : "200px"})`,
      flex: 1,
  
      transition: "width 0.3s"
    },
  };

  return (
    <div style={{ display: "flex" }}>
     <div style={sidebarStyle.sidebar}>
      <nav style={sidebarStyle.sidebarNav}>
        <div style={sidebarStyle.sidebarHeader}>
        <IconButton
        onClick={toggleSidebar}
        color="inherit"
        sx={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: "white",
          color: 'grey',
          position: "absolute",
          left: isCollapsed ? "35px" : "180px",
          top:"100px",
        }}
      >
        {isCollapsed ? <IoIosArrowDropright size={20} /> : <IoIosArrowDropleft size={20} />}
      </IconButton>
        </div>
        <NavLink
          to="/dashboard"
          style={sidebarStyle.navItem}
          activeStyle={sidebarStyle.navItemActive}
        >
          {!isCollapsed && <FiClock size={20} />} 
          {!isCollapsed && <span>TimeLog</span>}
        </NavLink>
      </nav>
    </div>

      <div style={sidebarStyle.content}>{children}</div>
    </div>
  );
};

export default SidebarContent;


