import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null;
        const response = await cloudinary.v2.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("File is uploaded ",response.url);
        return response;
    } catch(error){
        fs.unlinkSync(localFilePath);  //remove the locally saved temp file when upload fails
        return null;
    }
}

export {uploadOnCloudinary};