import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMemo, useContext } from "react";
import { DarkModeContext } from "./context/DarkMode";

const ThemeHook = ({ children }) => {
  const [darkMode, setDarkMode] = useContext(DarkModeContext);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeHook;
