import { Router } from 'express'
import {
    saveRecipe,
    rateRecipe,
    getAllRecipes,
    createRecipe,
    getSavedRecipes
} from '../controllers/recipe.contoller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/get").get(getAllRecipes)
router.route("/create").post(verifyJWT, createRecipe)
router.route("/saved").get(verifyJWT, getSavedRecipes)
router.route("/save/:id").post(verifyJWT, saveRecipe)
router.route("/rate/:id").post(verifyJWT, rateRecipe)

export default router
