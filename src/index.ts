// Creado por Kevin Quesada Jiménez - 2020096838 y David Hernandez Calvo - 2020041924

import mongoose from 'mongoose';
import express, { Request, Response } from 'express';

// Routes
import AbilitiesRouter from './routes/Abilities.route';
import UserRouter from './routes/User.route';
import PokemonsRouter from './routes/Pokemons.route'

import { authenticationMiddleware } from './middleware';


const app = express();
const port = 3000;

app.use(express.json());

app.use('/users', UserRouter);
app.use('/abilities',authenticationMiddleware, AbilitiesRouter);
app.use('/pokemon', authenticationMiddleware, PokemonsRouter);


const connectionString: string = 'mongodb+srv://dahercal29:KwCNLLaG75x9PEV7@pokecluster.wof8j1x.mongodb.net/Pokedex';

const main = async () => {
    await mongoose.connect(connectionString);

    app.listen(port, () => {
        console.log(`App loaded and listening on port: ${port}`);
    });
};

main();

