import React from 'react'
import Navbar from './Components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Registerpage from './pages/Registerpage'
import LoginPage from './pages/Loginpage'
import Dashboard from './pages/Dashboard'
import CreateRecipe from './pages/CreateRecipe'
import Home from './pages/Home'
import SavedRecipes from './pages/SavedRecipes'
import ProtectedRoute from './Components/ProtectedRoute'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/register' element={<Registerpage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateRecipe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-recipes"
          element={
            <ProtectedRoute>
              <SavedRecipes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
