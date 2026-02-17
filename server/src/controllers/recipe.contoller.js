import {Recipe} from '../models/recipe.models.js'
import {asyncHandler} from '../utils/AsyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError} from '../utils/ApiError.js'

//creating the matchrecipe controller
const matchRecipies=asyncHandler(async(req,res)=>{
    const {ingredients}=req.body
    if(!ingredients){
        throw new ApiError(400,"missing ingredients")
    }
     const recipes=await Recipe.find();
     
    const matchingRecipies=recipes.map((recipe)=>{
        const matchingIngredients=recipe.filter((item)=>
            ingredients.includes(item.lowerCase())
        

);
const score=matchingIngredients.length/recipe.ingredients.length;
  return {recipe,score}

    });

    const sortedRecipes=matchingRecipies.filter((p)=>p.score>0)
    .sort((a,b)=>b.score-a.score)
     .map((item)=>item.recipe);

     return res.status(200)
     .json(new ApiResponse(200,sortedRecipes,"fetched matched Recipe"))

});

const recipeFilter=asyncHandler(async(req,res)=>{
    const {difficulty,diet,time}=req.query;
    const filter={}
    if(difficulty)
        filter.difficulty=difficulty;
    if(diet)
        filter.diet=diet;
    if(time)
        filter.cookingTime={lte:Number(time)};

    const recipe=await Recipe.find(filter);
    return res.status(200)
    .json(new ApiResponse(200,recipe,"recipe  fetched"))


})


const saveRecipe=asyncHandler(async(req,res)=>{
    const user=req.user;
    const recipeId=eq.params.id;


    if(!user.saveRecipes.includes(recipeId)){
        user.savedRecipe.push(recipeId);
        await user.save();

    }
  return res.status(200)
   .json(new ApiResponse(200,null,"Recipe saved"))
})


const rateRecipe=asyncHandler(async(req,res)=>{
    const recipeId=req.params.id;
    const {rating}=req.body;

    const recipe=await Recipe.findById(recipeId);
    if(!recipe){
        throw new ApiError(404,"recipe not found");
    }

    recipe.ratings.push(
      {  user: req.user._id,
        rating

      } )
      await recipe.save();


      return res.status(200)
      .json(new ApiResponse(200,"recipe rated successful",null))
})

export {
    matchRecipies,
    recipeFilter,
    saveRecipe,
    rateRecipe


}