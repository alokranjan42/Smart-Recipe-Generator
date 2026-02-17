import {Router } from 'express'
import { matchRecipies,
    recipeFilter,
    saveRecipe,
    rateRecipe} from '../controllers/recipe.contoller.js'

    const router=Router()

    router.route("/recipe").post(saveRecipe)
    router.route("/recipe").get(recipeFilter)
    router.route("/recipe").post(rateRecipe)
    router.route("/recipe").post(matchRecipies)


    export default router