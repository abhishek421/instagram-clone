import React from 'react';
import { useState} from 'react';
import {Button, IconButton, Modal, LinearProgress, TextField} from '@material-ui/core';
import {Delete, AddCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { storage, db } from './firebase';
import firebase from "firebase";

function getModalStyle() {
    const top = 50 ;
    const left = 50 ;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      height: 480,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[6],
      padding: theme.spacing(2, 4, 3),
      display: 'flex',
      flexFlow: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center'
    },
  }));


function ImageUpload({user}) {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [loc,setLoc]=useState('');
    const [open,setOpen]=useState(false);
    const [caption,setCaption]=useState('');
    const [image,setImage]=useState(null);
    const [imgUrl,setImgUrl]=useState('');
    const [progress,setProgress]=useState(0);

    const handleChange =(e) => {
        if(e.target.files[0]) {
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
                 storage.ref("images")
                 .child(image.name)
                 .getDownloadURL()
                 .then(url => {
                     db.collection("posts").add({
                         timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                         caption: caption,
                         imgPost:url,
                         location: loc,
                         username: user

                     });
                     setImgUrl(url);
                 })
             }
        )
    }

    return (
        <div>
        <IconButton onClick={setOpen(true)}>
        <AddCircle />
        </IconButton>
        
             <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        { 
          <div style={modalStyle} className={classes.paper}>
          <img 
        className="logo" 
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 

        alt="Logo"
        />

        
        {
            imgUrl?(
               <div> <img 
        className="logo" 
        src={imgUrl} 
        style={{objectFit:'contain'}}
        /> 
        <IconButton onClick={setImgUrl('')}>
        <Delete />
        </IconButton> 
        </div>

            ):
            (
                <div><input
        accept="image/*"
        type="file"
        onChange={handleChange}
       />
       <LinearProgress variant="determinate" value={progress} />
       </div>
            )
        }


       <TextField value={caption} type='text' id="outlined-basic" label="Caption" variant="outlined" onChange={(e) => setCaption(e.target.value)} />
       <TextField value={loc} type='text' id="outlined-basic" label="Location" variant="outlined" onChange={(e) => setLoc(e.target.value)}/>
       <Button variant="contained" onClick={handleUpload} color="primary">
         Post
        </Button> 
          
        
    </div>}
      </Modal>

        </div>
    )
}

export default ImageUpload
