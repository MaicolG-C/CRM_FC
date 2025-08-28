// ==========================================================
// src/RegisterStep2Screen.js
// Pantalla de registro del paso 2 con validaciones.
// ==========================================================

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const RegisterStep2Screen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    currentStep,
    email,
    password
  } = route.params || {};

  const [useReason, setUseReason] = useState('Trabajo');
  const [position, setPosition] = useState('Administrador');
  const [hasExperience, setHasExperience] = useState(null);
  const [useReasonError, setUseReasonError] = useState('');
  const [positionError, setPositionError] = useState('');
  const [hasExperienceError, setHasExperienceError] = useState('');


  const handleNext = () => {
    let isValid = true;
    setUseReasonError('');
    setPositionError('');
    setHasExperienceError('');

    if (!useReason) {
      setUseReasonError('Debes seleccionar un motivo.');
      isValid = false;
    }
    if (!position) {
      setPositionError('Debes seleccionar un puesto.');
      isValid = false;
    }
    if (hasExperience === null) {
      setHasExperienceError('Debes indicar si tienes experiencia.');
      isValid = false;
    }

    if (isValid) {
      navigation.navigate('RegisterStep3', {
        currentStep: 3,
        email,
        password,
        useReason,
        position,
        hasExperience
      });
    }
  };

  const renderStep = (stepNumber, title) => (
    <View style={styles.stepItem}>
      <View style={[styles.stepDot, stepNumber <= currentStep && styles.stepDotActive]}>
        {stepNumber < currentStep && <Icon name="check" size={12} color="#fff" />}
      </View>
      <Text style={stepNumber <= currentStep ? styles.stepTextActive : styles.stepText}>{title}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
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
        <View style={styles.rightPanel}>
          <View style={styles.stepsContainer}>
            {renderStep(1, 'Información de Usuario')}
            {renderStep(2, 'Información del Perfil')}
            {renderStep(3, 'Información de la Empresa')}
          </View>
          <Text style={styles.formTitle}>Información de Perfil</Text>

          <Text style={styles.label}>Motivo para usar el producto</Text>
          <View style={[styles.pickerContainer, useReasonError && styles.inputError]}>
            <Picker
              selectedValue={useReason}
              onValueChange={(itemValue) => setUseReason(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Trabajo" value="Trabajo" />
              <Picker.Item label="Uso personal" value="Uso personal" />
              <Picker.Item label="Estudiante" value="Estudiante" />
              <Picker.Item label="Otro" value="Otro" />
            </Picker>
          </View>
          {useReasonError ? <Text style={styles.errorText}>{useReasonError}</Text> : null}

          <Text style={styles.label}>Tu Puesto de Trabajo</Text>
          <View style={[styles.pickerContainer, positionError && styles.inputError]}>
            <Picker
              selectedValue={position}
              onValueChange={(itemValue) => setPosition(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Administrador" value="Administrador" />
              <Picker.Item label="Gerente" value="Gerente" />
              <Picker.Item label="Empleado" value="Empleado" />
              <Picker.Item label="Otro" value="Otro" />
            </Picker>
          </View>
          {positionError ? <Text style={styles.errorText}>{positionError}</Text> : null}

          <Text style={styles.label}>¿Tienes experiencia previa con CRMs?</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setHasExperience(true)}
            >
              <View style={[styles.radioDot, hasExperience === true && styles.radioDotActive]} />
              <Text>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setHasExperience(false)}
            >
              <View style={[styles.radioDot, hasExperience === false && styles.radioDotActive]} />
              <Text>No</Text>
            </TouchableOpacity>
          </View>
          {hasExperienceError ? <Text style={styles.errorText}>{hasExperienceError}</Text> : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
  pickerContainer: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#555',
  },
  radioContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  radioDotActive: {
    backgroundColor: '#720819',
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

export default RegisterStep2Screen;
