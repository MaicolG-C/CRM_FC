// ==========================================================
// src/PerfilScreen.js
// Pantalla de perfil de usuario que muestra la información de registro.
// Ahora incluye un botón para navegar a la pantalla de edición.
// Se ha corregido la carga de la imagen para usar 'require'.
// ==========================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';

const PerfilScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Obtenemos los datos de registro pasados como parámetros de navegación
  const { 
    email, 
    useReason, 
    position, 
    hasExperience, 
    companyName, 
    businessArea, 
    teamSize 
  } = route.params || {};

  // Función para renderizar un ítem de perfil
  const renderProfileItem = (label, value) => (
    <View style={styles.profileItem}>
      <Text style={styles.itemLabel}>{label}:</Text>
      <Text style={styles.itemValue}>{value || 'N/A'}</Text>
    </View>
  );
  
  // Objeto de perfil para pasar a la pantalla de edición
  const userProfile = {
    email,
    useReason,
    position,
    hasExperience,
    companyName,
    businessArea,
    teamSize,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Barra de título del perfil */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#555" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('EditPerfil', { userProfile })}
        >
          <Icon name="edit" size={20} color="#720819" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        {/* Encabezado del perfil */}
        <View style={styles.profileHeader}>
          <Image
            source={require('./../../assets/itq_logo.png')} // Se ha corregido para usar la ruta local
            style={styles.profilePic}
          />
          <Text style={styles.profileName}>
            {email ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) : 'Usuario'}
          </Text>
          <Text style={styles.profileEmail}>{email || 'Correo no disponible'}</Text>
        </View>

        {/* Información del perfil */}
        <View style={styles.profileInfoContainer}>
          <Text style={styles.infoTitle}>Información de Registro</Text>
          <View style={styles.profileItems}>
            {renderProfileItem("Motivo de uso", useReason)}
            {renderProfileItem("Puesto", position)}
            {renderProfileItem("Experiencia en CRM", hasExperience ? "Sí" : "No")}
            {renderProfileItem("Nombre de la empresa", companyName)}
            {renderProfileItem("Área de negocio", businessArea)}
            {renderProfileItem("Tamaño del equipo", teamSize)}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingVertical: 20,
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
  },
  backButton: {
    padding: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#720819',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  editButtonText: {
    color: '#720819',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
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
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#720819',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
  },
  profileInfoContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#720819',
    marginBottom: 10,
  },
  profileItems: {
    width: '100%',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  itemValue: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1, // Permite que el texto se ajuste si es largo
    textAlign: 'right',
  },
});

export default PerfilScreen;
