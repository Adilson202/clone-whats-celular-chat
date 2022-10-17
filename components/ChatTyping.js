//import styled from "styled-components";
import { IconButton, InputBase, Box, makeStyles } from "@material-ui/core";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import SendIcon from "@material-ui/icons/Send";
import { useContext, useState, useEffect } from "react";
import { db, auth, storage } from "../firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import { Picker } from "emoji-mart";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { DarkModeContext } from "../context/DarkMode";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    padding: "0 1rem",
    width: "100%",
    zIndex: 3,
  },
});

const ChatTyping = ({ showEmoji, setShowEmoji }) => {
  const [chatText, setChatText] = useState("");
  const router = useRouter();
  const [user] = useAuthState(auth);
  const isMobile = useMediaQuery("(max-width:768px)");
  const classes = useStyles();
  const [darkMode, setDarkMode] = useContext(DarkModeContext);

  const keyboardSend = (e) => {
    if (e.key === "Enter") {
      sendChat();
    }
  };

  const sendChat = () => {
    if (chatText.length === 0) {
      alert("Please write something.");
    } else {
      db.collection("chats")
        .doc(router.query.chatid)
        .set(
          {
            chats: firebase.firestore.FieldValue.arrayUnion({
              sender: user.email,
              message: chatText,
              time: new Date().getTime().toString(),
            }),
          },
          { merge: true }
        );
      setChatText("");
    }
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  };

  const handleEmoji = (emoji) => {
    setChatText((prev) => prev + emoji.native);
  };

  const toggleEmoji = () => {
    setShowEmoji((prev) => !prev);
  };

  ///////////////////////////fotos//////////////////////////

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  function handleChange(e) {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  useEffect(() => {
    if (image !== null) {
      handleUpload();
    }
  }, [image]);

  function handleUpload() {
    if (image === null) {
      return;
    }
    const uploadTask = storage.ref(`fotos/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      "",
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("fotos")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
          });
      }
    );
  }
  /////////////////////////////////////////////

  return (
    <Box className={classes.container} elevation={0}>
      <IconButton onClick={toggleEmoji}>
        <EmojiEmotionsIcon />
      </IconButton>

      {/* ////////////////////////////fotos//////////////////////// */}
      <IconButton variant="contained" component="label">
        <AttachFileIcon />
        <input
          type="file"
          onChange={(e) => {
            handleChange(e);
          }}
          accept="image/*"
          hidden
        />
      </IconButton>
      {url ? <img src={url} height={50} width={100} /> : null}

      <Picker
        onClick={handleEmoji}
        set="twitter"
        style={
          showEmoji
            ? {
                visibility: "visible",
                opacity: 1,
                position: "absolute",
                top: "58%",
                left: "20%",
                transform: "translate(-50%, -50%) scale(1)",
                zIndex: 2,
                transition: "300ms ease-in-out",
                background: darkMode ? "#282a34" : "#fff",
              }
            : {
                visibility: "hidden",
                opacity: 0,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(0.6)",
                zIndex: 2,
                transition: "300ms ease-in-out",
                background: darkMode ? "#282a34" : "#fff",
              }
        }
      />

      <InputBase
        placeholder="message..."
        style={{
          background: darkMode ? "#3c3f51" : "#eee",
          padding: "0.3rem 0.6rem",
          margin: "0 1rem",
          borderRadius: "10px",
          border: "1px solid gray",
        }}
        value={chatText}
        fullWidth
        onChange={(e) => {
          setChatText(e.target.value);
        }}
        onKeyPress={keyboardSend}
        autoFocus={!isMobile ? true : false}
      />

      <IconButton
        onClick={() => {
          sendChat();
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatTyping;
