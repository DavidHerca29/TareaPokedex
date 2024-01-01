import { Router } from "express";
import PokemonsModel from "../collections/Abilities.collection";
import AbilitiesModel from "../collections/Abilities.collection";
import { error } from "console";

const router = Router();

// Es un servicio que me trae a todos los pokemons.
router.get("/", async (req, res) => {
    const allPokemons = await PokemonsModel.find({}).lean().exec();
    res.status(200).json(allPokemons);
});

router.get("/:pokedexNumber", async (req, res) => {
    const { pokedexNumber } = req.params;
    const pokemon = await PokemonsModel.find({ pokedexNumber }).lean().exec();

    if (pokemon.length === 0) {
        res.status(404).json({
            message: `There are no Pokemons with PokedexID: ${pokedexNumber}`,
        });
    } else {
        res.status(200).json(pokemon[0]);
    }
});

// Es un servicio para crear un pokemon
router.post("/", async (req, res) => {
    const { name, primaryAbility, description } = req.body;
    // Check if the Pokemon with the given name already exists
    const existingPokemon = await PokemonsModel.findOne({ name }).lean().exec();
    if (existingPokemon) {
        return res
            .status(400)
            .json({ error: `Pokemon named ${name} already exists.` });
    }

    // Validate the existence of referenced abilities
    const primaryExists = await AbilitiesModel.find({
        id: { $in: primaryAbility },
    });
    if (primaryExists.length < 1) {
        return res
            .status(400)
            .json({ error: "Primary ability does not exist." });
    }

    const abilities = await PokemonsModel.find({ id: req.body.primaryAbility });

    let next_id = await PokemonsModel.find()
        .select({ id: 1, _id: 0 })
        .sort({ id: -1 })
        .limit(1)
        .exec();
    next_id = next_id[0].id + 1;
    console.log("Max ID for Pokemons is now: $d", next_id);

    var secondaryAbility = req.body.secondaryAbility;
    if (secondaryAbility === undefined) {
        console.log("No secondary ability provided!");
        secondaryAbility = -1;
    } else {
        console.log("Y - Secondary ability provided!");

        const secondaryExists = await AbilitiesModel.find({
            id: { $in: secondaryAbility },
        });
        if (secondaryExists.length < 1) {
            return res
                .status(400)
                .json({ error: "Secondary ability does not exist." });
        }
        secondaryAbility = req.body.secondaryAbility;
    }

    const person = await PokemonsModel.create({
        id: next_id,
        name: req.body.name,
        description: req.body.description,
        abilities: {
            primary: req.body.primaryAbility,
            secondary: secondaryAbility,
        },
    });
    res.status(201).json(person);
});

router.put("/:pokedexNumber", async (req, res) => {
    const { secondaryAbility } = req.body;
    if (secondaryAbility !== undefined) {
        PokemonsModel.updateOne(
            { id: req.params.pokedexNumber },
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    abilities: {
                        primary: req.body.primaryAbility,
                        secondary: secondaryAbility,
                    },
                },
            }
        ).exec().then(() => {
            res.status(202).json({message: 'Pokemon modified!'})
        }).catch(error => {
            res.status(406).json({error})
        })
    }

    await PokemonsModel.updateOne(
        { id: req.params.pokedexNumber },
        {
            $set: {
                name: req.body.name,
                description: req.body.description,
                abilities: {
                    primary: req.body.primaryAbility,
                },
            },
        }
    ).exec().then(() => {
        res.status(202).json({message: 'Pokemon modified!'});
    }).catch(error => {
        res.status(406).json({error});
    });
});

router.delete('/:pokedexNumber', async (req, res) => {
    await PokemonsModel.deleteOne({ id: req.params.pokedexNumber});
    res.status(202).json({ message: ''});
})

export default router;
