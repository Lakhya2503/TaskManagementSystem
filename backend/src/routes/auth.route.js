import { Router } from "express";
import {
        changeCurrentPassword,
        forgotPasswordRequest,
        registerUser,
        resetForgotPassword,
        updateAvatar,
        updateUserProfileFileds,
        userFetch,
        userLoggedIn,
        userLoggedOut
  }  from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/multer.middleware.js";


const router = Router()


router.route("/user/register").post(registerUser)

router.route("/user/login" ).post(userLoggedIn)

router.route("/user/logout").post(verifyJWT, userLoggedOut)

router.route("/user/fetch").get(verifyJWT, userFetch)

router.route("/user/update-profile").put(verifyJWT, updateUserProfileFileds)

router.route("/user/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/user/update-avatar").put(uploadImage.fields(
  [
    {
      name : "avatar",
      maxSize: 1
    }
  ]
),verifyJWT, updateAvatar)

router.route('/user/forgot-password-request').post(forgotPasswordRequest)

router.route("/user/reset-password").post(resetForgotPassword)

export default router;
