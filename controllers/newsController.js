import News from "../models/newsModel.js";
import AppError from "../utils/AppError.js";
import config from "../config.js";

export const getNews = async (req, res, next) => {
  try {
    // Obtener todas las noticias de la base de datos
    const news = await News.find();

    // Enviar una respuesta al cliente
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

export const getNewsById = async (req, res, next) => {
  try {
    // Obtener el id de la noticia
    const { id } = req.params;

    // Obtener la noticia de la base de datos
    const news = await News.findById(id);

    // Enviar una respuesta al cliente
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

export const createNews = async (req, res, next) => {
  try {
    if (req.user.clearance !== config.ADMIN_CLEARANCE) {
      throw new AppError(403, "No tienes permiso para realizar esta acción");
    }

    const { title, body, date, image } = req.body;

    const newNews = new News({
      title,
      body,
      date,
      image,
      author: req.user.username,
      userID: req.user.id,
    });

    await newNews.save();

    // Enviar una respuesta al cliente
    res.status(201).json(newNews);
  } catch (err) {
    // Maneja los errores aquí
    res.status(500).json({ error: err.message });
  }
};

export const updateNews = async (req, res, next) => {
  try {
    if (req.user.clearance !== config.ADMIN_CLEARANCE) {
      throw new AppError(403, "No tienes permiso para realizar esta acción");
    }

    const { id } = req.params;
    const { title, body, date, image } = req.body;

    // Verificar si la noticia existe
    const news = await News.findById(id);
    if (!news) {
      throw new AppError(
        404,
        "No se ha encontrado ninguna noticia con el id proporcionado",
      );
    }

    // Actualizar la noticia
    news.title = title;
    news.body = body;
    news.date = date;
    news.image = image;

    await news.save();

    // Enviar una respuesta al cliente
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

export const deleteNews = async (req, res, next) => {
  try {
    if (req.user.clearance !== config.ADMIN_CLEARANCE) {
      throw new AppError(403, "No tienes permiso para realizar esta acción");
    }

    const { id } = req.params;

    // Eliminar la noticia directamente sin necesidad de buscarla previamente
    const news = await News.findByIdAndDelete(id);

    // Enviar una respuesta al cliente
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
