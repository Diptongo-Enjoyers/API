import Pet from "../models/petModel.js";
import AppError from "../utils/AppError.js";
import config from "../config.js";

export const getPets = async (req, res, next) => {
  try {
    const pet = await Pet.find();

    res.status(200).json(pet);
  } catch (error) {
    next(error);
  }
};

export const getPetById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pet = await Pet.findById(id);

    res.status(200).json(pet);
  } catch (error) {
    next(error);
  }
};

export const createPet = async (req, res, next) => {
  try {
    const { title, body, date, image } = req.body;

    const newPet = new Pet({
      title,
      body,
      age,
      date,
      image,
    });

    await newPet.save();

    // Enviar una respuesta al cliente
    res.status(201).json(newPet);
  } catch (err) {
    // Maneja los errores aquí
    res.status(500).json({ error: err.message });
  }
};

export const deletePet = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pet = await Pet.findByIdAndDelete(id);

    res.status(200).json(pet);
  } catch (error) {
    next(error);
  }
};
