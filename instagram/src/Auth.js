import { useState, useEffect, useContext } from "react";
import "./Auth.css";
import { auth } from "./firebase";
import { IconButton, TextField, Button } from "@material-ui/core";
import {UserContext} from './userContext';


function Auth() {

  const [user,setUser] = useContext(UserContext);
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [newUser, setNewUser] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    // setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    // setOpenSignIn(false);
  };

  return (
        <div className='auth__screen'>
                {
                    newUser?(
                        <div className='auth__login'>
                            <img className="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png" alt="Logo"/>
                            <div className='auth__input'>
                                <TextField value={username} type='email' fullWidth id="username" label="Username"  onChange={(e) => setUsername(e.target.value)} />
                                <TextField value={email} type='email' fullWidth id="email_input" label="Email-ID"  onChange={(e) => setEmail(e.target.value)} />
                                <TextField value={password} type='password' fullWidth id="pass_input" label="Password" onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            <Button type='submit' fullWidth variant="contained" disableElevation onClick={signUp} color="primary">
                                Register
                            </Button>
                            <p className='auth__Rflex'>Already Registerd?
                            <Button variant="outlined" disableElevation onClick={() => setNewUser(false)} color="primary">
                                Login
                            </Button>
                        </p>
                        </div>
                    ):
                    (
                    <div className='auth__login'>
                        <img className="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png" alt="Logo"/>
                        <div className='auth__input'>
                            <TextField value={email} type='email' fullWidth id="email_input" label="Email-ID"  onChange={(e) => setEmail(e.target.value)} />
                            <TextField value={password} type='password' fullWidth id="pass_input" label="Password" onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <Button type='submit' fullWidth variant="contained" disableElevation onClick={signIn} color="primary">
                            Login
                        </Button>
                        <p className='auth__Rflex'>New User? 
                            <Button variant="outlined" disableElevation onClick={() => setNewUser(true)} color="primary">
                                Register
                            </Button>
                        </p>
                    </div>
                    )
                }
                
        </div>
  );
}

export default Auth;
