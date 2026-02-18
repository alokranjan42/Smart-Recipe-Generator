import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../Api'
import { useAuth } from '../Context/AuthContext'

function Dashboard() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recipesRes, savedRes] = await Promise.all([
          API.get('/recipes/get'),
          API.get('/recipes/saved')
        ]);
        setRecipes(recipesRes.data.data);
        const ids = new Set(savedRes.data.data.map(r => r._id));
        setSavedIds(ids);
      } catch (err) {
        setError("Failed to load recipes.");
        console.log("Error fetching recipes", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async (recipeId) => {
    setSavingId(recipeId);
    try {
      await API.post(`/recipes/save/${recipeId}`);
      setSavedIds(prev => new Set([...prev, recipeId]));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save recipe.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500 text-lg">Loading recipes...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back, {user?.fullname}!</p>
          </div>
          <div className="flex gap-3">
            <Link to="/saved-recipes">
              <button className="px-5 py-2 rounded-xl border border-cyan-500 text-cyan-600 font-medium hover:bg-cyan-50 transition">
                Saved Recipes
              </button>
            </Link>
            <Link to="/create">
              <button className="px-5 py-2 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition">
                + Create Recipe
              </button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">{error}</div>
        )}

        {recipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-4">No recipes yet. Be the first to create one!</p>
            <Link to="/create">
              <button className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-medium hover:bg-cyan-600 transition">
                Create Recipe
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((item) => {
              const isSaved = savedIds.has(item._id);
              return (
                <div key={item._id} className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 hover:shadow-lg transition flex flex-col">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{item.recipeName}</h3>
                  <p className="text-sm text-slate-500 mb-1">
                    <span className="font-medium">Difficulty:</span> {item.difficulty}
                  </p>
                  {item.cookingTime && (
                    <p className="text-sm text-slate-500 mb-1">
                      <span className="font-medium">Cook time:</span> {item.cookingTime} min
                    </p>
                  )}
                  {item.ingredients?.length > 0 && (
                    <p className="text-sm text-slate-500 mb-1">
                      <span className="font-medium">Ingredients:</span> {item.ingredients.slice(0, 3).join(", ")}{item.ingredients.length > 3 ? "..." : ""}
                    </p>
                  )}
                  {item.foodType?.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2 mb-3">
                      {item.foodType.map(t => (
                        <span key={t} className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto pt-3">
                    <button
                      onClick={() => !isSaved && handleSave(item._id)}
                      disabled={isSaved || savingId === item._id}
                      className={`w-full py-2 rounded-xl text-sm font-medium transition ${isSaved
                        ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
                        : "bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700"
                        }`}
                    >
                      {savingId === item._id ? "Saving..." : isSaved ? "✓ Saved" : "Save Recipe"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
