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
// Usar la variable de entorno MONGO_URI
const mongoDBURI = process.env.MONGO_URI;

// Validar que la cadena de conexión exista
if (!mongoDBURI) {
  console.error("Error: La variable de entorno MONGO_URI no está definida.");
  process.exit(1);
}

mongoose.connect(mongoDBURI)
  .then(() => console.log('Conexión a MongoDB Atlas exitosa'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Definir el esquema y modelo de usuario
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
});

const User = mongoose.model('User', userSchema);

// Ruta de registro (POST /api/register)
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear un nuevo usuario en la base de datos
    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta de inicio de sesión (POST /api/login)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Comparar la contraseña ingresada con la encriptada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso', user: { email: user.email } });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));