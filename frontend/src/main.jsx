import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import "./index.css";
import App from "./App.jsx";
import NotesContextProvider from "./context/NotesContext.jsx";
import { theme } from "./config/theme.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <NotesContextProvider>
          <App />
        </NotesContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
