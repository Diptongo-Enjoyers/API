import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    // Obtener todos los usuarios de la base de datos
    const users = await User.find();

    // Enviar una respuesta al cliente
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ha ocurrido un error al obtener los usuarios" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar un usuario por su ID en la base de datos
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Enviar una respuesta al cliente
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ha ocurrido un error al obtener el usuario" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, username, name, address, phone, clearance } =
      req.body;

    // Buscar un usuario por su ID en la base de datos
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
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
    console.error(error);
    res
      .status(500)
      .json({ message: "Ha ocurrido un error al actualizar el usuario" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar un usuario por su ID en la base de datos
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar el usuario de la base de datos
    await user.remove();

    // Enviar una respuesta al cliente
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ha ocurrido un error al eliminar el usuario" });
  }
};
