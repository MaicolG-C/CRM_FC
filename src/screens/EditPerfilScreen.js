// ==========================================================
// src/screens/EditPerfilScreen.js
// CÓDIGO COMPLETO Y CORREGIDO
// ==========================================================

import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from './../../backend/AuthContext'; // Importa el AuthContext

const { width } = Dimensions.get('window');
const API_URL = 'http://localhost:5000/api'; // Asegúrate que esta URL sea correcta

const EditPerfilScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Obtenemos la función para actualizar el usuario desde el contexto
  const { updateUser } = useContext(AuthContext);
  
  const { userProfile } = route.params || {};

  const [formData, setFormData] = useState({
    email: userProfile?.email || '',
    useReason: userProfile?.useReason || '',
    position: userProfile?.position || '',
    hasExperience: userProfile?.hasExperience !== undefined ? userProfile.hasExperience : false,
    companyName: userProfile?.companyName || '',
    businessArea: userProfile?.businessArea || '',
    teamSize: userProfile?.teamSize || '',
  });
  const [loading, setLoading] = useState(false);

  const businessAreas = ['Admistraciones', 'Ventas', 'Marketing', 'Tecnología'];
  const teamSizes = ['Solo yo', '2 - 5', '6 - 10', '11 - 20', '21 - 40', '41 - 50', '51 - 100', '101 - 500'];
  const useReasons = ['Trabajo', 'Personal', 'Estudio'];
  const positions = ['Administrador', 'Coordinador', 'Asesor', 'Gerente'];
  const hasExperienceOptions = [true, false];


  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json(); // Obtenemos la respuesta con los datos actualizados
        Alert.alert("Éxito", data.message || "Perfil actualizado correctamente.");
        
        // PASO 1: Actualizamos el estado global de la aplicación con los nuevos datos
        updateUser(data.user); 
        
        // PASO 2: Regresamos a la pantalla principal (Dashboard)
        navigation.popToTop();

      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Hubo un problema al guardar los cambios.");
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#555" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 44 }} />
      </View>
      
      <View style={styles.formCard}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileEmail}>{formData.email}</Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <Text style={styles.label}>Motivo de uso</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.useReason}
              onValueChange={(itemValue) => handleChange('useReason', itemValue)}
              style={styles.picker}
            >
              {useReasons.map((item, index) => (
                <Picker.Item key={index} label={item} value={item} />
              ))}
            </Picker>
          </View>
          
          <Text style={styles.label}>Puesto</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.position}
              onValueChange={(itemValue) => handleChange('position', itemValue)}
              style={styles.picker}
            >
              {positions.map((item, index) => (
                <Picker.Item key={index} label={item} value={item} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Experiencia en CRM</Text>
          <View style={styles.radioContainer}>
            {hasExperienceOptions.map((item) => (
              <TouchableOpacity
                key={String(item)}
                style={styles.radioButton}
                onPress={() => handleChange('hasExperience', item)}
              >
                <View style={[styles.radioDot, formData.hasExperience === item && styles.radioDotActive]} />
                <Text>{item ? 'Sí' : 'No'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Información de la Empresa</Text>
          
          <Text style={styles.label}>Nombre de la Empresa</Text>
          <TextInput
            style={styles.input}
            value={formData.companyName}
            onChangeText={(text) => handleChange('companyName', text)}
          />
          
          <Text style={styles.label}>Área de Negocio</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.businessArea}
              onValueChange={(itemValue) => handleChange('businessArea', itemValue)}
              style={styles.picker}
            >
              {businessAreas.map((item, index) => (
                <Picker.Item key={index} label={item} value={item} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Tamaño del Equipo</Text>
          <View style={styles.teamSizeContainer}>
            {teamSizes.map((size, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.teamSizeButton, 
                  formData.teamSize === size && styles.teamSizeButtonActive
                ]}
                onPress={() => handleChange('teamSize', size)}
              >
                <Text style={[
                  styles.teamSizeText, 
                  formData.teamSize === size && styles.teamSizeTextActive
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 30,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 10,
  },
  formCard: {
    width: '90%',
    maxWidth: 600,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 20,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileEmail: {
    fontSize: 18,
    color: '#888',
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#720819',
    marginBottom: 10,
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
    alignSelf: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  pickerContainer: {
    width: '80%',
    alignSelf: 'center',
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
    alignSelf: 'center',
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
  radioContainer: {
    width: '80%',
    alignSelf: 'center',
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
  saveButton: {
    backgroundColor: '#720819',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    width: '80%',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
});

export default EditPerfilScreen;