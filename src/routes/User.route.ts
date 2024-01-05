import { Router } from "express";
import UserModel from '../collections/User.collection';

const router = Router();

// Servicio para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const allPeople = await UserModel.find({}).lean().exec();
        res.status(200).json(allPeople);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener todos los usuarios', error: error });
    }
});

// Servicio para obtener un usuario por su username
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const peopleWithThatUsername = await UserModel.find({ username }).lean().exec();

        if (peopleWithThatUsername.length === 0) {
            res.status(404).json({ message: `No hay personas con el username ${username}` });
        } else {
            res.status(200).json(peopleWithThatUsername[0]);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario por username', error: error });
    }
});

// Servicio para crear un usuario
router.post('/', async (req, res) => {
    try {
        const person = await UserModel.create({
            username: req.body.username,
            password: req.body.password,
        });
        res.status(201).json(person);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error: error });
    }
});

// Servicio para modificar un usuario
router.put('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        await UserModel.updateOne({ username: username }, { $set: { password: req.body.password } });
        res.status(202).json({ message: 'El usuario se modificó con éxito!' });
    } catch (error) {
        res.status(500).json({ message: 'Error al modificar el usuario', error: error });
    }
});

// Servicio para eliminar un usuario
router.delete('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        await UserModel.deleteOne({ username: username });
        res.status(202).json({ message: 'El usuario se eliminó con éxito!' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error });
    }
});

export default router;
