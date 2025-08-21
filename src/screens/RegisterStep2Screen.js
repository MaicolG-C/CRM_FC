import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const RegisterStep2Screen = ({ navigation, route }) => {
  // `currentStep` ahora se pasa desde la pantalla anterior para saber en qué paso estamos
  const { currentStep } = route.params; 
  const [useReason, setUseReason] = useState('Trabajo');
  const [position, setPosition] = useState('Administrador');
  const [hasExperience, setHasExperience] = useState(null);

  const handleNext = () => {
    // Validación de campos obligatorios
    if (!useReason || !position || hasExperience === null) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    // Navegar a la siguiente pantalla, pasando el paso actual
    navigation.navigate('RegisterStep3', { currentStep: 3 });
  };

  const renderStep = (stepNumber, title) => (
    <View style={styles.stepItem}>
      {/* Lógica para mostrar el check o el círculo */}
      <View style={[styles.stepDot, stepNumber <= currentStep && styles.stepCheckActive]}>
        {stepNumber < currentStep && <Icon name="check" size={12} color="#720819" />}
      </View>
      <Text style={stepNumber <= currentStep ? styles.stepTextActive : styles.stepText}>
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
        <Text style={styles.stepHeading}>PASO 2/3</Text>
        <Text style={styles.formTitle}>Habla un poco de ti</Text>
        
        <Text style={styles.label}>¿Por qué utilizarás el servicio?</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={useReason}
            onValueChange={(itemValue) => setUseReason(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Trabajo" value="Trabajo" />
            <Picker.Item label="Estudio" value="Estudio" />
            <Picker.Item label="Uso personal" value="Uso personal" />
          </Picker>
        </View>

        <Text style={styles.label}>¿Cuál es el cargo que ocuparás?</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={position}
            onValueChange={(itemValue) => setPosition(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Administrador" value="Administrador" />
            <Picker.Item label="Gerente" value="Gerente" />
            <Picker.Item label="Empleado" value="Empleado" />
          </Picker>
        </View>
        
        <Text style={styles.label}>¿Tienes experiencia previa con plataformas similares?</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity style={styles.radioButton} onPress={() => setHasExperience(true)}>
            <View style={[styles.radioDot, hasExperience === true && styles.radioDotActive]} />
            <Text>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioButton} onPress={() => setHasExperience(false)}>
            <View style={[styles.radioDot, hasExperience === false && styles.radioDotActive]} />
            <Text>No</Text>
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

export default RegisterStep2Screen;