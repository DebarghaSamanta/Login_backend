import  registerUser  from "../Controllers/register.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.js";


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
export default router