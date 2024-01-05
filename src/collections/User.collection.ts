import mongoose from "mongoose";
import { UserInterface } from "../models/User.interface";

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    }
});

export default mongoose.model<UserInterface>('User', userSchema);
