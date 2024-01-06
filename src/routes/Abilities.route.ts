import { Router } from "express";
import AbilitiesModel from '../collections/Abilities.collection';

const router = Router();

// Servicio para obtener todas las habilidades
router.get('/', async (req, res) => {
    try {
        const allAbilities = await AbilitiesModel.find({}).lean().exec();
        res.status(200).json(allAbilities);
    } catch (error) {
        res.status(500).json({ message: 'Error when extracting all abilities', error: error });
    }
});

// Servicio para crear una habilidad
router.post('/', async (req, res) => {
    try {
        let current_id = await AbilitiesModel.find({}).select({ id: 1 }).sort({ id: -1 }).limit(1).lean().exec();

        let next_id;
        if (current_id.length === 0 || current_id === undefined) {
            next_id = 0;
        } else {
            next_id = current_id[0].id.valueOf() + 1;
        }
        console.log(`Max ID for Abilities is now: ${next_id}`);

        const ability = await AbilitiesModel.create({
            id: next_id,
            name: req.body.name,
            description: req.body.description,
        });
        res.status(201).json(ability);
    } catch (error) {
        res.status(500).json({ message: 'Error when creating ability', error: error });
    }
});

export default router;
