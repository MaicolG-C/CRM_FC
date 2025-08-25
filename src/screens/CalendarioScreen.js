// ==========================================================
// src/CalendarioScreen.js
// ¡VERSIÓN CORREGIDA con DatePickerModal definido y funcional!
// ==========================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import 'moment/locale/es';
import { useNotifications } from '../../backend/NotificationContext';

moment.locale('es');

const { width } = Dimensions.get('window');
const dayWidth = (width - 40) / 7;

// MODIFICADO: El modelo de datos ahora usa startDate y endDate
const initialEvents = [
  { _id: '1', title: 'Reunión Semanal', startDate: '2025-08-25', endDate: '2025-08-25', time: '10:00', details: 'Discutir el progreso del proyecto de la semana.' },
  { _id: '2', title: 'Conferencia de Desarrollo', startDate: '2025-08-27', endDate: '2025-08-29', time: '09:00', details: 'Conferencia anual para desarrolladores.' },
  { _id: '3', title: 'Presentación Objetivos', startDate: '2025-09-16', endDate: '2025-09-16', time: '09:00', details: 'Establecer los objetivos para el siguiente periodo.' },
];

// =================================================================================
// NUEVO: Componente de Modal de Calendario que faltaba
// =================================================================================
const DatePickerModal = ({ isVisible, onClose, onDateSelect }) => {
    const [date, setDate] = useState(moment());

    const getCalendarGrid = () => {
        const startOfMonth = date.clone().startOf('month');
        const endOfMonth = date.clone().endOf('month');
        const startOfGrid = startOfMonth.clone().startOf('week');
        const endOfGrid = endOfMonth.clone().endOf('week');
        const grid = [];
        let day = startOfGrid.clone();
        while (day.isSameOrBefore(endOfGrid, 'day')) {
            grid.push(day.clone());
            day.add(1, 'day');
        }
        return grid;
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.datePickerModalView}>
                    <View style={styles.datePickerNavigation}>
                        <TouchableOpacity onPress={() => setDate(date.clone().subtract(1, 'month'))}>
                            <Text style={styles.datePickerNavButton}>{"←"}</Text>
                        </TouchableOpacity>
                        <Text style={styles.datePickerMonthYear}>{date.format('MMMM, YYYY')}</Text>
                        <TouchableOpacity onPress={() => setDate(date.clone().add(1, 'month'))}>
                            <Text style={styles.datePickerNavButton}>{"→"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dayNamesContainer}>
                        {moment.weekdaysShort(true).map(day => <Text key={day} style={styles.dayName}>{day}</Text>)}
                    </View>
                    <View style={styles.datePickerGridContainer}>
                        {getCalendarGrid().map((day, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.datePickerDay,
                                    !day.isSame(date, 'month') && styles.dayCellOutsideMonth
                                ]}
                                onPress={() => onDateSelect(day)}
                            >
                                <Text style={styles.dayText}>{day.date()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity style={[styles.modalButton, styles.buttonSecondary]} onPress={onClose}>
                        <Text style={styles.modalButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
// =================================================================================

// Componente principal del Calendario
const CalendarioScreen = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [events, setEvents] = useState(initialEvents);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerFor, setDatePickerFor] = useState(null); // 'start' o 'end'

  const [formState, setFormState] = useState({
    title: '',
    time: '09:00',
    details: '',
    startDate: moment(),
    endDate: moment()
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const { addNotification } = useNotifications();

  const resetFormState = () => {
    setFormState({
        title: '',
        time: '09:00',
        details: '',
        startDate: moment(),
        endDate: moment()
    });
    setSelectedEvent(null);
    setIsEditing(false);
    setErrors({});
  };
  
  const handleSaveEvent = () => {
    const newErrors = {};
    if (!formState.title.trim()) {
      newErrors.title = 'El título del evento es obligatorio.';
    }
    if (formState.endDate.isBefore(formState.startDate, 'day')) {
      newErrors.endDate = 'La fecha de fin no puede ser anterior a la de inicio.';
    }

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }
    
    const eventData = {
      title: formState.title,
      startDate: formState.startDate.format('YYYY-MM-DD'),
      endDate: formState.endDate.format('YYYY-MM-DD'),
      time: formState.time,
      details: formState.details,
    };

    if (isEditing) {
      setEvents(events.map(event =>
        event._id === selectedEvent._id ? { ...event, ...eventData } : event
      ));
      addNotification({ name: 'Calendario', activity: `Evento actualizado: "${eventData.title}".` });
    } else {
      const newEvent = { ...eventData, _id: `temp-${Date.now()}` };
      setEvents(prevEvents => [...prevEvents, newEvent]);
      addNotification({ name: 'Calendario', activity: `Nuevo evento creado: "${eventData.title}".` });
    }
    setModalVisible(false);
    resetFormState();
  };
  
  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    const eventTitle = selectedEvent.title;
    setEvents(prevEvents => prevEvents.filter(event => event._id !== selectedEvent._id));
    addNotification({ name: 'Calendario', activity: `Evento eliminado: "${eventTitle}".` });
    setModalVisible(false);
    resetFormState();
  };

  const getCalendarGrid = () => {
    const startOfMonth = moment(currentDate).startOf('month');
    const endOfGrid = moment(currentDate).endOf('month').endOf('week');
    const grid = [];
    let day = startOfMonth.clone().startOf('week');
    while (day.isSameOrBefore(endOfGrid, 'day')) {
      grid.push(day.clone());
      day.add(1, 'day');
    }
    return grid;
  };

  const handleDateSelect = (day) => {
    const newFormState = { ...formState };
    if (datePickerFor === 'start') {
        newFormState.startDate = day;
        if (newFormState.endDate.isBefore(day, 'day')) {
            newFormState.endDate = day.clone();
        }
    } else {
        newFormState.endDate = day;
    }
    setFormState(newFormState);
    setDatePickerVisible(false);
    setModalVisible(true);
    if (errors.endDate) setErrors(p => ({...p, endDate: null}));
  };

  const openDatePicker = (type) => {
    setDatePickerFor(type);
    setModalVisible(false);
    setDatePickerVisible(true);
  };
  
  const handleDayPress = (day) => {
    resetFormState();
    setFormState(prev => ({...prev, startDate: day, endDate: day}));
    setModalVisible(true);
  };
  
  const handleEventPress = (event) => {
    resetFormState();
    setSelectedEvent(event);
    setModalVisible(true);
  };
  
  const handleEditPress = () => {
    if (!selectedEvent) return;
    setIsEditing(true);
    setFormState({
        title: selectedEvent.title,
        time: selectedEvent.time,
        details: selectedEvent.details,
        startDate: moment(selectedEvent.startDate),
        endDate: moment(selectedEvent.endDate)
    });
  };
  
  const getEventsForDay = (day) => {
    return events.filter(event => day.isBetween(event.startDate, event.endDate, 'day', '[]'));
  };

  const renderEvent = (event) => (
    <TouchableOpacity key={event._id} style={styles.event} onPress={() => handleEventPress(event)}>
      <Text style={styles.eventText} numberOfLines={1}>{event.title}</Text>
    </TouchableOpacity>
  );

  const renderModalContent = () => {
    if (selectedEvent && !isEditing) {
      const isMultiDay = !moment(selectedEvent.startDate).isSame(selectedEvent.endDate, 'day');
      return (
        <>
          <Text style={styles.modalTitle}>Detalles del Evento</Text>
          <View style={styles.modalDetailsContainer}>
            <Text style={styles.modalDetailLabel}>Título:</Text>
            <Text style={styles.modalDetailText}>{selectedEvent.title}</Text>
            <Text style={styles.modalDetailLabel}>Fecha:</Text>
            <Text style={styles.modalDetailText}>
              {moment(selectedEvent.startDate).format('D MMM')}
              {isMultiDay && ` al ${moment(selectedEvent.endDate).format('D MMM, YYYY')}`}
              {!isMultiDay && `, ${moment(selectedEvent.startDate).format('YYYY')}`}
            </Text>
            <Text style={styles.modalDetailLabel}>Hora de Inicio:</Text>
            <Text style={styles.modalDetailText}>{selectedEvent.time}</Text>
            <Text style={styles.modalDetailLabel}>Detalles:</Text>
            <Text style={styles.modalDetailText}>{selectedEvent.details || 'Sin detalles.'}</Text>
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.buttonSecondary]} onPress={() => { setModalVisible(false); resetFormState(); }}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.buttonDanger]} onPress={handleDeleteEvent}>
              <Text style={styles.modalButtonText}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.buttonPrimary]} onPress={handleEditPress}>
              <Text style={styles.modalButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.modalTitle}>{isEditing ? 'Editar Evento' : 'Añadir Evento'}</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Título del evento*"
            value={formState.title}
            onChangeText={(text) => {
                setFormState(p => ({...p, title: text}));
                if (errors.title) setErrors(p => ({...p, title: null}));
            }}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

          <View style={styles.dateRangeContainer}>
            <View style={{flex: 1}}>
                <Text style={styles.label}>Fecha de Inicio</Text>
                <TouchableOpacity style={styles.datePickerButton} onPress={() => openDatePicker('start')}>
                    <Text>{formState.startDate.format('DD / MM / YYYY')}</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.label}>Fecha de Fin</Text>
                <TouchableOpacity 
                    style={[styles.datePickerButton, errors.endDate && styles.inputError]} 
                    onPress={() => openDatePicker('end')}
                >
                    <Text>{formState.endDate.format('DD / MM / YYYY')}</Text>
                </TouchableOpacity>
            </View>
          </View>
          {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}

          <Text style={styles.label}>Hora de Inicio:</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={formState.time} onValueChange={(val) => setFormState(p => ({...p, time: val}))}>
                {[...Array(24).keys()].map(h => {
                    const time = `${h < 10 ? '0' : ''}${h}:00`;
                    return <Picker.Item key={time} label={time} value={time} />
                })}
            </Picker>
          </View>
          
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            placeholder="Detalles (opcional)"
            value={formState.details}
            onChangeText={(text) => setFormState(p => ({...p, details: text}))}
            multiline={true}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.buttonSecondary]} onPress={() => { setModalVisible(false); resetFormState(); }}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.buttonPrimary]} onPress={handleSaveEvent}>
              <Text style={styles.modalButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Calendario</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => handleDayPress(moment())}>
          <Text style={styles.addButtonText}>+ Añadir Evento</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity onPress={() => setCurrentDate(currentDate.clone().subtract(1, 'month'))}><Text style={styles.navButton}>{"←"}</Text></TouchableOpacity>
        <Text style={styles.monthYear}>{currentDate.format('MMMM [de] YYYY')}</Text>
        <TouchableOpacity onPress={() => setCurrentDate(currentDate.clone().add(1, 'month'))}><Text style={styles.navButton}>{"→"}</Text></TouchableOpacity>
      </View>

      <View style={styles.dayNamesContainer}>
        {moment.weekdaysShort(true).map(day => <Text key={day} style={styles.dayName}>{day}</Text>)}
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {getCalendarGrid().map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isToday = day.isSame(moment(), 'day');
            return (
                <TouchableOpacity
                    key={index}
                    style={[ styles.dayCell, !day.isSame(currentDate, 'month') && styles.dayCellOutsideMonth, isToday && styles.todayCell ]}
                    onPress={() => handleDayPress(day)}
                >
                    <Text style={[styles.dayText, isToday && styles.todayText]}>{day.date()}</Text>
                    {dayEvents.length > 0 && <View style={styles.eventIndicator} />}
                    <ScrollView style={styles.eventScrollView}>
                        {dayEvents.slice(0, 2).map(event => renderEvent(event))}
                    </ScrollView>
                </TouchableOpacity>
            );
        })}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(false); resetFormState(); }}>
        <View style={styles.centeredView}><View style={styles.modalView}>{renderModalContent()}</View></View>
      </Modal>

      <DatePickerModal 
        isVisible={isDatePickerVisible}
        onClose={() => { setDatePickerVisible(false); setModalVisible(true); }}
        onDateSelect={handleDateSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerText: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
    addButton: { backgroundColor: '#720819', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    navigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 10 },
    navButton: { fontSize: 24, fontWeight: 'bold', color: '#720819' },
    monthYear: { fontSize: 20, fontWeight: 'bold', textTransform: 'capitalize', color: '#374151' },
    dayNamesContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    dayName: { width: dayWidth, textAlign: 'center', fontWeight: '600', color: '#6b7280' },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    dayCell: { width: dayWidth, height: dayWidth * 1.5, borderWidth: 1, borderColor: '#e5e7eb', padding: 4, backgroundColor: '#fff' },
    dayCellOutsideMonth: { backgroundColor: '#f9fafb', opacity: 0.8 },
    todayCell: { backgroundColor: '#fee2e2' },
    dayText: { fontSize: 12, fontWeight: '600', color: '#374151', alignSelf: 'flex-start' },
    todayText: { color: '#dc2626', fontWeight: 'bold' },
    eventIndicator: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#3b82f6', alignSelf: 'center', marginTop: 2 },
    eventScrollView: { flex: 1, width: '100%', marginTop: 4 },
    event: { backgroundColor: '#dbeafe', borderRadius: 4, paddingVertical: 2, paddingHorizontal: 4, marginTop: 4, width: '100%' },
    eventText: { fontSize: 10, fontWeight: '500', color: '#1e40af' },
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalView: { width: '90%', maxWidth: 400, backgroundColor: 'white', borderRadius: 20, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#111827', textAlign: 'center' },
    modalDetailsContainer: { width: '100%', marginBottom: 20 },
    modalDetailLabel: { fontWeight: '600', marginTop: 10, color: '#6b7280', fontSize: 14 },
    modalDetailText: { marginBottom: 5, color: '#1f2937', fontSize: 16 },
    input: { width: '100%', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, marginBottom: 15, backgroundColor: '#f9fafb' },
    inputError: { borderColor: '#dc2626' },
    errorText: { color: '#dc2626', fontSize: 12, marginTop: -10, marginBottom: 10, alignSelf: 'flex-start', width: '100%' },
    label: { alignSelf: 'flex-start', fontWeight: '600', marginBottom: 5, color: '#374151' },
    pickerContainer: { width: '100%', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, marginBottom: 15, justifyContent: 'center', backgroundColor: '#f9fafb' },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: 20, gap: 10 },
    modalButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    modalButtonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
    buttonPrimary: { backgroundColor: '#720819' },
    buttonSecondary: { backgroundColor: '#6b7280' },
    buttonDanger: { backgroundColor: '#dc2626' },
    dateRangeContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 10, marginBottom: 15 },
    datePickerButton: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, backgroundColor: '#f9fafb', alignItems: 'center' },
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

export default CalendarioScreen;