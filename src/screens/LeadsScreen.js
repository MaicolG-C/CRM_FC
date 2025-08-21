import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Íconos SVG para reemplazar lucide-react y hacer el código autónomo.
const UsersIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-8.5M22 4L12 14.01l-3-3"/>
  </svg>
);

const LoaderIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2 animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

const AlertCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle">
    <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
  </svg>
);

// Generador de ID simple para evitar la dependencia de 'uuid'.
const generateId = () => Math.random().toString(36).substring(2, 9);

// Este es el componente que simula la llamada a la API y maneja los estados.
const LeadsApiScreen = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Datos de ejemplo para simular una respuesta de la API.
    const simulatedLeads = [
      { id: generateId(), name: 'Juan Pérez', email: 'juan.perez@email.com', source: 'Web', status: 'Nuevo', date: '2025-08-20' },
      { id: generateId(), name: 'María García', email: 'maria.garcia@email.com', source: 'Referido', status: 'Contactado', date: '2025-08-19' },
      { id: generateId(), name: 'Carlos López', email: 'carlos.lopez@email.com', source: 'Social Media', status: 'Nuevo', date: '2025-08-18' },
      { id: generateId(), name: 'Ana Fernández', email: 'ana.fernandez@email.com', source: 'Web', status: 'En Proceso', date: '2025-08-17' },
      { id: generateId(), name: 'Pedro Sánchez', email: 'pedro.sanchez@email.com', source: 'Referido', status: 'Nuevo', date: '2025-08-16' },
      { id: generateId(), name: 'Sofía Díaz', email: 'sofia.diaz@email.com', source: 'Social Media', status: 'Contactado', date: '2025-08-15' },
    ];

    // Simulamos un retraso de 2 segundos para representar una llamada a la red.
    const timer = setTimeout(() => {
      setLeads(simulatedLeads);
      setIsLoading(false);
    }, 2000);

    // Función de limpieza.
    return () => clearTimeout(timer);
  }, []);

  // Función para renderizar el contenido basado en el estado (cargando, error o datos).
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-10 text-gray-500">
          <LoaderIcon size={24} className="animate-spin mr-2" />
          <span>Cargando leads...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-10 text-red-500">
          <AlertCircleIcon size={24} className="mr-2" />
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

// Este es el componente principal de tu pantalla, que actúa como contenedor.
const LeadsScreen = () => {
  const isApiConnected = true;

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-6">
      <style>{`
        body { font-family: 'Inter', sans-serif; }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between pb-6 border-b border-gray-200 mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-2">
            <UsersIcon size={32} className="text-blue-600" />
            <span>Gestión de Leads</span>
          </h1>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon size={20} className="text-green-500" />
            <span className="font-semibold text-green-600">
              API Status: En línea
            </span>
          </div>
        </header>

        {/* Aquí se renderiza el componente que maneja la lógica de la API */}
        <LeadsApiScreen />
      </div>
    </div>
  );
};

// El componente principal de la aplicación.
const App = () => {
  return <LeadsScreen />;
};

export default App;
