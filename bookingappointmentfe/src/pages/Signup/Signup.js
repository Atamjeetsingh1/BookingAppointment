import React, { useState } from "react";
import img1 from "../../assets/images/img1.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Box,FormControl,Select,MenuItem
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { displayLog } from "../../util/common";
import { signup } from "../../api/Function";
import "./Signup.css";
import countries from "../../util/countries.json"
const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });
 
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const [showPasswordFlag, setShowPasswordFlag] = useState(false);
  const navigate = useNavigate();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [loading, setLoading] = useState(false);

  const onUserSignup = async () => {
    const { firstName, lastName, email, phone, password } = formData;
    let formErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: ""
    };

    if (!firstName) {
      formErrors.firstName = "First name is required";
    }
    if (!lastName) {
      formErrors.lastName = "Last name is required";
    }
    if (!email) {
      formErrors.email = "Email is required";
    } else if (!regex.test(email)) {
      formErrors.email = "Email is incorrect";
    }
    if (!phone) {
      formErrors.phone = "Phone number is required";
    }
    if (!password) {
      formErrors.password = "Password is required";
    }

    setErrors(formErrors);

    if (
      !formErrors.firstName &&
      !formErrors.lastName &&
      !formErrors.email &&
      !formErrors.phone &&
      !formErrors.password
    ) {
      const data = {
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        password
      };
      setLoading(true);

      try {
        const response = await signup(data);
        if (response.status === 200) {
          displayLog(1, "Account created successfully! Please login.");
          navigate("/");
        } else if (response.status === 400) {
          throw new Error("EMAIL ALREADY REGISTERED");
        }
      } catch (error) {
        if (error.message === "EMAIL ALREADY REGISTERED") {
          setErrors({
            ...errors,
            email:
              "This email is already registered. Please use a different email."
          });
          displayLog(0, "Email Already Registered");
        } else {
          setErrors({
            ...errors,
            general: "An unexpected error occurred. Please try again."
          });
          displayLog(0, "Unexpected Error received");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () =>
    setShowPasswordFlag((prevState) => !prevState);
  return (
    <Box
      sx={{
        backgroundColor: "black",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center" }}>
        <Grid container spacing={5}>
          {/* Left Grid - Illustration */}
          <Grid item xs={12} md={6}>
            <Box sx={{ width: "495px", height: "764px" }}>
              <Typography variant="h4" gutterBottom>
                Lorem Ipsum
              </Typography>
              <Typography paragraph>
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </Typography>
              <Box mt={3}>
                <img
                  src={img1}
                  alt="Illustration"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </Box>
            </Box>
          </Grid>
          {/* Right Grid - Signup Form */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                color: "black",
                p: 4,
                borderRadius: "24px",
                boxShadow: 3,
                width: "596px",
                height: "auto",
                gap: "16px"
              }}
            >
              <Typography variant="h4" gutterBottom>
                Sign up now
              </Typography>
              <Box>
                   {/* First Name and Last Name Row */}
          <Box
            sx={{
              display: "flex",
              gap: "16px",
              mb: 2
            }}
          >
            <Box>
            <Typography> First Name </Typography>
            <TextField
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) =>
                handleChange(e.target.value, e.target.name)
              }
              error={!!errors.firstName}
              helperText={errors.firstName}
              sx={{
                flex: 1,
                border: "1px solid #66666659",
                borderRadius: "12px"
              }}
            />            
            </Box>
            <Box>            <Typography> Last Name </Typography>

            <TextField
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={(e) =>
                handleChange(e.target.value, e.target.name)
              }
              error={!!errors.lastName}
              helperText={errors.lastName}
              sx={{
                flex: 1,
                border: "1px solid #66666659",
                borderRadius: "12px"
              }}
            />            
            </Box>
          </Box>
                 
                <Box>
                  <Typography> Email Address </Typography>
                  <TextField
                    fullWidth
                    placeholder="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleChange(e.target.value, e.target.name)
                    }
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{
                      mb: 2,
                      border: "1px solid #66666659",
                      borderRadius: "12px"
                    }}
                  />
                </Box>          
               <Typography> Phone No.</Typography>
                <Box>
  <FormControl
    sx={{
      mb: 2,
      border: "1px solid #66666659",
      borderRadius: "12px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    <Select
      value={selectedCountry?.code || ""}
      onChange={(e) =>
        setSelectedCountry(
          countries.find((country) => country.code === e.target.value)
        )
      }
      sx={{
        minWidth: "30px",
        border: "none",maxHeight:"60px",
      }}
    >
      {countries.map((country) => (
        <MenuItem key={country.code} value={country.code}  sx={{ display:"flex",gap:"4px"}}>
          <img
            src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
            alt={country.code}
            style={{width:"36px",height:"22px" }}
          />
          {country.dial_code}
        </MenuItem>
      ))}
    </Select>
    <TextField
      placeholder="Phone Number"
      name="phone"
      value={formData.phone}
      onChange={(e) => handleChange(e.target.value, e.target.name)}
      error={!!errors.phone}
      helperText={errors.phone}
      fullWidth
      sx={{
        border: "none",
        "& fieldset": { border: "none" },
        paddingLeft: "8px",
      }}
      InputProps={{
        startAdornment: selectedCountry ? (
          <InputAdornment position="start">+{selectedCountry.dial_code}</InputAdornment>
        ) : null,
      }}
    />
  </FormControl>
</Box>
                {/* <Box>
                  <TextField
                    fullWidth
                    placeholder="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      handleChange(e.target.value, e.target.name)
                    }
                    error={!!errors.phone}
                    helperText={errors.phone}
                    sx={{
                      mb: 2,
                      border: "1px solid #66666659",
                      borderRadius: "12px"
                    }}
                  />
                </Box> */}
                <Box>
                <Typography> Password</Typography>
                  <TextField
                    fullWidth
                    placeholder="Password"
                    name="password"
                    type={showPasswordFlag ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleChange(e.target.value, e.target.name)
                    }
                    error={!!errors.password}
                    helperText={errors.password} variant="outlined"
                    
                    sx={{
                      mb: 2,
                      border: "1px solid #66666659",
                      borderRadius: "12px",
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility}>
                            {showPasswordFlag ? (
                              <AiOutlineEyeInvisible />
                            ) : (
                              <AiOutlineEye />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Box>
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <Typography variant="body2">
                    By creating an account, I agree to the{" "}
                    <Link to="/terms" style={{ color: "blue" }}>
                      Terms of Use
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" style={{ color: "blue" }}>
                      Privacy Policy
                    </Link>
                    .
                  </Typography>
                }
              />
              <Box mt={3} gap={6} display="flex" alignItems="center">
                <Box>
                  <Button
                    variant="contained"
                    onClick={onUserSignup}
                    sx={{
                      borderRadius: "40px",
                      width: "164px",
                      height: "64px",
                      backgroundColor: "#BB9CEF",
                      "&:hover": { backgroundColor: "#8e5ae4" }
                    }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Sign up"}
                  </Button>
                </Box>{" "}
                <Box>
                  <Typography variant="body2">
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "blue" }}>
                      Login
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

export default Signup;
// return (
//   <div
//     className="signup-auth"
//     style={{ backgroundColor: "black", minHeight: "100vh", color: "white" }}
//   >
//     <Container>
//       <Grid container spacing={6} justifyContent="center" alignItems="center" sx={{marginTop:"129px" ,borderRadius:"24px"}} >
//         <Grid item xs={12} md={6} sx={{width:"495px",height:"764px",gap:"24px"}} >
//           <Typography variant="h4" gutterBottom>
//             Lorem Ipsum
//           </Typography>
//           <Typography paragraph>
//             It is a long established fact that a reader will be distracted by
//             the readable content of a page when looking at its layout.
//           </Typography>
//           <img
//             src={img1}
//             alt="Illustration"
//             className="illustration"
//             style={{ width: "486px", height:"364px", marginTop:"24px" }}
//           />
//         </Grid >
//         <Grid item xs={12} md={6} >
//           <Box sx={{width:"596px",height:"666px",gap:"32px", borderRadius:"24px", padding: "20px", backgroundColor: "white", color: "black" }}>
//             <Typography variant="h5" gutterBottom>
//               Sign up now
//             </Typography>
//             <TextField
//               fullWidth={false}
//               variant="outlined"
//               margin="normal"
//               name="firstName"
//               label="First name"
//               value={formData.firstName}
//               onChange={(e) => handleChange(e.target.value, e.target.name)}
//               error={!!errors.firstName}
//               helperText={errors.firstName}
//               sx={{ marginRight: '20px', width:"229px", height:"56px", border:"1px solid #666666", borderRadius:"12px" }}
//             />
//             <TextField
//               fullWidth={false}
//               variant="outlined"
//               margin="normal"
//               name="lastName"
//               label="Last name"
//               value={formData.lastName}
//               onChange={(e) => handleChange(e.target.value, e.target.name)}
//               error={!!errors.lastName}
//               helperText={errors.lastName}
//               sx={{ marginRight: '20px', width:"229px", height:"56px", border:"1px solid #666666", borderRadius:"12px" }}
//             />
//             <TextField
//               fullWidth
//               variant="outlined"
//               margin="normal"
//               name="email"
//               label="Email Address"
//               value={formData.email}
//               onChange={(e) => handleChange(e.target.value, e.target.name)}
//               error={!!errors.email}
//               helperText={errors.email}
//               sx={{ border:"1px solid #666666", borderRadius:"12px" }}
//             />
//             <TextField
//               fullWidth
//               variant="outlined"
//               margin="normal"
//               name="phone"
//               label="Phone Number"
//               value={formData.phone}
//               onChange={(e) => handleChange(e.target.value, e.target.name)}
//               error={!!errors.phone}
//               helperText={errors.phone}
//               sx={{ border:"1px solid #666666", borderRadius:"12px" }}
//             />
//             <TextField
//               fullWidth
//               variant="outlined"
//               margin="normal"
//               name="password"
//               type={showPasswordFlag ? "text" : "password"}
//               label="Password"
//               value={formData.password}
//               onChange={(e) => handleChange(e.target.value, e.target.name)}
//               error={!!errors.password}
//               helperText={errors.password}
//               sx={{ border:"1px solid #666666", borderRadius:"12px" }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={togglePasswordVisibility}>
//                       {showPasswordFlag ? (
//                         <AiOutlineEyeInvisible />
//                       ) : (
//                         <AiOutlineEye />
//                       )}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <FormControlLabel
//               control={<Checkbox />}
//               label={
//                 <Typography variant="body2" sx={{ color: "#000" }} gutterBottom>
//                   By creating an account, I agree to the{" "}
//                   <Link to="/terms" style={{ color: 'blue' }}>Terms of Use</Link> and{" "}
//                   <Link to="/privacy" style={{ color: 'blue' }}>Privacy Policy</Link>.
//                 </Typography>
//               }
//               sx={{ mb: 2 }}
//             />
//             <Box sx={{ width: "453px", height: "64px", display: "flex", alignItems: "center", gap: "24px", }}>
//               <Button
//                 variant="contained"
//                 color="#BB9CEF"
//                 onClick={onUserSignup}
//                 sx={{ borderRadius: "40px", width: "164px", height: "64px", backgroundColor: '#BB9CEF', boxShadow: 'none', '&:hover': { backgroundColor: '#8e5ae4' } }}
//                 disabled={loading}
//               >
//                 {loading ? <CircularProgress color="neutral" /> : "Sign up"}
//               </Button>
//               <Typography align="center">
//                 Already have an account?{" "}
//                 <span
//                   onClick={() => navigate("/login")}
//                   className="login-text"
//                   style={{ color: "blue", cursor: "pointer" }}
//                 >
//                   Login
//                 </span>
//               </Typography>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </Container>
//   </div>
// );}

//export default Signup;
