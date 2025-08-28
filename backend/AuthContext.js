// ==========================================================
// backend/AuthContext.js
// VERSIÓN MODIFICADA CON GESTIÓN DE ESTADO DEL USUARIO
// ==========================================================

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Creamos el contexto
export const AuthContext = createContext();

// 2. Creamos el proveedor del contexto
export const AuthProvider = ({ children }) => {
  // Estado para el token de autenticación (si lo usas)
  const [authToken, setAuthToken] = useState(null);
  
  // =============================================================
  // ESTADO CLAVE: Aquí guardaremos la información del usuario
  // =============================================================
  const [user, setUser] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);

  // Simulación de inicio de sesión
  const signIn = (userData) => {
    // Aquí guardarías el token y los datos del usuario
    setUser(userData);
    setAuthToken('dummy-token'); // Reemplaza con tu lógica de token
    // Guardar en AsyncStorage si quieres persistencia
    AsyncStorage.setItem('userToken', 'dummy-token');
    AsyncStorage.setItem('userData', JSON.stringify(userData));
  };

  // Simulación de cierre de sesión
  const signOut = () => {
    setUser(null);
    setAuthToken(null);
    AsyncStorage.removeItem('userToken');
    AsyncStorage.removeItem('userData');
  };

  // =============================================================
  // FUNCIÓN CLAVE: Esta función actualizará los datos del usuario
  // en toda la aplicación.
  // =============================================================
  const updateUser = (newUserData) => {
    setUser(newUserData);
    // Opcional: Actualizar también en el almacenamiento local
    if (newUserData) {
      AsyncStorage.setItem('userData', JSON.stringify(newUserData));
    }
  };

  // Función para verificar si el usuario ya está logueado al abrir la app
  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const userDataString = await AsyncStorage.getItem('userData');
      if (token && userDataString) {
        setAuthToken(token);
        setUser(JSON.parse(userDataString));
      }
      setIsLoading(false);
    } catch (e) {
      console.log(`isLoggedIn error: ${e}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    // 3. Pasamos el usuario y la función de actualización a toda la app
    <AuthContext.Provider value={{ user, authToken, isLoading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};