import React from 'react'
import { useState,useEffect, createContext} from 'react';

export const UserContext = createContext();


export const UserProvider = props => {

    const [user,setUser]=useState(null);

    return(
        <UserContext.Provider value={[user, setUser]}>
            {props.children}
        </UserContext.Provider>
    ); 
}