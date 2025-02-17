import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccountSettings from './AccountSettings';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsOpen = () => {
    handleMenuClose();
    setOpenSettings(true);
  };

  const handleSettingsClose = () => {
    setOpenSettings(false);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const renderMenuItems = () => {
    return [
      <MenuItem key="username" disabled>
        <Typography variant="body2">
          Signed in as {user.username}
        </Typography>
      </MenuItem>,
      <Divider key="divider" />,
      <MenuItem 
        key="dashboard" 
        component={RouterLink} 
        to="/admin/dashboard"
        onClick={handleMenuClose}
        sx={{ display: user?.role === 'admin' ? 'block' : 'none' }}
      >
        Dashboard
      </MenuItem>,
      <MenuItem key="settings" onClick={handleSettingsOpen}>
        Account Settings
      </MenuItem>,
      <MenuItem key="logout" onClick={handleLogout}>
        Logout
      </MenuItem>
    ];
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 700 
          }}
        >
          BlogForge
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/contact"
          >
            Contact
          </Button>
          
          {user ? (
            <>
              <IconButton onClick={handleMenuOpen}>
                <Avatar 
                  src={user.photo} 
                  alt={user.username}
                  sx={{ width: 32, height: 32 }}
                >
                  {user.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {renderMenuItems()}
              </Menu>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/signin"
              >
                Sign In
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/signup"
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
      
      <AccountSettings 
        open={openSettings} 
        onClose={handleSettingsClose} 
      />
    </AppBar>
  );
};

export default Navbar;