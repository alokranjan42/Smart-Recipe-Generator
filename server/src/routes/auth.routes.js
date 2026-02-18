import { Router } from 'express'
import {
    registerUser,
    getUser,
    deleteUser,
    logoutUser,
    refreshToken,
    loginUser
} from '../controllers/auth.controllers.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/login").post(loginUser)
router.route("/registerUser").post(registerUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/deleteUser/:id").post(verifyJWT, deleteUser)
router.route("/me").get(verifyJWT, getUser)
router.route("/refreshToken").post(refreshToken)

export default router
