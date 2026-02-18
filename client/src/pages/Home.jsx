import React from 'react'
import { Link } from "react-router-dom";
import foodImg from "../assets/food.jpg";
import { useAuth } from "../Context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="relative h-screen w-full">
      <img
        src={foodImg}
        alt="food"
        className="absolute w-full h-full object-cover pt-4"
      />
      <div className="absolute w-full h-full bg-black/50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-4">
           Smart Recipe Generator
        </h1>
        <p className="text-lg mb-8 max-w-xl">
          Create, save and manage your recipes easily using AI
        </p>
        {user ? (
          <Link to="/dashboard">
            <button className="bg-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
              Go to Dashboard
            </button>
          </Link>
        ) : (
          <Link to="/register">
            <button className="bg-green-600 px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition">
              Get Started
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
