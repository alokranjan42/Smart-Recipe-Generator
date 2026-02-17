import React from 'react'
import axios from 'axios'
import {createContext,useContext,useState} from 'react'
import API from '../Api.js'

const AuthContext=createContext();

export const AuthProvider=({children}) =>{
    const [user,setUser]=useState(null);

    const register=async(data)=>{
        const response=await axios.post('/auth/registerUser',data);
        setUser(response.data.data);

    }

    const login=async(data)=>{
        const response=await axios.post('/auth/loginUser',data);
        setUser(response.data.data);
    }
    const logout=async()=>{
        await API.post("/auth/logoutUser");
        setUser(null);
    }
  return (
     <AuthContext.Provider value={{user,register,logout,login}}>
     {children}
     </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);