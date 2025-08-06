import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


// Import MUI components for layout and styling
import { Container, Typography, Box, Grid, CircularProgress } from "@mui/material";
import { NotesContext } from "../context/NotesContext";
import { FolderCard } from "../../components";

const Resources = () => {
  // State to hold the public folders, loading status, and any errors
  const [publicFolders, setPublicFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the backendUrl from your context
  const { backendUrl } = useContext(NotesContext);

  // Function to fetch all public folders from the backend
  const fetchPublicFolders = async () => {
    setLoading(true);
    setError(null);
    try {
      // The endpoint for public folders does not require authentication
      const res = await axios.get(`${backendUrl}/api/folders/all`);
      if (res.data.success) {
        setPublicFolders(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching public folders:", err);
      setError("Failed to load resources. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to fetch the data when the component mounts
  useEffect(() => {
    fetchPublicFolders();
  }, []); // The empty dependency array ensures this runs only once

  // Render a loading state using MUI components
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render an error message using MUI components and theme colors
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Public Resources
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Browse notes and materials shared by the community.
        </Typography>
      </Box>

      {/* Render the list of folder cards or a message if none exist */}
      {publicFolders.length > 0 ? (
        <Grid container spacing={3}>
          {publicFolders.map((folder) => (
            <Grid item key={folder._id} xs={12} sm={6} md={4} lg={3}>
              <FolderCard folder={folder} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{
          textAlign: 'center',
          p: 5,
          bgcolor: 'background.paper', // Uses the paper color from your theme
          borderRadius: 2
        }}>
          <Typography>No public resources are available at the moment.</Typography>
        </Box>
      )}
    </Container>
  );
};

export default Resources;
