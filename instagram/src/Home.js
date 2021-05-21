import { useState, useEffect, useContext } from "react";
import "./Home.css";
import { db, auth, storage } from "./firebase";
import Post from "./Post";
import {
  IconButton,
  TextField,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  HomeRounded,
  SearchRounded,
  AddBoxRounded,
  FavoriteBorderRounded,
} from "@material-ui/icons";
import ImageUpload from "./imageUpload";
import { UserContext } from "./userContext";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    height: 460,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[6],
    padding: theme.spacing(2, 4, 3),
    display: "flex",
    flexFlow: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [user, setUser] = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [Profile, setProfile] = useState(false);
  const [username, setUsername] = useState(user.displayName);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`dp/${user.uid}`).put(image);

    if (image){
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
          .ref("dp")
          .child(user.uid)
          .getDownloadURL()
          .then((url) => {
            user.updateProfile({
              photoURL: url,
              displayName: username
            })
            .catch((error) => alert(error.message));
            setProgress(0);
            setImage(null);
            setProfile(false);
          });
      }
    );}
    else{
      user.updateProfile({
        displayName: username
      })
      .catch((error) => alert(error.message));
      setProgress(0);
      setImage(null);
      setProfile(false);
    }
  };

  return (
    <div className="App">
      <div className="app__header">
        <div className="app__header__cnt">
          <ImageUpload />
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
            alt="Logo"
          />
          <Avatar
            alt={user?.displayName}
            src={user.photoURL}
            onClick={handleMenu}
          />
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMClose}
          >
            <MenuItem onClick={() => setProfile(true)}>Profile</MenuItem>
            <MenuItem onClick={handleMClose}>Settings</MenuItem>
            <MenuItem
              onClick={() => {
                auth.signOut();
                setUser(null);
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>

      <Dialog
        open={Profile}
        onClose={() => setProfile(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title"> Edit Profile</DialogTitle>
        <DialogContent>
          <DialogContentText>Hey, {user.displayName}</DialogContentText>
          <div className="app__profile">
            <div className="profile__dp">
              <Avatar
                alt={user.displayName}
                style={{ width: "4em", height: "4em" }}
                src={user.photoURL}
              />
              <div className="profile_dp_btns">
                <Button
                  onClick={() => {
                    user.updateProfile({
                      photoURL: null
                    })
                    .catch((error) => alert(error.message));
                    setProfile(false);
                  }}
                  variant="outlined"
                  color="danger"
                >
                  Remove
                </Button>
                <input
                  accept="image/*"
                  style={{display:'none'}}
                  id="contained-button-file"
                  type="file"
                  onChange={handleChange}
                />
                <label htmlFor="contained-button-file">
                  <Button variant="contained" color="primary" component="span">
                    Change
                  </Button>
                </label>
              </div>
            </div>

            <TextField
              style={{ margin: "10px 0" }}
              value={username}
              type="text"
              fullWidth
              label="Username"
              variant="outlined"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setProfile(false);
              setProgress(0);
              setUsername(user.displayName);
              setImage(null);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <div className="app__posts">
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            id={id}
            imgPost={post.imgPost}
            location={post.location}
            timestamp={post.timestamp}
            username={post.username}
            user={user.displayName}
            caption={post.caption}
            imgProfile={post.imgProfile}
          />
        ))}
      </div>

      <div className="app__nav">
        <IconButton>
          <HomeRounded fontSize="large" />
        </IconButton>
        <IconButton>
          <SearchRounded fontSize="large" />
        </IconButton>
        <ImageUpload />
        <IconButton>
          <FavoriteBorderRounded fontSize="large" />
        </IconButton>
        <Avatar alt={user.displayName} src={user.photoURL} />
      </div>
    </div>
  );
}

export default App;
