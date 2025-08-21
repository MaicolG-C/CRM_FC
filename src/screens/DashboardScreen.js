// ==========================================================
// src/DashboardScreen.js
// Pantalla principal del dashboard con barra de navegación lateral y widgets.
// ==========================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// Importar los componentes de las pantallas individuales
import ProyectosScreen from './ProyectosScreen';
import CalendarioScreen from './CalendarioScreen';
import LeadsScreen from './LeadsScreen';
import EmpleadosScreen from './EmpleadosScreen';
import MensajesScreen from './MensajesScreen';

const DashboardScreen = ({ navigation }) => {
  // Estado para controlar qué pantalla se muestra en el panel principal
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Datos de ejemplo para las secciones del dashboard
  const employees = [
    { id: 1, name: 'Pedro Rojas', position: 'Supervisor de Admisiones', status: 'Conectado' },
    { id: 2, name: 'Mónica Argudo', position: 'Coordinadora de Admisiones', status: 'Desconectado' },
    { id: 3, name: 'Fernanda Paredes', position: 'Asesora Académica', status: 'Conectado' },
    { id: 4, name: 'Christopher Villagómez', position: 'Asesor Académico', status: 'Conectado' },
    { id: 5, name: 'Melania Durán', position: 'Asesora Académica', status: 'Desconectado' },
    { id: 6, name: 'Kevin Zapata', position: 'Asesor Académico', status: 'Conectado' },
    { id: 7, name: 'Patricia Insua', position: 'Asesora Académica', status: 'Desconectado' },
    { id: 8, name: 'María Belén Chamorro', position: 'Asesora Académica', status: 'Conectado' },
  ];

  const events = [
    { id: 1, title: 'Presentación del nuevo departamento', time: 'Hoy | 3:00 PM', timeRemaining: '4h' },
    { id: 2, title: 'Cumpleaños de Fernanda', time: 'Hoy | 5:00 PM', timeRemaining: '4h' },
    { id: 3, title: 'Reunión de Métricas', time: 'Mañana | 2:00 PM', timeRemaining: '4h' },
  ];

  const projects = [
    { id: 1, name: 'App Admisiones', code: 'PN0001265', date: 'Sep 12, 2020', priority: 'Medio', tasks: 34, activeTasks: 13 },
    { id: 2, name: 'Pagina Web ITQ', code: 'PN0001222', date: 'Sep 10, 2020', priority: 'Medio', tasks: 50, activeTasks: 24 },
    { id: 3, name: 'Proyectos Internos', code: 'PN0001290', date: 'May 28, 2020', priority: 'Bajo', tasks: 23, activeTasks: 20 },
  ];

  const activityFeed = [
    { id: 1, name: 'Fernanda Paredes', position: 'Asesora Comercial', activity: 'Se actualizó el estado de la tarea de contacto en progreso.' },
    { id: 2, name: 'Christopher Villagómez', position: 'Asesor Comercial', activity: 'Se actualizó el estado de la tarea de contacto en progreso.' },
    { id: 3, name: 'Archivo Adjunto', position: 'Tarea', activity: 'Archivos adjuntos a la tarea.' },
  ];
  
  // Filtrar los datos basados en el término de búsqueda
  const filteredEmployees = employees.filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredEvents = events.filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredProjects = projects.filter(proj => proj.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredActivity = activityFeed.filter(act => act.activity.toLowerCase().includes(searchTerm.toLowerCase()));

  // Función para renderizar el componente de pantalla basado en el estado
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Proyectos':
        return <ProyectosScreen />;
      case 'Calendario':
        return <CalendarioScreen />;
      case 'Leads':
        return <LeadsScreen />;
      case 'Empleados':
        return <EmpleadosScreen />;
      case 'Mensajes':
        return <MensajesScreen />;
      default:
        // Contenido del Dashboard con los widgets
        return (
          <ScrollView style={styles.dashboardContent}>
            {/* Encabezado del Dashboard */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greetingText}>¡Bienvenido de nuevo, <Text style={styles.userName}>Pedro!</Text></Text>
                <Text style={styles.dashboardTitle}>Dashboard</Text>
              </View>
              <View style={styles.headerRight}>
                <View style={styles.searchBar}>
                  <Icon name="search" size={18} color="#aaa" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar"
                    placeholderTextColor="#aaa"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                  />
                </View>
                <Icon name="bell" size={24} color="#555" style={{ marginLeft: 15 }} />
                <View style={styles.userProfile}>
                  <Image source={{ uri: 'https://placehold.co/40x40' }} style={styles.profilePic} />
                  <Text style={styles.profileName}>Pedro Rojas</Text>
                </View>
              </View>
            </View>

            {/* Widgets del Dashboard */}
            <View style={styles.widgetsContainer}>
              {/* Widget de Carga de trabajo */}
              <View style={styles.widgetCard}>
                <Text style={styles.widgetTitle}>Carga de trabajo</Text>
                <View style={styles.employeesGrid}>
                  {filteredEmployees.map(emp => (
                    <View key={emp.id} style={styles.employeeCard}>
                      <View style={[styles.statusCircle, { backgroundColor: emp.status === 'Conectado' ? 'green' : 'red' }]} />
                      <Image source={{ uri: 'https://placehold.co/60x60' }} style={styles.employeeImage} />
                      <Text style={styles.employeeName}>{emp.name}</Text>
                      <Text style={styles.employeePosition}>{emp.position}</Text>
                      <View style={styles.statusPill}>
                        <Text style={styles.statusText}>{emp.status}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Widget de Eventos */}
              <View style={styles.widgetCard}>
                <Text style={styles.widgetTitle}>Eventos</Text>
                {filteredEvents.map(event => (
                  <View key={event.id} style={styles.eventItem}>
                    <View>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventTime}>{event.time}</Text>
                    </View>
                    <View style={styles.timeRemaining}>
                      <Text style={styles.timeRemainingText}>{event.timeRemaining}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Widget de Proyectos */}
              <View style={styles.widgetCard}>
                <Text style={styles.widgetTitle}>Proyectos</Text>
                {filteredProjects.map(proj => (
                  <View key={proj.id} style={styles.projectItem}>
                    <Text style={styles.projectCode}>{proj.code}</Text>
                    <Text style={styles.projectName}>{proj.name}</Text>
                    <Text style={styles.projectDate}>Creado {proj.date}</Text>
                    <View style={styles.projectStats}>
                      <Text>Tareas: {proj.tasks}</Text>
                      <Text>Activas: {proj.activeTasks}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Widget de Flujo de actividad */}
              <View style={styles.widgetCard}>
                <Text style={styles.widgetTitle}>Flujo de actividad</Text>
                {filteredActivity.map(act => (
                  <View key={act.id} style={styles.activityItem}>
                    <Text style={styles.activityText}>
                      <Text style={styles.activityUser}>{act.name}</Text>: {act.activity}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        );
    }
  };

  const SidebarItem = ({ name, icon, screenName, onPress }) => (
    <TouchableOpacity 
      style={[styles.sidebarItem, currentScreen === screenName && styles.sidebarItemActive]} 
      onPress={() => onPress(screenName)}
    >
      <Icon name={icon} size={20} color={currentScreen === screenName ? '#fff' : '#888'} />
      <Text style={[styles.sidebarItemText, currentScreen === screenName && styles.sidebarItemTextActive]}>
        {name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Barra de Navegación Lateral */}
      <View style={styles.sidebar}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>itq</Text>
        </View>
        <ScrollView style={styles.menuItems}>
          <SidebarItem name="Dashboard" icon="grid" screenName="Dashboard" onPress={setCurrentScreen} />
          <SidebarItem name="Proyectos" icon="folder" screenName="Proyectos" onPress={setCurrentScreen} />
          <SidebarItem name="Calendario" icon="calendar" screenName="Calendario" onPress={setCurrentScreen} />
          <SidebarItem name="Leads" icon="user" screenName="Leads" onPress={setCurrentScreen} />
          <SidebarItem name="Empleados" icon="users" screenName="Empleados" onPress={setCurrentScreen} />
          <SidebarItem name="Mensajes" icon="message-square" screenName="Mensajes" onPress={setCurrentScreen} />
        </ScrollView>
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
          <Icon name="log-out" size={20} color="#888" />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido Principal */}
      <View style={styles.mainContent}>
        {renderScreen()}
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
  sidebar: {
    width: 250,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#720819',
  },
  menuItems: {
    flex: 1,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  sidebarItemActive: {
    backgroundColor: '#720819',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  sidebarItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  sidebarItemTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 20,
  },
  logoutButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#888',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  dashboardContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greetingText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontWeight: 'bold',
    color: '#333',
  },
  dashboardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    width: 250,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileName: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  widgetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  widgetCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  widgetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  employeesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  employeeCard: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 20,
  },
  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 5,
    right: 5,
  },
  employeeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  employeeName: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  employeePosition: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  statusPill: {
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 5,
  },
  statusText: {
    fontSize: 10,
    color: '#555',
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  eventTitle: {
    fontWeight: 'bold',
  },
  eventTime: {
    color: '#888',
    fontSize: 12,
  },
  timeRemaining: {
    backgroundColor: '#720819',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timeRemainingText: {
    color: '#fff',
    fontSize: 10,
  },
  projectItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  projectCode: {
    fontWeight: 'bold',
    color: '#777',
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  projectDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  projectStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  activityItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  activityText: {
    fontSize: 14,
  },
  activityUser: {
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
