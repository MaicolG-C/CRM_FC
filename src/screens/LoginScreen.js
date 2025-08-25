// ==========================================================
// src/screens/LoginScreen.js
// Pantalla de inicio de sesión con validaciones mejoradas.
// Ahora usa AuthContext para persistir la sesión.
// ==========================================================

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './../../backend/AuthContext'; // Corregida la ruta de importación

const { width } = Dimensions.get('window');

// URL de tu API, asegúrate de que sea la correcta
const API_URL = 'http://localhost:5000/api';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { signIn } = React.useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('El correo electrónico es obligatorio.');
      isValid = false;
    }
    if (!password) {
      setPasswordError('La contraseña es obligatoria.');
      isValid = false;
    }
    
    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const userProfile = data.user;
        const userName = userProfile.email ? userProfile.email.split('@')[0] : 'Usuario';
        
        Alert.alert('Éxito', data.message);
        signIn({ ...userProfile, userName });
      } else {
        Alert.alert('Error de login', data.message || 'Credenciales inválidas.');
      }
    } catch (error) {
      console.error('Error en la llamada a la API:', error);
      Alert.alert('Error de red', 'No se pudo conectar al servidor. Asegúrate de que está en ejecución.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          style={styles.studentImage} 
        />
      </View>

      <View style={styles.rightPanel}>
        <Text style={styles.loginTitle}>Login</Text>
        <Text style={styles.label}>Usuario o Correo Electrónico</Text>
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="tucorreoelectronico@gmail.com"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        
        <Text style={styles.label}>Contraseña</Text>
        <View style={[styles.passwordContainer, passwordError && styles.inputError]}>
          <TextInput
            style={styles.inputPassword}
            placeholder="********"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordIcon}>
            <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <View style={styles.optionsContainer}>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}></View>
            <Text style={styles.checkboxText}>Recordar</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
              <Icon name="arrow-right" size={16} color="#fff" style={styles.buttonIcon} />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register', { currentStep: 1 })}>
          <Text style={styles.registerLink}>¿No tienes una cuenta?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  leftPanel: {
    width: width > 768 ? '50%' : '100%',
    backgroundColor: '#720819',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    display: width > 768 ? 'flex' : 'none',
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
  studentImage: {
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
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    alignSelf: 'flex-start',
    marginLeft: '10%',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    color: '#555',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginTop: -15,
    marginBottom: 10,
  },
  passwordContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
  },
  passwordIcon: {
    padding: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxText: {
    color: '#555',
  },
  forgotPassword: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#720819',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  registerLink: {
    color: '#007bff',
    marginTop: 10,
  },
});

export default LoginScreen;
