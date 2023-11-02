import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";

export const register = async (req, res, next) => {
  try {
    const { email, password, username, name, address, phone, clearance } =
      req.body;

    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(
        400,
        "Ya existe un usuario con el mismo correo electrónico",
      );
    }

    const existingUserUsername = await User.findOne({ username });
    if (existingUserUsername) {
      throw new AppError(
        400,
        "Ya existe un usuario con el mismo nombre de usuario",
      );
    }

    if (
      clearance === config.ADMIN_CLEARANCE ||
      clearance === config.WORKER_CLEARANCE
    ) {
      throw new AppError(
        400,
        "No puedes registrarte como administrador o trabajador",
      );
    }

    // Crear un nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      clearance,
    });

    await newUser.save();

    // Generar un token de acceso
    const accessToken = jwt.sign({ userId: newUser._id }, config.SECRET_KEY);

    // Enviar una respuesta al cliente
    res.status(201).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Verificar si el correo electrónico y la contraseña son correctos
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(401, "Credenciales inválidas");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, "Credenciales inválidas");
    }

    // Generar un token de acceso
    const accessToken = jwt.sign({ userId: user._id }, config.SECRET_KEY);

    // Enviar una respuesta al cliente
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const registerWorker = async (req, res, next) => {
  try {
    const { email, password, username, name, address, phone, clearance } =
      req.body;

    if (req.user.clearance !== config.ADMIN_CLEARANCE) {
      throw new AppError(403, "No tienes permiso para realizar esta acción");
    }

    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(
        400,
        "Ya existe un usuario con el mismo correo electrónico",
      );
    }

    const existingUserUsername = await User.findOne({ username });
    if (existingUserUsername) {
      throw new AppError(
        400,
        "Ya existe un usuario con el mismo nombre de usuario",
      );
    }

    if (clearance === config.ADMIN_CLEARANCE) {
      throw new AppError(400, "No puedes registrarte como administrador");
    }

    // Crear un nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      name,
      address,
      phone,
      clearance,
    });

    await newUser.save();

    // Generar un token de acceso
    const accessToken = jwt.sign({ userId: newUser._id }, config.SECRET_KEY);

    // Enviar una respuesta al cliente
    res.status(201).json({ accessToken });
  } catch (error) {
    next(error);
  }
};
