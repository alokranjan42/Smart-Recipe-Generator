import React from 'react'
import {useState} from 'react'
import API from "../Api"
import { useNavigate } from "react-router-dom";

function CreateRecipe() {

    const [recipeName,setRecipeName]=useState("");
    const navigate=useNavigate();

    const createRecipe=async(e)=>{
     e.preventDefault(); 
     try{
        await API.post("/createRecipe",{recipeName});
        navigate("/");

     }catch(error){
        console.log("error occured while creating recipe",error);
     }
    }
     
  return (
    <div>
        <h1 className="">CreateRecipe</h1>
        <form onSubmit={createRecipe}>
            <input type="text"  
            placeholder="enter the recipe want to create"
            onChange={(e)=>setRecipeName(e.target.value)}
            className=" "
            />
            <button>create Now </button>
        </form>

    </div>
  )
}

export default CreateRecipe