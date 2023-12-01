import Pet from "../models/amezcuaPetModel.js";
import AppError from "../utils/AppError.js";

export const getPets = async (req, res, next) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (error) {
    next(error);
  }
};

export const getPetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id);
    if (!pet) {
      return next(new AppError(404, "No pet was found with that ID"));
    }
    res.status(200).json(pet);
  } catch (error) {
    next(error);
  }
};

export const createPet = async (req, res, next) => {
  try {
    const { name, age, weight } = req.body;
    const newPet = new Pet({
      name,
      age,
      weight,
    });
    await newPet.save();
    res.status(201).json(newPet);
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findByIdAndDelete(id);
    if (!pet) {
      return next(new AppError(404, "No pet was found with that ID"));
    }
    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};
