import { useState, createContext } from "react";

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);  
  const [url, setUrl] = useState("");
  return (
    <DarkModeContext.Provider value={[darkMode, setDarkMode, url, setUrl ]}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const DarkModeContext = createContext(DarkModeProvider);
