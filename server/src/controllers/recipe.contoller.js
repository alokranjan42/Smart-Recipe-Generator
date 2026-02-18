import { Recipe } from '../models/recipe.models.js'
import { User } from '../models/user.models.js'
import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'

const getAllRecipes = asyncHandler(async (req, res) => {
    const recipes = await Recipe.find();
    return res.status(200)
        .json(new ApiResponse(200, recipes, "Recipes fetched"))
})

const createRecipe = asyncHandler(async (req, res) => {
    const { recipeName, ingredients, steps, nutrition, foodType, cookingTime, difficulty } = req.body;

    if (!recipeName || !ingredients || !steps || !difficulty) {
        throw new ApiError(400, "recipeName, ingredients, steps and difficulty are required");
    }

    const recipe = await Recipe.create({
        recipeName,
        ingredients,
        steps,
        nutrition: nutrition || {},
        foodType: foodType || [],
        cookingTime,
        difficulty
    });

    return res.status(201)
        .json(new ApiResponse(201, recipe, "Recipe created successfully"))
})

const getSavedRecipes = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('savedRecipes');
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200)
        .json(new ApiResponse(200, user.savedRecipes, "Saved recipes fetched"))
})

const matchRecipes = asyncHandler(async (req, res) => {
    const { ingredients } = req.body
    if (!ingredients || !Array.isArray(ingredients)) {
        throw new ApiError(400, "Ingredients must be an array")
    }
    const inputIngredients = ingredients.map(i => i.toLowerCase().trim());
    const recipes = await Recipe.find();
    const matchingRecipes = recipes.map((recipe) => {
        const recipeIngs = recipe.ingredients || [];
        const matchingIngredients = recipeIngs.filter((item) =>
            inputIngredients.includes(item.toLowerCase().trim())
        );
        const score = recipeIngs.length > 0 ? matchingIngredients.length / recipeIngs.length : 0;
        return { recipe, score }
    });
    const sortedRecipes = matchingRecipes
        .filter((p) => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.recipe);
    return res.status(200)
        .json(new ApiResponse(200, sortedRecipes, "Matched recipes fetched"))
});

const recipeFilter = asyncHandler(async (req, res) => {
    const { difficulty, diet, time } = req.query;
    const filter = {}
    if (difficulty) filter.difficulty = difficulty;
    if (diet) filter.diet = diet;
    if (time) filter.cookingTime = { $lte: Number(time) };
    const recipes = await Recipe.find(filter);
    return res.status(200)
        .json(new ApiResponse(200, recipes, "Recipes fetched"))
})

const saveRecipe = asyncHandler(async (req, res) => {
    const user = req.user;
    const recipeId = req.params.id;

    if (!recipeId) {
        throw new ApiError(400, "Recipe ID is required");
    }

    // Reload user with savedRecipes to avoid stale data
    const fullUser = await User.findById(user._id);
    const savedIds = fullUser.savedRecipes ? fullUser.savedRecipes.map(id => id.toString()) : [];

    if (!savedIds.includes(recipeId)) {
        fullUser.savedRecipes.push(recipeId);
        await fullUser.save({ validateBeforeSave: false });
    }

    return res.status(200)
        .json(new ApiResponse(200, null, "Recipe saved"))
})

const rateRecipe = asyncHandler(async (req, res) => {
    const recipeId = req.params.id;
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
        throw new ApiError(400, "Please provide a rating between 1 and 5");
    }
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        throw new ApiError(404, "Recipe not found");
    }
    const existingRating = recipe.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (existingRating) {
        existingRating.value = rating;
    } else {
        recipe.ratings.push({ user: req.user._id, value: rating });
    }
    await recipe.save();
    return res.status(200)
        .json(new ApiResponse(200, null, "Recipe rated successfully"))
})

export { getAllRecipes, createRecipe, getSavedRecipes, matchRecipes, recipeFilter, saveRecipe, rateRecipe }
