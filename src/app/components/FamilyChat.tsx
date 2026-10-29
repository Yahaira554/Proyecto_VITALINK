import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Navigation } from './Navigation';
import { ChatStarter } from './ChatStarter';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Image,
  Paperclip,
  Smile,
  Heart,
  Shield,
  Clock,
  CheckCheck,
  Camera,
  Plus,
  Users,
  AlertTriangle
} from 'lucide-react';

export function FamilyChat({ user, onNavigate }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Ana González',
      senderId: 2,
      content: '¡Hola mamá! ¿Ya tomaste tu medicamento de la mañana?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'text',
      read: true
    },
    {
      id: 2,
      sender: user.name,
      senderId: user.id,
      content: 'Sí mi amor, ya lo tomé hace una hora. Gracias por recordarme ❤️',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      type: 'text',
      read: true
    },
    {
      id: 3,
      sender: 'Carlos González',
      senderId: 3,
      content: 'Que bueno mamá! También revisé tus signos vitales de ayer, todo se ve muy bien 👍',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text',
      read: true
    },
    {
      id: 4,
      sender: 'Ana González',
      senderId: 2,
      content: 'Mamá, el Dr. Rodríguez me comentó que quiere revisar tu presión arterial en la próxima cita. ¿Te parece bien el viernes a las 10?',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      type: 'text',
      read: false
    },
    {
      id: 5,
      sender: 'Dr. María Rodríguez',
      senderId: 4,
      content: 'Buenos días familia González. He revisado los reportes de medicamentos de esta semana y María está teniendo una excelente adherencia al tratamiento. ¡Felicidades! 🎉',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      type: 'text',
      read: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const familyMembers = [
    { id: 2, name: 'Ana González', role: 'Hija', avatar: 'A', status: 'online' },
    { id: 3, name: 'Carlos González', role: 'Hijo', avatar: 'C', status: 'offline' },
    { id: 4, name: 'Dr. María Rodríguez', role: 'Médico', avatar: 'M', status: 'busy' }
  ];

  const quickResponses = [
    '✅ Medicamento tomado',
    '❤️ Gracias mi amor',
    '📱 Te llamo más tarde',
    '🆗 Todo bien',
    '🏥 Confirmo la cita',
    '📊 Revisar signos vitales'
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: user.name,
        senderId: user.id,
        content: newMessage,
        timestamp: new Date(),
        type: 'text',
        read: true
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simular respuesta automática después de unos segundos
      setTimeout(() => {
        if (Math.random() > 0.5) {
          const responses = [
            'Perfecto mamá, me da mucha tranquilidad saber que estás bien ❤️',
            'Excelente! Sigue así',
            'Te amo mucho mamá 🥰'
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          const autoReply = {
            id: messages.length + 2,
            sender: 'Ana González',
            senderId: 2,
            content: randomResponse,
            timestamp: new Date(),
            type: 'text',
            read: false
          };
          
          setMessages(prev => [...prev, autoReply]);
        }
      }, 2000);
    }
  };

  const handleQuickResponse = (response) => {
    setNewMessage(response);
  };

  const handleStartNewChat = (chatData) => {
    // Crear nuevo mensaje basado en la conversación iniciada
    const newChatMessage = {
      id: messages.length + 1,
      sender: user.name,
      senderId: user.id,
      content: `[${chatData.type === 'emergency' ? '🚨 EMERGENCIA' : '💬 Nueva conversación'}] ${chatData.message}`,
      timestamp: new Date(),
      type: 'text',
      read: true,
      priority: chatData.priority,
      participants: chatData.participants
    };
    
    setMessages(prev => [...prev, newChatMessage]);
    
    // Simular respuesta automática para emergencias
    if (chatData.type === 'emergency') {
      setTimeout(() => {
        const emergencyResponse = {
          id: messages.length + 2,
          sender: 'Ana González',
          senderId: 2,
          content: '🚨 ¡Recibido! Estoy en camino. ¿Necesitas que llame a emergencias médicas?',
          timestamp: new Date(),
          type: 'text',
          read: false,
          priority: 'urgent'
        };
        
        setMessages(prev => [...prev, emergencyResponse]);
      }, 1000);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else {
      return messageDate.toLocaleDateString('es-MX', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation user={user} currentView="chat" onNavigate={onNavigate} />
      
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="h-[80vh] flex flex-col">
          {/* Header del chat */}
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                  <span>Chat Familiar</span>
                </CardTitle>
                <CardDescription>
                  Red de apoyo de {user.name}
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <ChatStarter user={user} onStartChat={handleStartNewChat} />
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Miembros activos */}
            <div className="flex items-center space-x-4 mt-4">
              <span className="text-sm text-gray-600">Miembros:</span>
              <div className="flex space-x-2">
                {familyMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-1">
                    <div className="relative">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{member.avatar}</span>
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(member.status)} rounded-full border border-white`}></div>
                    </div>
                    <span className="text-xs text-gray-600">{member.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          {/* Área de mensajes */}
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isOwnMessage = message.senderId === user.id;
                const showDate = index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                
                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="text-center my-4">
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        {!isOwnMessage && (
                          <div className="text-xs text-gray-600 mb-1">
                            {message.sender}
                          </div>
                        )}
                        
                        <div className={`p-3 rounded-lg ${
                          isOwnMessage 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border shadow-sm'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          
                          <div className={`flex items-center justify-end space-x-1 mt-2 text-xs ${
                            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span>{formatTime(message.timestamp)}</span>
                            {isOwnMessage && (
                              <CheckCheck className={`h-3 w-3 ${message.read ? 'text-blue-200' : 'text-blue-300'}`} />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {!isOwnMessage && (
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center order-1 mr-2 flex-shrink-0">
                          <span className="text-white text-sm font-medium">
                            {message.sender.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Respuestas rápidas */}
          <div className="px-4 py-2 border-t bg-gray-50">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-600 self-center">Respuestas rápidas:</span>
              {quickResponses.map((response, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickResponse(response)}
                  className="text-xs h-6 px-2"
                >
                  {response}
                </Button>
              ))}
            </div>
          </div>

          {/* Input de mensaje */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Image className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="pr-12"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {isTyping && (
              <div className="text-xs text-gray-500 mt-2">
                Ana está escribiendo...
              </div>
            )}
          </div>
        </Card>

        {/* Panel de información */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notificaciones Familiares</CardTitle>
              <CardDescription>Alertas recientes del grupo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                  <Shield className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Medicamentos del día completos</p>
                    <p className="text-xs text-gray-600">Hace 2 horas</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                  <Heart className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Signos vitales registrados</p>
                    <p className="text-xs text-gray-600">Hace 4 horas</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Recordatorio de cita médica</p>
                    <p className="text-xs text-gray-600">Mañana a las 10:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuración del Chat</CardTitle>
              <CardDescription>Personaliza las notificaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm">Notificaciones de mensajes</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm">Sonidos de notificación</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm">Compartir ubicación en emergencias</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm">Confirmar lectura de mensajes</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}