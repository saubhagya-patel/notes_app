import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { NotesContext } from '../context/NotesContext'; // Adjust path if needed

import { Container, Typography, Box, Button, Paper } from '@mui/material';

import { signOut } from 'firebase/auth';

const AdminDashboard = () => {
  const { backendUrl, setUser, auth } = useContext(NotesContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      if (auth) {
        await signOut(auth);
      }
      
      setUser(null);

      toast.success("Logged out successfully");
      navigate("/");

    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const TestComponent = () => (
    <Paper elevation={3} sx={{ p: 3, mt: 4, bgcolor: 'background.paper' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Admin Widget
      </Typography>
      <Typography color="text.secondary">
        This is a placeholder for an admin-specific feature. You could display
        site statistics, a list of recent sign-ups, or controls to manage public folders here.
      </Typography>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Render your admin components here */}
      <TestComponent />

    </Container>
  );
};

export default AdminDashboard;
