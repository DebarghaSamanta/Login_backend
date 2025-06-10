import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js"
import { UploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"
const registerUser = asyncHandler(async (req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const {fullname,
      phoneNumber,
      emailId,
      adharNo,
      password,
      department,
      vehicleType,
      vehicleNumber,
      licenseNumber}=req.body


    //basic validation
    if(!fullname || !phoneNumber || !emailId || !adharNo || !password ||!department)
        throw new ApiError(400,"All fieds are required!")


    //check if user exists
    const existingUser = await User.findOne({ $or: [{ emailId }, { phoneNumber }, { adharNo }] })
    if(existingUser)
        throw new ApiError(409,"Existing User")
    

    //file uploading 
    const AdharUrl = req.files?.Adharphoto?.[0]
    const govtIdProofUrl = req.files?.govtIdProof?.[0]
    if(!AdharUrl || !govtIdProofUrl)
        throw new ApiError(502,"Photo required")
    const adharPhotoResult = await UploadOnCloudinary(AdharUrl.path);
    const govtIdResult = await UploadOnCloudinary(govtIdProofUrl.path);
    if(!adharPhotoResult || !govtIdResult)
        throw new ApiError(500, "File upload failed.")
    const userData = {
      fullname,
      phoneNumber,
      emailId,
      adharNo,
      password,
      department,
      Adharphoto: adharPhotoResult.url,
      govtIdProof: govtIdResult.url,
    };
    

    //for driver specifically
    if (department === "Driver") {
      const licenseDoc = req.files?.licenseDocument?.[0];
      if (!vehicleType || !vehicleNumber || !licenseNumber || !licenseDoc) {
        throw new ApiError(400, "Driver  vehicle details and license document missing");
      }

      const licenseUpload = await UploadOnCloudinary(licenseDoc.path);
      if (!licenseUpload) {
        throw new ApiError(500, "License document upload failed.");
      }

      userData.vehicleType = vehicleType;
      userData.vehicleNumber = vehicleNumber;
      userData.licenseNumber = licenseNumber;
      userData.licenseDocument = licenseUpload.url;
      userData.availabilityStatus = true;
    }
    const user = await User.create(userData);

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  // Send response
  return res.status(201).json(
    new ApiResponse(201, {
      user: userObj,
      accessToken,
      refreshToken,
    }, "User registered successfully")
  );
})

export default registerUser