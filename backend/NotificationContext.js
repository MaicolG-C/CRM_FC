import React, { createContext, useState, useContext } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [activityFeed, setActivityFeed] = useState([
    { id: 1, name: 'Fernanda Paredes', position: 'Asesora Comercial', activity: 'Se actualizó el estado de la tarea de contacto en progreso.', read: true },
    { id: 2, name: 'Christopher Villagómez', position: 'Asesor Comercial', activity: 'Se actualizó el estado de la tarea de contacto en progreso.', read: true },
    { id: 3, name: 'Archivo Adjunto', position: 'Tarea', activity: 'Archivos adjuntos a la tarea.', read: false },
  ]);

  // NUEVO: Contar notificaciones no leídas
  const unreadCount = activityFeed.filter(item => !item.read).length;

  // MODIFICADO: La función ahora añade la propiedad 'read: false'
  const addNotification = (newNotification) => {
    const notificationWithId = {
      ...newNotification,
      id: activityFeed.length + 1,
      read: false, // Las notificaciones nuevas siempre están sin leer
    };
    setActivityFeed(prevFeed => [notificationWithId, ...prevFeed]);
  };

  // NUEVO: Función para marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    setActivityFeed(prevFeed => 
      prevFeed.map(item => ({ ...item, read: true }))
    );
  };

  return (
    <NotificationContext.Provider value={{ activityFeed, addNotification, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};