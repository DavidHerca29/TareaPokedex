import mongoose from 'mongoose';
import express, { Request, Response } from 'express';

// Routes
import AbilitiesRouter from './routes/Abilities.route';
import UserRouter from './routes/User.route';
import PokemonsRouter from './routes/Pokemons.route'


const app = express();
const port = 3000;

app.use(express.json()); // <- Esta linea permite que se accese el body

app.use('/users', UserRouter);
app.use('/abilities', AbilitiesRouter);
app.use('/pokemon', PokemonsRouter);

// const authenticationMiddleware = (req: Request, result: Response, next: () => any) => {
//     if (req.headers.authorization === 'Basic andres:obando') {
//         next();
//     }
//     else {
//         return result.status(401).json({ message: 'El usuario no esta autorizado' });
//     }
// }

const connectionString: string = 'mongodb+srv://dahercal29:KwCNLLaG75x9PEV7@pokecluster.wof8j1x.mongodb.net/Pokedex';

const main = async () => {
    await mongoose.connect(connectionString);

    app.listen(port, () => {
        console.log(`La aplicación está escuchando en el puerto ${port}`);
    });
};

main();

