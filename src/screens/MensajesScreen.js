// ===============================================
// src/MensajesScreen.js
// Pantalla de chat y mensajería
// ===============================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Platform, ActivityIndicator, KeyboardAvoidingView } from 'react-native';

const MensajesScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // NOTE: You must update this URL to match your backend server's address.
  // If running locally, use your machine's IP address and the server port (e.g., http://192.168.1.100:5000)
  const API_URL = 'http://localhost:5000/api/messages';
  const userId = 'usuario-demo-123'; // Simulación de un ID de usuario

  // Función para obtener los mensajes del servidor
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Error al cargar los mensajes. Por favor, verifica el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Función para enviar un nuevo mensaje
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newMessage, senderId: userId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Limpia el input y recarga los mensajes
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error al enviar el mensaje. Por favor, verifica el servidor.');
    }
  };

  // Carga los mensajes al iniciar la aplicación y luego cada 3 segundos
  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 3000); // Polling para simular tiempo real
    return () => clearInterval(intervalId);
  }, []);

  // UI rendering with React Native components and Stylesheet
  return (
    <SafeAreaView style={styles.container}>
      {/* Main content area */}
      <View style={styles.mainContent}>
        {/* Chat layout */}
        <View style={styles.chatLayout}>
          {/* Left panel - conversations list (simplified) */}
          <View style={styles.conversationsPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Conversaciones</Text>
            </View>
            <ScrollView style={styles.conversationList}>
                <TouchableOpacity
                  style={styles.selectedConversation}
                >
                  <View style={styles.avatarPlaceholder} />
                  <View style={styles.conversationDetails}>
                    <Text style={styles.conversationName}>Grupo General</Text>
                    <Text style={styles.conversationMessage}>Chat de prueba</Text>
                  </View>
                </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Right panel - chat window */}
          <View style={styles.chatWindow}>
            {/* Chat header */}
            <View style={styles.chatHeader}>
              <Text style={styles.chatHeaderName}>Grupo General</Text>
            </View>

            {/* Message list */}
            {loading ? (
              <ActivityIndicator style={styles.loadingIndicator} size="large" color="#2563eb" />
            ) : error ? (
              <View style={styles.messagesContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <View key={index} style={[styles.messageBubbleContainer, msg.senderId === userId ? styles.myMessageContainer : styles.otherMessageContainer]}>
                      <View style={[styles.messageBubble, msg.senderId === userId ? styles.myMessageBubble : styles.otherMessageBubble]}>
                        <Text style={msg.senderId === userId ? styles.myMessageText : styles.otherMessageText}>{msg.text}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noMessagesText}>No hay mensajes. Envía uno para empezar.</Text>
                )}
              </ScrollView>
            )}

            {/* Message input area */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.inputArea}
            >
              <TextInput
                style={styles.messageInput}
                placeholder="Escribe tu mensaje aquí..."
                value={newMessage}
                onChangeText={setNewMessage}
              />
              <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>➔</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
  },
  chatLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  conversationsPanel: {
    width: 280,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    padding: 16,
  },
  panelHeader: {
    marginBottom: 16,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  conversationList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedConversation: {
    backgroundColor: '#dbeafe',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1d5db',
  },
  conversationDetails: {
    marginLeft: 12,
  },
  conversationName: {
    fontWeight: 'bold',
    color: '#1f2937',
  },
  conversationMessage: {
    fontSize: 12,
    color: '#6b7280',
  },
  chatWindow: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    justifyContent: 'flex-end',
  },
  messageBubbleContainer: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '80%',
  },
  myMessageBubble: {
    backgroundColor: '#2563eb',
    borderTopRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#e5e7eb',
    borderTopLeftRadius: 4,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#1f2937',
  },
  noMessagesText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 20,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  messageInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  sendButton: {
    padding: 12,
    borderRadius: 9999,
    backgroundColor: '#2563eb',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  }
});

export default MensajesScreen;
