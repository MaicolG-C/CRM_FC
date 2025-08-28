// ==========================================================
// src/screens/EmpleadosScreen.js
// VERSIÓN CON CORRECCIÓN FINAL DE LAYOUT DEL MODAL
// ==========================================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNotifications } from '../../backend/NotificationContext';
import { useProjects } from '../../backend/ProjectsContext';
import { useEmployees } from '../../backend/EmployeesContext';
import { Picker } from '@react-native-picker/picker';

// --- COMPONENTES INTERNOS SIN CAMBIOS (EmployeeProfile, ProjectView, AddProjectModal, CustomDatePickerModal) ---
const EmployeeProfile = ({ employee, onGoBack, onEdit, projects }) => {
    const [activeTab, setActiveTab] = useState('projects');
    const employeeProjects = projects.filter(project => project.members && project.members.includes(employee.id));
    const renderProjectsTab = () => ( <View style={profileStyles.tabContent}>{employeeProjects.length > 0 ? (employeeProjects.map(project => (<View key={project.id} style={profileStyles.projectCard}><View style={profileStyles.projectHeader}><Text style={profileStyles.projectTitle}>{project.name}</Text></View><Text style={profileStyles.projectSubtitle}><Text style={{fontWeight: 'bold'}}>Tareas: </Text>{project.tasks.length}</Text></View>))) : ( <Text style={profileStyles.noDataText}>No hay proyectos asignados.</Text> )}</View> );
    const renderTeamTab = () => ( <View style={profileStyles.tabContent}><Text style={profileStyles.teamText}><Text style={{fontWeight: 'bold'}}>Equipo:</Text> {employee.team}</Text></View> );
    const renderVacationsTab = () => { return (<View style={profileStyles.tabContent}><Text>Función de vacaciones en desarrollo.</Text></View>) };
    return ( <View style={profileStyles.container}><ScrollView><TouchableOpacity onPress={onGoBack} style={profileStyles.backButton}><Text style={{fontSize: 24, color: '#1F2937'}}>‹</Text></TouchableOpacity><View style={profileStyles.header}><View style={profileStyles.headerTitleContainer}><Text style={profileStyles.headerTitle}>Perfil de Empleado</Text><TouchableOpacity onPress={() => onEdit(employee)}><Text style={{fontSize: 24, color: '#1F2937'}}>✎</Text></TouchableOpacity></View><View style={profileStyles.profileHeaderInfo}><Image style={profileStyles.avatar} source={{ uri: employee.avatar }} /><View><Text style={profileStyles.profileName}>{employee.name}</Text><Text style={profileStyles.profilePosition}>{employee.position}</Text></View></View></View><View style={profileStyles.tabContainer}><TouchableOpacity onPress={() => setActiveTab('projects')} style={[profileStyles.tabButton, activeTab === 'projects' && profileStyles.activeTab]}><Text style={[profileStyles.tabText, activeTab === 'projects' && profileStyles.activeTabText]}>Proyectos</Text></TouchableOpacity><TouchableOpacity onPress={() => setActiveTab('team')} style={[profileStyles.tabButton, activeTab === 'team' && profileStyles.activeTab]}><Text style={[profileStyles.tabText, activeTab === 'team' && profileStyles.activeTabText]}>Equipo</Text></TouchableOpacity><TouchableOpacity onPress={() => setActiveTab('vacations')} style={[profileStyles.tabButton, activeTab === 'vacations' && profileStyles.activeTab]}><Text style={[profileStyles.tabText, activeTab === 'vacations' && profileStyles.activeTabText]}>Vacaciones</Text></TouchableOpacity></View>{activeTab === 'projects' && renderProjectsTab()}{activeTab === 'team' && renderTeamTab()}{activeTab === 'vacations' && renderVacationsTab()}<View style={profileStyles.section}><Text style={profileStyles.sectionTitle}>Info Principal</Text><View style={profileStyles.infoItem}><Text style={profileStyles.infoLabel}>Posición</Text><Text style={profileStyles.infoValue}>{employee.position}</Text></View><View style={profileStyles.infoItem}><Text style={profileStyles.infoLabel}>Equipo</Text><Text style={profileStyles.infoValue}>{employee.team}</Text></View><View style={profileStyles.infoItem}><Text style={profileStyles.infoLabel}>Ubicación</Text><Text style={profileStyles.infoValue}>{employee.location}</Text></View><View style={profileStyles.infoItem}><Text style={profileStyles.infoLabel}>Cumpleaños</Text><Text style={profileStyles.infoValue}>{employee.birthdate}</Text></View></View><View style={profileStyles.section}><Text style={profileStyles.sectionTitle}>Contacto</Text><View style={profileStyles.infoItem}><Text style={profileStyles.infoLabel}>Email</Text><Text style={profileStyles.infoValue}>{employee.email}</Text></View><View style={profileStyles.infoItem}><Text style={profileStyles.infoLabel}>Teléfono</Text><Text style={profileStyles.infoValue}>{employee.phone}</Text></View></View></ScrollView></View> );
};
const ProjectView = ({ projects, employees, onAddProject }) => (
    <ScrollView style={styles.scrollView}><View style={projectStyles.header}><Text style={projectStyles.headerTitle}>Proyectos ({projects.length})</Text><TouchableOpacity onPress={onAddProject} style={styles.addButton}><Text style={styles.addButtonText}>+ Añadir Proyecto</Text></TouchableOpacity></View>{projects.map(project => (<View key={project.id} style={projectStyles.projectCard}><Text style={projectStyles.projectName}>{project.name}</Text><View style={projectStyles.projectDetailsRow}><View style={projectStyles.projectDetailItem}><Text style={projectStyles.projectDetailLabel}>ID:</Text><Text style={projectStyles.projectDetailValue}>{project.id}</Text></View></View><Text style={projectStyles.membersTitle}>Miembros del Equipo:</Text><View style={projectStyles.membersContainer}>{project.members && project.members.map(memberId => { const member = employees.find(emp => emp.id === memberId); return member ? (<View key={member.id} style={projectStyles.memberTag}><Image style={projectStyles.memberAvatar} source={{ uri: member.avatar }} /><Text style={projectStyles.memberText}>{member.name.split(' ')[0]}</Text></View>) : null; })}{!project.members || project.members.length === 0 && (<Text style={projectStyles.noMembersText}>No hay miembros asignados.</Text>)}</View></View>))}</ScrollView>
);
const AddProjectModal = ({ isVisible, onClose, onSave, employees }) => {
    const [formData, setFormData] = useState({ name: '', code: '', priority: 'Media', members: [] });
    const priorities = ['Alta', 'Media', 'Baja'];
    const handleToggleMember = (memberId) => { setFormData(prevData => { const newMembers = prevData.members.includes(memberId) ? prevData.members.filter(id => id !== memberId) : [...prevData.members, memberId]; return { ...prevData, members: newMembers }; }); };
    const handleSave = () => { onSave(formData); onClose(); setFormData({ name: '', code: '', priority: 'Media', members: [] }); };
    return ( <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}><View style={styles.modalContainer}><View style={[styles.modalContent, projectStyles.addProjectModal]}><Text style={styles.modalTitle}>Añadir Nuevo Proyecto</Text><TextInput style={styles.textInput} placeholder="Nombre del Proyecto" value={formData.name} onChangeText={text => setFormData({ ...formData, name: text })} /><TextInput style={styles.textInput} placeholder="Código del Proyecto (Ej. ITQ-001)" value={formData.code} onChangeText={text => setFormData({ ...formData, code: text })} /><View style={styles.pickerContainer}><Picker selectedValue={formData.priority} onValueChange={(itemValue) => setFormData({ ...formData, priority: itemValue })} style={styles.picker}>{priorities.map(p => <Picker.Item key={p} label={`Prioridad ${p}`} value={p} />)}</Picker></View><Text style={projectStyles.selectMembersTitle}>Seleccionar Miembros:</Text><ScrollView style={projectStyles.membersSelectionContainer}>{employees.map(employee => (<TouchableOpacity key={employee.id} style={[projectStyles.memberSelectionItem, formData.members.includes(employee.id) && projectStyles.memberSelected]} onPress={() => handleToggleMember(employee.id)}><Image style={projectStyles.memberSelectionAvatar} source={{ uri: employee.avatar }} /><Text style={projectStyles.memberSelectionText}>{employee.name}</Text>{formData.members.includes(employee.id) && ( <Text>✓</Text> )}</TouchableOpacity>))}</ScrollView><View style={styles.buttonRow}><TouchableOpacity onPress={onClose} style={[styles.modalButton, styles.modalCancelButton]}><Text style={styles.buttonText}>Cancelar</Text></TouchableOpacity><TouchableOpacity onPress={handleSave} style={[styles.modalButton, styles.modalConfirmButton]}><Text style={styles.buttonText}>Guardar</Text></TouchableOpacity></View></View></View></Modal> );
};
const CustomDatePickerModal = ({ isVisible, onClose, onSelectDate, initialDate }) => {
    const [date, setDate] = useState(initialDate || new Date(new Date().getFullYear() - 25, 0, 1));
    const [viewMode, setViewMode] = useState('days');
    useEffect(() => { setDate(initialDate || new Date(new Date().getFullYear() - 25, 0, 1)); }, [initialDate, isVisible]);
    const changeMonth = (amount) => setDate(new Date(date.getFullYear(), date.getMonth() + amount, 1));
    const changeYearRange = (amount) => setDate(new Date(date.getFullYear() + amount, date.getMonth(), 1));
    const selectYear = (year) => { setDate(new Date(year, date.getMonth(), 1)); setViewMode('months'); };
    const selectMonth = (month) => { setDate(new Date(date.getFullYear(), month, 1)); setViewMode('days'); };
    const renderHeader = () => ( <View style={styles.calendarHeader}><TouchableOpacity onPress={() => viewMode === 'years' ? changeYearRange(-10) : changeMonth(-1)}><Text style={styles.calendarNav}>‹</Text></TouchableOpacity><View style={{flexDirection: 'row'}}><TouchableOpacity onPress={() => setViewMode('months')}><Text style={styles.calendarMonthYear}>{date.toLocaleString('es-EC', { month: 'long' })}</Text></TouchableOpacity><TouchableOpacity onPress={() => setViewMode('years')}><Text style={styles.calendarMonthYear}> {date.getFullYear()}</Text></TouchableOpacity></View><TouchableOpacity onPress={() => viewMode === 'years' ? changeYearRange(10) : changeMonth(1)}><Text style={styles.calendarNav}>›</Text></TouchableOpacity></View> );
    const renderDays = () => { const month = date.getMonth(); const year = date.getFullYear(); const firstDayOfMonth = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate(); const days = []; for (let i = 0; i < firstDayOfMonth; i++) days.push(<View key={`empty-${i}`} style={styles.calendarDayEmpty} />); for (let day = 1; day <= daysInMonth; day++) { days.push( <TouchableOpacity key={day} style={styles.calendarDay} onPress={() => onSelectDate(new Date(year, month, day))}><Text style={styles.calendarDayText}>{day}</Text></TouchableOpacity> ); } return <><View style={styles.calendarWeekdays}>{['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => <Text key={i} style={styles.calendarWeekdayText}>{d}</Text>)}</View><View style={styles.calendarGrid}>{days}</View></>; };
    const renderMonths = () => { const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('es-EC', { month: 'long' })); return <View style={styles.calendarGrid}>{months.map((month, i) => <TouchableOpacity key={month} style={styles.monthYearItem} onPress={() => selectMonth(i)}><Text style={styles.monthYearItemText}>{month}</Text></TouchableOpacity>)}</View>; };
    const renderYears = () => { const currentYear = date.getFullYear(); const startYear = Math.floor(currentYear / 10) * 10 - 1; const years = []; for (let i = 0; i < 12; i++) { const year = startYear + i; years.push(<TouchableOpacity key={year} style={styles.monthYearItem} onPress={() => selectYear(year)}><Text style={styles.monthYearItemText}>{year}</Text></TouchableOpacity>); } return <View style={styles.calendarGrid}>{years}</View>; };
    return ( <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}><View style={styles.modalContainer}><View style={styles.calendarModalContent}>{renderHeader()}{viewMode === 'days' && renderDays()}{viewMode === 'months' && renderMonths()}{viewMode === 'years' && renderYears()}<TouchableOpacity onPress={onClose} style={[styles.modalButton, styles.modalCancelButton, { width: '100%', marginTop: 10 }]}><Text style={styles.buttonText}>Cerrar</Text></TouchableOpacity></View></View></Modal> );
};

const EmpleadosScreen = ({ initialEmployeeId }) => {
    const { addNotification } = useNotifications();
    const { projects, addProject } = useProjects();
    const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
    const teams = [...new Set(employees.map(emp => emp.team))].sort();
    const [view, setView] = useState('list');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isAddProjectModalVisible, setIsAddProjectModalVisible] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', position: '', seniority: '', phone: '', location: '', birthdate: '', team: teams[0] || '', avatar: null });
    const [errors, setErrors] = useState({});
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    
    useEffect(() => { if (initialEmployeeId) { const employeeToSelect = employees.find(e => e.id === initialEmployeeId); if (employeeToSelect) { setSelectedEmployee(employeeToSelect); } } }, [initialEmployeeId, employees]);
    
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name?.trim()) newErrors.name = 'El nombre es obligatorio.';
        if (!formData.position?.trim()) newErrors.position = 'La posición es obligatoria.';
        if (!formData.seniority?.trim()) newErrors.seniority = 'La antigüedad es obligatoria.';
        if (!formData.team?.trim()) newErrors.team = 'El equipo es obligatorio.';
        if (!formData.birthdate) newErrors.birthdate = 'La fecha de cumpleaños es obligatoria.';
        if (!formData.email?.trim()) newErrors.email = 'El email es obligatorio.';
        if (!formData.location?.trim()) newErrors.location = 'La ubicación es obligatoria.';
        if (!formData.phone?.trim()) newErrors.phone = 'El teléfono es obligatorio.';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El formato del email no es válido.';
        const ecuadorPhoneRegex = /^(09\d{8}|0[2-7]\d{7})$/;
        if (formData.phone && !ecuadorPhoneRegex.test(formData.phone.replace(/\s/g, ''))) { newErrors.phone = 'El teléfono debe ser un número válido de Ecuador (Ej: 09... o 02...).'; }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOpenEditModal = (employee = null) => {
        setCurrentEmployee(employee);
        if (employee) {
            setFormData({ name: employee.name, email: employee.email, position: employee.position, seniority: employee.seniority, phone: employee.phone, location: employee.location, birthdate: employee.birthdate, team: employee.team, avatar: employee.avatar });
        } else {
            setFormData({ name: '', email: '', position: '', seniority: '', phone: '', location: '', birthdate: '', team: teams[0] || '', avatar: null });
        }
        setErrors({});
        setIsEditModalVisible(true);
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); if (status !== 'granted') { Alert.alert('Permiso denegado', 'Necesitas dar permisos para acceder a la galería.'); return; }
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1, });
        if (!result.canceled) { setFormData({ ...formData, avatar: result.assets[0].uri }); }
    };

    const handleDateSelect = (selectedDate) => {
        if (selectedDate) {
            const formattedDate = selectedDate.toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' });
            setFormData({ ...formData, birthdate: formattedDate });
            if (errors.birthdate) setErrors(prev => ({...prev, birthdate: null}));
        }
        setDatePickerVisible(false);
    };
    
    const handleSave = () => {
        if (!validateForm()) { return; }
        if (currentEmployee) {
            const updatedData = { ...currentEmployee, ...formData }; updateEmployee(updatedData);
            if (selectedEmployee?.id === currentEmployee.id) { setSelectedEmployee(updatedData); }
            addNotification({ name: 'Sistema', activity: `Se ha actualizado el perfil de ${formData.name}.` });
        } else {
            addEmployee(formData);
            addNotification({ name: 'Sistema', activity: `El empleado ${formData.name} ha sido añadido.` });
        }
        setIsEditModalVisible(false);
    };
    
    const handleDelete = () => { const employeeData = employees.find(emp => emp.id === employeeToDelete); deleteEmployee(employeeToDelete); if (employeeData) { addNotification({ name: 'Sistema', activity: `El empleado ${employeeData.name} ha sido eliminado.` }); } setIsDeleteModalVisible(false); setEmployeeToDelete(null); setSelectedEmployee(null); };
    const handleOpenDeleteModal = (id) => { setEmployeeToDelete(id); setIsDeleteModalVisible(true); };
    const handleAddProjectInternal = (newProjectData) => { const addedProject = addProject(newProjectData); addNotification({ name: 'Gestor de Proyectos', activity: `Se creó el proyecto: "${addedProject.name}".` }); };
    const renderDeleteModal = () => ( <Modal animationType="fade" transparent={true} visible={isDeleteModalVisible} onRequestClose={() => setIsDeleteModalVisible(false)}><View style={styles.modalContainer}><View style={styles.modalContent}><Text style={styles.modalTitle}>Eliminar Empleado</Text><Text style={styles.modalText}>¿Estás seguro de que quieres eliminar a este empleado?</Text><View style={styles.buttonRow}><TouchableOpacity onPress={() => setIsDeleteModalVisible(false)} style={[styles.modalButton, styles.modalCancelButton]}><Text style={styles.buttonText}>Cancelar</Text></TouchableOpacity><TouchableOpacity onPress={handleDelete} style={[styles.modalButton, styles.modalConfirmButton]}><Text style={styles.buttonText}>Eliminar</Text></TouchableOpacity></View></View></View></Modal> );
    const renderListView = () => ( <ScrollView style={styles.scrollView}>{employees.map(employee => (<TouchableOpacity key={employee.id} onPress={() => setSelectedEmployee(employee)}><View style={styles.listItem}><Image style={styles.avatarListImage} source={{ uri: employee.avatar }} /><View style={styles.listItemTextContainer}><Text style={styles.listItemTitle}>{employee.name}</Text><Text style={styles.listItemSubtitle}>{employee.position}</Text><View style={styles.seniorityTag}><Text style={styles.seniorityText}>{employee.seniority}</Text></View></View><View style={styles.listItemActions}><TouchableOpacity onPress={() => handleOpenEditModal(employee)} style={[styles.actionButton, { backgroundColor: '#E5E7EB' }]}><Text>✎</Text></TouchableOpacity><TouchableOpacity onPress={() => handleOpenDeleteModal(employee.id)} style={[styles.actionButton, { backgroundColor: '#FEE2E2' }]}><Text>🗑️</Text></TouchableOpacity></View></View></TouchableOpacity>))}</ScrollView> );
    const renderActivityView = () => ( <ScrollView contentContainerStyle={styles.activityGrid}>{employees.map(employee => (<TouchableOpacity key={employee.id} onPress={() => setSelectedEmployee(employee)} style={styles.activityCard}><Image style={styles.avatarImage} source={{ uri: employee.avatar }} /><Text style={styles.activityTitle}>{employee.name}</Text><Text style={styles.activitySubtitle}>{employee.position}</Text><View style={styles.taskContainer}><View style={styles.taskItem}><Text style={styles.taskCount}>{employee.tasksPending}</Text><Text style={styles.taskLabel}>Pendientes</Text></View><View style={styles.taskItem}><Text style={styles.taskCount}>{employee.tasksProgress}</Text><Text style={styles.taskLabel}>En progreso</Text></View><View style={styles.taskItem}><Text style={styles.taskCount}>{employee.tasksReview}</Text><Text style={styles.taskLabel}>En revisión</Text></View></View></TouchableOpacity>))}</ScrollView> );

    // ==========================================================
    // MODIFICACIÓN: Reestructuración del JSX del modal
    // ==========================================================
    const renderEditModal = () => (
        <Modal animationType="fade" transparent={true} visible={isEditModalVisible} onRequestClose={() => setIsEditModalVisible(false)}>
            <View style={styles.modalContainer}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.kavContainer}
                >
                    <ScrollView>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{currentEmployee ? 'Editar Empleado' : 'Añadir Empleado'}</Text>
                            <TouchableOpacity style={styles.imagePickerContainer} onPress={handlePickImage}>{formData.avatar ? (<Image source={{ uri: formData.avatar }} style={styles.avatarPreview} />) : (<View style={styles.avatarPlaceholder}><Text style={styles.avatarPlaceholderText}>Subir Foto</Text></View>)}</TouchableOpacity>
                            <Text style={styles.formSectionTitle}>Información Personal</Text>
                            <TextInput style={[styles.textInput, errors.name && styles.inputError]} placeholder="Nombre Completo *" value={formData.name} onChangeText={text => { setFormData({ ...formData, name: text }); if (errors.name) setErrors(prev => ({...prev, name: null})); }} />
                            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                            <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                                <View style={[styles.datePickerInput, errors.birthdate && styles.inputError]}><Text style={formData.birthdate ? styles.datePickerText : styles.datePickerPlaceholder}>{formData.birthdate || 'Fecha de Cumpleaños *'}</Text></View>
                            </TouchableOpacity>
                            {errors.birthdate && <Text style={styles.errorText}>{errors.birthdate}</Text>}
                            <Text style={styles.formSectionTitle}>Información Laboral</Text>
                            <TextInput style={[styles.textInput, errors.position && styles.inputError]} placeholder="Posición *" value={formData.position} onChangeText={text => { setFormData({ ...formData, position: text }); if (errors.position) setErrors(prev => ({...prev, position: null})); }} />
                            {errors.position && <Text style={styles.errorText}>{errors.position}</Text>}
                            <TextInput style={[styles.textInput, errors.seniority && styles.inputError]} placeholder="Antigüedad (Ej: Senior, Junior) *" value={formData.seniority} onChangeText={text => { setFormData({ ...formData, seniority: text }); if (errors.seniority) setErrors(prev => ({...prev, seniority: null})); }} />
                            {errors.seniority && <Text style={styles.errorText}>{errors.seniority}</Text>}
                            <View style={[styles.pickerContainer, errors.team && styles.inputError]}>
                                <Picker selectedValue={formData.team} onValueChange={(itemValue) => setFormData({ ...formData, team: itemValue })} style={styles.picker}>
                                    {teams.map(team => <Picker.Item key={team} label={team} value={team} />)}
                                </Picker>
                            </View>
                            {errors.team && <Text style={styles.errorText}>{errors.team}</Text>}
                            <Text style={styles.formSectionTitle}>Información de Contacto</Text>
                            <TextInput style={[styles.textInput, errors.email && styles.inputError]} placeholder="Email *" value={formData.email} onChangeText={text => { setFormData({ ...formData, email: text }); if (errors.email) setErrors(prev => ({...prev, email: null})); }} keyboardType="email-address" autoCapitalize="none"/>
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            <TextInput style={[styles.textInput, errors.phone && styles.inputError]} placeholder="Teléfono (Ej: 09...) *" value={formData.phone} onChangeText={text => { setFormData({ ...formData, phone: text }); if (errors.phone) setErrors(prev => ({...prev, phone: null})); }} keyboardType="phone-pad" />
                            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                            <TextInput style={[styles.textInput, errors.location && styles.inputError]} placeholder="Ubicación *" value={formData.location} onChangeText={text => { setFormData({ ...formData, location: text }); if (errors.location) setErrors(prev => ({...prev, location: null})); }} />
                            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
                            <View style={styles.buttonRow}><TouchableOpacity onPress={() => setIsEditModalVisible(false)} style={[styles.modalButton, styles.modalCancelButton]}><Text style={styles.buttonText}>Cancelar</Text></TouchableOpacity><TouchableOpacity onPress={handleSave} style={[styles.modalButton, styles.modalConfirmButton]}><Text style={styles.buttonText}>Guardar</Text></TouchableOpacity></View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal> 
    );
    
    return (
        <View style={styles.container}>
            {selectedEmployee ? ( <EmployeeProfile employee={selectedEmployee} onGoBack={() => setSelectedEmployee(null)} onEdit={handleOpenEditModal} projects={projects} /> ) : (
                <>
                    <View style={styles.header}><Text style={styles.headerTitle}>Empleados ({employees.length})</Text><TouchableOpacity onPress={() => handleOpenEditModal()} style={styles.addButton}><Text style={styles.addButtonText}>+ Añadir Empleado</Text></TouchableOpacity></View>
                    <View style={styles.viewToggleContainer}><View style={styles.viewToggle}><TouchableOpacity onPress={() => setView('list')} style={[styles.viewButton, view === 'list' && styles.viewButtonActive]}><Text style={[styles.viewButtonText, view === 'list' && styles.viewButtonTextActive]}>Lista</Text></TouchableOpacity><TouchableOpacity onPress={() => setView('activity')} style={[styles.viewButton, view === 'activity' && styles.viewButtonActive]}><Text style={[styles.viewButtonText, view === 'activity' && styles.viewButtonTextActive]}>Actividad</Text></TouchableOpacity><TouchableOpacity onPress={() => setView('projects')} style={[styles.viewButton, view === 'projects' && styles.viewButtonActive]}><Text style={[styles.viewButtonText, view === 'projects' && styles.viewButtonTextActive]}>Proyectos</Text></TouchableOpacity></View></View>
                    {view === 'list' && renderListView()}
                    {view === 'activity' && renderActivityView()}
                    {view === 'projects' && <ProjectView projects={projects} employees={employees} onAddProject={() => setIsAddProjectModalVisible(true)} />}
                </>
            )}
            {renderEditModal()}
            {renderDeleteModal()}
            <AddProjectModal isVisible={isAddProjectModalVisible} onClose={() => setIsAddProjectModalVisible(false)} onSave={handleAddProjectInternal} employees={employees} />
            <CustomDatePickerModal isVisible={isDatePickerVisible} onClose={() => setDatePickerVisible(false)} onSelectDate={handleDateSelect} initialDate={formData.birthdate ? new Date(formData.birthdate) : null} />
        </View>
    );
};

