// ==========================================================
// src/RegisterStep3Screen.js
// Pantalla de registro del paso 3 con validaciones.
// ==========================================================
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// URL de tu API, asegúrate de que sea la correcta
const API_URL = 'http://localhost:5000/api';

const RegisterStep3Screen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { currentStep, email, password, useReason, position, hasExperience } = route.params || {};

  const [companyName, setCompanyName] = useState('');
  const [businessArea, setBusinessArea] = useState('Administraciones');
  const [teamSize, setTeamSize] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga
  const [companyNameError, setCompanyNameError] = useState('');
  const [businessAreaError, setBusinessAreaError] = useState('');
  const [teamSizeError, setTeamSizeError] = useState('');


  const teamSizes = ['Solo yo', '2 - 5', '6 - 10', '11 - 20', '21 - 40', '41 - 50', '51 - 100', '101 - 500'];

  const handleNext = async () => {
    let isValid = true;
    setCompanyNameError('');
    setBusinessAreaError('');
    setTeamSizeError('');

    if (!companyName) {
      setCompanyNameError('El nombre de la empresa es obligatorio.');
      isValid = false;
    }
    if (!businessArea) {
      setBusinessAreaError('Debes seleccionar un área de negocio.');
      isValid = false;
    }
    if (teamSize === null) {
      setTeamSizeError('Debes seleccionar el tamaño de tu equipo.');
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            useReason,
            position,
            hasExperience,
            companyName,
            businessArea,
            teamSize
          }),
        });

        const data = await response.json();

        if (response.ok) {
          navigation.navigate('RegisterSuccess', {
            email,
            useReason,
            position,
            hasExperience,
            companyName,
            businessArea,
            teamSize
          });
        } else {
          Alert.alert('Error', data.message || 'Error al registrar el usuario. Inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
        Alert.alert('Error', 'No se pudo conectar al servidor. Inténtalo más tarde.');
      } finally {
        setLoading(false);
      }
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
          <Text style={styles.formTitle}>Información de la Empresa</Text>

          <Text style={styles.label}>Nombre de la Empresa</Text>
          <TextInput
            style={[styles.input, companyNameError && styles.inputError]}
            placeholder="Escribe el nombre de tu empresa"
            value={companyName}
            onChangeText={setCompanyName}
          />
          {companyNameError ? <Text style={styles.errorText}>{companyNameError}</Text> : null}

          <Text style={styles.label}>Área de Negocio</Text>
          <View style={[styles.pickerContainer, businessAreaError && styles.inputError]}>
            <Picker
              selectedValue={businessArea}
              onValueChange={(itemValue) => setBusinessArea(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Administraciones" value="Administraciones" />
              <Picker.Item label="Finanzas" value="Finanzas" />
              <Picker.Item label="Tecnología" value="Tecnología" />
              <Picker.Item label="Marketing" value="Marketing" />
            </Picker>
          </View>
          {businessAreaError ? <Text style={styles.errorText}>{businessAreaError}</Text> : null}

          <Text style={styles.label}>Tamaño del Equipo</Text>
          <View style={[styles.teamSizeContainer, teamSizeError && styles.inputError]}>
            {teamSizes.map((size, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.teamSizeButton,
                  teamSize === size && styles.teamSizeButtonActive
                ]}
                onPress={() => setTeamSize(size)}
              >
                <Text style={[
                  styles.teamSizeText,
                  teamSize === size && styles.teamSizeTextActive
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {teamSizeError ? <Text style={styles.errorText}>{teamSizeError}</Text> : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={16} color="#720819" style={{ marginRight: 10 }} />
              <Text style={styles.backButtonText}>Atrás</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleNext}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Finalizar</Text>
                  <Icon name="check" size={16} color="#fff" style={{ marginLeft: 10 }} />
                </>
              )}
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
    borderColor: '#720819',
    backgroundColor: '#720819',
  },
  stepText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  stepTextActive: {
    fontWeight: 'bold',
    color: '#720819',
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
  teamSizeContainer: {
    width: '80%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  teamSizeButton: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  teamSizeButtonActive: {
    backgroundColor: '#720819',
    borderColor: '#720819',
  },
  teamSizeText: {
    color: '#555',
    fontWeight: 'bold',
  },
  teamSizeTextActive: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#720819',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
    width: '48%',
  },
  backButtonText: {
    color: '#720819',
    fontWeight: 'bold',
    fontSize: 16,
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

export default RegisterStep3Screen;
