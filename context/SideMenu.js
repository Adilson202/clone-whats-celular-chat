import { useState, createContext } from "react";

export const SideMenuProvider = ({ children }) => {
  const [showMenu, setShowMenu] = useState(true);
  const [contadorMensajes, setContadorMensajes] = useState({});
  const [mensajesLeidos, setMensajesLeidos] = useState({});  
  return (
    <SideMenuContext.Provider
      value={[
        showMenu,
        setShowMenu,
        contadorMensajes,
        setContadorMensajes,
        mensajesLeidos,
        setMensajesLeidos,        
      ]}
    >
      {children}
    </SideMenuContext.Provider>
  );
};

export const SideMenuContext = createContext(SideMenuProvider);
