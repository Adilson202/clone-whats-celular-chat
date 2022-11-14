import ChatHeader from "./ChatHeader";
import styled from "styled-components";
import ChatTyping from "./ChatTyping";
import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import { auth, db } from "../firebase";
import { IconButton, makeStyles, Container, Box } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import moment from "moment";
import { DarkModeContext } from "../context/DarkMode";
import Image from "next/image";
import PrintImage from "./PrintImage";

const useStyles = makeStyles({
  container: (darkMode) => ({
    width: "100%",
    position: "relative",
    height: "100%",
    background: darkMode ? "#282a34" : "#fff",
    padding: "0",
    margin: "0",
  }),
  ChatContainer: (darkMode) => ({
    background: darkMode ? "#3c3f51" : "#e8e6e6",
    width: "100%",
    height: "80%",
    overflowX: " hidden",
    display: "flex",
    flexDirection: "column",
    padding: "0.5rem",
    scrollBehavior: "smooth",
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  }),
});

const ChatScreen = ({ headerTitle }) => {
  const [chats, setChats] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [mensajeNuevo, setmensajeNuevo] = useState(0);
  const router = useRouter();

  const [darkMode, setDarkMode, url, setUrl] = useContext(DarkModeContext);

  const classes = useStyles(darkMode);
  const [user] = useAuthState(auth);
  const [chatsDoc, loading] = useDocument(
    firebase.firestore().doc(`chats/${router.query.chatid}`),
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );

  const ChatContainerRef = useRef(null);

  const handleDelete = (chat) => {
    db.collection("chats")
      .doc(router.query.chatid)
      .set(
        {
          chats: firebase.firestore.FieldValue.arrayRemove(chat),
        },
        { merge: true }
      );
  };

  const getChatTime = (time) => {
    const numTime = Number(time);
    return moment(numTime).format("LT");
  };

  ///Notification message
  useEffect(() => {
    if (chats.length > 0) {
      let lastMessage = chats[chats.length - 1];
      if (lastMessage.time > lastMessageTime && lastMessageTime !== null) {
        
        if (lastMessage.sender !== user.email) {
          notifyMe("Nuevo Mensaje");
        }
      }
      setLastMessageTime(lastMessage.time);
    }
  }, [chats]);

  ///// reload chats
  useEffect(() => {
    if (!loading) {
      setChats(chatsDoc.data().chats);
      setTimeout(() => {
        ChatContainerRef.current.scrollTop =
          ChatContainerRef.current.scrollHeight;
      }, 500);
    }
  }, [chatsDoc]);

  ////////////////////Notificacion/////////////

  function notifyMe(mensagem) {
    if (!Notification) {
      alert(
        "O navegador que você está utilizando não possui o notifications. Tente o Chrome"
      );
      return;
    }

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    } else {
      var notification = new Notification(mensagem);

      notification.onclick = function () {
        window.focus();
      };
    }
  }
  /////////////////////////////////

  return (
    <Container className={classes.container}>
      <ChatHeader email={headerTitle} mensajeNuevo={mensajeNuevo} />
      <Box
        ref={ChatContainerRef}
        onClick={() => {
          setShowEmoji(false);
        }}
        className={classes.ChatContainer}
      >
        {chats.map((chat) =>
          chat.sender === user.email ? (
            <UserMessage key={chat.time} darkMode={darkMode}>
              {chat.image ? (
                <>
                  <div className="unset-img">
                    <Image
                      className="custom-img"
                      layout="fill"
                      src={chat.image}
                      objectFit="cover"
                    />
                  </div>
                  <br />
                </>
              ) : (
                ""
              )}
              {chat.message}
              <ChatTime>{getChatTime(chat.time)}</ChatTime>
              <DeleteSpan>
                <IconButton
                  onClick={() => {
                    handleDelete(chat);
                  }}
                  disableRipple
                  style={{ padding: "0 0.3rem", background: "red", color: "white"}}
                >
                  <DeleteForeverIcon style={{ fontSize: "1.2rem" }} />
                </IconButton>
              </DeleteSpan>
            </UserMessage>
          ) : (
            <SenderMessage key={chat.time} darkMode={darkMode}>
              {chat.image ? (
                <>
                  <div className="unset-img">
                    <Image
                      className="custom-img"
                      layout="fill"
                      src={chat.image}
                      objectFit="cover"
                    />
                  </div>
                  <br />
                </>
              ) : (
                ""
              )}
              {chat.message}
              <ChatTime>{getChatTime(chat.time)}</ChatTime>
              <DeleteSpan>
                <IconButton
                  onClick={() => {
                    handleDelete(chat);
                  }}
                  disableRipple
                  style={{ padding: "0 0.4rem", background: "red", color: "white" }}
                >
                  <DeleteForeverIcon style={{ fontSize: "1.2rem" }} />
                </IconButton>
              </DeleteSpan>
            </SenderMessage>
          )
        )}
        <PrintImage url={url} />
      </Box>
      <ChatTyping showEmoji={showEmoji} setShowEmoji={setShowEmoji} />
    </Container>
  );
};

const ChatTime = styled.span`
  position: absolute;
  bottom: 0;
  right: 1rem;
  font-size: 0.6rem;
  margin: 5rem 0.1rem 0.5rem 0.8rem;
`;

const DeleteSpan = styled.span`
  display: none;
`;

const SenderMessage = styled.div`
  align-self: flex-start;
  border: 1px solid;
  position: relative;
  padding: 0.8rem 2rem 1.3rem;
  background: ${(props) => (props.darkMode ? "white" : "white")};
  color: ${(props) => (props.darkMode ? "black" : "black")};
  border-radius: 0.6rem;
  margin: 0.5rem 0;
  transition: 0.3s ease;
  &:hover span {
    display: initial;
  }
`;

const UserMessage = styled.div`
  align-self: flex-end;
  border: 1px solid;
  position: relative;
  padding: 0.8rem 2rem 1.3rem;
  background: ${(props) => (props.darkMode ? "white" : "white")};
  color: ${(props) => (props.darkMode ? "black" : "black")};
  border-radius: 0.6rem;
  margin: 0.4rem 0;
  transition: 0.3s ease;
  &:hover span {
    display: initial;
  }
`;

export default ChatScreen;
