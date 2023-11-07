import User from "../models/userModel";
import AppError from "../utils/AppError";
import config from "../config";
import MaterialDonation from "../models/materialDonationsModel";
import MonetaryDonation from "../models/monetaryDonationsModel";
import bcrypt from "bcrypt";

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

    res.status(200).json(materialDonation);
  } catch (error) {
    next(error);
  }
};
