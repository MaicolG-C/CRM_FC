// ==========================================================
// src/RegisterScreen.js
// Pantalla inicial de registro con validaciones de campos.
// ==========================================================

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateFields = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!email) {
      setEmailError('El correo electrónico es obligatorio.');
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Introduce un correo electrónico válido.');
        isValid = false;
      }
    }

    if (!password) {
      setPasswordError('La contraseña es obligatoria.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Debes confirmar tu contraseña.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateFields()) {
      navigation.navigate('RegisterStep2', {
        currentStep: 2,
        email,
        password,
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderStep = (stepNumber, title) => (
    <View style={styles.stepItem}>
      <View style={[styles.stepDot, stepNumber <= 1 && styles.stepDotActive]}>
        {stepNumber < 1 && <Icon name="check" size={12} color="#fff" />}
      </View>
      <Text style={stepNumber <= 1 ? styles.stepTextActive : styles.stepText}>{title}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
        {/* Panel Derecho con el formulario */}
        <View style={styles.rightPanel}>
          <View style={styles.stepsContainer}>
            {renderStep(1, 'Información de Usuario')}
            {renderStep(2, 'Información del Perfil')}
            {renderStep(3, 'Información de la Empresa')}
          </View>
          <Text style={styles.formTitle}>Información de Usuario</Text>

          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={[styles.input, emailError && styles.inputError]}
            placeholder="Introduce tu correo electrónico"
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
              placeholder="Crea tu contraseña"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordIcon}>
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <Text style={styles.label}>Confirmar Contraseña</Text>
          <View style={[styles.passwordContainer, confirmPasswordError && styles.inputError]}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Confirma tu contraseña"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordIcon}>
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Icon name="arrow-left" size={16} color="#720819" />
              <Text style={styles.backButtonText}>Atrás</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Siguiente</Text>
              <Icon name="arrow-right" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
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
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 40,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  stepDotActive: {
    backgroundColor: '#720819',
  },
  stepText: {
    fontSize: 10,
    color: '#888',
  },
  stepTextActive: {
    fontSize: 10,
    color: '#720819',
    fontWeight: 'bold',
  },
  formTitle: {
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
  passwordContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
  },
  passwordIcon: {
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  backButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#720819',
    marginRight: 10,
  },
  backButtonText: {
    color: '#720819',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#720819',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginTop: -15,
    marginBottom: 10,
  }
});

export default RegisterScreen;
