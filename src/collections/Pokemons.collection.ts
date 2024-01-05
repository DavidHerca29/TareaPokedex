import mongoose from "mongoose";
import { PokemonsInterface } from "../models/Pokemons.interface";

const pokemonsSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        require: true,
        index: true,
    },
    name: {
        type: String,
        unique: true,
        require: true,
        index: true,
    },
    description: { 
        type: String, 
        require: true, 
    },
    primaryType: {
        type: String,
        required: true,
    },
    secondaryType: {
        type: String,
    },
    abilities: [{ 
        type: String, 
        ref: 'Abilities' 
    }]
});

export default mongoose.model<PokemonsInterface>("Pokemons", pokemonsSchema);
