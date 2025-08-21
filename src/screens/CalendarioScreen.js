import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, Button, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const { width } = Dimensions.get('window');
const dayWidth = (width - 40) / 7;

// Simulación de los datos del backend.
const initialEvents = [
  { _id: '1', title: 'Reunión Semanal', date: '2025-09-08', time: '10:00', duration: 3, details: 'Discutir el progreso del proyecto de la semana.' },
  { _id: '2', title: 'Presentación Métricas', date: '2025-09-08', time: '14:00', duration: 2, details: 'Presentar los resultados de ventas del último trimestre.' },
  { _id: '3', title: 'Presentación Objetivos', date: '2025-09-16', time: '09:00', duration: 2, details: 'Establecer los objetivos para el siguiente periodo.' },
  { _id: '4', title: 'Cumpleaños Pedro', date: '2025-09-16', time: '12:00', duration: 2, details: 'Celebración sorpresa en la oficina.' },
  { _id: '5', title: 'Noche de Películas', date: '2025-09-16', time: '19:00', duration: 2, details: 'Ver la última película de Marvel con amigos.' },
  { _id: '6', title: 'Reunión Admisiones', date: '2025-09-28', time: '09:00', duration: 2, details: 'Entrevistas a nuevos candidatos para el puesto.' },
  { _id: '7', title: 'Feriado', date: '2025-09-28', time: '09:00', duration: 3, details: 'No hay trabajo hoy. ¡A descansar!' },
];

