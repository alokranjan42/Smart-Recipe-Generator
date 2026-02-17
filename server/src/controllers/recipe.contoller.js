 import { Recipe } from '../models/recipe.models.js'
import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'

const getAllRecipes = asyncHandler(async (req, res) => {
    const recipes = await Recipe.find();
    return res.status(200)
        .json(new ApiResponse(200, recipes, "recipes fetched"))
})

// Corrected matchRecipes logic
const matchRecipes = asyncHandler(async (req, res) => {
    const { ingredients } = req.body
    if (!ingredients || !Array.isArray(ingredients)) {
        throw new ApiError(400, "Ingredients must be an array")
    }

    // Convert input ingredients to lowercase once for efficiency
    const inputIngredients = ingredients.map(i => i.toLowerCase().trim());
    
    const recipes = await Recipe.find();

    const matchingRecipes = recipes.map((recipe) => {
        // Ensure recipe.ingredients exists before filtering
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
        .json(new ApiResponse(200, sortedRecipes, "fetched matched Recipe"))
});

const recipeFilter = asyncHandler(async (req, res) => {
    const { difficulty, diet, time } = req.query;
    const filter = {}
    
    if (difficulty) filter.difficulty = difficulty;
    if (diet) filter.diet = diet;
    if (time) filter.cookingTime = { $lte: Number(time) };

    const recipes = await Recipe.find(filter); // Renamed internal var to plural for clarity
    return res.status(200)
        .json(new ApiResponse(200, recipes, "recipe fetched"))
})

const saveRecipe = asyncHandler(async (req, res) => {
    const user = req.user;
    const recipeId = req.params.id;

    if (!recipeId) {
        throw new ApiError(400, "Recipe ID is required");
    }

    // Use .toString() to compare ObjectIds correctly
    if (!user.savedRecipes.map(id => id.toString()).includes(recipeId)) {
        user.savedRecipes.push(recipeId);
        await user.save({ validateBeforeSave: false });
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
        throw new ApiError(404, "recipe not found");
    }

    // Check if user already rated (Optional but good for 4th year project)
    const existingRating = recipe.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (existingRating) {
        existingRating.rating = rating; // Update existing
    } else {
        recipe.ratings.push({
            user: req.user._id,
            rating
        });
    }

    await recipe.save();

    return res.status(200)
        .json(new ApiResponse(200, null, "recipe rated successful"))
})

export {
    getAllRecipes,
    matchRecipes,
    recipeFilter,
    saveRecipe,
    rateRecipe
}