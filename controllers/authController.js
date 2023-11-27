import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import Token from "../models/tokenModel.js";
import nodemailer from "nodemailer";
import authToken from "../models/authTokenModel.js";

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
      html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
              <div style="text-align: center;">
                  <img src="https://bamx.org.mx/wp-content/uploads/2023/10/RED-BAMX.png" alt="Logo BAMX" style="max-width: 200px;">
                  <h1>Bienvenido a BAMX, ${username}!</h1>
              </div>
              <p>Estamos encantados de tenerte con nosotros. Tu cuenta ha sido creada con éxito.</p>
              <p>Al unirte a nuestra comunidad, estás apoyando directamente al Banco de Alimentos de Jalisco en nuestra misión de luchar contra el hambre y el desperdicio de alimentos. Tu contribución hace una gran diferencia.</p>
              <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.</p>
              <p>¡Gracias por ser parte de esta noble causa!</p>
              <p>Saludos cordiales,</p>
              <p>El equipo de BAMX</p>
          </div>
      `,
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

// Configuración del transporte de correo electrónico
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.USER_MAIL,
    pass: config.USER_MAIL_PASSWORD,
  },
});

// Función de inicio de sesión
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Verificar si el correo electrónico y la contraseña son correctos
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Contraseña incorrecta");
    }

    if (user.clearance === config.ADMIN_CLEARANCE || user.clearance === config.WORKER_CLEARANCE) {
      // Generar un código de 6 dígitos
      const verificationCode = Math.floor(100000 + Math.random() * 900000);

      const mailOptions = {
        from: config.USER_MAIL,
        to: email,
        subject: "Código de Verificación de BAMX",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
            <div style="text-align: center;">
              <img src="https://bamx.org.mx/wp-content/uploads/2023/10/RED-BAMX.png" alt="Logo BAMX" style="max-width: 200px;">
              <h2>¡Hola!</h2>
            </div>
            <p>Estamos emocionados de ayudarte a asegurar tu cuenta. Como parte de nuestro proceso de seguridad, necesitamos que verifiques tu identidad.</p>
            <p style="text-align: center; font-size: 24px; margin: 20px 0; color: #007bff;"><strong>${verificationCode}</strong></p>
            <p>Por favor, introduce este código en la página de inicio de sesión para completar el proceso de verificación.</p>
            <p>Si no has intentado iniciar sesión recientemente, por favor ignora este correo electrónico y avísanos inmediatamente.</p>
            <p>Gracias por ser parte de la comunidad BAMX y por ayudarnos a mantener segura tu cuenta.</p>
            <p style="text-align: center;">Saludos,</p>
            <p style="text-align: center;">El equipo de BAMX</p>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);

      // Guardar el código de verificación en la base de datos
      const newAuthToken = new authToken({  
        userId: user._id,
        authToken: verificationCode,
      });
      await newAuthToken.save();

      return res.status(200).json({ message: "Verifica tu correo para el código de autenticación" });
    } else {
      const accessToken = jwt.sign({ userId: user._id }, config.SECRET_KEY);

      const newToken = new Token({
        userId: user._id,
        token: accessToken,
      });

      await newToken.save();

      return res.status(200).json({ accessToken });
    }
  } catch (error) {
    next(error);
  }
};

export const verifyAuthenticationCode = async (req, res, next) => {
  try {
    const { email, verificationCode } = req.body;

    // Buscar el usuario y el token de autenticación asociado por email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const authTokenRecord = await authToken.findOne({ userId: user._id });
    if (!authTokenRecord) {
      throw new Error("Código de autenticación no encontrado");
    }

    // Verificar si el código de autenticación coincide
    if (authTokenRecord.authToken !== verificationCode) {
      throw new Error("Código de autenticación incorrecto");
    }

    // Si el código es correcto, generar un token de acceso
    const accessToken = jwt.sign({ userId: user._id }, config.SECRET_KEY);

    const newToken = new Token({
      userId: user._id,
      token: accessToken,
    });

    await newToken.save();

    // Opcionalmente, eliminar el registro de authToken aquí para evitar su reutilización

    // Enviar el token de acceso
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
