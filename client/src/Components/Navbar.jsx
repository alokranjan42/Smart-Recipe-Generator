import {Link} from 'react-router-dom'
import React from 'react'

function Navbar() {   
  return (
  <nav className="bg-blue-800 flex p-9 text-white shadow-md">
   <div className="max-w-6xl mx-auto px-6 py-4 flex justofy-between justify-center text-lg">
     <Link to="/"  className="hover:text-gray-200 transition pr-4">Home</Link>
    <Link to="/profile" className="hover:text-gray-200 transition pr-4">profile</Link>
    <Link to="/register" className="hover:text-gray-200 transition pr-4">register</Link>
    <Link to="/saved" className="hover:text-gray-200 transition pr-4">saved</Link>
   </div>
  </nav>
  )
}

export default Navbar