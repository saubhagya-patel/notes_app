import React, { useState, useContext } from "react";
import axios from "axios";
import { NotesContext } from "../src/context/NotesContext";

// Import MUI components
import { Modal, Box, Typography, TextField, Button, CircularProgress } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const CreateFolderModal = ({ onClose, onFolderCreated, parentFolderId = null }) => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState(1);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(NotesContext);

  const handleCreate = async () => {
    if (!name || !subject || !semester) return;

    setLoading(true);
    try {
      const payload = {
        name,
        subject,
        semester,
        isCoreFolder: false,
      };

      if (parentFolderId) {
        payload.parent = parentFolderId;
      }

      const res = await axios.post(`${backendUrl}/api/folders`, payload, {
        withCredentials: true,
      });

      if (res.data.success) {
        onFolderCreated(); // Notify parent to refresh
        onClose(); // Close modal on successful creation
      }
    } catch (err) {
      console.error("Error creating folder", err);
      // TODO: Show an error message to the user in the UI
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={true} // The modal's visibility should be controlled by a prop from the parent
      onClose={onClose}
      aria-labelledby="create-folder-modal-title"
    >
      <Box sx={style}>
        <Typography id="create-folder-modal-title" variant="h6" component="h2">
          {parentFolderId ? "Create Subfolder" : "Create Folder"}
        </Typography>
        <TextField
          autoFocus
          margin="normal"
          label="Folder Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Subject"
          fullWidth
          variant="outlined"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Semester"
          type="number"
          fullWidth
          variant="outlined"
          value={semester}
          onChange={(e) => setSemester(parseInt(e.target.value, 10) || 1)}
          inputProps={{ min: 1, max: 10 }}
        />
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={loading || !name || !subject}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateFolderModal;
