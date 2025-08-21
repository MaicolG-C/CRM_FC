import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = async () => {
    // Validar que los campos no estén vacíos
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, introduce un correo electrónico válido.');
      return;
    }
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      // Llamada a la API de registro
      // Asegúrate de que la URL sea la de tu servidor backend
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Navegar a la siguiente pantalla al registrarse con éxito
        navigation.navigate('RegisterStep2', { currentStep: 2 });
      } else {
        // Mostrar mensaje de error de la API
        Alert.alert('Error de registro', data.message || 'Ocurrió un error inesperado.');
      }
    } catch (error) {
      console.error('Error en la llamada a la API:', error);
      Alert.alert('Error de red', 'No se pudo conectar al servidor. Asegúrate de que está en ejecución.');
    }
  };

  const renderStep = (stepNumber, title) => (
    <View style={styles.stepItem}>
      <View style={[styles.stepDot, stepNumber <= 1 && styles.stepCheckActive]}>
        {stepNumber < 1 && <Icon name="check" size={12} color="#720819" />}
      </View>
      <Text style={stepNumber <= 1 ? styles.stepTextActive : styles.stepText}>
        {title}
      </Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Panel Izquierdo - Etapas de registro */}
      <View style={styles.leftPanel}>
        <Text style={styles.title}>itq</Text>
        <Text style={styles.subtitle}>Empecemos</Text>
        <View style={styles.stepContainer}>
          {renderStep(1, 'Valida tu Correo')}
          {renderStep(2, 'Habla un poco de ti')}
          {renderStep(3, 'Sobre tu empresa')}
          {renderStep(4, 'Registro Exitoso')}
        </View>
      </View>

      {/* Panel Derecho - Formulario */}
      <View style={styles.rightPanel}>
        <Text style={styles.stepHeading}>PASO 1/3</Text>
        <Text style={styles.formTitle}>Valida tu Correo</Text>
        
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tucorreoelectronico@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordIcon}>
            <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Confirmar Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="********"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordIcon}>
            <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={16} color="#720819" />
            <Text style={styles.backButtonText}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Siguiente</Text>
            <Icon name="arrow-right" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
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
  subtitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  stepContainer: {
    marginLeft: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    marginRight: 10,
  },
  stepCheckActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepText: {
    color: '#fff',
    opacity: 0.7,
    fontSize: 16,
  },
  stepTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rightPanel: {
    width: width > 768 ? '50%' : '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  stepHeading: {
    fontSize: 16,
    color: '#777',
    marginBottom: 5,
    alignSelf: 'flex-start',
    marginLeft: '10%',
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
  },
  backButtonText: {
    color: '#720819',
    fontWeight: 'bold',
    marginLeft: 5,
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
    fontWeight: 'bold',
    marginRight: 5,
  },
});

export default RegisterScreen;
