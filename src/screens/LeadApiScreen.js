import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Loader, AlertCircle } from 'lucide-react';

/**
 * Componente que simula la llamada a una API para obtener los datos de leads.
 * Maneja los estados de carga y errores para una mejor experiencia de usuario.
 */
const LeadsApiScreen = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect se usa para simular la llamada a la API cuando el componente se monta.
  useEffect(() => {
    // Datos de ejemplo para simular la respuesta de una API real.
    const simulatedLeads = [
      { id: uuidv4(), name: 'Juan Pérez', email: 'juan.perez@email.com', source: 'Web', status: 'Nuevo', date: '2025-08-20' },
      { id: uuidv4(), name: 'María García', email: 'maria.garcia@email.com', source: 'Referido', status: 'Contactado', date: '2025-08-19' },
      { id: uuidv4(), name: 'Carlos López', email: 'carlos.lopez@email.com', source: 'Social Media', status: 'Nuevo', date: '2025-08-18' },
      { id: uuidv4(), name: 'Ana Fernández', email: 'ana.fernandez@email.com', source: 'Web', status: 'En Proceso', date: '2025-08-17' },
      { id: uuidv4(), name: 'Pedro Sánchez', email: 'pedro.sanchez@email.com', source: 'Referido', status: 'Nuevo', date: '2025-08-16' },
      { id: uuidv4(), name: 'Sofía Díaz', email: 'sofia.diaz@email.com', source: 'Social Media', status: 'Contactado', date: '2025-08-15' },
    ];

    // Simulamos un retraso de 2 segundos para dar la sensación de una llamada a la red.
    const timer = setTimeout(() => {
      // En una aplicación real, aquí manejarías la respuesta exitosa o el error.
      // Por ahora, siempre cargamos los datos de ejemplo.
      setLeads(simulatedLeads);
      setIsLoading(false);
      // Para simular un error: setError("Error al cargar los datos de la API.");
    }, 2000);

    // Función de limpieza para evitar fugas de memoria si el componente se desmonta.
    return () => clearTimeout(timer);
  }, []);

  // Función para renderizar el contenido basado en el estado (cargando, error o datos).
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-10 text-gray-500">
          <Loader size={24} className="animate-spin mr-2" />
          <span>Cargando leads...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-10 text-red-500">
          <AlertCircle size={24} className="mr-2" />
          <span>Error: {error}</span>
        </div>
      );
    }

    if (leads.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          No hay leads disponibles.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600 uppercase text-sm">
              <th className="px-5 py-3 border-b-2 border-gray-200">ID</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Nombre</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Email</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Fuente</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Estado</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} className="bg-white hover:bg-gray-50">
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{lead.id.substring(0, 8)}...</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-900">{lead.name}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-600">{lead.email}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-600">
                  <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">{lead.source}</span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-600">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    lead.status === 'Nuevo' ? 'bg-yellow-100 text-yellow-800' :
                    lead.status === 'Contactado' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-600">{lead.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <main className="bg-white rounded-xl shadow-md p-6">
      {renderContent()}
    </main>
  );
};

export default LeadsApiScreen;
