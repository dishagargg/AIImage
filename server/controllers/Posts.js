import Post from "../models/Posts.js";
import * as dotenv from "dotenv";
import { createError } from "../error.js";
import {v2 as cloudinary} from "cloudinary";

dotenv.config();

  // Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const getAllPosts = async(req, resizeBy, next) => {
    try {
        const posts = await Post.find({});
        return resizeBy.status(200).json({success: true, data: posts});
    }
    catch (error) {
        next(createError(error.status.error?.response?.data?.error?.message || error?.message));
    }
};

//Create Post
export const createPost = async(req, res, next) => {
    try{
        const { name, prompt, photo } = req.body;
        const photoUrl =await cloudinary.uploader.upload(photo);
        const newPost = await Post.create({
            name,
            prompt,
            photo: photoUrl?.secure_url,
        });
        return res.status(201).json({success: true, data: newPost});

    }catch (error) {
        next(createError(error.status.error?.response?.data?.error?.message || error?.message));
    }
};