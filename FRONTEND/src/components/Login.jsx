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

// 🌈 Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#009688' },
    secondary: { main: '#ff7043' },
    background: { default: '#f0f4f8' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
});

const Login = () => {
  const [input, setInput] = useState({ email: '', password: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!input.email || !input.password) {
      setErrorMessage('Email and password are required');
      return;
    }

    axios
      .post('http://localhost:3000/api/', input)
      .then((response) => {
        console.log("Login Response:", response.data); 
        const { token, user, message } = response.data;
        const storage = remember ? localStorage : sessionStorage;
        
        if (token) storage.setItem('token', token);
        if (user) storage.setItem('user', JSON.stringify(user));

        setSuccessMessage(message || 'Login successful!');
        
        setTimeout(() => {
            if (user && user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/user'); 
            }
        }, 600);
      })
      .catch((error) => {
        console.error('Login error:', error);
        const msg =
          error?.response?.data?.message ||
          'Login failed. Please check your credentials.';
        setErrorMessage(msg);
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
          p: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 4,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            p: 4,
          }}
        >
          <Typography variant="h4" gutterBottom align="center" color="primary">
            Smart City Sign In
          </Typography>

          <Typography variant="subtitle1" align="center" sx={{ color: 'text.secondary', mb: 3 }}>
            Secure access to your smart city dashboard
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              name="email"
              value={input.email}
              onChange={inputHandler}
            />

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
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <FormControlLabel
                control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
                label="Remember me"
              />

              <Link component={RouterLink} to="/res" underline="hover" color="secondary" variant="body2">
                Forgot Password?
              </Link>
            </Box>

            <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 3, py: 1 }}>
              Sign In
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
            Don't have an account?{' '}
            <Link component={RouterLink} to="/signup" underline="hover" color="secondary">
              Create one
            </Link>
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;