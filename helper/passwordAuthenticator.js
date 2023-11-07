import AppError from "../utils/AppError.js";

const updatePassword = async (req, res, next) => {
    try {
        if(req.body.password !== req.body.passwordConfirm) {
            throw new AppError(400, "Las contraseñas no coinciden");
        }

      const { password } = req.body;
  
      // Requisitos de la contraseña
      const minLength = 12;
      const hasUpperCase = /[A-Z]/;
      const hasLowerCase = /[a-z]/;
      const hasNumbers = /[0-9]/;
      const hasSpecialChar = /[\^$*.\[\]{}()?"!@#%&/,><':;|_~`]/;
  
      // Verificación de la seguridad de la contraseña
      if (password.length < minLength) {
        throw new Error('Password must be at least 12 characters long.');
      }
  
      if (!hasUpperCase.test(password)) {
        throw new Error('Password must contain at least one uppercase letter.');
      }
  
      if (!hasLowerCase.test(password)) {
        throw new Error('Password must contain at least one lowercase letter.');
      }
  
      if (!hasNumbers.test(password)) {
        throw new Error('Password must contain at least one number.');
      }
  
      if (!hasSpecialChar.test(password)) {
        throw new Error('Password must contain at least one special character.');
      }
  
      // Si la contraseña pasa todas las comprobaciones, puedes continuar con la actualización
      // Aquí iría tu lógica para actualizar la contraseña...
      req.password = password;
      next();
    } catch (error) {
      next(error);
    }
  };

  export default updatePassword;
  