// ==========================================================
// MODIFICACIÓN: Ajuste de estilos del Modal
// ==========================================================
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }, headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' }, addButton: { backgroundColor: '#DC2626', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 }, addButtonText: { color: '#FFFFFF', fontWeight: 'bold' }, viewToggleContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 }, viewToggle: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 20, padding: 4, width: 300 }, viewButton: { flex: 1, paddingVertical: 8, borderRadius: 20, alignItems: 'center' }, viewButtonActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3 }, viewButtonText: { fontWeight: 'bold', color: '#6B7280' }, viewButtonTextActive: { color: '#1F2937' }, scrollView: { flex: 1 }, listItem: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3 }, avatarListImage: { width: 50, height: 50, borderRadius: 25, marginRight: 16 }, listItemTextContainer: { flex: 1 }, listItemTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' }, listItemSubtitle: { fontSize: 14, color: '#6B7280' }, seniorityTag: { backgroundColor: '#D1FAE5', borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4, marginTop: 8, alignSelf: 'flex-start' }, seniorityText: { color: '#065F46', fontSize: 12, fontWeight: 'bold' }, listItemActions: { flexDirection: 'row', gap: 8 }, actionButton: { padding: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: 36, height: 36 }, activityGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, activityCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3 }, avatarImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 16 }, activityTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginTop: 8 }, activitySubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 16 }, taskContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' }, taskItem: { alignItems: 'center' }, taskCount: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' }, taskLabel: { fontSize: 12, color: '#6B7280', textAlign: 'center' }, 
    
    // Contenedor principal del modal: OCUPA TODA LA PANTALLA Y PONE EL FONDO OSCURO
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    
    // Nuevo contenedor para el KeyboardAvoidingView: DEFINE EL TAMAÑO MÁXIMO DEL MODAL
    kavContainer: {
        width: '90%',
        maxHeight: '90%', // El modal nunca será más alto que el 90% de la pantalla
        maxWidth: 500,
    },

    // Contenido del formulario (la caja blanca)
    modalContent: { 
        backgroundColor: 'white', 
        borderRadius: 12, 
        padding: 24, 
        alignItems: 'center',
    },
    
    modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 }, modalText: { fontSize: 16, textAlign: 'center', marginBottom: 24, color: '#4B5563' }, buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 }, modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 }, modalCancelButton: { backgroundColor: '#6B7280' }, modalConfirmButton: { backgroundColor: '#DC2626' }, buttonText: { color: '#FFFFFF', fontWeight: 'bold' }, textInput: { width: '100%', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, color: '#1F2937' },
    inputError: { borderColor: '#DC2626' }, errorText: { color: '#DC2626', fontSize: 12, alignSelf: 'flex-start', marginTop: -12, marginBottom: 10, },
    imagePickerContainer: { alignItems: 'center', marginBottom: 20 }, avatarPreview: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#D1D5DB' }, avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }, avatarPlaceholderText: { color: '#6B7280', fontWeight: 'bold' },
    formSectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', alignSelf: 'flex-start', marginBottom: 15, marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', width: '100%', paddingBottom: 5 },
    pickerContainer: { width: '100%', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, marginBottom: 16, justifyContent: 'center' },
    picker: { height: 50, width: '100%' },
    datePickerInput: { width: '100%', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, height: 50, justifyContent: 'center', marginBottom: 16 },
    datePickerText: { fontSize: 16, color: '#1F2937' },
    datePickerPlaceholder: { fontSize: 16, color: '#9CA3AF' },
    calendarModalContent: { backgroundColor: 'white', borderRadius: 12, padding: 15, width: '90%', maxWidth: 320 },
    calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, marginBottom: 8 },
    calendarNav: { fontSize: 22, fontWeight: 'bold', color: '#DC2626', paddingHorizontal: 12 },
    calendarMonthYear: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    calendarWeekdays: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 4 },
    calendarWeekdayText: { fontSize: 12, fontWeight: 'bold', color: '#6B7280', width: '14%', textAlign: 'center' },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    calendarDay: { width: '14%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
    calendarDayText: { fontSize: 14, color: '#1F2937' },
    calendarDayEmpty: { width: '14%', aspectRatio: 1 },
    monthYearItem: { width: '33.3%', paddingVertical: 12, justifyContent: 'center', alignItems: 'center' },
    monthYearItemText: { fontSize: 14 }
});

