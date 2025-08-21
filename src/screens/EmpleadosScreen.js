import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Image } from 'react-native';

// Datos de empleados, proyectos, equipos y vacaciones
const initialEmployees = [
    { id: '1', name: 'Pedro Rojas', email: 'pedro.rojas@email.com', phone: '+593 945 098 5634', avatar: 'https://placehold.co/100x100/A05151/FFFFFF?text=PR', position: 'Supervisor de Admisiones', seniority: 'Middle', tasksPending: 0, tasksProgress: 16, tasksReview: 2, team: 'Equipo ITQ', location: 'Quito, Av. Ulloa', birthdate: 'Mar 19, 1994' },
    { id: '2', name: 'Mónica Arguedo', email: 'monica.arguedo@email.com', phone: '+593 912 345 6789', avatar: 'https://placehold.co/100x100/D9A03A/FFFFFF?text=MA', position: 'Coordinadora de Proyectos', seniority: 'Junior', tasksPending: 1, tasksProgress: 20, tasksReview: 2, team: 'Equipo de Soporte', location: 'Guayaquil, Av. 9 de Octubre', birthdate: 'May 20, 1993' },
    { id: '3', name: 'Melanie Durán', email: 'melanie.duran@email.com', phone: '+593 987 654 3210', avatar: 'https://placehold.co/100x100/6A7758/FFFFFF?text=MD', position: 'Asesora Senior', seniority: 'Senior', tasksPending: 1, tasksProgress: 20, tasksReview: 2, team: 'Equipo de Desarrollo', location: 'Cuenca, Calle Larga', birthdate: 'Sep 1, 1991' },
    { id: '4', name: 'Fernanda Paredes', email: 'fernanda.paredes@email.com', phone: '+593 923 456 7890', avatar: 'https://placehold.co/100x100/5267A8/FFFFFF?text=FP', position: 'Asesora de Marketing', seniority: 'Middle', tasksPending: 1, tasksProgress: 14, tasksReview: 3, team: 'Equipo de Marketing', location: 'Quito, Av. Eloy Alfaro', birthdate: 'Apr 15, 1995' },
    { id: '5', name: 'Kevin Zapata', email: 'kevin.zapata@email.com', phone: '+593 956 789 0123', avatar: 'https://placehold.co/100x100/3A4F7F/FFFFFF?text=KZ', position: 'Asesor de Ventas', seniority: 'Junior', tasksPending: 0, tasksProgress: 8, tasksReview: 6, team: 'Equipo de Ventas', location: 'Quito, Av. Amazonas', birthdate: 'Nov 30, 1996' },
    { id: '6', name: 'Patricia Irua', email: 'patricia.irua@email.com', phone: '+593 967 890 1234', avatar: 'https://placehold.co/100x100/7E5983/FFFFFF?text=PI', position: 'Asesora de Soporte', seniority: 'Junior', tasksPending: 1, tasksProgress: 20, tasksReview: 2, team: 'Equipo de Soporte', location: 'Guayaquil, Samborondón', birthdate: 'Dec 25, 1995' },
    { id: '7', name: 'María Belén Chamorro', email: 'maria.chamorro@email.com', phone: '+593 978 901 2345', avatar: 'https://placehold.co/100x100/A03A4E/FFFFFF?text=MC', position: 'Asesora Financiera', seniority: 'Middle', tasksPending: 0, tasksProgress: 4, tasksReview: 6, team: 'Equipo Financiero', location: 'Cuenca, Av. Las Américas', birthdate: 'Mar 10, 1992' },
    { id: '8', name: 'Cristopher Villagómez', email: 'cristopher.villagomez@email.com', phone: '+593 989 012 3456', avatar: 'https://placehold.co/100x100/1E3F66/FFFFFF?text=CV', position: 'Asesor de Proyectos', seniority: 'Senior', tasksPending: 0, tasksProgress: 20, tasksReview: 2, team: 'Equipo de Desarrollo', location: 'Quito, Av. 6 de Diciembre', birthdate: 'Oct 2, 1990' },
];

const initialProjects = [
    { id: 'P001265', name: 'App Admisiones', created: 'Sep 12, 2020', priority: 'Medio', tasks: 34, activeTasks: 13, members: ['1', '5'] },
    { id: 'P001221', name: 'Pagina Web ITQ', created: 'Sep 10, 2020', priority: 'Medio', tasks: 50, activeTasks: 24, members: ['2', '3'] },
    { id: 'P001290', name: 'Proyectos Internos', created: 'May 28, 2020', priority: 'Bajo', tasks: 23, activeTasks: 20, members: ['4', '6', '7'] },
];

