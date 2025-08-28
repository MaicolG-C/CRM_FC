// ==========================================================
// server.js
// Lógica del backend para manejar las peticiones de registro, login y actualización de perfil.
// ==========================================================

// Cargar variables de entorno desde el archivo .env
require('dotenv').config();

// Importar dependencias necesarias
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// Inicializar la aplicación Express
const app = express();

// Configurar middlewares
app.use(express.json()); // Permite a la aplicación procesar JSON en las peticiones
app.use(cors()); // Permite peticiones desde dominios diferentes

// Configurar la conexión a MongoDB Atlas
const mongoDBURI = process.env.MONGO_URI;

if (!mongoDBURI) {
  console.error("Error: La variable de entorno MONGO_URI no está definida.");
  process.exit(1);
}

mongoose.connect(mongoDBURI)
  .then(() => console.log('Conexión a MongoDB Atlas exitosa'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// ==========================================================
// Definir el esquema y modelo de usuario
// Se han agregado todos los campos del formulario de registro
// ==========================================================
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // Nuevos campos para la información del perfil
  useReason: {
    type: String,
    required: false
  },
  position: {
    type: String,
    required: false
  },
  hasExperience: {
    type: Boolean,
    required: false
  },
  companyName: {
    type: String,
    required: false
  },
  businessArea: {
    type: String,
    required: false
  },
  teamSize: {
    type: String,
    required: false
  },
});

const User = mongoose.model('User', userSchema);

// ==========================================================
// Ruta de registro (POST /api/register)
// Ahora recibe y guarda todos los datos del perfil
// ==========================================================
app.post('/api/register', async (req, res) => {
  try {
    const { 
      email, 
      password,
      useReason,
      position,
      hasExperience,
      companyName,
      businessArea,
      teamSize
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      useReason,
      position,
      hasExperience,
      companyName,
      businessArea,
      teamSize
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// ==========================================================
// Ruta de inicio de sesión (POST /api/login)
// Ahora devuelve toda la información del perfil del usuario,
// con valores predeterminados para cuentas antiguas.
// ==========================================================
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const userProfile = {
      email: user.email,
      useReason: user.useReason || 'No especificado',
      position: user.position || 'No especificado',
      hasExperience: user.hasExperience !== undefined ? user.hasExperience : false,
      companyName: user.companyName || 'No especificado',
      businessArea: user.businessArea || 'No especificado',
      teamSize: user.teamSize || 'No especificado',
    };

    res.status(200).json({ message: 'Inicio de sesión exitoso', user: userProfile });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// ==========================================================
// Nueva ruta para actualizar el perfil del usuario
// =sigue estando el mismo, error , quieres que te pase algunos archivos para que veas en donde puede estar el problema te serian de ayuda ??
// ==========================================================
app.put('/api/profile/update', async (req, res) => {
  try {
    const { email, ...updateData } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await User.updateOne({ email }, { $set: updateData });

    const updatedUser = await User.findOne({ email });

    const userProfile = {
      email: updatedUser.email,
      useReason: updatedUser.useReason || 'No especificado',
      position: updatedUser.position || 'No especificado',
      hasExperience: updatedUser.hasExperience !== undefined ? updatedUser.hasExperience : false,
      companyName: updatedUser.companyName || 'No especificado',
      businessArea: updatedUser.businessArea || 'No especificado',
      teamSize: updatedUser.teamSize || 'No especificado',
    };

    res.status(200).json({ message: 'Perfil actualizado exitosamente', user: userProfile });

  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
