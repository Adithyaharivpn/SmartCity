import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box, Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import RegistrationModal from './RegistrationModal';
import WasteModal from './WasteModal';
import WaterModal from './WaterModal';
import GrievanceModal from './GrievanceModal';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showReg, setShowReg] = React.useState(false);
  const [showWaste, setShowWaste] = React.useState(false);
  const [showWater, setShowWater] = React.useState(false);
  const [showGrievance, setShowGrievance] = React.useState(false);
  const open = Boolean(anchorEl);
  const user = typeof window !== 'undefined' && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/');
    handleClose();
  };

  return (
    <AppBar 
      position="absolute" 
      color="primary"
      sx={{
        height: '70px', // Adjust height to match Home page look
        justifyContent: 'center', // Vertical centering
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo / Title */}
        <Typography
          variant="h5"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            fontWeight: 'bold',
            fontFamily: 'Roboto, sans-serif', // Matching homepage font
            fontSize: { xs: '1.2rem', md: '1.5rem' }, // Responsive size
            color: 'inherit',
          }}
        >
          SMART CITY PORTAL
        </Typography>

        {/* Navigation Links */}
        <Box>
          {!user && (
            <>
              <Button color="inherit" component={RouterLink} to="/mi">Our mission</Button>
              <Button color="inherit" component={RouterLink} to="/r">Register</Button>
              <Button color="inherit" component={RouterLink} to="/co">Contact Us</Button>
            </>
          )}

          {user && (
            <>
              <Button color="inherit" component={RouterLink} to="/home">Home</Button>
              <Button color="inherit" onClick={() => setShowWaste(true)}>Request Waste</Button>
              <Button color="inherit" onClick={() => setShowWater(true)}>Report Water Issue</Button>
              <Button color="inherit" onClick={() => setShowGrievance(true)}>Grievance</Button>
              <Button color="inherit" onClick={() => setShowReg(true)}>Register Service</Button>
              <Button color="inherit" component={RouterLink} to="/user">My Dashboard</Button>
              {user.role === 'admin' && <Button color="inherit" component={RouterLink} to="/admin">Admin</Button>}
              <IconButton color="inherit" onClick={handleMenu} sx={{ ml: 1 }}>
                <Avatar sx={{ width: 32, height: 32 }}>{(user.fullName || user.email || 'U')[0]}</Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={() => { handleClose(); navigate('/user'); }}>Profile</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>

              <RegistrationModal open={showReg} onClose={() => setShowReg(false)} onSuccess={() => { /* optional refresh */ }} />
              <WasteModal open={showWaste} onClose={() => setShowWaste(false)} onSuccess={() => { /* optional refresh */ }} />
              <WaterModal open={showWater} onClose={() => setShowWater(false)} onSuccess={() => { /* optional refresh */ }} />
              <GrievanceModal open={showGrievance} onClose={() => setShowGrievance(false)} onSuccess={() => { /* optional refresh */ }} />
            </>
          )}

          {!user && (
            <Button color="inherit" component={RouterLink} to="/">Sign In</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
