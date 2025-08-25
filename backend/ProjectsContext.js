// ==========================================================
// backend/ProjectsContext.js
// NUEVO ARCHIVO: Este es el contexto que centralizará todos los datos de los proyectos.
// ==========================================================

import React, { createContext, useState, useContext } from 'react';
import moment from 'moment';

// Datos iniciales que antes estaban en ProyectosScreen
const initialProjects = [
  { 
    id: '1', 
    code: 'PN001245', 
    name: 'App de Admisiones', 
    details: 'Ver Detalles', 
    tasks: [ 
      { id: 't1', name: 'Investigación', estimated: 4, assignee: 'Pedro', priority: 'Media', status: 'Hecho', description: 'Investigación de mercado y análisis de competencia.', startDate: '2025-08-01', endDate: '2025-08-04' },
      { id: 't2', name: 'Mapa Mental', estimated: 2, assignee: 'Mónica', priority: 'Media', status: 'En Proceso', description: 'Creación de un mapa mental para organizar ideas.', startDate: '2025-08-05', endDate: '2025-08-06' },
    ] 
  },
  { id: '2', code: 'PN001246', name: 'Servicio de Mallas Curriculares', details: 'Ver Detalles', tasks: [] },
  { id: '3', code: 'PN001247', name: 'Sitio Web del ITQ', details: 'Ver Detalles', tasks: [] },
];

export const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState(initialProjects);

  // Función para añadir un nuevo proyecto a la lista
  const addProject = (newProjectData) => {
    const newProject = {
      ...newProjectData,
      id: `proj-${Date.now()}`,
      tasks: [{
        id: `t-${Date.now()}`,
        name: 'Tarea Inicial',
        estimated: 1,
        assignee: 'Sin Asignar',
        priority: 'Media',
        status: 'Hacer',
        description: 'Primera tarea del proyecto.',
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().add(1, 'days').format('YYYY-MM-DD'),
      }]
    };
    setProjects(prevProjects => [...prevProjects, newProject]);
    return newProject; // Devolvemos el proyecto para usarlo en la notificación
  };

  // Función para añadir una nueva tarea a un proyecto existente
  const addTaskToProject = (projectId, newTaskData) => {
    const newTask = {
      ...newTaskData,
      id: `t-${Date.now()}`,
      status: 'Hacer' // Las tareas nuevas siempre empiezan en "Hacer"
    };

    setProjects(prevProjects => 
      prevProjects.map(project => {
        if (project.id === projectId) {
          // Crea una nueva copia del proyecto con la nueva tarea añadida
          return { ...project, tasks: [...project.tasks, newTask] };
        }
        return project;
      })
    );
    return newTask; // Devolvemos la tarea para la notificación
  };

  const updateTask = (projectId, updatedTask) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === updatedTask.id ? updatedTask : task
            ),
          };
        }
        return project;
      })
    );
  };

  return (
    <ProjectsContext.Provider value={{ projects, addProject, addTaskToProject, updateTask }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  return useContext(ProjectsContext);
};