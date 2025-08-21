// ===============================================
// App.js
// Archivo principal de la aplicación que gestiona las rutas de navegación.
// Importa cada pantalla desde su archivo correspondiente.
// ===============================================

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar las pantallas del proyecto desde la carpeta 'src/screen'
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RegisterStep2Screen from './src/screens/RegisterStep2Screen';
import RegisterStep3Screen from './src/screens/RegisterStep3Screen';
import RegisterSuccessScreen from './src/screens/RegisterSuccessScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProyectosScreen from './src/screens/ProyectosScreen';
import CalendarioScreen from './src/screens/CalendarioScreen';
import LeadsScreen from './src/screens/LeadsScreen';
import EmpleadosScreen from './src/screens/EmpleadosScreen';
import MensajesScreen from './src/screens/MensajesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterStep2" component={RegisterStep2Screen} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterStep3" component={RegisterStep3Screen} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Proyectos" component={ProyectosScreen} />
        <Stack.Screen name="Calendario" component={CalendarioScreen} />
        <Stack.Screen name="Leads" component={LeadsScreen} />
        <Stack.Screen name="Empleados" component={EmpleadosScreen} />
        <Stack.Screen name="Mensajes" component={MensajesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
