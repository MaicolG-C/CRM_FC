// ==========================================================
// src/RegisterSuccessScreen.js
// Pantalla de confirmación de registro exitoso.
// Ahora guarda la sesión en AuthContext y redirige al Dashboard.
// ==========================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from './../../backend/AuthContext';

const { width } = Dimensions.get('window');

const RegisterSuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { signIn } = React.useContext(AuthContext);

  // Obtenemos todos los datos de registro pasados desde la pantalla anterior
  const {
    email,
    useReason,
    position,
    hasExperience,
    companyName,
    businessArea,
    teamSize
  } = route.params || {};

  const handleStart = async () => {
    // Simulamos un inicio de sesión con los datos de registro
    const userProfile = {
      email,
      useReason,
      position,
      hasExperience,
      companyName,
      businessArea,
      teamSize,
      userName: email ? email.split('@')[0] : 'Usuario'
    };

    // Guardamos la sesión en el contexto y AsyncStorage
    await signIn(userProfile);

    // La navegación al Dashboard se maneja automáticamente por App.js
    // Ahora, solo regresamos a la pantalla anterior para activar el redireccionamiento
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Panel Izquierdo con imagen */}
      <View style={styles.leftPanel}>
        <View style={styles.logoAndTitleContainer}>
          <Image
            source={require('./../../assets/itq_logo.png')}
            style={styles.logoITQ}
          />
          <Text style={styles.titleITQ}>Instituto Superior Tecnológico Quito</Text>
        </View>
        <Image
          source={require('./../../assets/itq1.png')}
          style={styles.successImage}
        />
      </View>

      {/* Panel Derecho con el mensaje de éxito */}
      <View style={styles.rightPanel}>
        <View style={styles.iconContainer}>
          <Icon name="check-circle" size={120} color="#66c25a" />
        </View>
        <Text style={styles.successMessage}>¡Te has registrado correctamente!</Text>
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Comenzar</Text>
          <Icon name="arrow-right" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  leftPanel: {
    width: width > 768 ? '50%' : '100%',
    backgroundColor: '#720819',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    // Esto oculta el panel en dispositivos móviles, como se sugiere en el código original
    display: width > 768 ? 'flex' : 'none',
  },
  title: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
    position: 'absolute',
    top: 20,
    left: 20,
  },
  successImage: {
    width: '90%',
    height: 'auto',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  rightPanel: {
    width: width > 768 ? '50%' : '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  iconContainer: {
    marginBottom: 40,
  },
  successMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#720819',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
    logoAndTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 20,
  },
  logoITQ: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
    titleITQ: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default RegisterSuccessScreen;
