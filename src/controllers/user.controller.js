import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res)=>{
    /* steps for registering user:
    1. get user details from frontend 
    2. validation - not empty
    3. check if user already exists - username, email
    4. check for images, avatar
    5. upload them to cluodinary, avatar
    6. create user obejct, create entry in db
    7. remove password and refresh token from response
    8. return res
    */

    const {username, email, fullName, password} = req.body;
    if(
        [username,email,fullName,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required!");
    }

    const existedUser = User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"Username or email already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required!");
    }

    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar is required!");
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError (500,"Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully!")
    )

}) 

export {registerUser};