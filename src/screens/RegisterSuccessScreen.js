import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const RegisterSuccessScreen = ({ navigation }) => {
  const handleStart = () => {
    // Navegar a la pantalla de login para que el usuario pueda iniciar sesión
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Panel Izquierdo con imagen */}
      <View style={styles.leftPanel}>
        <Text style={styles.title}>itq</Text>
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
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#720819',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
});

export default RegisterSuccessScreen;
