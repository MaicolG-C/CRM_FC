// ==========================================================
// src/DashboardScreen.js
// VERSIÓN CORREGIDA PARA MOSTRAR EL NOMBRE DE USUARIO
// ==========================================================

import React, { useState, useContext } from 'react'; // Se importa useContext
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, Dimensions, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './../../backend/AuthContext'; // Se importa el AuthContext
import { useNotifications } from './../../backend/NotificationContext';
import { useProjects } from './../../backend/ProjectsContext';
import { useEmployees } from './../../backend/EmployeesContext';

const { width } = Dimensions.get('window');

import ProyectosScreen from './ProyectosScreen';
import CalendarioScreen from './CalendarioScreen';
import LeadsScreen from './LeadsScreen';
import EmpleadosScreen from './EmpleadosScreen';
import MensajesScreen from './MensajesScreen';
import PerfilScreen from './PerfilScreen';

const NotificationsModal = ({ isVisible, onClose, notifications }) => (
  <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}>
    <View style={styles.modalOverlay}><View style={styles.modalContainer}><Text style={styles.modalTitle}>Notificaciones</Text><ScrollView>{notifications.length > 0 ? (notifications.map(notif => (<View key={notif.id} style={[styles.notificationItem, !notif.read && styles.notificationUnread]}><Text style={styles.notificationText}><Text style={styles.notificationUser}>{notif.name}</Text>: {notif.activity}</Text></View>))) : (<Text style={styles.noNotificationsText}>No hay notificaciones</Text>)}</ScrollView><TouchableOpacity style={styles.closeButton} onPress={onClose}><Text style={styles.closeButtonText}>Cerrar</Text></TouchableOpacity></View></View>
  </Modal>
);

