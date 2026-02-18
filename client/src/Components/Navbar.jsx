import React from 'react'
import {Link} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Navbar=() =>{   

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
  <nav className="bg-blue-800 flex p-9 text-white shadow-md">
   <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center w-full text-lg">
     <Link to="/" className="hover:text-gray-200 transition pr-4">Home</Link>
     {user && (
       <>
         <Link to="/create" className="hover:text-gray-200 transition pr-4">Create Recipe</Link>
         <Link to="/dashboard" className="hover:text-gray-200 transition pr-4">Dashboard</Link>
          <Link to="/airecipe" className="hover:text-gray-200 transition pr-4">Generate  with Ai</Link>
         <button onClick={handleLogout} className="hover:text-gray-200 transition pr-4">Logout</button>
       </>
     )}
     {!user && (
       <>
         <Link to="/register" className="hover:text-gray-200 transition pr-4">Register</Link>
         <Link to="/login" className="hover:text-gray-200 transition pr-4">Login</Link>
       </>
     )}
   </div>
  </nav>
  )
}

export default Navbar
