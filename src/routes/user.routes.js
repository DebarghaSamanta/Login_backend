import  {registerUser,loginUser,logoutUser,updateAccountDetails,getCurrentUser,changeCurrentPassword  } from "../Controllers/register.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/register").post(upload.fields([
    {
        name:"Adharphoto",//Same feild name should be there in frontend label
        maxCount:1
    },
    {
        name:"govtIdProof",//Same feild name should be there in frontend label
        maxCount:1
    },
    {
        name:"licenseDocument",//Same feild name should be there in frontend label
        maxCount:1
    }
    ]),
    registerUser)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/updateaccountdetails").post(verifyJWT,  updateAccountDetails)
router.route("/getcurrentuser").post(verifyJWT,  getCurrentUser)
router.route("/changepassword").post(verifyJWT,  changeCurrentPassword)

export default router