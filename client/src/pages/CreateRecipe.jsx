import React, { useState } from 'react'
import API from "../Api"
import { useNavigate, Link } from "react-router-dom";

function CreateRecipe() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        recipeName: "",
        ingredients: "",
        steps: "",
        cookingTime: "",
        difficulty: "easy",
        foodType: [],
        nutrition: { calories: "", protein: "", carbs: "" }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in form.nutrition) {
            setForm({ ...form, nutrition: { ...form.nutrition, [name]: value } });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleFoodType = (type) => {
        setForm(prev => ({
            ...prev,
            foodType: prev.foodType.includes(type)
                ? prev.foodType.filter(t => t !== type)
                : [...prev.foodType, type]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const payload = {
                recipeName: form.recipeName,
                ingredients: form.ingredients.split(",").map(i => i.trim()).filter(Boolean),
                steps: form.steps.split("\n").map(s => s.trim()).filter(Boolean),
                cookingTime: form.cookingTime ? Number(form.cookingTime) : undefined,
                difficulty: form.difficulty,
                foodType: form.foodType,
                nutrition: {
                    calories: Number(form.nutrition.calories) || 0,
                    protein: Number(form.nutrition.protein) || 0,
                    carbs: Number(form.nutrition.carbs) || 0,
                }
            };
            await API.post("/recipes/create", payload);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create recipe.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Create Recipe</h1>
                        <p className="text-slate-500 mt-1">Add a new recipe to the collection</p>
                    </div>
                    <Link to="/dashboard">
                        <button className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition text-sm">
                            ← Back
                        </button>
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
                )}

                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        <div>
                            <label className="text-sm font-medium text-slate-700">Recipe Name *</label>
                            <input
                                type="text"
                                name="recipeName"
                                value={form.recipeName}
                                onChange={handleChange}
                                placeholder="e.g. Spaghetti Carbonara"
                                className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700">Ingredients * <span className="text-slate-400 font-normal">(comma-separated)</span></label>
                            <input
                                type="text"
                                name="ingredients"
                                value={form.ingredients}
                                onChange={handleChange}
                                placeholder="e.g. eggs, pasta, bacon, cheese"
                                className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700">Steps * <span className="text-slate-400 font-normal">(one step per line)</span></label>
                            <textarea
                                name="steps"
                                value={form.steps}
                                onChange={handleChange}
                                placeholder={"Boil water\nCook pasta\nMix eggs and cheese\nCombine everything"}
                                rows={5}
                                className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition resize-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700">Cooking Time (mins)</label>
                                <input
                                    type="number"
                                    name="cookingTime"
                                    value={form.cookingTime}
                                    onChange={handleChange}
                                    placeholder="30"
                                    min="1"
                                    className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Difficulty *</label>
                                <select
                                    name="difficulty"
                                    value={form.difficulty}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition bg-white"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Food Type</label>
                            <div className="flex gap-3">
                                {["veg", "vegan", "keto"].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => handleFoodType(type)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${form.foodType.includes(type)
                                            ? "bg-cyan-500 text-white border-cyan-500"
                                            : "bg-white text-slate-600 border-slate-300 hover:border-cyan-400"}`}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Nutrition (optional)</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[["calories", "Calories (kcal)"], ["protein", "Protein (g)"], ["carbs", "Carbs (g)"]].map(([key, label]) => (
                                    <div key={key}>
                                        <label className="text-xs text-slate-500">{label}</label>
                                        <input
                                            type="number"
                                            name={key}
                                            value={form.nutrition[key]}
                                            onChange={handleChange}
                                            placeholder="0"
                                            min="0"
                                            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 transition text-white font-semibold py-3 rounded-xl shadow-lg shadow-cyan-200"
                        >
                            {loading ? "Creating..." : "Create Recipe"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateRecipe;
