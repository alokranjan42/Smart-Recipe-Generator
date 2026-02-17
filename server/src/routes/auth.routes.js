import {Router } from 'express'

import {registerUser,
    getUser,
    deleteUser,
    logoutUser,
    refreshToken,
    loginUser} from '../controllers/auth.controllers.js'

    const router=Router()

    router.route("/login").post(loginUser)
    router.route("/registerUser").post(registerUser)
    router.route("/logout").post(logoutUser)
    router.route("/deleteUser").post(deleteUser)
    router.route("/ getUser").get( getUser)
    router.route("/refreshToken").post(refreshToken)


    export default router