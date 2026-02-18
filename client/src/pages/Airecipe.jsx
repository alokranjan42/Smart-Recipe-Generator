import React, { useState, useRef } from "react";
import API from "../Api";

function AiRecipe() {
  const [ingredients, setIngredients] = useState("");
  const [diet, setDiet] = useState("none");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await API.post("/ai/recipeGenerator", { ingredients, diet });
      setResult(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await API.post("/ai/ingredientsDetector", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIngredients(res.data.data);
    } catch {
      setError("Could not detect ingredients from image");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">AI Recipe Generator</h1>
      <p className="text-gray-500 text-sm mb-6">Enter what you have and get recipe ideas</p>

      <form onSubmit={handleGenerate} className="flex flex-col gap-4">

        <div>
          <label className="block text-sm text-gray-700 mb-1">Ingredients</label>
          <textarea
            rows={3}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g. eggs, onion, tomato..."
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Diet</label>
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none bg-white"
          >
            <option value="none">No preference</option>
            <option value="veg">Vegetarian</option>
            <option value="vegan">Vegan</option>
            
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Or upload a food photo</label>
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleImage}
            className="text-sm text-gray-600"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Recipes"}
        </button>

      </form>

      {loading && (
        <p className="text-gray-500 text-sm mt-6">Generating recipes...</p>
      )}

      {result && !loading && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Recipes</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-7">{result}</pre>
        </div>
      )}
    </div>
  );
}

export default AiRecipe;
