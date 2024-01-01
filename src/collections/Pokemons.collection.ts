import mongoose from "mongoose";
import { PokemonsInterface } from "../models/Pokemons.interface";

const pokemonsSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    description: { type: String, require: true },
    abilities: 
        {
            primary: { type: Number, require: true },
            secondary: {
                type: Number,
                default: -1,
                require: false,
            },
        },
});

export default mongoose.model<PokemonsInterface>("Pokemons", pokemonsSchema);