const mockVacations = {
    '1': ['2025-08-25', '2025-08-26', '2025-08-27'],
    '2': ['2025-09-10', '2025-09-11'],
    '3': ['2025-10-01', '2025-10-02', '2025-10-03', '2025-10-04', '2025-10-05'],
    '4': [],
    '5': ['2025-11-20', '2025-11-21', '2025-11-22'],
    '6': ['2025-12-24', '2025-12-25', '2025-12-26'],
    '7': [],
    '8': ['2025-07-01', '2025-07-02', '2025-07-03', '2025-07-04'],
};

// Componente para la vista del perfil del empleado
const EmployeeProfile = ({ employee, onGoBack, onEdit, projects }) => {
    const [activeTab, setActiveTab] = useState('projects');
    const employeeProjects = projects.filter(project => project.members.includes(employee.id));

    const renderProjectsTab = () => (
        <View style={profileStyles.tabContent}>
            {employeeProjects.length > 0 ? (
                employeeProjects.map(project => (
                    <View key={project.id} style={profileStyles.projectCard}>
                        <View style={profileStyles.projectHeader}>
                            <Text style={profileStyles.projectTitle}>{project.name}</Text>
                            <Text style={profileStyles.projectPriority}>{project.priority}</Text>
                        </View>
                        <Text style={profileStyles.projectSubtitle}>
                            <Text style={{fontWeight: 'bold'}}>ID: </Text>{project.id}
                            <Text style={{fontWeight: 'bold'}}> • Creado: </Text>{project.created}
                        </Text>
                        <View style={profileStyles.projectTasks}>
                            <Text style={profileStyles.projectTaskText}><Text style={{fontWeight: 'bold'}}>{project.tasks}</Text> Tareas en total</Text>
                            <Text style={profileStyles.projectTaskText}><Text style={{fontWeight: 'bold'}}>{project.activeTasks}</Text> Tareas activas</Text>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={profileStyles.noDataText}>No hay proyectos asignados.</Text>
            )}
        </View>
    );

    const renderTeamTab = () => (
        <View style={profileStyles.tabContent}>
            <Text style={profileStyles.teamText}><Text style={{fontWeight: 'bold'}}>Equipo:</Text> {employee.team}</Text>
        </View>
    );

    const renderVacationsTab = () => {
        const vacationDates = mockVacations[employee.id] || [];
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        const vacationMonths = vacationDates.reduce((acc, dateStr) => {
            const date = new Date(dateStr);
            const month = monthNames[date.getMonth()];
            if (!acc[month]) {
                acc[month] = [];
            }
            acc[month].push(date.getDate());
            return acc;
        }, {});

        return (
            <View style={profileStyles.tabContent}>
                {vacationDates.length === 0 ? (
                    <Text style={profileStyles.noDataText}>No hay vacaciones programadas.</Text>
                ) : (
                    Object.entries(vacationMonths).map(([month, days]) => (
                        <View key={month} style={profileStyles.vacationMonth}>
                            <Text style={profileStyles.vacationMonthTitle}>{month}</Text>
                            <Text style={profileStyles.vacationDays}>{days.join(', ')}</Text>
                        </View>
                    ))
                )}
            </View>
        );
    };

    return (
        <View style={profileStyles.container}>
            <ScrollView>
                <TouchableOpacity onPress={onGoBack} style={profileStyles.backButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#1F2937">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </TouchableOpacity>

                <View style={profileStyles.header}>
                    <View style={profileStyles.headerTitleContainer}>
                        <Text style={profileStyles.headerTitle}>Perfil de Empleado</Text>
                        <TouchableOpacity onPress={() => onEdit(employee)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#1F2937">
                                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                            </svg>
                        </TouchableOpacity>
                    </View>
                    <View style={profileStyles.profileHeaderInfo}>
                         <Image style={profileStyles.avatar} source={{ uri: employee.avatar }} />
                        <View>
                            <Text style={profileStyles.profileName}>{employee.name}</Text>
                            <Text style={profileStyles.profilePosition}>{employee.position}</Text>
                        </View>
                    </View>
                </View>

                <View style={profileStyles.tabContainer}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('projects')}
                        style={[profileStyles.tabButton, activeTab === 'projects' && profileStyles.activeTab]}
                    >
                        <Text style={[profileStyles.tabText, activeTab === 'projects' && profileStyles.activeTabText]}>Proyectos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('team')}
                        style={[profileStyles.tabButton, activeTab === 'team' && profileStyles.activeTab]}
                    >
                        <Text style={[profileStyles.tabText, activeTab === 'team' && profileStyles.activeTabText]}>Equipo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('vacations')}
                        style={[profileStyles.tabButton, activeTab === 'vacations' && profileStyles.activeTab]}
                    >
                        <Text style={[profileStyles.tabText, activeTab === 'vacations' && profileStyles.activeTabText]}>Mis Vacaciones</Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'projects' && renderProjectsTab()}
                {activeTab === 'team' && renderTeamTab()}
                {activeTab === 'vacations' && renderVacationsTab()}

                {/* Info Principal y de Contacto */}
                <View style={profileStyles.section}>
                    <Text style={profileStyles.sectionTitle}>Info Principal</Text>
                    <View style={profileStyles.infoItem}>
                        <Text style={profileStyles.infoLabel}>Posición</Text>
                        <Text style={profileStyles.infoValue}>{employee.position}</Text>
                    </View>
                    <View style={profileStyles.infoItem}>
                        <Text style={profileStyles.infoLabel}>Equipo</Text>
                        <Text style={profileStyles.infoValue}>{employee.team}</Text>
                    </View>
                    <View style={profileStyles.infoItem}>
                        <Text style={profileStyles.infoLabel}>Ubicación</Text>
                        <Text style={profileStyles.infoValue}>{employee.location}</Text>
                    </View>
                    <View style={profileStyles.infoItem}>
                        <Text style={profileStyles.infoLabel}>Fecha de Cumpleaños</Text>
                        <Text style={profileStyles.infoValue}>{employee.birthdate}</Text>
                    </View>
                </View>
                
                <View style={profileStyles.section}>
                    <Text style={profileStyles.sectionTitle}>Información de Contacto</Text>
                    <View style={profileStyles.infoItem}>
                        <Text style={profileStyles.infoLabel}>Email</Text>
                        <Text style={profileStyles.infoValue}>{employee.email}</Text>
                    </View>
                    <View style={profileStyles.infoItem}>
                        <Text style={profileStyles.infoLabel}>Teléfono</Text>
                        <Text style={profileStyles.infoValue}>{employee.phone}</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
};

// Componente para la vista de proyectos
const ProjectView = ({ projects, employees, onAddProject }) => {
    return (
        <ScrollView style={styles.scrollView}>
            <View style={projectStyles.header}>
                <Text style={projectStyles.headerTitle}>Proyectos ({projects.length})</Text>
                <TouchableOpacity onPress={onAddProject} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Añadir Proyecto</Text>
                </TouchableOpacity>
            </View>
            {projects.map(project => (
                <View key={project.id} style={projectStyles.projectCard}>
                    <Text style={projectStyles.projectName}>{project.name}</Text>
                    <View style={projectStyles.projectDetailsRow}>
                        <View style={projectStyles.projectDetailItem}>
                            <Text style={projectStyles.projectDetailLabel}>ID:</Text>
                            <Text style={projectStyles.projectDetailValue}>{project.id}</Text>
                        </View>
                        <View style={projectStyles.projectDetailItem}>
                            <Text style={projectStyles.projectDetailLabel}>Prioridad:</Text>
                            <Text style={projectStyles.projectDetailValue}>{project.priority}</Text>
                        </View>
                    </View>
                    <Text style={projectStyles.membersTitle}>Miembros del Equipo:</Text>
                    <View style={projectStyles.membersContainer}>
                        {project.members.map(memberId => {
                            const member = employees.find(emp => emp.id === memberId);
                            return member ? (
                                <View key={member.id} style={projectStyles.memberTag}>
                                    <Image style={projectStyles.memberAvatar} source={{ uri: member.avatar }} />
                                    <Text style={projectStyles.memberText}>{member.name.split(' ')[0]}</Text>
                                </View>
                            ) : null;
                        })}
                        {project.members.length === 0 && (
                            <Text style={projectStyles.noMembersText}>No hay miembros asignados.</Text>
                        )}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

// Componente para el modal de añadir proyecto
const AddProjectModal = ({ isVisible, onClose, onSave, employees }) => {
    const [formData, setFormData] = useState({ name: '', priority: '', members: [] });
    
    const handleToggleMember = (memberId) => {
        setFormData(prevData => {
            const newMembers = prevData.members.includes(memberId)
                ? prevData.members.filter(id => id !== memberId)
                : [...prevData.members, memberId];
            return { ...prevData, members: newMembers };
        });
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, projectStyles.addProjectModal]}>
                    <Text style={styles.modalTitle}>Añadir Nuevo Proyecto</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Nombre del Proyecto"
                        value={formData.name}
                        onChangeText={text => setFormData({ ...formData, name: text })}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Prioridad (Ej. Alto, Medio, Bajo)"
                        value={formData.priority}
                        onChangeText={text => setFormData({ ...formData, priority: text })}
                    />
                    <Text style={projectStyles.selectMembersTitle}>Seleccionar Miembros:</Text>
                    <ScrollView style={projectStyles.membersSelectionContainer}>
                        {employees.map(employee => (
                            <TouchableOpacity 
                                key={employee.id} 
                                style={[projectStyles.memberSelectionItem, formData.members.includes(employee.id) && projectStyles.memberSelected]}
                                onPress={() => handleToggleMember(employee.id)}
                            >
                                <Image style={projectStyles.memberSelectionAvatar} source={{ uri: employee.avatar }} />
                                <Text style={projectStyles.memberSelectionText}>{employee.name}</Text>
                                {formData.members.includes(employee.id) && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#1F2937">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-8.69" />
                                        <path d="M22 4 12 14.01l-3-3" />
                                    </svg>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onClose} style={[styles.modalButton, styles.modalCancelButton]}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave} style={[styles.modalButton, styles.modalConfirmButton]}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// Componente principal de la aplicación
const App = () => {
    const [employees, setEmployees] = useState(initialEmployees);
    const [projects, setProjects] = useState(initialProjects);
    const [view, setView] = useState('list');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isAddProjectModalVisible, setIsAddProjectModalVisible] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        seniority: '',
        phone: '',
        location: '',
        birthdate: '',
    });

    const handleOpenEditModal = (employee = null) => {
        setCurrentEmployee(employee);
        if (employee) {
            setFormData({
                name: employee.name,
                email: employee.email,
                position: employee.position,
                seniority: employee.seniority,
                phone: employee.phone,
                location: employee.location,
                birthdate: employee.birthdate,
            });
        } else {
            setFormData({
                name: '',
                email: '',
                position: '',
                seniority: '',
                phone: '',
                location: '',
                birthdate: '',
            });
        }
        setIsEditModalVisible(true);
    };

    const handleSave = () => {
        if (currentEmployee) {
            const updatedEmployees = employees.map(emp =>
                emp.id === currentEmployee.id ? { ...emp, ...formData } : emp
            );
            setEmployees(updatedEmployees);
            setSelectedEmployee({ ...currentEmployee, ...formData });
        } else {
            const newEmployee = {
                ...formData,
                id: Math.random().toString(),
                avatar: `https://placehold.co/100x100/CCCCCC/333333?text=${formData.name.charAt(0).toUpperCase()}`,
                tasksPending: 0,
                tasksProgress: 0,
                tasksReview: 0
            };
            setEmployees([...employees, newEmployee]);
        }
        setIsEditModalVisible(false);
    };

    const handleDelete = () => {
        const updatedEmployees = employees.filter(emp => emp.id !== employeeToDelete);
        setEmployees(updatedEmployees);
        setIsDeleteModalVisible(false);
        setEmployeeToDelete(null);
        setSelectedEmployee(null);
    };

    const handleOpenDeleteModal = (id) => {
        setEmployeeToDelete(id);
        setIsDeleteModalVisible(true);
    };

    const handleAddProject = (newProjectData) => {
        const newProject = {
            ...newProjectData,
            id: 'P' + Math.floor(Math.random() * 900000 + 100000), // Generar ID de proyecto aleatorio
            created: new Date().toLocaleDateString('es-ES', { month: 'short', day: '2-digit', year: 'numeric' }),
            tasks: 0,
            activeTasks: 0,
        };
        setProjects(prevProjects => [...prevProjects, newProject]);
    };

    const renderDeleteModal = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isDeleteModalVisible}
            onRequestClose={() => setIsDeleteModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Eliminar Empleado</Text>
                    <Text style={styles.modalText}>¿Estás seguro de que quieres eliminar a este empleado?</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)} style={[styles.modalButton, styles.modalCancelButton]}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={[styles.modalButton, styles.modalConfirmButton]}>
                            <Text style={styles.buttonText}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderEditModal = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isEditModalVisible}
            onRequestClose={() => setIsEditModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{currentEmployee ? 'Editar Empleado' : 'Añadir Empleado'}</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Nombre"
                        value={formData.name}
                        onChangeText={text => setFormData({ ...formData, name: text })}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Email"
                        value={formData.email}
                        onChangeText={text => setFormData({ ...formData, email: text })}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Posición"
                        value={formData.position}
                        onChangeText={text => setFormData({ ...formData, position: text })}
                    />
                     <TextInput
                        style={styles.textInput}
                        placeholder="Antigüedad"
                        value={formData.seniority}
                        onChangeText={text => setFormData({ ...formData, seniority: text })}
                    />
                     <TextInput
                        style={styles.textInput}
                        placeholder="Teléfono"
                        value={formData.phone}
                        onChangeText={text => setFormData({ ...formData, phone: text })}
                    />
                     <TextInput
                        style={styles.textInput}
                        placeholder="Ubicación"
                        value={formData.location}
                        onChangeText={text => setFormData({ ...formData, location: text })}
                    />
                     <TextInput
                        style={styles.textInput}
                        placeholder="Fecha de Cumpleaños (MM DD, AAAA)"
                        value={formData.birthdate}
                        onChangeText={text => setFormData({ ...formData, birthdate: text })}
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={() => setIsEditModalVisible(false)} style={[styles.modalButton, styles.modalCancelButton]}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave} style={[styles.modalButton, styles.modalConfirmButton]}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderListView = () => (
        <ScrollView style={styles.scrollView}>
            {employees.map(employee => (
                <TouchableOpacity key={employee.id} onPress={() => setSelectedEmployee(employee)}>
                    <View style={styles.listItem}>
                        <View style={styles.listItemTextContainer}>
                            <Text style={styles.listItemTitle}>{employee.name}</Text>
                            <Text style={styles.listItemSubtitle}>{employee.position}</Text>
                            <View style={styles.seniorityTag}>
                                <Text style={styles.seniorityText}>{employee.seniority}</Text>
                            </View>
                        </View>
                        <View style={styles.listItemActions}>
                            <TouchableOpacity onPress={() => handleOpenEditModal(employee)} style={[styles.actionButton, { backgroundColor: '#E5E7EB' }]}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#6B7280">
                                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                </svg>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleOpenDeleteModal(employee.id)} style={[styles.actionButton, { backgroundColor: '#FEE2E2' }]}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#EF4444">
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <line x1="10" x2="10" y1="11" y2="17" />
                                    <line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderActivityView = () => (
        <ScrollView contentContainerStyle={styles.activityGrid}>
            {employees.map(employee => (
                <TouchableOpacity key={employee.id} onPress={() => setSelectedEmployee(employee)} style={styles.activityCard}>
                    <Image
                        style={styles.avatarImage}
                        source={{ uri: employee.avatar }}
                    />
                    <Text style={styles.activityTitle}>{employee.name}</Text>
                    <Text style={styles.activitySubtitle}>{employee.position}</Text>
                    <View style={styles.taskContainer}>
                        <View style={styles.taskItem}>
                            <Text style={styles.taskCount}>{employee.tasksPending}</Text>
                            <Text style={styles.taskLabel}>Pendientes</Text>
                        </View>
                        <View style={styles.taskItem}>
                            <Text style={styles.taskCount}>{employee.tasksProgress}</Text>
                            <Text style={styles.taskLabel}>En progreso</Text>
                        </View>
                        <View style={styles.taskItem}>
                            <Text style={styles.taskCount}>{employee.tasksReview}</Text>
                            <Text style={styles.taskLabel}>En revisión</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            {selectedEmployee ? (
                <EmployeeProfile
                    employee={selectedEmployee}
                    onGoBack={() => setSelectedEmployee(null)}
                    onEdit={handleOpenEditModal}
                    projects={projects} // Pasa los proyectos como prop
                />
            ) : (
                <>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Empleados ({employees.length})</Text>
                        <TouchableOpacity onPress={() => handleOpenEditModal()} style={styles.addButton}>
                            <Text style={styles.addButtonText}>+ Añadir Empleado</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.viewToggleContainer}>
                        <View style={styles.viewToggle}>
                            <TouchableOpacity
                                onPress={() => setView('list')}
                                style={[styles.viewButton, view === 'list' && styles.viewButtonActive]}
                            >
                                <Text style={[styles.viewButtonText, view === 'list' && styles.viewButtonTextActive]}>Lista</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setView('activity')}
                                style={[styles.viewButton, view === 'activity' && styles.viewButtonActive]}
                            >
                                <Text style={[styles.viewButtonText, view === 'activity' && styles.viewButtonTextActive]}>Actividad</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setView('projects')}
                                style={[styles.viewButton, view === 'projects' && styles.viewButtonActive]}
                            >
                                <Text style={[styles.viewButtonText, view === 'projects' && styles.viewButtonTextActive]}>Proyectos</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {view === 'list' && renderListView()}
                    {view === 'activity' && renderActivityView()}
                    {view === 'projects' && <ProjectView projects={projects} employees={employees} onAddProject={() => setIsAddProjectModalVisible(true)} />}
                </>
            )}

            {renderEditModal()}
            {renderDeleteModal()}
            <AddProjectModal
                isVisible={isAddProjectModalVisible}
                onClose={() => setIsAddProjectModalVisible(false)}
                onSave={handleAddProject}
                employees={employees}
            />
        </View>
    );
};

// Styles for Project View
const projectStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    projectCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    projectName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    projectDetailsRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    projectDetailItem: {
        flexDirection: 'row',
        marginRight: 20,
    },
    projectDetailLabel: {
        fontWeight: 'bold',
        color: '#6B7280',
        marginRight: 4,
    },
    projectDetailValue: {
        color: '#1F2937',
    },
    membersTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    membersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    memberTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5E7EB',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 8,
    },
    memberAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 6,
    },
    memberText: {
        fontSize: 14,
        color: '#1F2937',
    },
    noMembersText: {
        fontSize: 14,
        color: '#6B7280',
    },
    addProjectModal: {
        height: '80%',
        width: '90%',
    },
    selectMembersTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 16,
        marginBottom: 8,
    },
    membersSelectionContainer: {
        maxHeight: 200,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 8,
    },
    memberSelectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 8,
        justifyContent: 'space-between',
    },
    memberSelected: {
        backgroundColor: '#D1FAE5',
    },
    memberSelectionAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
    },
    memberSelectionText: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
});

const profileStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
    },
    header: {
        marginTop: 40,
        marginBottom: 20,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    profileHeaderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 20,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    profilePosition: {
        fontSize: 16,
        color: '#6B7280',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#E5E7EB',
        borderRadius: 20,
        padding: 4,
        marginBottom: 20,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    tabText: {
        fontWeight: 'bold',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#1F2937',
    },
    tabContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    projectCard: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    projectPriority: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4B5563',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
    },
    projectSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    projectTasks: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 16
    },
    projectTaskText: {
        fontSize: 14,
        color: '#4B5563'
    },
    teamText: {
        fontSize: 16,
        color: '#1F2937',
    },
    noDataText: {
        textAlign: 'center',
        color: '#6B7280',
        paddingVertical: 20,
    },
    vacationMonth: {
        marginBottom: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 16,
    },
    vacationMonthTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    vacationDays: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 8,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    infoLabel: {
        fontSize: 16,
        color: '#6B7280',
    },
    infoValue: {
        fontSize: 16,
        color: '#1F2937',
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    addButton: {
        backgroundColor: '#DC2626',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    viewToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    viewToggle: {
        flexDirection: 'row',
        backgroundColor: '#E5E7EB',
        borderRadius: 20,
        padding: 4,
        width: 300,
    },
    viewButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    viewButtonActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    viewButtonText: {
        fontWeight: 'bold',
        color: '#6B7280',
    },
    viewButtonTextActive: {
        color: '#1F2937',
    },
    scrollView: {
        flex: 1,
    },
    listItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    listItemTextContainer: {
        flex: 1,
    },
    listItemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    listItemSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    seniorityTag: {
        backgroundColor: '#D1FAE5',
        borderRadius: 16,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    seniorityText: {
        color: '#065F46',
        fontSize: 12,
        fontWeight: 'bold',
    },
    listItemActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 8,
        borderRadius: 8,
    },
    activityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    activityCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    avatarImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 16
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginTop: 8,
    },
    activitySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 16,
    },
    taskContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    taskItem: {
        alignItems: 'center',
    },
    taskCount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    taskLabel: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        color: '#4B5563',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    modalCancelButton: {
        backgroundColor: '#6B7280',
    },
    modalConfirmButton: {
        backgroundColor: '#DC2626',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    textInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        color: '#1F2937',
    },
});

export default App;
