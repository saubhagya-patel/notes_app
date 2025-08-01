import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1A202C', // Dark Slate (Background)
      paper: '#2D3748',   // Medium Slate (Surface for Cards, etc.)
    },
    primary: {
      main: '#4299E1',    // Sky Blue (Accent)
    },
    text: {
      primary: '#E2E8F0',   // Light Slate Grey (Primary Text)
      secondary: '#A0AEC0', // Medium Slate Grey (Secondary Text)
    },
  },
  typography: {
    fontFamily: 'sans-serif',
  },
});
