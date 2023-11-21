import AppError from "../utils/AppError.js";
import config from "../config.js";
import MaterialDonation from "../models/materialDonationsModel.js";
import MonetaryDonation from "../models/monetaryDonationsModel.js";

export const getMonetaryDonations = async (req, res, next) => {
  try {
    const monetaryDonations = await MonetaryDonation.find();

    res.status(200).json(monetaryDonations);
  } catch (error) {
    next(error);
  }
};

export const getMaterialDonations = async (req, res, next) => {
  try {
    const materialDonations = await MaterialDonation.find();
    res.status(200).json(materialDonations);
  } catch (error) {
    next(error);
  }
};

export const getDonations = async (req, res, next) => {
  try {
    const materialDonations = await MaterialDonation.find();
    const monetaryDonations = await MonetaryDonation.find();

    res.status(200).json({ materialDonations, monetaryDonations });
  } catch (error) {
    next(error);
  }
};

export const getMonetaryDonationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const monetaryDonation = await MonetaryDonation.findById(id);
    if (!monetaryDonation) {
      throw new AppError(404, "Donación no encontrada");
    }

    res.status(200).json(monetaryDonation);
  } catch (error) {
    next(error);
  }
};

export const getMaterialDonationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const materialDonation = await MaterialDonation.findById(id);
    if (!materialDonation) {
      throw new AppError(404, "Donación no encontrada");
    }
  } catch (error) {
    next(error);
  }
};

export const registerMonetaryDonation = async (req, res, next) => {
  try {
    if (req.user.clearance !== config.DONATOR_CLEARANCE) {
      throw new AppError(403, "No tienes permiso para realizar esta acción");
    }
    const { amount, date, userId } = req.body;

    const newMonetaryDonation = new MonetaryDonation({
      amount,
      date,
      userId,
    });

    await newMonetaryDonation.save();

    res.status(201).json(newMonetaryDonation);
  } catch (error) {
    next(error);
  }
};

export const registerMaterialDonation = async (req, res, next) => {
  try {
    const { materials, receptionDate } = req.body;

    const newMaterialDonation = new MaterialDonation({
      materials,
      creationDate: new Date(),
      receptionDate,
      status: "Pendiente",
      userId: req.user.id,
    });

    await newMaterialDonation.save();
    res.status(201).json(newMaterialDonation);
  } catch (error) {
    next(error);
  }
};

export const updateMonetaryDonation = async (req, res, next) => {
  try {
    if (
      req.user.clearance !== config.WORKER_CLEARANCE ||
      req.user.clearance !== config.ADMIN_CLEARANCE
    ) {
      throw new AppError(403, "No tienes permiso para realizar esta acción");
    }

    const { id } = req.params;
    const { amount, date } = req.body;

    const monetaryDonation = await MonetaryDonation.findById(id);
    if (!monetaryDonation) {
      throw new AppError(404, "Donación no encontrada");
    }

    monetaryDonation.amount = amount;
    monetaryDonation.date = date;

    await monetaryDonation.save();

    res.status(200).json(monetaryDonation);
  } catch (error) {
    next(error);
  }
};

export const updateMaterialDonation = async (req, res, next) => {
  try {
    if (
      req.user.clearance !== config.WORKER_CLEARANCE &&
      req.user.clearance !== config.ADMIN_CLEARANCE
    ) {
      throw new AppError(403, "No tienes permiso para realizar esta acción");
    }

    const { id } = req.params;
    const { materials, receptionDate, status } = req.body;

    const materialDonation = await MaterialDonation.findById(id);
    if (!materialDonation) {
      throw new AppError(404, "Donación no encontrada");
    }

    materialDonation.materials = materials; // Actualizar el array de materiales
    materialDonation.receptionDate = receptionDate;
    materialDonation.status = status;

    await materialDonation.save();
    res.status(200).json(materialDonation);
  } catch (error) {
    next(error);
  }
};

export const deleteMaterialDonation = async (req, res, next) => {
  try {
    if (
      req.user.clearance !== config.WORKER_CLEARANCE &&
      req.user.clearance !== config.ADMIN_CLEARANCE
    ) {
      throw new AppError(403, "No tienes permiso para realizar esta acción");
    }

    const { id } = req.params;
    await MaterialDonation.findByIdAndDelete(id);
    res.status(200).json({ message: "Donación eliminada con éxito" });
  } catch (error) {
    next(error);
  }
};

export const deleteMonetaryDonation = async (req, res, next) => {
  try {
    if (
      req.user.clearance !== config.WORKER_CLEARANCE ||
      req.user.clearance !== config.ADMIN_CLEARANCE
    ) {
      throw new AppError(403, "No tienes permiso para realizar esta acción");
    }

    const { id } = req.params;

    const monetaryDonation = await MonetaryDonation.findByIdAndDelete(id);

    res.status(200).json(monetaryDonation);
  } catch (error) {
    next(error);
  }
};
