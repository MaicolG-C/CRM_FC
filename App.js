// ===============================================
// App.js
// VERSIÓN COMPLETA con todos los Contextos
// ===============================================

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './backend/AuthContext';
import { NotificationProvider } from './backend/NotificationContext';
import { ProjectsProvider } from './backend/ProjectsContext';
import { EmployeesProvider } from './backend/EmployeesContext';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// Importar las pantallas del proyecto
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
import PerfilScreen from './src/screens/PerfilScreen';
import EditPerfilScreen from './src/screens/EditPerfilScreen';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [],
  config: {
    screens: {
      Login: 'login',
      Register: 'registro',
      RegisterStep2: 'registro/paso-2',
      RegisterStep3: 'registro/paso-3',
      RegisterSuccess: 'registro/exito',
      Dashboard: '',
      Proyectos: 'proyectos',
      Calendario: 'calendario',
      Leads: 'leads',
      Empleados: 'empleados',
      Mensajes: 'mensajes',
      Perfil: 'perfil',
      EditPerfil: 'perfil/editar',
    },
  },
};

const AppNav = () => {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#720819" />
        <Text style={styles.loaderText}>Cargando sesión...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Proyectos" component={ProyectosScreen} />
          <Stack.Screen name="Calendario" component={CalendarioScreen} />
          <Stack.Screen name="Leads" component={LeadsScreen} />
          <Stack.Screen name="Empleados" component={EmpleadosScreen} />
          <Stack.Screen name="Mensajes" component={MensajesScreen} />
          <Stack.Screen name="Perfil" component={PerfilScreen} />
          <Stack.Screen name="EditPerfil" component={EditPerfilScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="RegisterStep2" component={RegisterStep2Screen} />
          <Stack.Screen name="RegisterStep3" component={RegisterStep3Screen} />
          <Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ProjectsProvider>
          <EmployeesProvider>
            <NavigationContainer linking={linking} fallback={<Text>Cargando...</Text>}>
                <AppNav />
            </NavigationContainer>
          </EmployeesProvider>
        </ProjectsProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loaderText: {
    marginTop: 10,
    color: '#720819',
  }
});