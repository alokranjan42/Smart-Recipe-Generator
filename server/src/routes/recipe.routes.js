import {Router } from 'express'
import { 
    saveRecipe,
    rateRecipe,
    getAllRecipes} from '../controllers/recipe.contoller.js'

    const router=Router()

    router.route("/save/:id").post(saveRecipe)
    router.route("/rate/:id").post(rateRecipe)
    router.route("/get").get(getAllRecipes)


    export default router



 