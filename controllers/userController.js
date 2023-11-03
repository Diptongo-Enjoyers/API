import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";

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
    const id = req.user._id;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError(404, "Usuario no encontrado");
    }

    res.status(200).json(user);
  }
  catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, password, username, name, address, phone, clearance } =
      req.body;

    // Buscar un usuario por su ID en la base de datos
    const user = await User.findById(id);
    if (!user) {
      throw new AppError(404, "Usuario no encontrado");
    }

    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (username) user.username = username;
    if (name) user.name = name;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (clearance) user.clearance = clearance;

    await user.save();

    // Enviar una respuesta al cliente
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar un usuario por su ID en la base de datos
    const user = await User.findById(id);
    if (!user) {
      throw new AppError(404, "Usuario no encontrado");
    }

    // Eliminar el usuario de la base de datos
    await user.remove();

    // Enviar una respuesta al cliente
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
