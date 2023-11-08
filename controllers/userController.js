import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import config from "../config.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res, next) => {
  try {
    // Obtener todos los usuarios de la base de datos
    const users = await User.find();

    // Enviar una respuesta al cliente
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar un usuario por su ID en la base de datos
    const user = await User.findById(id);
    if (!user) {
      throw new AppError(404, "Usuario no encontrado");
    }

    // Enviar una respuesta al cliente
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError(404, "Usuario no encontrado");
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { profilePictureURL, name, username, phone, email, address } =
      req.body;

    // Buscar un usuario por su ID en la base de datos
    const user = await User.findById(id);
    if (!user) {
      throw new AppError(404, "Usuario no encontrado");
    }

    if (profilePictureURL) user.profilePictureURL = profilePictureURL;
    if (name) user.name = name;
    if (username) user.username = username;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (address) user.address = address;

    await user.save();

    // Enviar una respuesta al cliente
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.clearance !== config.ADMIN_CLEARANCE)
      throw new AppError(403, "No tienes permisos para realizar esta acción");
    const { id } = req.params;
    const { email, password, username, name, address, phone, clearance } =
      req.body;

    // Buscar un usuario por su ID en la base de datos
    const user = await User.findById(id);
    if (!user) {
      throw new AppError(404, "Usuario no encontrado");
    }

    if (email) user.email = email;
    if (username) user.username = username;
    if (name) user.name = name;
    if (address) user.address = address;
    if (phone) user.phone = phone;

    await user.save();

    // Enviar una respuesta al cliente
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError(404, "Usuario no encontrado");
    }

    user.password = await bcrypt.hash(req.body.password, 10);

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.clearance !== config.ADMIN_CLEARANCE)
      throw new AppError(403, "No tienes permisos para realizar esta acción");
    const { id } = req.params;

    // Eliminar un usuario por su ID en la base de datos
    const user = await User.findByIdAndDelete(id);

    if (user) {
      throw new AppError(404, "Usuario no encontrado");
    }

    // Enviar una respuesta al cliente
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