const CalendarioScreen = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [events, setEvents] = useState(initialEvents);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDatePickerModalVisible, setDatePickerModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('09:00');
  const [newEventDuration, setNewEventDuration] = useState('1');
  const [newEventDetails, setNewEventDetails] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Reinicia los estados del modal y formulario
  const resetModalState = () => {
    setNewEventTitle('');
    setNewEventTime('09:00');
    setNewEventDuration('1');
    setNewEventDetails('');
    setSelectedDay(null);
    setSelectedEvent(null);
    setIsEditing(false);
  };

  // Lógica para guardar o editar un evento
  const handleSaveEvent = () => {
    if (!newEventTitle || !selectedDay) {
      Alert.alert('Error', 'El título y la fecha son obligatorios.');
      return;
    }
    const eventData = {
      title: newEventTitle,
      date: selectedDay.format('YYYY-MM-DD'),
      time: newEventTime,
      duration: parseFloat(newEventDuration),
      details: newEventDetails,
    };

    if (isEditing) {
      // Editar un evento existente
      setEvents(events.map(event =>
        event._id === selectedEvent._id ? { ...event, ...eventData } : event
      ));
    } else {
      // Crear un nuevo evento
      const newEvent = { ...eventData, _id: `temp-${Date.now()}` };
      setEvents(prevEvents => [...prevEvents, newEvent]);
    }
    setModalVisible(false);
    resetModalState();
  };

  // Lógica para eliminar un evento
  const handleDeleteEvent = () => {
    // Si no hay un evento seleccionado, no hacemos nada
    if (!selectedEvent) {
      return;
    }

    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este evento?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => {
            // Usa el ID del evento seleccionado para filtrar la lista
            setEvents(prevEvents => prevEvents.filter(event => event._id !== selectedEvent._id));
            setModalVisible(false);
            resetModalState();
          }
        }
      ]
    );
  };

  const getCalendarGrid = () => {
    const startOfMonth = moment(currentDate).startOf('month');
    const endOfMonth = moment(currentDate).endOf('month');
    const startOfGrid = moment(startOfMonth).startOf('week');
    const endOfGrid = moment(endOfMonth).endOf('week');

    const grid = [];
    let day = startOfGrid;

    while (day.isSameOrBefore(endOfGrid, 'day')) {
      grid.push(moment(day));
      day.add(1, 'day');
    }
    return grid;
  };

  // Maneja la acción de tocar un evento
  const handleEventPress = (event) => {
    setSelectedEvent(event);
    setIsEditing(false); // Asegura que el modo de edición esté apagado
    setModalVisible(true);
  };

  // Maneja la acción de tocar un día
  const handleDayPress = (day) => {
    setSelectedDay(day);
    setSelectedEvent(null); // Asegura que no hay evento seleccionado para crear
    setIsEditing(false); // Asegura que el modo de edición esté apagado
    setModalVisible(true);
  };

  // Llena el formulario con los datos del evento para la edición
  const handleEditPress = () => {
    setIsEditing(true);
    setNewEventTitle(selectedEvent.title);
    setNewEventTime(selectedEvent.time);
    setNewEventDuration(selectedEvent.duration.toString());
    setNewEventDetails(selectedEvent.details);
    setSelectedDay(moment(selectedEvent.date));
  };

  // Lógica para aplazar el evento
  const handleReschedulePress = () => {
    setModalVisible(false);
    setDatePickerModalVisible(true);
  };

  const renderEvent = (event) => {
    return (
      <TouchableOpacity key={event._id} style={styles.event} onPress={() => handleEventPress(event)}>
        <Text style={styles.eventText}>{event.title}</Text>
        <View style={styles.eventDetails}>
          <Text style={styles.eventTime}>{event.duration}h</Text>
          <Text style={styles.eventIcon}>{"\u2B07\uFE0E"}</Text> 
        </View>
      </TouchableOpacity>
    );
  };

  const getEventsForDay = (day) => {
    return events.filter(event => moment(event.date).isSame(day, 'day'));
  };

  const renderModalContent = () => {
    if (selectedEvent && !isEditing) {
      // Contenido del modal para ver detalles y acciones
      return (
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Detalles del Evento</Text>
          <Text style={styles.modalDetailLabel}>Título:</Text>
          <Text style={styles.modalDetailText}>{selectedEvent.title}</Text>
          <Text style={styles.modalDetailLabel}>Fecha:</Text>
          <Text style={styles.modalDetailText}>{moment(selectedEvent.date).format('DD-MM-YYYY')}</Text>
          <Text style={styles.modalDetailLabel}>Hora:</Text>
          <Text style={styles.modalDetailText}>{selectedEvent.time}</Text>
          <Text style={styles.modalDetailLabel}>Duración:</Text>
          <Text style={styles.modalDetailText}>{selectedEvent.duration} horas</Text>
          <Text style={styles.modalDetailLabel}>Detalles:</Text>
          <Text style={styles.modalDetailText}>{selectedEvent.details}</Text>
          <View style={styles.modalButtons}>
            <Button title="Editar" onPress={handleEditPress} color="#f87171" />
            <Button title="Aplazar" onPress={handleReschedulePress} color="#fb923c" />
            <Button title="Eliminar" onPress={handleDeleteEvent} color="#dc2626" />
            <Button title="Cerrar" onPress={() => { setModalVisible(false); resetModalState(); }} color="#6b7280" />
          </View>
        </View>
      );
    } else {
      // Contenido del modal para añadir/editar evento
      return (
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{isEditing ? 'Editar Evento' : 'Añadir Evento'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Título del evento"
            value={newEventTitle}
            onChangeText={setNewEventTitle}
            maxLength={50}
          />
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setDatePickerModalVisible(true)}
          >
            <Text style={styles.label}>Fecha: {selectedDay ? selectedDay.format('DD-MM-YYYY') : ''}</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Hora:</Text>
          <Picker
            selectedValue={newEventTime}
            onValueChange={(itemValue) => setNewEventTime(itemValue)}
            style={styles.picker}
          >
            {[...Array(24).keys()].map(h => (
              <Picker.Item key={h} label={`${h < 10 ? '0' : ''}${h}:00`} value={`${h < 10 ? '0' : ''}${h}:00`} />
            ))}
          </Picker>
          <Text style={styles.label}>Duración (horas):</Text>
          <Picker
            selectedValue={newEventDuration}
            onValueChange={(itemValue) => setNewEventDuration(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="0.5" value="0.5" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="1.5" value="1.5" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
          </Picker>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Detalles del evento"
            value={newEventDetails}
            onChangeText={setNewEventDetails}
            multiline={true}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancelar" onPress={() => { setModalVisible(false); resetModalState(); }} color="#6b7280" />
            <Button title="Guardar" onPress={handleSaveEvent} color="#f87171" />
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Calendario</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            setSelectedDay(moment());
            setSelectedEvent(null);
            setIsEditing(false);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Añadir Evento</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity onPress={() => setCurrentDate(moment(currentDate).subtract(1, 'month'))}>
          <Text style={styles.navButton}>{"←"}</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>{currentDate.format('MMMM, YYYY')}</Text>
        <TouchableOpacity onPress={() => setCurrentDate(moment(currentDate).add(1, 'month'))}>
          <Text style={styles.navButton}>{"→"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dayNamesContainer}>
        {moment.weekdaysShort().map(day => (
          <Text key={day} style={styles.dayName}>{day}</Text>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {getCalendarGrid().map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              !day.isSame(currentDate, 'month') && styles.dayCellOutsideMonth
            ]}
            onPress={() => handleDayPress(day)}
          >
            <Text style={styles.dayText}>{day.date()}</Text>
            {getEventsForDay(day).map(event => renderEvent(event))}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal principal para añadir/ver/editar eventos */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          resetModalState();
        }}
      >
        <View style={styles.centeredView}>
          {renderModalContent()}
        </View>
      </Modal>

      {/* Modal para seleccionar la fecha (para añadir o aplazar) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDatePickerModalVisible}
        onRequestClose={() => setDatePickerModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { padding: 10, width: '85%' }]}>
            <View style={styles.navigation}>
              <TouchableOpacity onPress={() => setCurrentDate(moment(currentDate).subtract(1, 'month'))}>
                <Text style={styles.navButton}>{"←"}</Text>
              </TouchableOpacity>
              <Text style={styles.monthYear}>{currentDate.format('MMMM, YYYY')}</Text>
              <TouchableOpacity onPress={() => setCurrentDate(moment(currentDate).add(1, 'month'))}>
                <Text style={styles.navButton}>{"→"}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dayNamesContainer}>
              {moment.weekdaysShort().map(day => (
                <Text key={day} style={[styles.dayName, { width: 40 }]}>{day}</Text>
              ))}
            </View>
            <View style={styles.gridContainer}>
              {getCalendarGrid().map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.datePickerDay,
                    day.isSame(selectedDay, 'day') && styles.selectedDay,
                    !day.isSame(currentDate, 'month') && styles.dayCellOutsideMonth
                  ]}
                  onPress={() => {
                    if (selectedEvent) {
                      // Aplazar un evento existente
                      setEvents(events.map(event =>
                        event._id === selectedEvent._id ? { ...event, date: day.format('YYYY-MM-DD') } : event
                      ));
                    } else {
                      // Seleccionar fecha para nuevo evento
                      setSelectedDay(day);
                    }
                    setDatePickerModalVisible(false);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.dayText}>{day.date()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#f87171',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  navButton: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    color: '#333',
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#555',
  },
  dayNamesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  dayName: {
    width: dayWidth,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#777',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: dayWidth,
    minHeight: dayWidth * 1.2,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#f9f9f9',
  },
  dayCellOutsideMonth: {
    backgroundColor: '#fff',
    opacity: 0.4,
  },
  datePickerDay: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 3,
  },
  selectedDay: {
    backgroundColor: '#f87171',
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-end',
  },
  event: {
    backgroundColor: '#d6f0f8',
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  eventText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00796b',
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  eventTime: {
    fontSize: 9,
    color: '#00796b',
  },
  eventIcon: {
    fontSize: 10,
    color: '#00796b',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalDetailLabel: {
    alignSelf: 'flex-start',
    fontWeight: '600',
    marginTop: 5,
    color: '#555',
  },
  modalDetailText: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  label: {
    alignSelf: 'flex-start',
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 5,
    color: '#555',
  },
  datePickerButton: {
    alignSelf: 'flex-start',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    height: 50,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default CalendarioScreen;