const DashboardScreen = () => {
  const navigation = useNavigation();
  
  // =============================================================
  // CORRECCIÓN PRINCIPAL
  // =============================================================
  // 1. Usamos useContext para acceder a los datos del AuthContext
  const { signOut, user } = useContext(AuthContext); 
  
  // 2. Extraemos los datos del perfil del usuario del estado 'user'
  const userProfileData = user || {};

  // 3. Obtenemos el nombre de forma más robusta
  //    Primero busca 'user.name', si no existe, lo crea a partir del email.
  const userName = userProfileData.name || (userProfileData.email ? userProfileData.email.split('@')[0] : 'Usuario');
  // =============================================================

  const { activityFeed, unreadCount, markAllAsRead } = useNotifications();
  const { projects } = useProjects();
  const { employees } = useEmployees();

  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);
  
  const [initialEmployeeId, setInitialEmployeeId] = useState(null);
  const [initialProjectId, setInitialProjectId] = useState(null);

  const handleOpenNotifications = () => {
    setNotificationsVisible(true);
    markAllAsRead();
  };
  
  const handleSidebarClick = (screenName) => {
    setInitialEmployeeId(null);
    setInitialProjectId(null);
    setCurrentScreen(screenName);
  };

  const events = [ { id: 1, title: 'Presentación del nuevo departamento', time: 'Hoy | 3:00 PM', timeRemaining: '4h', date: '2025-08-23' }, { id: 2, title: 'Cumpleaños de Fernanda', time: 'Hoy | 5:00 PM', timeRemaining: '4h', date: '2025-08-23' }, { id: 3, title: 'Reunión de Métricas', time: 'Mañana | 2:00 PM', timeRemaining: '4h', date: '2025-08-24' }, ];
  
  const filteredEmployees = employees.filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredEvents = events.filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredProjects = projects.filter(proj => proj.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredActivity = activityFeed.filter(act => act.activity.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Proyectos': return <ProyectosScreen initialProjectId={initialProjectId} />;
      case 'Calendario': return <CalendarioScreen />;
      case 'Leads': return <LeadsScreen />;
      case 'Empleados': return <EmpleadosScreen initialEmployeeId={initialEmployeeId} />;
      case 'Mensajes': return <MensajesScreen />;
      case 'Perfil': return <PerfilScreen navigation={navigation} route={{ params: userProfileData }} />;
      default:
        return (
          <ScrollView style={styles.dashboardContent}>
            <View style={styles.header}><View><Text style={styles.greetingText}>¡Bienvenido de nuevo, <Text style={styles.userName}>{userName}!</Text></Text><Text style={styles.dashboardTitle}>Dashboard</Text></View><View style={styles.headerRight}><View style={styles.searchBar}><Icon name="search" size={18} color="#aaa" /><TextInput style={styles.searchInput} placeholder="Buscar" placeholderTextColor="#aaa" value={searchTerm} onChangeText={setSearchTerm} /></View><TouchableOpacity onPress={handleOpenNotifications} style={styles.bellIconContainer}><Icon name="bell" size={24} color="#555" />{unreadCount > 0 && (<View style={styles.notificationBadge}><Text style={styles.notificationBadgeText}>{unreadCount}</Text></View>)}</TouchableOpacity><TouchableOpacity style={styles.userProfile} onPress={() => navigation.navigate('Perfil', { ...userProfileData })}><Image source={require('./../../assets/itq_logo.png')} style={styles.profilePic} /><Text style={styles.profileName}>{userName}</Text></TouchableOpacity></View></View>
            <View style={styles.widgetsContainer}>
              <View style={styles.widgetCard}><Text style={styles.widgetTitle}>Carga de trabajo</Text><View style={styles.employeesGrid}>{filteredEmployees.map(emp => ( <TouchableOpacity key={emp.id} style={styles.employeeCard} onPress={() => { setInitialEmployeeId(emp.id); setCurrentScreen('Empleados'); }}><View style={[styles.statusCircle, { backgroundColor: emp.status === 'Conectado' ? '#22C55E' : '#EF4444' }]} /><Image source={{ uri: emp.avatar }} style={styles.employeeImage} /><Text style={styles.employeeName}>{emp.name}</Text><Text style={styles.employeePosition}>{emp.position}</Text></TouchableOpacity>))}</View></View>
              <View style={styles.widgetCard}><Text style={styles.widgetTitle}>Eventos</Text>{filteredEvents.map(event => ( <TouchableOpacity key={event.id} onPress={() => handleSidebarClick('Calendario')}><View style={styles.eventItem}><View><Text style={styles.eventTitle}>{event.title}</Text><Text style={styles.eventTime}>{event.time}</Text></View><View style={styles.timeRemaining}><Text style={styles.timeRemainingText}>{event.timeRemaining}</Text></View></View></TouchableOpacity>))}</View>
              <View style={styles.widgetCard}><Text style={styles.widgetTitle}>Proyectos</Text>{filteredProjects.map(proj => ( <TouchableOpacity key={proj.id} onPress={() => { setInitialProjectId(proj.id); setCurrentScreen('Proyectos'); }}><View style={styles.projectItem}><Text style={styles.projectCode}>{proj.code}</Text><Text style={styles.projectName}>{proj.name}</Text><View style={styles.projectStats}><Text>Tareas: {proj.tasks.length}</Text></View></View></TouchableOpacity>))}</View>
              <View style={styles.widgetCard}><Text style={styles.widgetTitle}>Flujo de actividad</Text>{filteredActivity.slice(0, 5).map(act => (<View key={act.id} style={styles.activityItem}><Text style={styles.activityText}><Text style={styles.activityUser}>{act.name}</Text>: {act.activity}</Text></View>))}</View>
            </View>
          </ScrollView>
        );
    }
  };

  const SidebarItem = ({ name, icon, screenName }) => (
    <TouchableOpacity style={[styles.sidebarItem, currentScreen === screenName && styles.sidebarItemActive]} onPress={() => handleSidebarClick(screenName)}>
      <Icon name={icon} size={20} color={currentScreen === screenName ? '#fff' : '#888'} />
      <Text style={[styles.sidebarItemText, currentScreen === screenName && styles.sidebarItemTextActive]}>{name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}><View style={styles.logoContainer}><Text style={styles.logoText}>itq</Text></View><ScrollView style={styles.menuItems}><SidebarItem name="Dashboard" icon="grid" screenName="Dashboard" /><SidebarItem name="Proyectos" icon="folder" screenName="Proyectos" /><SidebarItem name="Calendario" icon="calendar" screenName="Calendario" /><SidebarItem name="Leads" icon="user" screenName="Leads" /><SidebarItem name="Empleados" icon="users" screenName="Empleados" /><SidebarItem name="Mensajes" icon="message-square" screenName="Mensajes" /></ScrollView><TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}><Icon name="log-out" size={20} color="#888" /><Text style={styles.logoutButtonText}>Cerrar Sesión</Text></TouchableOpacity></View>
      <View style={styles.mainContent}>{renderScreen()}</View>
      <NotificationsModal isVisible={isNotificationsVisible} onClose={() => setNotificationsVisible(false)} notifications={activityFeed}/>
    </View>
  );
};

