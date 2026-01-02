import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  createTheme,
  ThemeProvider,
  CssBaseline,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// 🌈 Aesthetic Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#009688', // Teal
    },
    secondary: {
      main: '#ff7043', // Coral
    },
    background: {
      default: '#f0f4f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const Signup = () => {
  const [input, setInput] = useState({ fullName: '', email: '', password: '', confirmPassword: '', phone: '', city: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!input.fullName || input.fullName.length < 2) return setErrorMessage('Full name is required');
    if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return setErrorMessage('Valid email is required');
    if (!input.password || input.password.length < 6) return setErrorMessage('Password must be at least 6 characters');
    if (input.password !== input.confirmPassword) return setErrorMessage('Passwords do not match');
    if (!agree) return setErrorMessage('You must agree to the terms');

    axios
      .post('http://localhost:3000/api/s', {
        fullName: input.fullName,
        email: input.email,
        password: input.password,
        phone: input.phone,
        city: input.city,
      })
      .then((response) => {
        // --- LOGIC CORRECTION ---
        // 1. Handle Flat Data
        const data = response.data;
        const user = data; 
        const token = data.token; 

        // 2. FIX: Save to sessionStorage (so Dashboard can find it immediately)
        if (token) sessionStorage.setItem('token', token);
        if (user) sessionStorage.setItem('user', JSON.stringify(user));

        setSuccessMessage('Signup successful!');
        setErrorMessage('');
        
        setTimeout(() => {
          // Check role directly from the flat data object
          navigate(user?.role === 'admin' ? '/admin' : '/user');
        }, 700);
      })
      .catch((error) => {
        console.error('Signup error:', error, error?.response?.data);
        const msg =
          error?.response?.data?.message ||
          (error?.response?.data?.errors && error.response.data.errors[0]?.msg) ||
          'Signup failed. Please try again.';
        setErrorMessage(msg);
        setSuccessMessage('');
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1950&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 480,
            bgcolor: 'rgba(255, 255, 255, 0.98)',
            borderRadius: 4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            padding: 4,
          }}
        >
          <Typography variant="h4" gutterBottom align="center" color="primary">
            Create an account
          </Typography>

          <Typography variant="subtitle1" align="center" sx={{ color: 'text.secondary', mb: 3 }}>
            Get started with Smart City services
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Full Name" variant="outlined" margin="normal" name="fullName" value={input.fullName} onChange={inputHandler} />
            <TextField fullWidth label="Email" variant="outlined" margin="normal" name="email" value={input.email} onChange={inputHandler} />

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              name="password"
              value={input.password}
              type={showPassword ? 'text' : 'password'}
              onChange={inputHandler}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword((s) => !s)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField fullWidth label="Confirm Password" variant="outlined" margin="normal" name="confirmPassword" value={input.confirmPassword} type={showPassword ? 'text' : 'password'} onChange={inputHandler} />

            <TextField fullWidth label="Phone (optional)" variant="outlined" margin="normal" name="phone" value={input.phone} onChange={inputHandler} />
            <TextField fullWidth label="City (optional)" variant="outlined" margin="normal" name="city" value={input.city} onChange={inputHandler} />

            <FormControlLabel control={<Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />} label={<Typography variant="body2">I agree to the <Link href="#">terms</Link> and privacy policy</Typography>} />

            <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2, py: 1.1 }}>
              Sign up
            </Button>
          </form>

          {successMessage && (
            <Typography variant="body1" align="center" color="success.main" sx={{ mt: 2 }}>
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography variant="body1" align="center" color="error.main" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/l" underline="hover" color="secondary">
              Sign in
            </Link> 
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Signup;