import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Typography, Box, Menu, MenuItem, IconButton, Avatar, Stack } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import RegistrationModal from './RegistrationModal';
import WasteModal from './WasteModal';
import WaterModal from './WaterModal';
import GrievanceModal from './GrievanceModal';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const [anchorEl, setAnchorEl] = useState(null);
  const [showReg, setShowReg] = useState(false);
  const [showWaste, setShowWaste] = useState(false);
  const [showWater, setShowWater] = useState(false);
  const [showGrievance, setShowGrievance] = useState(false);
  
  
  const getUser = () => {
    const sessionUser = sessionStorage.getItem('user');
    const localUser = localStorage.getItem('user');
    if (sessionUser) return JSON.parse(sessionUser);
    if (localUser) return JSON.parse(localUser);
    return null;
  };

  const user = getUser();
  const open = Boolean(anchorEl);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setAnchorEl(null);
    navigate('/');
  };

  return (
    <AppBar 
      position="static"
      color="primary"
      elevation={3}
      sx={{ height: '70px', justifyContent: 'center' }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
            variant="h5"
            component={RouterLink}
            to="/home"
            sx={{
                textDecoration: 'none',
                fontWeight: 'bold',
                fontFamily: 'Roboto, sans-serif',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                color: 'inherit',
                letterSpacing: 1
            }}
            >
            SMART CITY
            </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!user ? (
            // GUEST VIEW
            <>
              {/* 3. FIX: Updated routes to match your file structure */}
              <Button color="inherit" component={RouterLink} to="/home">Home</Button>
              <Button color="inherit" component={RouterLink} to="/signup">Register</Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                sx={{ ml: 1, borderRadius: 20 }}
              >
                Sign In
              </Button>
            </>
          ) : (
            // LOGGED IN USER VIEW
            <>
              {/* Only show these action buttons if NOT an admin (optional preference) */}
              {user.role !== 'admin' && (
                  <>
                    <Button color="inherit" onClick={() => setShowWaste(true)}>Waste</Button>
                    <Button color="inherit" onClick={() => setShowWater(true)}>Water</Button>
                    <Button color="inherit" onClick={() => setShowGrievance(true)}>Grievance</Button>
                    <Button color="inherit" onClick={() => setShowReg(true)}>Services</Button>
                  </>
              )}

              {/* Dashboard Link based on Role */}
              {user.role === 'admin' ? (
                <Button color="inherit" component={RouterLink} to="/admin" sx={{ fontWeight: 'bold' }}>Admin Panel</Button>
              ) : (
                <Button color="inherit" component={RouterLink} to="/user">Dashboard</Button>
              )}

              <IconButton color="inherit" onClick={handleMenu} sx={{ ml: 1 }}>
                <Avatar 
                    sx={{ width: 35, height: 35, bgcolor: 'secondary.main', fontSize: 16 }}
                >
                    {(user.fullName || user.email || 'U')[0].toUpperCase()}
                </Avatar>
              </IconButton>
              
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={() => { handleClose(); navigate(user.role === 'admin' ? '/admin' : '/user'); }}>
                    My Dashboard
                </MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>

              {/* Modals */}
              <RegistrationModal open={showReg} onClose={() => setShowReg(false)} onSuccess={() => {}} />
              <WasteModal open={showWaste} onClose={() => setShowWaste(false)} onSuccess={() => {}} />
              <WaterModal open={showWater} onClose={() => setShowWater(false)} onSuccess={() => {}} />
              <GrievanceModal open={showGrievance} onClose={() => setShowGrievance(false)} onSuccess={() => {}} />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;