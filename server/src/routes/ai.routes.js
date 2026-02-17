import {Router} from 'express'
import {
    generateRecipeByAi,
    ingredientsdetector

} from '../controllers/ai.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
const router=Router()

router.route('/recipeGenerator').post(generateRecipeByAi)
router.route("/ingredientsDetector").post(
  upload.single("image"),
  ingredientsdetector
);


 export default router

