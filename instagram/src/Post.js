import React from 'react'
import './post.css'
import Avatar from '@material-ui/core/Avatar';
import {IconButton,Menu, MenuItem} from '@material-ui/core';
import {MoreVert } from '@material-ui/icons';
import { db } from './firebase';
  

function Post(props) {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const deletePost = (event) => {
        event.preventDefault()
        if (props.user===props.username){
            db.collection("posts").doc(props.id).delete()
        .catch((error) => alert(error.message))
        }
        else{
            alert("You can delete only your own post !")
        }
        
        
        handleClose()
    }

    return (
        <div className='post'>
        <div className='post__header'>
            <div className='post__headR'>
            <Avatar alt={props.username} src={props.imgProfile} />
            <div className='post__hcnt'>
                <h4 style={{fontWeight:'600'}} className='post__username'>{props.username}</h4>
                <p style={{fontSize:'0.68em'}}>{props.location}</p>
            </div>
            </div>
            <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <MoreVert />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Edit Post</MenuItem>
                <MenuItem onClick={deletePost}>Delete Post</MenuItem>
            </Menu>
        </div>
         
        <img className='post__img'
        src={props.imgPost}
         
        />
        <p className='post__cnt' style={{fontSize:'0.88em'}}>
         <span style={{fontWeight:'600'}}>{props.username}</span> {props.caption} 
        </p>
        {/* <p  style={{fontSize:'0.88em',color:'gray'}}>{Date(props.timestamp)}</p> */}
            
        </div>
    )
}

export default Post
