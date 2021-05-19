import { useState,useEffect} from 'react';
import './App.css';
import { db,auth } from './firebase';
import Post from './Post'
import {Modal,IconButton,TextField,Button} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { ExitToApp } from '@material-ui/icons';
import ImageUpload from './imageUpload';


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



function App() {
  const [posts,setPosts]=useState([]);
  const [open,setOpen]=useState(false);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [username,setUsername]=useState('');
  const [openSignIn,setOpenSignIn]=useState('');
  const [user,setUser]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  useEffect( ()=>{
    db.collection('Posts').onSnapshot(snapshot=>{
    setPosts(snapshot.docs.map(doc => ({
      id: doc.id,
      post: doc.data()
    })));
    })
  }, []);


  useEffect( ()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
       if (authUser) {
         console.log(authUser);
         setUser(authUser);

       } else{
         setUser(null);
       }
    }) 
    
    return () => {
      unsubscribe();
    }
  }, [user, username]);


  const signUp = (event) => {
    event.preventDefault()
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false);
   
   }

   const signIn = (event) => {
    event.preventDefault()
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
   
   }

  return (
    <div className="App">
      
      <div className="app__header">
        
        <div>
        <img 
        className="logo" 
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 

        alt="Logo"
        />
        </div> 


        <div>

        {user ? (
          <div className='app__auth'>
          <ImageUpload user={user?.displayName}/>
          <IconButton onClick={() => auth.signOut()}>
           {'Hello, ' + user?.displayName + " "}  <ExitToApp/>
        </IconButton> 
        </div>
        ):(
          <div className='app__auth'>
          <Button variant="contained" onClick={() => setOpen(true)}>
          SignUp
        </Button>

        <Button variant="contained" onClick={() => setOpenSignIn(true)}>
         LogIn
        </Button>
        </div>
        )}
   
        
        </div>
   
      </div> 
      
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        { 
          <div style={modalStyle} className={classes.paper}>
          <img 
        className="logo" 
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 

        alt="Logo"
        />
        
       <TextField value={email} type='email' id="outlined-basic" label="Email-ID" variant="outlined" onChange={(e) => setEmail(e.target.value)} />
       <TextField value={password} type='password' id="outlined-basic" label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)}/>
       <Button type='submit' variant="contained" onClick={signIn} color="primary">
         LogIn
        </Button> 
          {/* <h4>
            New User ??? <Button type='submit' variant="text" onClick={setOpen(true)} color="primary">
         LogIn
        </Button>
          </h4> */}
        
    </div>}
      </Modal>


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
        
        
       <TextField value={username} id="outlined-basic" label="UserName" variant="outlined" onChange={(e) => setUsername(e.target.value)}/>
       <TextField value={email} type='email' id="outlined-basic" label="Email-ID" variant="outlined" onChange={(e) => setEmail(e.target.value)} />
       <TextField value={password} type='password' id="outlined-basic" label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)}/>
       <Button type='submit' variant="contained" onClick={signUp} color="primary">
          SignUp
        </Button> 

        {/* <h4>
            Already a User ??? <Button type='submit' variant="text" onClick={setOpenSignIn(true)} color="primary"> 
         LogIn
        </Button>
          </h4> */}

    </div>}
      </Modal>

      {
        posts.map(({id,post}) => (
          <Post key={id} imgPost={post.imgPost} username={post.username} caption={post.caption} imgProfile={post.imgProfile}/>
        ))
      }

    </div>
  );

}

export default App;
