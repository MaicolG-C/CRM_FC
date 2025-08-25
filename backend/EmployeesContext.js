// ==========================================================
// backend/EmployeesContext.js
// NUEVO ARCHIVO: Contexto para manejar de forma centralizada a los empleados.
// ==========================================================

import React, { createContext, useState, useContext } from 'react';

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

export const EmployeesContext = createContext();

export const EmployeesProvider = ({ children }) => {
  const [employees, setEmployees] = useState(initialEmployees);

  const addEmployee = (newEmployeeData) => {
    const newEmployee = {
      ...newEmployeeData,
      id: `emp-${Date.now()}`,
      avatar: `https://placehold.co/100x100/CCCCCC/333333?text=${newEmployeeData.name.charAt(0).toUpperCase()}`,
      tasksPending: 0,
      tasksProgress: 0,
      tasksReview: 0
    };
    setEmployees(prev => [...prev, newEmployee]);
  };
  
  const updateEmployee = (updatedEmployee) => {
    setEmployees(prev => 
      prev.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );
  };
  
  const deleteEmployee = (employeeId) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  };

  return (
    <EmployeesContext.Provider value={{ employees, addEmployee, updateEmployee, deleteEmployee }}>
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = () => {
  return useContext(EmployeesContext);
};