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
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
  const [darkMode, setDarkMode, url, setUrl] = useContext(DarkModeContext);

  const keyboardSend = (e) => {
    if (e.key === "Enter") {
      sendChat();
    }
  };

  const sendChat = async () => {
    if (chatText.length > 0 || url.length > 0) {
      let emails = (
        await db.collection("chats").doc(router.query.chatid).get()
      ).data().emails;
      //console.log(emails);

      const querySnapshot = await db
        .collection("users")
        .where("email", "==", emails[0] === user.email ? emails[1] : emails[0])
        .get();

      querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
        if (!doc.data().emails.includes(user.email)) {
          db.collection("users")
            .doc(doc.id)
            .set(
              {
                emails: [...doc.data().emails, user.email],
              },
              { merge: true }
            );
        } else {
          db.collection("users").doc(doc.id).set(
            {
              ultimomensaje: new Date().getTime(),
            },
            { merge: true }
          );
        }
      });

      db.collection("chats")
        .doc(router.query.chatid)
        .set(
          {
            chats: firebase.firestore.FieldValue.arrayUnion({
              sender: user.email,
              message: chatText,
              time: new Date().getTime(),
              image: url,
            }),
          },
          { merge: true }
        );
      setChatText("");
      setUrl("");
      setImage(null);
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

  const notify = () => toast.success("Cargando Imagen");

  ///////////////////////////fotos//////////////////////////
  const [image, setImage] = useState(null);
  // const [url, setUrl] = useState("");
  

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
        notify();
      }
    );
  }
  /////////////////Notification/////////////////////////

  return (
    <Box className={classes.container} elevation={0}>
      <IconButton onClick={toggleEmoji}>
        <EmojiEmotionsIcon />
      </IconButton>

      <IconButton variant="contained" component="label">
        <AttachFileIcon />
        <input
          type="file"
          onChange={(e) => {
            handleChange(e);
          }}
          accept="*"
          hidden
        />
        <ToastContainer position="top-right" reverseOrder={false} />
      </IconButton>

      {/* <div>
        {url ? <Image src={url} alt={url} height={70} width={120} /> : null}
      </div> */}

      <Picker
        onClick={handleEmoji}
        set="twitter"
        style={
          showEmoji
            ? {
                visibility: "visible",
                opacity: 1,
                position: "absolute",
                top: "50%",
                left: "50%",
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
        placeholder="Digite aqui..."
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
