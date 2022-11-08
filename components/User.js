import styled from "styled-components";
import { Avatar, Typography, ButtonBase, IconButton } from "@material-ui/core";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useContext } from "react";
import { SideMenuContext } from "../context/SideMenu";

const User = ({ email, styledObj, contadorMsg }) => {
  const [photoUrl, setPhotoUrl] = useState("");
  const [chatId, setChatId] = useState("");
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [
    showMenu,
    setShowMenu,
    contadorMensajes,
    setContadorMensajes,
    mensajesLeidos,
    setMensajesLeidos,
  ] = useContext(SideMenuContext); 

  useEffect(() => {
    const userChatRef = db
      .collection("chats")
      .where("emails", "array-contains", user.email && email)
      .get();
    userChatRef.then((data) => {
      data.docs.forEach((doc) => {
        if (
          doc.data().emails.includes(email) &&
          doc.data().emails.includes(user.email)
        ) {
          setChatId(doc.id);
        }
      });
    });
  }, [router.query.chatid]);


  const handleChatOpen = (e) => {
    let contadorEmail = {}
    contadorEmail[email] = 0;
    setContadorMensajes({
      ...contadorMensajes, ...contadorEmail 
    })
    
    let contadorTime = {}
    contadorTime[email] = new Date().getTime();
    setMensajesLeidos({
      ...mensajesLeidos, ...contadorTime
    })
    
    if (chatId !== "") {
      router.push({
        pathname: "/chat",
        query: { chatid: chatId },
      });
    } else {
      db.collection("chats")
        .add({
          emails: [user.email, email],
          chats: [],
        })
        .then((docRef) => {
          router.push({
            pathname: "/chat",
            query: { chatid: docRef.id },
          });
        });
    }
    setShowMenu(false);
  };

  useEffect(() => {
    db.collection("users")
      .get()
      .then((col) => {
        col.docs.forEach((doc) => {
          if (email === doc.data().email) {
            setPhotoUrl(doc.data().photo);
          }
        });
      });
  }, [email]);

  return (
    <Container onClick={handleChatOpen}>
      {photoUrl ? (
        <Avatar src={photoUrl}></Avatar>
      ) : (
        <Avatar style={styledObj}>{email[0].toUpperCase()}</Avatar>
      )}
      <Typography style={{ marginLeft: "1rem" }} noWrap>
        {email}
      </Typography>
      {contadorMsg > 0 && <Bolinha>{contadorMsg}</Bolinha>}
    </Container>
  );
};

const Container = styled(ButtonBase)`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start !important;
  width: 100%;
  padding: 1rem !important;
  cursor: pointer;
`;
const Bolinha = styled.span`
  background-color: green;
  position: absolute;
  right: 0;
  margin-top: 30px;
  border-radius: 50%;
  padding: 0 4px;
  color: white;
  font-size: 9pt;
`;

export default User;
