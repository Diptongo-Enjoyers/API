import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import Token from "../models/tokenModel.js";
import nodemailer from "nodemailer";

export const register = async (req, res, next) => {
  try {
    const { email, username, clearance } = req.body;

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

    const hashedPassword = await bcrypt.hash(req.password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      clearance,
    });

    // Generar un token de acceso
    const accessToken = jwt.sign({ userId: newUser._id }, config.SECRET_KEY);

    const newToken = new Token({
      userId: newUser._id,
      token: accessToken,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail", // Especifica el servicio de correo electrónico
      auth: {
        user: config.USER_MAIL, // Tu correo de Gmail
        pass: config.USER_MAIL_PASSWORD, // Contraseña de tu correo de Gmail
      },
    });

    const mailOptions = {
      from: config.USER_MAIL,
      to: email,
      subject: "Confirmación de Registro",
      text: `Hola ${username}, tu cuenta ha sido creada con éxito.`,
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Correo electrónico enviado: " + info.response);
      }
    });
    await newToken.save();
    await newUser.save();

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
      throw new AppError(401, user.password);
    }

    // Generar un token de acceso
    const accessToken = jwt.sign({ userId: user._id }, config.SECRET_KEY);

    const newToken = new Token({
      userId: user._id,
      token: accessToken,
    });

    await newToken.save();
    // Enviar una respuesta al cliente
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(req.user.username);
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(404, "Usuario no encontrado");
    }

    const token = await Token.findOne({ userId: userId });
    if (!token) {
      throw new AppError(404, "Token no encontrado");
    }

    await token.deleteOne();

    res.status(200).json({ message: "Logout exitoso" });
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
