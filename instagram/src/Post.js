import React from 'react'
import './post.css'
import Avatar from '@material-ui/core/Avatar';
function Post(props) {
    return (
        <div className='post'>
        <div className='post__header'>
        <Avatar alt={props.username} src={props.imgProfile} />
        <div className='post__hcnt'>
        <h3 className='post__username'>{props.username}</h3>
        <p>{props.location}</p>
        </div>
        
        </div>
         
        <img className='post__img'
        src={props.imgPost}
         
        />
        <p className='post__cnt'>
         <strong>{props.username}</strong> {props.caption} 
        </p>
            
        </div>
    )
}

export default Post
