import React, { createContext, useEffect, useState } from "react";
import config from "../config/config";

export const NotesContext = createContext();

const NotesContextProvider = (props) => {
  const backendUrl = config.backend_url;
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const value = {
    backendUrl,
    token,
    setToken,
    user,
    setUser,
  };

  return (
    <NotesContext.Provider value={value}>
      {props.children}
    </NotesContext.Provider>
  );
};

export default NotesContextProvider;
