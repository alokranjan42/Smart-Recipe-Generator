import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../Api'
import { useAuth } from '../Context/AuthContext'

function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        setLoading(true);
       
        const response = await API.get('/recipes/saved');
        setSavedRecipes(response.data.data);
      } catch (err) {
        setError("Failed to load saved recipes.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedRecipes();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500 text-lg">Loading saved recipes...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Saved Recipes</h1>
            <p className="text-slate-500 mt-1">Your personal recipe collection</p>
          </div>
          <Link to="/dashboard">
            <button className="px-5 py-2 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-100 transition">
              ← Back to Dashboard
            </button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">{error}</div>
        )}

        {savedRecipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-4">You haven't saved any recipes yet.</p>
            <Link to="/dashboard">
              <button className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-medium hover:bg-cyan-600 transition">
                Browse Recipes
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 hover:shadow-lg transition">
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
                  <div className="mt-3">
                    <p className="text-sm font-medium text-slate-600 mb-1">Ingredients:</p>
                    <ul className="text-sm text-slate-500 list-disc list-inside space-y-0.5">
                      {item.ingredients.slice(0, 4).map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                      {item.ingredients.length > 4 && (
                        <li className="text-slate-400">+{item.ingredients.length - 4} more</li>
                      )}
                    </ul>
                  </div>
                )}
                {item.steps?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-slate-600 mb-1">Steps:</p>
                    <ol className="text-sm text-slate-500 list-decimal list-inside space-y-0.5">
                      {item.steps.slice(0, 3).map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                      {item.steps.length > 3 && (
                        <li className="text-slate-400">+{item.steps.length - 3} more steps</li>
                      )}
                    </ol>
                  </div>
                )}
                {item.foodType?.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-3">
                    {item.foodType.map(t => (
                      <span key={t} className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
                {(item.nutrition?.calories || item.nutrition?.protein || item.nutrition?.carbs) && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex gap-3 text-xs text-slate-500">
                    {item.nutrition.calories ? <span>  {item.nutrition.calories} kcal</span> : null}
                    {item.nutrition.protein ? <span>  {item.nutrition.protein}g protein</span> : null}
                    {item.nutrition.carbs ? <span>  {item.nutrition.carbs}g carbs</span> : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedRecipes;
