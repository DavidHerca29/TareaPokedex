import mongoose from "mongoose";
import { AbilitiesInterface } from "../models/Abilities.interface";

const abilitiesSchema = new mongoose.Schema({
    id: { type: Number, unique: true, require: true, },
    name: { type: String, require: true, },
    description: { type: String, require: true, },
});

export default mongoose.model<AbilitiesInterface>('Abilities', abilitiesSchema);
