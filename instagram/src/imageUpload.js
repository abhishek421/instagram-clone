import React from "react";
import { useState,useContext } from "react";
import { UserContext } from "./userContext";

import {
  Button,
  IconButton,
  LinearProgress,
  TextField,
} from "@material-ui/core";
import { Delete, AddBoxRounded } from "@material-ui/icons";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { storage, db } from "./firebase";
import firebase from "firebase";

function ImageUpload({ username }) {
  
  const [user, setUser] = useContext(UserContext);
  const [loc, setLoc] = useState("");
  const [openUpload, setOpenUpload] = useState(false);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changes",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imgPost: url,
              location: loc,
              username: user.displayName,
              imgProfile: user.photoURL
            });
            setProgress(0);
            setCaption("");
            setImage(null);
            setLoc("");
            setOpenUpload(false);
          });
      }
    );
  };

  return (
    <div>
      <IconButton onClick={() => setOpenUpload(true)}>
        <AddBoxRounded fontSize="large"/>
      </IconButton>

      <Dialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add your Image with a cool caption and other details, to publish
            your post.
          </DialogContentText>
          <LinearProgress variant="determinate" value={progress} />
          {image ? (
            <div
              style={{
                display: "flex",
                flexFlow: "row",
                widows: "100%",
                justifyContent: "center",
              }}
            >
              <img
                src={URL.createObjectURL(image)}
                alt="Post Preview"
                style={{
                  objectFit: "contain",
                  width: "200px",
                  height: "200px",
                  margin: "20px 0",
                }}
              />
              <IconButton onClick={() => setImage(null)}>
                <Delete />
              </IconButton>
            </div>
          ) : (
            <input
              accept="image/*"
              type="file"
              style={{ width: "100%", margin: "20px 0" }}
              onChange={handleChange}
            />
          )}

          <TextField
            style={{ margin: "10px 0" }}
            value={caption}
            type="text"
            multiline
            rowsMax={4}
            fullWidth
            id="outlined-basic"
            label="Caption"
            variant="outlined"
            onChange={(e) => setCaption(e.target.value)}
          />
          <TextField
            style={{ margin: "10px 0" }}
            value={loc}
            type="text"
            fullWidth
            id="outlined-basic"
            label="Location"
            variant="outlined"
            onChange={(e) => setLoc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenUpload(false);
              setProgress(0);
              setCaption("");
              setImage(null);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary">
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

//AIzaSyCSfu-KJC1IqOZ0nfC6PsjZInjhlTRjEow google api

export default ImageUpload;
