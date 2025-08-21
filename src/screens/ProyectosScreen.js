// ==========================================================
// src/ProyectosScreen.js
// Pantalla de gestión de proyectos con vista de tablero Kanban y cronograma.
// Se ha añadido un selector de fechas, visualización de tareas en el cronograma
// y funcionalidad para editar tareas existentes.
// ==========================================================

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';

const ProyectosScreen = () => {
  // Estados para controlar la visibilidad de los modales
  const [addProjectModalVisible, setAddProjectModalVisible] = useState(false);
  const [taskDetailsModalVisible, setTaskDetailsModalVisible] = useState(false);
  const [editTaskModalVisible, setEditTaskModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null); // Tarea seleccionada para ver o editar
  
  // Estado para controlar la vista: 'kanban' o 'list'
  const [viewMode, setViewMode] = useState('kanban'); 
  
  // Estado para la tarea que se está "arrastrando" en la vista Kanban
  const [selectedTask, setSelectedTask] = useState(null); 
  
  // Estado para el filtro de prioridad en la vista de lista
  const [filterPriority, setFilterPriority] = useState('Todas'); 

  // Estado para los datos del nuevo proyecto que se va a añadir
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    code: '',
    assignee: '',
    priority: 'Medio',
    dueDate: '',
    description: ''
  });

  // Estados para el selector de fechas
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState(null); // 'start' o 'end'

  // Datos de proyectos de ejemplo
  const [projects, setProjects] = useState([
    {
      id: '1',
      code: 'PN001245',
      name: 'App de Admisiones',
      details: 'Ver Detalles',
      tasks: [
        { id: 't1', name: 'Investigación', estimated: 4, assignee: 'Pedro', priority: 'Media', status: 'Hecho', description: 'Investigación de mercado y análisis de competencia.', startDate: '2023-11-01', endDate: '2023-11-04' },
        { id: 't2', name: 'Mapa Mental', estimated: 2, assignee: 'Mónica', priority: 'Media', status: 'En Proceso', description: 'Creación de un mapa mental para organizar ideas.', startDate: '2023-11-05', endDate: '2023-11-06' },
        { id: 't3', name: 'Bocetos de UX', estimated: 5, assignee: 'Fernanda', priority: 'Baja', status: 'En Proceso', description: 'Diseño de los bocetos de experiencia de usuario (UX).', startDate: '2023-11-07', endDate: '2023-11-11' },
        { id: 't4', name: 'UX Login + Registro', estimated: 3, assignee: 'Christopher', priority: 'Baja', status: 'Hacer', description: 'Definición del flujo de usuario para el login y registro.', startDate: '2023-11-12', endDate: '2023-11-14' },
        { id: 't5', name: 'UI Login + Registro', estimated: 2, assignee: 'Melania', priority: 'Media', status: 'En Revisión', description: 'Diseño de la interfaz de usuario (UI).', startDate: '2023-11-15', endDate: '2023-11-16' },
      ]
    },
    { id: '2', code: 'PN001246', name: 'Servicio de Mallas Curriculares', details: 'Ver Detalles', tasks: [] },
    { id: '3', code: 'PN001247', name: 'Sitio Web del ITQ', details: 'Ver Detalles', tasks: [] },
    { id: '4', code: 'PN001248', name: 'App de Planeación', details: 'Ver Detalles', tasks: [] },
  ]);

  // Estado para el proyecto seleccionado en la barra lateral
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  // Lógica para simular el "drag and drop" en el Kanban
  const onDrop = (newStatus) => {
    if (!selectedTask) return;
    const updatedProjects = projects.map(proj => {
      if (proj.id === selectedProject.id) {
        const updatedTasks = proj.tasks.map(task => {
          if (task.id === selectedTask.id) {
            return { ...task, status: newStatus };
          }
          return task;
        });
        return { ...proj, tasks: updatedTasks };
      }
      return proj;
    });
    setProjects(updatedProjects);
    setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id));
    setSelectedTask(null);
  };

  // Función para manejar la adición de un nuevo proyecto
  const handleAddProject = () => {
    if (newProjectData.name) {
      const newProjectId = (projects.length + 1).toString();
      const newProjectCode = newProjectData.code || `PN${1000 + projects.length + 1}`;
      
      const newProject = {
        id: newProjectId,
        code: newProjectCode,
        name: newProjectData.name,
        details: 'Ver Detalles',
        tasks: [{
          id: 't1',
          name: 'Tarea Inicial',
          estimated: 1,
          assignee: newProjectData.assignee || 'Sin Asignar',
          priority: newProjectData.priority,
          status: 'Hacer',
          description: newProjectData.description || 'Descripción por defecto para la tarea inicial.',
          startDate: new Date().toISOString().slice(0, 10),
          endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10),
        }]
      };

      setProjects([newProject, ...projects]);
      setAddProjectModalVisible(false);
      setNewProjectData({ name: '', code: '', assignee: '', priority: 'Medio', dueDate: '', description: '' });
    }
  };

  // Función para manejar la edición de una tarea existente
  const handleEditTask = () => {
    if (currentTask) {
      const updatedProjects = projects.map(proj => {
        if (proj.id === selectedProject.id) {
          const updatedTasks = proj.tasks.map(task => {
            if (task.id === currentTask.id) {
              return currentTask;
            }
            return task;
          });
          return { ...proj, tasks: updatedTasks };
        }
        return proj;
      });
      setProjects(updatedProjects);
      setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id));
      setEditTaskModalVisible(false);
    }
  };

  // Función para mostrar los detalles de una tarea
  const showTaskDetails = (task) => {
    setCurrentTask(task);
    setTaskDetailsModalVisible(true);
  };

  // Función para abrir el modal de edición de tarea
  const editTask = (task) => {
    setCurrentTask(task);
    setEditTaskModalVisible(true);
  };

  // Renderiza el estado de la tarea con un color específico
  const renderTaskStatus = (status) => {
    let color = '#ccc';
    switch(status) {
      case 'Hecho': color = '#5cb85c'; break;
      case 'En Proceso': color = '#337ab7'; break;
      case 'En Revisión': color = '#7e57c2'; break;
      case 'Hacer': color = '#f0ad4e'; break;
    }
    return (
      <View style={[styles.taskStatus, { backgroundColor: color }]}>
        <Text style={styles.taskStatusText}>{status}</Text>
      </View>
    );
  };

  // Componente para la vista de lista de tareas
  const ListView = ({ project }) => {
    const filteredTasks = project.tasks.filter(task => 
      filterPriority === 'Todas' || task.priority === filterPriority
    );
    
    return (
      <View style={styles.listContainer}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filtrar por Prioridad:</Text>
          {['Todas', 'Alta', 'Media', 'Baja'].map(priority => (
            <TouchableOpacity 
              key={priority} 
              style={[styles.filterButton, filterPriority === priority && styles.filterButtonActive]}
              onPress={() => setFilterPriority(priority)}
            >
              <Text style={[styles.filterButtonText, filterPriority === priority && styles.filterButtonTextActive]}>{priority}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView style={styles.listScrollView}>
          {filteredTasks.map(task => (
            <View key={task.id} style={styles.taskListItem}>
              <View style={styles.taskListItemContent}>
                <Text style={styles.taskListItemName}>{task.name}</Text>
                <View style={styles.taskListItemInfo}>
                  <Text style={styles.taskListItemDetails}>Encargado: {task.assignee}</Text>
                  <Text style={styles.taskListItemDetails}>Prioridad: {task.priority}</Text>
                  <Text style={styles.taskListItemDetails}>Estado: {task.status}</Text>
                </View>
              </View>
              <View style={styles.taskCardButtons}>
                <Pressable
                  style={styles.detailsButton}
                  onPress={() => showTaskDetails(task)}
                >
                  <Text style={styles.detailsButtonText}>Ver Detalles</Text>
                </Pressable>
                <Pressable
                  style={styles.editButton}
                  onPress={() => editTask(task)}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Componente para una columna del tablero Kanban
  const KanbanColumn = ({ status, tasks, onDrop }) => {
    return (
      <View style={styles.kanbanColumn}>
        <Text style={styles.kanbanColumnTitle}>{status}</Text>
        <TouchableOpacity
          style={styles.dropZone}
          onPress={() => onDrop(status)}
        >
          {tasks.map(task => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskCard}
              onPress={() => setSelectedTask(task)} // Permite seleccionar la tarea para arrastrarla
            >
              <Text style={styles.taskCardCode}>{selectedProject.code}</Text>
              <Text style={styles.taskCardName}>{task.name}</Text>
              <View style={styles.taskCardInfo}>
                <Icon name="clock" size={12} color="#888" />
                <Text style={styles.taskCardInfoText}>Estimado: {task.estimated}d</Text>
              </View>
              <View style={styles.taskCardInfo}>
                <Icon name="user" size={12} color="#888" />
                <Text style={styles.taskCardInfoText}>Encargado: {task.assignee}</Text>
              </View>
              {renderTaskStatus(task.status)}
              {/* Botones para ver y editar los detalles de la tarea */}
              <View style={styles.taskCardButtons}>
                <Pressable
                  style={styles.detailsButton}
                  onPress={() => showTaskDetails(task)}
                >
                  <Text style={styles.detailsButtonText}>Ver Detalles</Text>
                </Pressable>
                <Pressable
                  style={styles.editButton}
                  onPress={() => editTask(task)}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </Pressable>
              </View>
            </TouchableOpacity>
          ))}
          {selectedTask && (
            <Text style={styles.dropInstruction}>Suelta aquí la tarea: {selectedTask.name}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Modal para añadir un nuevo proyecto */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addProjectModalVisible}
        onRequestClose={() => setAddProjectModalVisible(!addProjectModalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Añadir Nuevo Proyecto</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del Proyecto"
              value={newProjectData.name}
              onChangeText={(text) => setNewProjectData({...newProjectData, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Código del Proyecto (ej. PN001)"
              value={newProjectData.code}
              onChangeText={(text) => setNewProjectData({...newProjectData, code: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Persona Encargada"
              value={newProjectData.assignee}
              onChangeText={(text) => setNewProjectData({...newProjectData, assignee: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Prioridad (Alta, Media, Baja)"
              value={newProjectData.priority}
              onChangeText={(text) => setNewProjectData({...newProjectData, priority: text})}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción del proyecto"
              multiline={true}
              numberOfLines={4}
              value={newProjectData.description}
              onChangeText={(text) => setNewProjectData({...newProjectData, description: text})}
            />
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setAddProjectModalVisible(!addProjectModalVisible)}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonAdd]}
                onPress={handleAddProject}
              >
                <Text style={styles.textStyle}>Añadir</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para mostrar los detalles de la tarea */}
      {currentTask && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={taskDetailsModalVisible}
          onRequestClose={() => setTaskDetailsModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Detalles de la Tarea</Text>
              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Nombre:</Text>
                <Text style={styles.detailsText}>{currentTask.name}</Text>
              </View>
              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Encargado:</Text>
                <Text style={styles.detailsText}>{currentTask.assignee}</Text>
              </View>
              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Prioridad:</Text>
                <Text style={styles.detailsText}>{currentTask.priority}</Text>
              </View>
              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Estado:</Text>
                <Text style={styles.detailsText}>{currentTask.status}</Text>
              </View>
              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Descripción:</Text>
                <Text style={styles.detailsText}>{currentTask.description}</Text>
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setTaskDetailsModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal para editar la tarea */}
      {currentTask && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={editTaskModalVisible}
          onRequestClose={() => setEditTaskModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Editar Tarea</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre de la Tarea"
                value={currentTask.name}
                onChangeText={(text) => setCurrentTask({...currentTask, name: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Persona Encargada"
                value={currentTask.assignee}
                onChangeText={(text) => setCurrentTask({...currentTask, assignee: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Prioridad"
                value={currentTask.priority}
                onChangeText={(text) => setCurrentTask({...currentTask, priority: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Estado"
                value={currentTask.status}
                onChangeText={(text) => setCurrentTask({...currentTask, status: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Días Estimados"
                keyboardType="numeric"
                value={currentTask.estimated.toString()}
                onChangeText={(text) => setCurrentTask({...currentTask, estimated: parseInt(text) || 0})}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descripción"
                multiline={true}
                numberOfLines={4}
                value={currentTask.description}
                onChangeText={(text) => setCurrentTask({...currentTask, description: text})}
              />
              <View style={styles.datePickerContainer}>
                <Text style={styles.dateLabel}>Fecha de Inicio:</Text>
                <Pressable onPress={() => { setShowDatePicker(true); setDateType('start'); }}>
                  <Text style={styles.dateInput}>{currentTask.startDate}</Text>
                </Pressable>
                <Text style={styles.dateLabel}>Fecha de Fin:</Text>
                <Pressable onPress={() => { setShowDatePicker(true); setDateType('end'); }}>
                  <Text style={styles.dateInput}>{currentTask.endDate}</Text>
                </Pressable>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={new Date(currentTask[dateType === 'start' ? 'startDate' : 'endDate'])}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      const newDate = selectedDate.toISOString().slice(0, 10);
                      if (dateType === 'start') {
                        setCurrentTask({...currentTask, startDate: newDate});
                      } else {
                        setCurrentTask({...currentTask, endDate: newDate});
                      }
                    }
                  }}
                />
              )}

              <View style={styles.buttonContainer}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setEditTaskModalVisible(false)}
                >
                  <Text style={styles.textStyle}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonAdd]}
                  onPress={handleEditTask}
                >
                  <Text style={styles.textStyle}>Guardar Cambios</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Contenido Principal de Proyectos */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Proyectos</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setAddProjectModalVisible(true)}>
          <Icon name="plus" size={18} color="#fff" />
          <Text style={styles.addButtonText}>Añadir Proyecto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* Columna de Proyectos Actuales */}
        <View style={styles.projectsSidebar}>
          <Text style={styles.projectsSidebarTitle}>Proyectos Actuales</Text>
          <ScrollView style={styles.projectsList}>
            {projects.map(proj => (
              <TouchableOpacity
                key={proj.id}
                style={[styles.projectItem, selectedProject.id === proj.id && styles.projectItemActive]}
                onPress={() => setSelectedProject(proj)}
              >
                <Text style={styles.projectCode}>{proj.code}</Text>
                <Text style={styles.projectName}>{proj.name}</Text>
                <Text style={styles.projectDetails}>{proj.details}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Columna de Tareas y Detalles */}
        <View style={styles.tasksContainer}>
          <View style={styles.tasksHeader}>
            <Text style={styles.tasksHeaderTitle}>Tareas</Text>
            <View style={styles.viewModeButtons}>
              <TouchableOpacity
                style={[styles.viewButton, viewMode === 'kanban' && styles.viewButtonActive]}
                onPress={() => setViewMode('kanban')}
              >
                <Icon name="layout" size={20} color={viewMode === 'kanban' ? '#fff' : '#000'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
                onPress={() => setViewMode('list')}
              >
                <Icon name="list" size={20} color={viewMode === 'list' ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>
          </View>
          
          {viewMode === 'kanban' ? (
            <View style={styles.kanbanBoard}>
              <KanbanColumn
                status="Hacer"
                tasks={selectedProject.tasks.filter(t => t.status === 'Hacer')}
                onDrop={onDrop}
              />
              <KanbanColumn
                status="En Proceso"
                tasks={selectedProject.tasks.filter(t => t.status === 'En Proceso')}
                onDrop={onDrop}
              />
              <KanbanColumn
                status="En Revisión"
                tasks={selectedProject.tasks.filter(t => t.status === 'En Revisión')}
                onDrop={onDrop}
              />
              <KanbanColumn
                status="Hecho"
                tasks={selectedProject.tasks.filter(t => t.status === 'Hecho')}
                onDrop={onDrop}
              />
            </View>
          ) : (
            <ListView project={selectedProject} />
          )}
        </View>
      </View>
    </View>
  );
};

// Estilos de la aplicación
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#720819',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  projectsSidebar: {
    width: 250,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  projectsSidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  projectsList: {
    flex: 1,
  },
  projectItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderRadius: 8,
  },
  projectItemActive: {
    backgroundColor: '#f5f5f5',
  },
  projectCode: {
    fontSize: 12,
    color: '#888',
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  projectDetails: {
    color: '#720819',
    marginTop: 5,
  },
  tasksContainer: {
    flex: 1,
    marginLeft: 20,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tasksHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  viewModeButtons: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 5,
  },
  viewButton: {
    padding: 10,
    borderRadius: 5,
  },
  viewButtonActive: {
    backgroundColor: '#720819',
  },
  kanbanBoard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kanbanColumn: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  kanbanColumnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  taskCardCode: {
    fontSize: 10,
    color: '#aaa',
  },
  taskCardName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  taskCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  taskCardInfoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    marginRight: 10,
  },
  taskStatus: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  taskStatusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  taskCardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailsButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  detailsButtonText: {
    color: '#720819',
    fontWeight: 'bold',
    fontSize: 12,
  },
  editButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  editButtonText: {
    color: '#337ab7',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dropZone: {
    flex: 1,
  },
  dropInstruction: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#aaa',
    marginTop: 10,
  },
  // Estilos para la nueva vista de lista
  listContainer: {
    flex: 1,
  },
  listScrollView: {
    flex: 1,
  },
  taskListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  taskListItemContent: {
    flex: 1,
  },
  taskListItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskListItemInfo: {
    flexDirection: 'row',
    marginTop: 5,
  },
  taskListItemDetails: {
    fontSize: 12,
    color: '#666',
    marginRight: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  filterLabel: {
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#720819',
  },
  filterButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  // Estilos del modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    alignSelf: 'center',
  },
  detailsSection: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailsLabel: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  detailsText: {
    flex: 1,
    flexWrap: 'wrap',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 100,
  },
  datePickerContainer: {
    width: '100%',
    marginBottom: 15,
  },
  dateLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  buttonClose: {
    backgroundColor: '#ccc',
  },
  buttonAdd: {
    backgroundColor: '#720819',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProyectosScreen;
