import React from 'react'
import {useState,useEffect} from 'react'

function Loginpage() {
    const[login,setLogin]=useState([])

    useEffect(()=>{
        const login=async()=>{
            try {
                const response=await axios.post();
                
            } catch (error) {
                console.log("error occured while fetching data from api",error);
                
            }
        }
        login();
    },[]);
  return (
    <div>
        <form >
            <label htmlFor="email">email</label>
            <input type="text" 
             placeholder="enter email" 
             value={}
             onChange={(e)=>}
            className=""/>
            <label htmlFor="password">email</label>
            <input type="text" 
            placeholder="password"
            value={}
             onChange={(e)=>}
             className=""/>
            <button onClick={}></button>
        </form>
        
         </div>
  )
}

export default Loginpage