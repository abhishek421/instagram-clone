import React from 'react'
import { useState,useEffect,useContext} from 'react';
import {UserContext} from './userContext';
import Home from './Home';
import Auth from './Auth';

function App() {
  const [user,setUser] = useContext(UserContext);

  return (
      <div>
      {
        user?
        <Home />
        :
        <Auth />
      }
      </div>
  )
}

export default App