const profileStyles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 }, backButton: { position: 'absolute', top: 20, left: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.7)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }, header: { marginTop: 40, marginBottom: 20 }, headerTitleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' }, profileHeaderInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 20 }, avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 20 }, profileName: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' }, profilePosition: { fontSize: 16, color: '#6B7280' }, tabContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#E5E7EB', borderRadius: 20, padding: 4, marginBottom: 20 }, tabButton: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center' }, activeTab: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3 }, tabText: { fontWeight: 'bold', color: '#6B7280' }, activeTabText: { color: '#1F2937' }, tabContent: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 20 }, projectCard: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 8, marginBottom: 12 }, projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, projectTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' }, projectPriority: { fontSize: 14, fontWeight: 'bold', color: '#4B5563', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: '#E5E7EB' }, projectSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 4 }, projectTasks: { flexDirection: 'row', marginTop: 8, gap: 16 }, projectTaskText: { fontSize: 14, color: '#4B5563' }, teamText: { fontSize: 16, color: '#1F2937' }, noDataText: { textAlign: 'center', color: '#6B7280', paddingVertical: 20 }, vacationMonth: { marginBottom: 16, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 16 }, vacationMonthTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' }, vacationDays: { fontSize: 16, color: '#6B7280', marginTop: 8 }, section: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 20 }, sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 }, infoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }, infoLabel: { fontSize: 16, color: '#6B7280' }, infoValue: { fontSize: 16, color: '#1F2937', textAlign: 'right', flex: 1 }, });
const projectStyles = StyleSheet.create({ header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }, headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' }, projectCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3 }, projectName: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 }, projectDetailsRow: { flexDirection: 'row', marginBottom: 16 }, projectDetailItem: { flexDirection: 'row', marginRight: 20 }, projectDetailLabel: { fontWeight: 'bold', color: '#6B7280', marginRight: 4 }, projectDetailValue: { color: '#1F2937' }, membersTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 }, membersContainer: { flexDirection: 'row', flexWrap: 'wrap' }, memberTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5E7EB', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, marginRight: 8, marginBottom: 8 }, memberAvatar: { width: 24, height: 24, borderRadius: 12, marginRight: 6 }, memberText: { fontSize: 14, color: '#1F2937' }, noMembersText: { fontSize: 14, color: '#6B7280' }, addProjectModal: { maxHeight: '80%', width: '90%' }, selectMembersTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginTop: 16, marginBottom: 8 }, membersSelectionContainer: { maxHeight: 200, marginBottom: 16, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 8 }, memberSelectionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8, justifyContent: 'space-between' }, memberSelected: { backgroundColor: '#D1FAE5' }, memberSelectionAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 10 }, memberSelectionText: { flex: 1, fontSize: 16, color: '#1F2937' }, });

export default EmpleadosScreen;