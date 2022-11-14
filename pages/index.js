import PageTitle from "../components/PageTitle";
import styled from "styled-components";
import SideBar from "../components/SideBar";
import { SideMenuContext } from "../context/SideMenu";
import { useContext, useEffect } from "react";
import { DarkModeContext } from "../context/DarkMode";

export default function Home() {
  const [showMenu, setShowMenu] = useContext(SideMenuContext);
  const [darkMode, setDarkMode] = useContext(DarkModeContext);

  useEffect(() => {
    setShowMenu(true);
  }, []);

  return (
    <Container>
      <PageTitle title="WhatsApp" />
      <SideBar />
      <DummyChatScreen darkMode={darkMode}>
        <StartChatText
          onClick={() => {
            setShowMenu(true);
          }}
          darkMode={darkMode}
        >  
          <h1>WHATSAPP</h1>          
        </StartChatText>
      </DummyChatScreen>
    </Container>
  );
}

const DummyChatScreen = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
  background: ${(props) => (props.darkMode ? "#3c3f51" : "#fff")};
`;

const StartChatText = styled.div`
  font-size: 1.7rem;
  color: ${(props) => (props.darkMode ? "#c1c1c1" : "#848484")};
  text-transform: uppercase;
  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
