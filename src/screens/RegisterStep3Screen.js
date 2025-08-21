import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const RegisterStep3Screen = ({ navigation, route }) => {
  const { currentStep } = route.params;
  const [companyName, setCompanyName] = useState('');
  const [businessArea, setBusinessArea] = useState('Admistraciones');
  const [teamSize, setTeamSize] = useState(null);

  const teamSizes = ['Solo yo', '2 - 5', '6 - 10', '11 - 20', '21 - 40', '41 - 50', '51 - 100', '101 - 500'];

  const handleNext = () => {
    // Validar que todos los campos sean obligatorios
    if (!companyName || !businessArea || teamSize === null) {
      Alert.alert('Error', 'Todos los campos son obligatorios. Por favor, completa la información.');
      return;
    }
    
    // Navegar a la pantalla de éxito
    navigation.navigate('RegisterSuccess', { currentStep: 4 });
  };

  const renderStep = (stepNumber, title) => (
    <View style={styles.stepItem}>
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
        <Text style={styles.stepHeading}>PASO 3/3</Text>
        <Text style={styles.formTitle}>Cuéntanos sobre tu empresa</Text>
        
        <Text style={styles.label}>El nombre de tu empresa</Text>
        <TextInput
          style={styles.input}
          placeholder="Empresa"
          value={companyName}
          onChangeText={setCompanyName}
        />
        
        <Text style={styles.label}>Dirección de Negocios</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={businessArea}
            onValueChange={(itemValue) => setBusinessArea(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Admistraciones" value="Admistraciones" />
            <Picker.Item label="Ventas" value="Ventas" />
            <Picker.Item label="Marketing" value="Marketing" />
            <Picker.Item label="Tecnología" value="Tecnología" />
          </Picker>
        </View>
        
        <Text style={styles.label}>¿Cuántas personas trabajan en tu equipo?</Text>
        <View style={styles.teamSizeContainer}>
          {teamSizes.map((size) => (
            <TouchableOpacity 
              key={size}
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
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={16} color="#720819" />
            <Text style={styles.backButtonText}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
          >
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

export default RegisterStep3Screen;