// --- Estilos sin cambios ---
const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#f5f5f5' },
  sidebar: { width: 250, backgroundColor: '#fff', borderRightWidth: 1, borderRightColor: '#ccc', paddingVertical: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logoText: { fontSize: 40, fontWeight: 'bold', color: '#720819' },
  menuItems: { flex: 1 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, marginBottom: 5 },
  sidebarItemActive: { backgroundColor: '#720819', borderRadius: 8, marginHorizontal: 10 },
  sidebarItemText: { marginLeft: 15, fontSize: 16, color: '#333' },
  sidebarItemTextActive: { color: '#fff', fontWeight: 'bold' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#ccc', marginTop: 20 },
  logoutButtonText: { marginLeft: 10, fontSize: 16, color: '#888' },
  mainContent: { flex: 1, padding: 20 },
  dashboardContent: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  greetingText: { fontSize: 16, color: '#666' },
  userName: { fontWeight: 'bold', color: '#333' },
  dashboardTitle: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, borderColor: '#ccc', width: 250 },
  searchInput: { marginLeft: 10, flex: 1 },
  userProfile: { flexDirection: 'row', alignItems: 'center', marginLeft: 15 },
  profilePic: { width: 40, height: 40, borderRadius: 20 },
  profileName: { marginLeft: 10, fontWeight: 'bold' },
  bellIconContainer: { marginLeft: 15, padding: 5 },
  notificationBadge: { position: 'absolute', right: 0, top: 0, backgroundColor: 'red', borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  notificationBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  widgetsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  widgetCard: { backgroundColor: '#fff', borderRadius: 10, padding: 20, marginBottom: 20, width: '48%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  widgetTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  employeesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
  employeeCard: { alignItems: 'center', width: '48%', marginBottom: 20 },
  statusCircle: { width: 10, height: 10, borderRadius: 5, position: 'absolute', top: 5, right: 15, zIndex: 1 },
  employeeImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 5 },
  employeeName: { fontWeight: 'bold', textAlign: 'center' },
  employeePosition: { fontSize: 12, color: '#888', textAlign: 'center' },
  statusPill: { backgroundColor: '#eee', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, marginTop: 5 },
  statusText: { fontSize: 10, color: '#555' },
  eventItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  eventTitle: { fontWeight: 'bold' },
  eventTime: { color: '#888', fontSize: 12 },
  timeRemaining: { backgroundColor: '#720819', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  timeRemainingText: { color: '#fff', fontSize: 10 },
  projectItem: { marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  projectCode: { fontWeight: 'bold', color: '#888', fontSize: 12 },
  projectName: { fontSize: 16, fontWeight: 'bold' },
  projectDate: { fontSize: 12, color: '#888', marginTop: 5 },
  projectStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  activityItem: { marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  activityText: { fontSize: 14 },
  activityUser: { fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingTop: 80, paddingRight: 20 },
  modalContainer: { backgroundColor: 'white', borderRadius: 10, padding: 20, width: 350, maxHeight: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  notificationItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  notificationUnread: { backgroundColor: '#fdecec' },
  notificationText: { fontSize: 14 },
  notificationUser: { fontWeight: 'bold' },
  noNotificationsText: { textAlign: 'center', color: '#888', marginTop: 20 },
  closeButton: { backgroundColor: '#720819', borderRadius: 8, padding: 10, marginTop: 20, alignItems: 'center' },
  closeButtonText: { color: 'white', fontWeight: 'bold' },
});

export default DashboardScreen;