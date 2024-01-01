import mongoose from "mongoose";
import { UserInterface } from "../models/User.interface";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    }
});

export default mongoose.model<UserInterface>('User', userSchema);
