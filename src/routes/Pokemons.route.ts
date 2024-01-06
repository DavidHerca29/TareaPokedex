import { Router } from "express";
import PokemonsModel from "../collections/Pokemons.collection";
import AbilitiesModel from "../collections/Abilities.collection";
import { error } from "console";

const router = Router();

// Servicio para obtener todos los pokemons.
router.get("/", async (req, res) => {
    try {
        const allPokemons = await PokemonsModel.find({}).sort({ id: 1 }).lean().exec();
        res.status(200).json(allPokemons);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener todos los pokemon', error: error });
    }
    
});

// Servicio para obtener un pokemon por id
router.get("/:pokedexNumber", async (req, res) => {
    try {
        const { pokedexNumber } = req.params;
        const pokemon = await PokemonsModel.find({ id: pokedexNumber }).lean().exec();

        if (pokemon.length === 0) {
            res.status(404).json({
                message: `No hay pokemon con esta PokedexID: ${pokedexNumber}`,
            });
        } else {
            res.status(200).json(pokemon[0]);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el pokemon por id', error: error });
    }
});

// Servicio para crear un pokemon
router.post("/", async (req, res) => {
    
    try {
        let requestedAbilities = req.body.abilities || [];

        const abilitiesCheck = await Promise.all(
            requestedAbilities.map(async (abilityName: string) => {
                const ability = await AbilitiesModel.findOne({ name: abilityName });
                return ability !== null && ability !== undefined;
            })
        );

        if (abilitiesCheck.includes(false)) {
            return res.status(400).json({ message: 'Una o más habilidades proporcionadas no existen.' });
        }
        

        const person = await PokemonsModel.create({
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            primaryType: req.body.primaryType,
            secondaryType: req.body.secondaryType,
            abilities: req.body.abilities
        });
        res.status(201).json(person);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pokemon', error: error });
    }
});

// Servicio para modificar un pokemon
router.put("/:pokedexNumber", async (req, res) => {

    let requestedAbilities = req.body.abilities || [];

    const abilitiesCheck = await Promise.all(
        requestedAbilities.map(async (abilityName: string) => {
            const ability = await AbilitiesModel.findOne({ name: abilityName });
            return ability !== null && ability !== undefined;
        })
    );

    if (abilitiesCheck.includes(false)) {
        return res.status(400).json({ message: 'Una o más habilidades proporcionadas no existen.' });
    }

    await PokemonsModel.updateOne(
        { id: req.params.pokedexNumber },
        {
            $set: {
                name: req.body.name,
                description: req.body.description,
                primaryType: req.body.primaryType,
                secondaryType: req.body.secondaryType,
                abilities: req.body.abilities,
            },
        }
    ).exec().then(() => {
        res.status(202).json({message: 'Pokemon modificado!'});
    }).catch(error => {
        res.status(406).json({error});
    });
});


// Servicio para eliminar un pokemon
router.delete('/:pokedexNumber', async (req, res) => {
    try {
        await PokemonsModel.deleteOne({ id: req.params.pokedexNumber});
        res.status(202).json({ message: 'El pokemon se eliminó con éxito!' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el pokemon', error: error });
    }
})

export default router;
