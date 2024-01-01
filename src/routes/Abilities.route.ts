import { Router } from "express";
import AbilitiesModel from '../collections/Abilities.collection';
import { getUnpackedSettings } from "http2";

const router = Router();
const ONE = 1;

// Es un servicio que me trae a todas las habilities.
router.get('/', async (req, res) => {
    const allAbilities = await AbilitiesModel.find({}).lean().exec();
    res.status(200).json(allAbilities);
});

// Es un servicio para crear una ability
router.post('/', async (req, res) => {
    let current_id = await AbilitiesModel.find({}).select({id: 1}).sort({ id: -1 }).limit(1).lean().exec();

    let next_id;
    if (current_id.length === 0 || current_id === undefined) {
        next_id = 0
    } else {
        next_id = current_id[0].id.valueOf() + ONE;
    }
    console.log("Max ID for Abilities is now: $d", next_id);

    const ability = await AbilitiesModel.create({
        id: next_id,
        name: req.body.name,
        description: req.body.description,
    });
    res.status(201).json(ability);
});

export default router;
