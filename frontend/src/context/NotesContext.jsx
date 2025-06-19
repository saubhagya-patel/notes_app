import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import config from "../config/config";

export const NotesContext = createContext();

const NotesContextProvider = (props) => {
  const backendUrl = config.backend_url;
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // For loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/auth/me`, {
          withCredentials: true, // important to send cookies
        });
        setUser(res.data.user);
      } catch (err) {
        setUser(null); // not logged in
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [backendUrl]);



  const value = {
    backendUrl,
    user,
    setUser,
    loadingUser
  };

  return (
    <NotesContext.Provider value={value}>
      {props.children}
    </NotesContext.Provider>
  );
};

export default NotesContextProvider;
