import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Container, IconButton, InputAdornment, TextField, Typography, Grid } from "@mui/material";
import { login } from "../../api/Function";
import { displayLog } from "../../util/common";
import img1 from "../../assets/images/img1.png"
const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    const { email, password } = formData;
    let formErrors = { email: "", password: "" };

    if (!email) formErrors.email = "Email is required";
    else if (!regex.test(email)) formErrors.email = "Email is incorrect";
    if (!password) formErrors.password = "Password is required";

    setErrors(formErrors);

    if (!formErrors.email && !formErrors.password) {
      const data = { email: email.toLowerCase(), password: password };
      setLoading(true);
      try {
        const response = await login(data);
        if (response.status === 200) {
          localStorage.setItem("access_token", response.data.data.token);
          localStorage.setItem("id", response.data.data._id);
          onLogin(true);
          displayLog(1, "Welcome Back");
        }
      } catch (error) {
        setErrors({ ...errors, general: "Login failed. Please check your credentials." });
        displayLog(0, "Error While Login");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "black", color: "white",
  }}>
      <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center",}}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <Box sx={{width:"495px",height:"764px"}}>
              <Typography variant="h4" gutterBottom>
                Lorem Ipsum is
              </Typography>
              <Typography variant="body1" gutterBottom>
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
              </Typography>
              <Box mt={3}>
                <img src={img1} alt="Illustration" style={{ width: "100%", borderRadius: "8px" }} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: "#FFFFFF", color: "black", p: 4, borderRadius: "24px", boxShadow: 3,width:"772px",height:"548px",border:"1px"}}>
              <Typography variant="h4" align="start" gutterBottom >
                Log in
              </Typography>
              <Box sx={{gap:"16px",width:"534px",height:"239px"}}>
              <Typography variant="h7" component="label" htmlFor="username"> Email Address</Typography>
              <TextField
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                InputProps={{
                   style: {width:"534px",height:"56px",
                    border: "1px solid #66666659",
                    borderRadius: "12px",backgroundColor:"white",
                    fontFamily: "Roboto",
                    fontSize: "14px",
                   }
                  }
                  }
              />  
                <Typography variant="h7" component="label" htmlFor="P"> Password</Typography>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                variant="outlined"
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ), style: {width:"534px",height:"56px",
                    border: "1px solid ##666666",
                    borderRadius: "12px",
                    fontFamily: "Roboto",backgroundColor:"white",
                    fontSize: "14px",
                  },
                }}
              />
              <Typography variant="body2" color="textSecondary" align="left">
                Use 8 or more characters with a mix of letters, numbers & symbols
              </Typography>
              {errors.general && (
                <Typography variant="body2" color="error" align="center" gutterBottom>
                  {errors.general}
                </Typography>
              )} </Box>
              <Box sx={{width:"447px",height:"64px",gap:"24px"}}><Link to="/forgot-password" style={{ textDecoration: "none", display: "block", textAlign:"start", marginTop: 16 }}>
              <Typography variant="body2" color="primary">
                Forgot Password?
              </Typography>
            </Link></Box>
            <Box sx={{Width:"447px",Hight:"64px",display:"flex",alignItems:"center",gap:"24px"}}>
            <Box>
              <Button
                variant="contained"
                color="#BB9CEF"
                onClick={handleLogin}
                fullWidth 
                sx={{ mt: 2 ,borderRadius:"40px",width:"164px",height:"64px",                backgroundColor: '#BB9CEF',
                '&:hover': {
                  backgroundColor: '#9151FF',
                  boxShadow: 'none',
                },}}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </Button></Box>
             
              <Box mt={2} textAlign="center" sx={{width:"255px",height:"24px"}}>
                <Typography variant="body1">
                  Don't have an account?{" "}
                  <Link to="/signup" underline="always" style={{ textDecoration: "none" }}>
                    <Typography variant="body2" color="primary" component="span">
                     Sign Up
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;


// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; 
// import "./Login.css";
// import { login } from "../../api/Function";
// import { displayLog } from "../../util/common";

// const Login = ({ onLogin }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
// const [loading, setloading] = useState(false)
//   const [errors, setErrors] = useState({
//     email: "",
//     password: "",
//   });
//   const [showPasswordFlag, setShowPasswordFlag] = useState(false);
//   const navigate = useNavigate();
//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const handleLogin = async () => {
//     const { email, password } = formData;
//     let formErrors = { email: "", password: "" };

//     if (!email) {
//       formErrors.email = "Email is required";
//     } else if (!regex.test(email)) {
//       formErrors.email = "Email is incorrect";
//     }
//     if (!password) {
//       formErrors.password = "Password is required";
//     }

//     setErrors(formErrors);

//     if (!formErrors.email && !formErrors.password) {
//       const data = { email: email.toLowerCase(), password: password };
//       setloading(true)
//       try {
        
//         const response = await login(data);
//         console.log("respo", response.data.data);

//         if (response.status === 200) {
//           localStorage.setItem("access_token", response.data.data.token);
//           localStorage.setItem("id", response.data.data._id);
//           onLogin(true);
//           displayLog(1, "Welcome Back");
//         }
//       } catch (error) {
//         console.error("Login error:", error);
//         setErrors({ ...errors, general: "Login failed. Please check your credentials." });
//         displayLog(0, "Error While Login");
//       }
//       finally{
//         setloading(false)
//       }
//     }
//   };

//   const handleChange = (value, name) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const togglePasswordVisibility = () =>
//     setShowPasswordFlag((prevState) => !prevState);

//   return (
//     <div>
//       <div className="login-auth">
//         <div className="container">
//           <h1>Login</h1>

//           <div className="input-group">
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={(e) => handleChange(e.target.value, e.target.name)}
//             />
//             {errors.email && <div className="error-message">{errors.email}</div>}
//           </div>
//    <div>
//           <div className="input-group password-group">
//             <input
//               type={showPasswordFlag ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={(e) => handleChange(e.target.value, e.target.name)}
//             />
//             <span onClick={togglePasswordVisibility} className="icon">
//               {showPasswordFlag ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
//             </span></div>
//             {errors.password && <div className="error-message">{errors.password}</div>}
//           </div>

//           {errors.general && <div className="error-message">{errors.general}</div>}

//           <button onClick={handleLogin} className="login-btn" disabled={loading}>{loading?"login..":"Login"}</button>
//           <Link to="/forgot-password" className="forgot-password">
//             Forgot Password?
//           </Link>
//           <div className="signup-option">
//             <p>Don't have an account?</p>
//             <Link to="/signup" className="signup-link">Create an Account</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


