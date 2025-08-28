// ==========================================================
// src/ProyectosScreen.js
// CÓDIGO COMPLETO Y FINAL CON LA SOLUCIÓN DE MODAL ANIDADO
// ==========================================================

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import { useNotifications } from '../../backend/NotificationContext';
import { useProjects } from '../../backend/ProjectsContext';
import { useEmployees } from '../../backend/EmployeesContext';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const priorityOptions = ['Baja', 'Media', 'Alta'];
const statusOptions = ['Hacer', 'En Proceso', 'En Revisión', 'Hecho'];

// Componente original del DatePicker, autocontenido en un Modal.
// Se le añade la prop 'initialDate' para que se abra en el mes correcto.
const DatePickerModal = ({ isVisible, onClose, onDateSelect, initialDate }) => {
    const [date, setDate] = useState(moment(initialDate));

    useEffect(() => {
        // Se asegura de que el calendario muestre el mes correcto cada vez que se abre
        if (initialDate) {
            setDate(moment(initialDate));
        }
    }, [initialDate, isVisible]);

    const getCalendarGrid = () => {
        const startOfMonth = date.clone().startOf('month'); const endOfMonth = date.clone().endOf('month'); const startOfGrid = startOfMonth.clone().startOf('week'); const endOfGrid = endOfMonth.clone().endOf('week'); const grid = []; let day = startOfGrid.clone(); while (day.isSameOrBefore(endOfGrid, 'day')) { grid.push(day.clone()); day.add(1, 'day'); } return grid;
    };
    return (
        <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.datePickerModalView}>
                    <View style={styles.datePickerNavigation}>
                        <TouchableOpacity onPress={() => setDate(date.clone().subtract(1, 'month'))}><Text style={styles.datePickerNavButton}>{"←"}</Text></TouchableOpacity>
                        <Text style={styles.datePickerMonthYear}>{date.format('MMMM, YYYY')}</Text>
                        <TouchableOpacity onPress={() => setDate(date.clone().add(1, 'month'))}><Text style={styles.datePickerNavButton}>{"→"}</Text></TouchableOpacity>
                    </View>
                    <View style={styles.dayNamesContainer}>{moment.weekdaysShort().map(day => <Text key={day} style={styles.dayName}>{day}</Text>)}</View>
                    <View style={styles.datePickerGridContainer}>
                        {getCalendarGrid().map((day, index) => (
                            <TouchableOpacity key={index} style={[styles.datePickerDay, !day.isSame(date, 'month') && styles.dayCellOutsideMonth]} onPress={() => onDateSelect(day)}>
                                <Text style={styles.dayText}>{day.date()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Pressable style={[styles.button, styles.buttonClose]} onPress={onClose}><Text style={styles.textStyle}>Cancelar</Text></Pressable>
                </View>
            </View>
        </Modal>
    );
};

const ProyectosScreen = ({ initialProjectId }) => {
  const { projects, addProject, addTaskToProject, updateTask } = useProjects();
  const { employees } = useEmployees();
  const { addNotification } = useNotifications();
  
  const userListForPicker = [...employees.map(emp => emp.name), 'Sin Asignar'];

  const [addProjectModalVisible, setAddProjectModalVisible] = useState(false);
  const [taskDetailsModalVisible, setTaskDetailsModalVisible] = useState(false);
  const [editTaskModalVisible, setEditTaskModalVisible] = useState(false);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [viewMode, setViewMode] = useState('kanban');
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState('Todas');
  const [newProjectData, setNewProjectData] = useState({ name: '', code: '', description: '' });
  const [newTaskData, setNewTaskData] = useState({ name: '', assignee: 'Sin Asignar', priority: 'Media', estimated: 1, description: '', startDate: moment().format('YYYY-MM-DD'), endDate: moment().add(1, 'days').format('YYYY-MM-DD'), });
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDatePickerModalVisible, setDatePickerModalVisible] = useState(false);
  const [dateType, setDateType] = useState(null);
  const [errors, setErrors] = useState({});
  const [pickerInitialDate, setPickerInitialDate] = useState(moment().format('YYYY-MM-DD'));

    useEffect(() => {
        if (initialProjectId) {
            const projectToSelect = projects.find(p => p.id === initialProjectId);
            if (projectToSelect) {
                setSelectedProject(projectToSelect);
                return;
            }
        }
        if (projects.length > 0 && !selectedProject) {
            setSelectedProject(projects[0]);
        } else if (selectedProject && !projects.find(p => p.id === selectedProject.id)) {
            setSelectedProject(projects[0] || null);
        }
    }, [initialProjectId, projects]);

    useEffect(() => {
    if (selectedProject) {
        const updatedProjectFromContext = projects.find(p => p.id === selectedProject.id);
        if (updatedProjectFromContext) {
            setSelectedProject(updatedProjectFromContext);
        }
    }
    }, [projects]);
 
    const onDrop = (newStatus) => {
        if (!selectedTask) return;
        const updatedTask = { ...selectedTask, status: newStatus };
        updateTask(selectedProject.id, updatedTask);
        addNotification({ name: selectedTask.assignee, activity: `Movió la tarea "${selectedTask.name}" a "${newStatus}".` });
        setSelectedTask(null);
    };

    const handleAddProjectInternal = () => {
        if (!newProjectData.name.trim()) {
          setErrors({ name: 'El nombre del proyecto es obligatorio.' });
          return;
        }
        setErrors({});
        const addedProject = addProject(newProjectData);
        addNotification({ name: 'Gestor de Proyectos', activity: `Se ha creado el nuevo proyecto "${addedProject.name}".` });
        setAddProjectModalVisible(false);
    };

    const handleEditTask = () => {
        if (!currentTask || !currentTask.name.trim()) {
            setErrors({ name: 'El nombre de la tarea es obligatorio.' });
            return;
        }
        setErrors({});
        updateTask(selectedProject.id, currentTask);
        addNotification({ name: 'Sistema', activity: `La tarea "${currentTask.name}" fue actualizada.` });
        setEditTaskModalVisible(false);
    };
    
    const handleAddTask = () => {
        if (!newTaskData.name.trim()) {
            setErrors({ newTaskName: 'El nombre de la tarea es obligatorio.' });
            return;
        }
        setErrors({});
        const addedTask = addTaskToProject(selectedProject.id, newTaskData);
        addNotification({ name: 'Proyectos', activity: `Nueva tarea "${addedTask.name}" añadida a "${selectedProject.name}".` });
        setAddTaskModalVisible(false);
    };
    
    const openAddTaskModal = () => {
        setErrors({});
        setNewTaskData({ name: '', assignee: 'Sin Asignar', priority: 'Media', estimated: 1, description: '', startDate: moment().format('YYYY-MM-DD'), endDate: moment().add(1, 'days').format('YYYY-MM-DD'), });
        setAddTaskModalVisible(true);
    };
    
    const handleDateSelect = (selectedDay) => {
        const newDate = selectedDay.format('YYYY-MM-DD');
        if (dateType === 'start' && moment(newDate).isAfter(currentTask.endDate)) {
            setCurrentTask(prev => ({...prev, startDate: newDate, endDate: newDate}));
        } else if (dateType === 'end' && moment(newDate).isBefore(currentTask.startDate)) {
            // No hacer nada si se intenta poner una fecha de fin anterior al inicio
        } else {
            setCurrentTask(prev => ({...prev, [dateType === 'start' ? 'startDate' : 'endDate']: newDate}));
        }
        setDatePickerModalVisible(false);
    };

    const openDatePicker = (type, currentDate) => { 
        setDateType(type);
        setPickerInitialDate(currentDate || moment().format('YYYY-MM-DD'));
        setDatePickerModalVisible(true);
    };
    const closeDatePicker = () => { 
        setDatePickerModalVisible(false);
    };
    
    const showTaskDetails = (task) => { setCurrentTask(task); setTaskDetailsModalVisible(true); };
    
    const editTask = (task) => { 
        setErrors({});
        setCurrentTask({...task}); 
        setEditTaskModalVisible(true); 
    };
 
    const renderTaskStatus = (status) => {
        let color = '#ccc';
        switch(status) {
          case 'Hecho': color = '#5cb85c'; break;
          case 'En Proceso': color = '#337ab7'; break;
          case 'En Revisión': color = '#7e57c2'; break;
          case 'Hacer': color = '#f0ad4e'; break;
        }
        return <View style={[styles.taskStatus, { backgroundColor: color }]}><Text style={styles.taskStatusText}>{status}</Text></View>;
    };

    const ListView = ({ project }) => {
        const filteredTasks = (project.tasks || []).filter(task => filterPriority === 'Todas' || task.priority === filterPriority);
        return (
          <View style={styles.listContainer}>
            <View style={styles.filterContainer}><Text style={styles.filterLabel}>Filtrar por Prioridad:</Text>{['Todas', 'Alta', 'Media', 'Baja'].map(priority => (<TouchableOpacity key={priority} style={[styles.filterButton, filterPriority === priority && styles.filterButtonActive]} onPress={() => setFilterPriority(priority)}><Text style={[styles.filterButtonText, filterPriority === priority && styles.filterButtonTextActive]}>{priority}</Text></TouchableOpacity>))}</View>
            <ScrollView style={styles.listScrollView}>{filteredTasks.map(task => (<View key={task.id} style={styles.taskListItem}><View style={styles.taskListItemContent}><Text style={styles.taskListItemName}>{task.name}</Text><View style={styles.taskListItemInfo}><Text style={styles.taskListItemDetails}>Encargado: {task.assignee}</Text><Text style={styles.taskListItemDetails}>Prioridad: {task.priority}</Text><Text style={styles.taskListItemDetails}>Estado: {task.status}</Text></View></View><View style={styles.taskCardButtons}><Pressable style={styles.detailsButton} onPress={() => showTaskDetails(task)}><Text style={styles.detailsButtonText}>Ver Detalles</Text></Pressable><Pressable style={styles.editButton} onPress={() => editTask(task)}><Text style={styles.editButtonText}>Editar</Text></Pressable></View></View>))}</ScrollView>
          </View>
        );
    };

    const KanbanColumn = ({ status, tasks, onDrop }) => {
        const filteredTasks = (tasks || []).filter(t => t.status === status);
        return (
          <View style={styles.kanbanColumn}>
            <Text style={styles.kanbanColumnTitle}>{status}</Text>
            <ScrollView>
                <TouchableOpacity style={styles.dropZone} onPress={() => onDrop(status)}>
                    {filteredTasks.map(task => (
                    <TouchableOpacity key={task.id} style={styles.taskCard} onPress={() => setSelectedTask(task)}>
                        <Text style={styles.taskCardCode}>{selectedProject.code}</Text>
                        <Text style={styles.taskCardName}>{task.name}</Text>
                        <View style={styles.taskCardInfo}><Icon name="clock" size={12} color="#888" /><Text style={styles.taskCardInfoText}>Estimado: {task.estimated}d</Text></View>
                        <View style={styles.taskCardInfo}><Icon name="user" size={12} color="#888" /><Text style={styles.taskCardInfoText}>Encargado: {task.assignee}</Text></View>
                        {renderTaskStatus(task.status)}
                        <View style={styles.taskCardButtons}>
                        <Pressable style={styles.detailsButton} onPress={() => showTaskDetails(task)}><Text style={styles.detailsButtonText}>Ver Detalles</Text></Pressable>
                        <Pressable style={styles.editButton} onPress={() => editTask(task)}><Text style={styles.editButtonText}>Editar</Text></Pressable>
                        </View>
                    </TouchableOpacity>
                    ))}
                    {selectedTask && <Text style={styles.dropInstruction}>Suelta aquí la tarea: {selectedTask.name}</Text>}
                </TouchableOpacity>
            </ScrollView>
          </View>
        );
    };

    if (!selectedProject) {
        return <View style={styles.container}><Text>Cargando proyecto...</Text></View>;
    }
    
    return (
        <View style={styles.container}>
            <Modal animationType="slide" transparent={true} visible={addProjectModalVisible} onRequestClose={() => setAddProjectModalVisible(false)}>
              <View style={styles.centeredView}><View style={styles.modalView}><Text style={styles.modalTitle}>Añadir Nuevo Proyecto</Text><TextInput style={[styles.input, errors.name && styles.inputError]} placeholder="Nombre del Proyecto*" value={newProjectData.name} onChangeText={(text) => { setNewProjectData({...newProjectData, name: text}); if (errors.name) { setErrors(prev => ({...prev, name: null})); } }} />{errors.name && <Text style={styles.errorText}>{errors.name}</Text>}<TextInput style={styles.input} placeholder="Código del Proyecto (ej. PN001)" value={newProjectData.code} onChangeText={(text) => setNewProjectData({...newProjectData, code: text})} /><TextInput style={[styles.input, styles.textArea]} placeholder="Descripción" multiline value={newProjectData.description} onChangeText={(text) => setNewProjectData({...newProjectData, description: text})} /><View style={styles.buttonContainer}><Pressable style={[styles.button, styles.buttonClose]} onPress={() => setAddProjectModalVisible(false)}><Text style={styles.textStyle}>Cancelar</Text></Pressable><Pressable style={[styles.button, styles.buttonAdd]} onPress={handleAddProjectInternal}><Text style={styles.textStyle}>Añadir</Text></Pressable></View></View></View>
            </Modal>
            
            {currentTask && <Modal animationType="slide" transparent={true} visible={taskDetailsModalVisible} onRequestClose={() => setTaskDetailsModalVisible(false)}><View style={styles.centeredView}><View style={styles.modalView}><Text style={styles.modalTitle}>Detalles de la Tarea</Text><View style={styles.detailsSection}><Text style={styles.detailsLabel}>Nombre:</Text><Text style={styles.detailsText}>{currentTask.name}</Text></View><View style={styles.detailsSection}><Text style={styles.detailsLabel}>Encargado:</Text><Text style={styles.detailsText}>{currentTask.assignee}</Text></View><View style={styles.detailsSection}><Text style={styles.detailsLabel}>Prioridad:</Text><Text style={styles.detailsText}>{currentTask.priority}</Text></View><View style={styles.detailsSection}><Text style={styles.detailsLabel}>Estado:</Text><Text style={styles.detailsText}>{currentTask.status}</Text></View><View style={styles.detailsSection}><Text style={styles.detailsLabel}>Descripción:</Text><Text style={styles.detailsText}>{currentTask.description}</Text></View><View style={styles.buttonContainer}><Pressable style={[styles.button, styles.buttonClose]} onPress={() => setTaskDetailsModalVisible(false)}><Text style={styles.textStyle}>Cerrar</Text></Pressable></View></View></View></Modal>}
            
            <Modal animationType="slide" transparent={true} visible={addTaskModalVisible} onRequestClose={() => setAddTaskModalVisible(false)}><ScrollView contentContainerStyle={styles.centeredView}><View style={styles.modalView}><Text style={styles.modalTitle}>Añadir Nueva Tarea</Text><TextInput style={[styles.input, errors.newTaskName && styles.inputError]} placeholder="Nombre de la Tarea*" value={newTaskData.name} onChangeText={(text) => { setNewTaskData(prev => ({...prev, name: text})); if (errors.newTaskName) setErrors({}); }} />{errors.newTaskName && <Text style={styles.errorText}>{errors.newTaskName}</Text>}<Text style={styles.pickerLabel}>Persona Encargada</Text><View style={styles.pickerContainer}><Picker selectedValue={newTaskData.assignee} onValueChange={(itemValue) => setNewTaskData(prev => ({...prev, assignee: itemValue}))}>{userListForPicker.map(user => <Picker.Item key={user} label={user} value={user} />)}</Picker></View><Text style={styles.pickerLabel}>Prioridad</Text><View style={styles.pickerContainer}><Picker selectedValue={newTaskData.priority} onValueChange={(itemValue) => setNewTaskData(prev => ({...prev, priority: itemValue}))}>{priorityOptions.map(p => <Picker.Item key={p} label={p} value={p} />)}</Picker></View><View style={styles.buttonContainer}><Pressable style={[styles.button, styles.buttonClose]} onPress={() => setAddTaskModalVisible(false)}><Text style={styles.textStyle}>Cancelar</Text></Pressable><Pressable style={[styles.button, styles.buttonAdd]} onPress={handleAddTask}><Text style={styles.textStyle}>Añadir Tarea</Text></Pressable></View></View></ScrollView></Modal>
            
            {/* --- MODAL DE EDICIÓN CON LA SOLUCIÓN ANIDADA --- */}
            {currentTask && (
                <Modal 
                    animationType="slide" 
                    transparent={true} 
                    visible={editTaskModalVisible} 
                    onRequestClose={() => setEditTaskModalVisible(false)}
                >
                    <ScrollView contentContainerStyle={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Editar Tarea</Text>
                            <TextInput style={[styles.input, errors.name && styles.inputError]} placeholder="Nombre de la Tarea*" value={currentTask.name} onChangeText={(text) => { setCurrentTask({...currentTask, name: text}); if (errors.name) { setErrors(prev => ({...prev, name: null})); } }} />
                            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                            <Text style={styles.pickerLabel}>Persona Encargada</Text>
                            <View style={styles.pickerContainer}><Picker selectedValue={currentTask.assignee} onValueChange={(itemValue) => setCurrentTask({...currentTask, assignee: itemValue})}>{userListForPicker.map(user => <Picker.Item key={user} label={user} value={user} />)}</Picker></View>
                            <Text style={styles.pickerLabel}>Prioridad</Text>
                            <View style={styles.pickerContainer}><Picker selectedValue={currentTask.priority} onValueChange={(itemValue) => setCurrentTask({...currentTask, priority: itemValue})}>{priorityOptions.map(p => <Picker.Item key={p} label={p} value={p} />)}</Picker></View>
                            <Text style={styles.pickerLabel}>Estado</Text>
                            <View style={styles.pickerContainer}><Picker selectedValue={currentTask.status} onValueChange={(itemValue) => setCurrentTask({...currentTask, status: itemValue})}>{statusOptions.map(s => <Picker.Item key={s} label={s} value={s} />)}</Picker></View>
                            <TextInput style={styles.input} placeholder="Días Estimados" keyboardType="numeric" value={String(currentTask.estimated)} onChangeText={(text) => setCurrentTask({...currentTask, estimated: parseInt(text, 10) || 0})} />
                            <TextInput style={[styles.input, styles.textArea]} placeholder="Descripción" multiline value={currentTask.description} onChangeText={(text) => setCurrentTask({...currentTask, description: text})} />
                            <View style={styles.datePickerContainer}>
                                <Text style={styles.dateLabel}>Fecha de Inicio:</Text>
                                <Pressable onPress={() => openDatePicker('start', currentTask.startDate)}>
                                    <Text style={styles.dateInput}>{currentTask.startDate}</Text>
                                </Pressable>
                                <Text style={styles.dateLabel}>Fecha de Fin:</Text>
                                <Pressable onPress={() => openDatePicker('end', currentTask.endDate)}>
                                    <Text style={styles.dateInput}>{currentTask.endDate}</Text>
                                </Pressable>
                            </View>
                            <View style={styles.buttonContainer}>
                                <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setEditTaskModalVisible(false)}><Text style={styles.textStyle}>Cancelar</Text></Pressable>
                                <Pressable style={[styles.button, styles.buttonAdd]} onPress={handleEditTask}><Text style={styles.textStyle}>Guardar Cambios</Text></Pressable>
                            </View>
                        </View>
                    </ScrollView>

                    {/* LA SOLUCIÓN: El DatePickerModal se renderiza DENTRO del Modal de Edición */}
                    <DatePickerModal
                        isVisible={isDatePickerModalVisible}
                        onClose={closeDatePicker}
                        onDateSelect={handleDateSelect}
                        initialDate={pickerInitialDate}
                    />
                </Modal>
            )}
            
            <View style={styles.header}><Text style={styles.headerTitle}>Proyectos</Text><TouchableOpacity style={styles.addButton} onPress={() => { setErrors({}); setAddProjectModalVisible(true);}}><Icon name="plus" size={18} color="#fff" /><Text style={styles.addButtonText}>Añadir Proyecto</Text></TouchableOpacity></View>
            <View style={styles.contentContainer}>
                <View style={styles.projectsSidebar}><Text style={styles.projectsSidebarTitle}>Proyectos Actuales</Text><ScrollView style={styles.projectsList}>{projects.map(proj => (<TouchableOpacity key={proj.id} style={[styles.projectItem, selectedProject.id === proj.id && styles.projectItemActive]} onPress={() => setSelectedProject(proj)}><Text style={styles.projectCode}>{proj.code}</Text><Text style={styles.projectName}>{proj.name}</Text></TouchableOpacity>))}</ScrollView></View>
                <View style={styles.tasksContainer}><View style={styles.tasksHeader}><Text style={styles.tasksHeaderTitle}>Tareas de "{selectedProject.name}"</Text><View style={styles.headerActions}><TouchableOpacity style={styles.addTaskButton} onPress={openAddTaskModal}><Icon name="plus" size={16} color="#720819" /><Text style={styles.addTaskButtonText}>Nueva Tarea</Text></TouchableOpacity><View style={styles.viewModeButtons}><TouchableOpacity style={[styles.viewButton, viewMode === 'kanban' && styles.viewButtonActive]} onPress={() => setViewMode('kanban')}><Icon name="layout" size={20} color={viewMode === 'kanban' ? '#fff' : '#000'} /></TouchableOpacity><TouchableOpacity style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]} onPress={() => setViewMode('list')}><Icon name="list" size={20} color={viewMode === 'list' ? '#fff' : '#000'} /></TouchableOpacity></View></View></View>
                  {viewMode === 'kanban' ? (<ScrollView horizontal contentContainerStyle={styles.kanbanBoard}><KanbanColumn status="Hacer" tasks={selectedProject.tasks} onDrop={onDrop} /><KanbanColumn status="En Proceso" tasks={selectedProject.tasks} onDrop={onDrop} /><KanbanColumn status="En Revisión" tasks={selectedProject.tasks} onDrop={onDrop} /><KanbanColumn status="Hecho" tasks={selectedProject.tasks} onDrop={onDrop} /></ScrollView>) : (<ListView project={selectedProject} />)}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    input: { width: '100%', height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 15, paddingHorizontal: 10 },
    inputError: { borderColor: '#DC2626', },
    errorText: { color: '#DC2626', fontSize: 12, alignSelf: 'flex-start', marginTop: -10, marginBottom: 10, },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#720819', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8 },
    addButtonText: { color: '#fff', marginLeft: 10 },
    contentContainer: { flex: 1, flexDirection: 'row' },
    projectsSidebar: { width: 250, backgroundColor: '#fff', padding: 15, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
    projectsSidebarTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    projectsList: { flex: 1 },
    projectItem: { paddingVertical: 15, paddingHorizontal: 10, marginBottom: 5, borderRadius: 8 },
    projectItemActive: { backgroundColor: '#f0e6e8' },
    projectCode: { fontSize: 12, color: '#888' },
    projectName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    tasksContainer: { flex: 1, marginLeft: 20 },
    tasksHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    tasksHeaderTitle: { fontSize: 24, fontWeight: 'bold', flexShrink: 1, marginRight: 10 },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    addTaskButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#FEE2E2' },
    addTaskButtonText: { color: '#720819', fontWeight: 'bold', marginLeft: 8 },
    viewModeButtons: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 8, padding: 5 },
    viewButton: { padding: 10, borderRadius: 5 },
    viewButtonActive: { backgroundColor: '#720819' },
    kanbanBoard: { flexGrow: 1, flexDirection: 'row', gap: 10 },
    kanbanColumn: { width: 250, backgroundColor: '#fff', padding: 10, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    kanbanColumnTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    taskCard: { backgroundColor: '#f9f9f9', padding: 10, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
    taskCardCode: { fontSize: 10, color: '#aaa' },
    taskCardName: { fontSize: 14, fontWeight: 'bold', marginVertical: 5 },
    taskCardInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    taskCardInfoText: { fontSize: 12, color: '#666', marginLeft: 5 },
    taskStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 15, alignSelf: 'flex-start', marginTop: 5 },
    taskStatusText: { color: '#fff', fontWeight: 'bold', fontSize: 10 },
    taskCardButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
    detailsButton: { padding: 5, borderRadius: 5 },
    detailsButtonText: { color: '#720819', fontWeight: 'bold', fontSize: 12 },
    editButton: { padding: 5, borderRadius: 5 },
    editButtonText: { color: '#337ab7', fontWeight: 'bold', fontSize: 12 },
    dropZone: { flex: 1, minHeight: 100 },
    dropInstruction: { textAlign: 'center', fontStyle: 'italic', color: '#aaa', marginTop: 10, padding: 10, borderWidth: 1, borderStyle: 'dashed', borderColor: '#ccc', borderRadius: 5 },
    listContainer: { flex: 1 },
    listScrollView: { flex: 1 },
    taskListItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, marginBottom: 10, backgroundColor: '#fff', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
    taskListItemContent: { flex: 1 },
    taskListItemName: { fontSize: 16, fontWeight: 'bold' },
    taskListItemInfo: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
    taskListItemDetails: { fontSize: 12, color: '#666', marginRight: 15 },
    filterContainer: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
    filterLabel: { fontWeight: 'bold', marginRight: 10, color: '#333' },
    filterButton: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e0e0e0', marginRight: 10, marginBottom: 5 },
    filterButtonActive: { backgroundColor: '#720819' },
    filterButtonText: { color: '#333', fontWeight: 'bold' },
    filterButtonTextActive: { color: '#fff' },
    centeredView: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 20 },
    modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, width: '90%', maxWidth: 500, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
    detailsSection: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' },
    detailsLabel: { fontWeight: 'bold', marginRight: 5, color: '#333' },
    detailsText: { flex: 1, flexWrap: 'wrap', color: '#555' },
    textArea: { height: 100, textAlignVertical: 'top', paddingTop: 10 },
    datePickerContainer: { width: '100%', marginBottom: 15 },
    dateLabel: { fontWeight: 'bold', marginBottom: 5, color: '#333' },
    dateInput: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 10, width: '100%', color: '#333', textAlign: 'center' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, width: '100%', gap: 10 },
    button: { borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20, elevation: 2 },
    buttonClose: { backgroundColor: '#6c757d' },
    buttonAdd: { backgroundColor: '#720819' },
    textStyle: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
    pickerLabel: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5, alignSelf: 'flex-start' },
    pickerContainer: { width: '100%', borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 15, justifyContent: 'center' },
    datePickerModalView: { width: '90%', maxWidth: 350, backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    datePickerNavigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 },
    datePickerNavButton: { fontSize: 24, fontWeight: 'bold', color: '#720819' },
    datePickerMonthYear: { fontSize: 18, fontWeight: 'bold', textTransform: 'capitalize' },
    dayNamesContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 5, paddingBottom: 5 },
    dayName: { textAlign: 'center', fontWeight: 'bold', color: '#888', width: 40 },
    datePickerGridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
    datePickerDay: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, margin: 2 },
    dayCellOutsideMonth: { opacity: 0.3 },
    dayText: { fontSize: 14, color: '#333' },
});


export default ProyectosScreen;