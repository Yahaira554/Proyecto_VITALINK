import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Bot, 
  Send, 
  Clock, 
  Heart, 
  Pill, 
  Activity, 
  AlertTriangle, 
  Calendar,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  Sparkles,
  User,
  ArrowLeft,
  Stethoscope
} from 'lucide-react';

interface HealthAssistantBotProps {
  user: any;
  onBack: () => void;
}

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'suggestion' | 'reminder' | 'alert';
  quickReplies?: string[];
  category?: 'medication' | 'health' | 'appointment' | 'emergency' | 'general';
}

export function HealthAssistantBot({ user, onBack }: HealthAssistantBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: `¡Hola ${user.name}! 👋 Soy VitaBot, tu asistente personal de salud. Estoy aquí para ayudarte con tus medicamentos, recordatorios, consultas médicas y cualquier pregunta sobre tu bienestar. ¿En qué puedo ayudarte hoy?`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      category: 'general',
      quickReplies: [
        'Medicamentos 💊',
        'Signos vitales 📊',
        'Cita médica 📅',
        'Síntomas 🤒',
        'Emergencia 🚨'
      ]
    }
  ]);

  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const botResponses = {
    medication: {
      keywords: ['medicamento', 'pastilla', 'dosis', 'tomar', 'receta', 'medicina'],
      responses: [
        '💊 Te ayudo con tus medicamentos. ¿Qué necesitas saber?',
        '¿Olvidaste tomar algún medicamento? Puedo ayudarte a registrarlo.',
        'Para medicamentos, es importante seguir los horarios. ¿Necesitas un recordatorio?',
        '¿Tienes alguna duda sobre la dosis o efectos secundarios de tus medicamentos?'
      ],
      quickReplies: [
        'Olvide tomar medicina',
        'Efectos secundarios',
        'Renovar receta',
        'Horarios de medicina'
      ]
    },
    health: {
      keywords: ['presión', 'glucosa', 'oxígeno', 'peso', 'temperatura', 'signos vitales', 'salud'],
      responses: [
        '📊 Es excelente que monitorees tu salud. ¿Qué signo vital quieres registrar?',
        'Registrar tus signos vitales es muy importante. ¿Ya tomaste tus mediciones hoy?',
        '💗 Para un mejor seguimiento, te recomiendo medir tus signos vitales regularmente.',
        '¿Necesitas ayuda para interpretar alguna lectura de tus signos vitales?'
      ],
      quickReplies: [
        'Registrar presión arterial',
        'Medir glucosa',
        'Registrar peso',
        'Ver historial médico'
      ]
    },
    appointment: {
      keywords: ['cita', 'doctor', 'médico', 'consulta', 'hospital', 'clínica'],
      responses: [
        '📅 Te ayudo con tus citas médicas. ¿Necesitas agendar o modificar alguna?',
        '¿Tienes alguna cita médica próxima? Puedo recordártela.',
        'Es importante no faltar a las citas médicas. ¿En qué puedo ayudarte?',
        'Para las citas médicas, puedo ayudarte a preparar las preguntas para tu doctor.'
      ],
      quickReplies: [
        'Agendar cita',
        'Ver próximas citas',
        'Preparar consulta',
        'Contactar doctor'
      ]
    },
    symptoms: {
      keywords: ['dolor', 'mareo', 'síntoma', 'malestar', 'fiebre', 'cansancio', 'molestia'],
      responses: [
        '🤒 Lamento que te sientas mal. Es importante registrar tus síntomas.',
        'Si tienes síntomas persistentes, deberías contactar a tu médico.',
        '⚠️ Para síntomas severos, es mejor buscar atención médica inmediata.',
        'Puedo ayudarte a registrar tus síntomas para el seguimiento médico.'
      ],
      quickReplies: [
        'Registrar síntomas',
        'Contactar doctor',
        'Llamar familiar',
        'Emergencia médica'
      ]
    },
    emergency: {
      keywords: ['emergencia', 'urgente', 'ayuda', 'grave', 'mal', 'dolor fuerte'],
      responses: [
        '🚨 Si es una emergencia médica real, llama al 911 inmediatamente.',
        '⚠️ Para emergencias, contacta a servicios médicos o a tu familia de inmediato.',
        'En caso de emergencia, presiona el botón de pánico o llama al 911.',
        '🆘 ¿Necesitas que notifique a tu familia o servicios de emergencia?'
      ],
      quickReplies: [
        'Llamar 911',
        'Contactar familia',
        'Ubicación médica cercana',
        'Falsa alarma'
      ]
    },
    general: {
      keywords: ['hola', 'ayuda', 'información', 'cómo', 'qué', 'cuándo'],
      responses: [
        '😊 Estoy aquí para ayudarte con cualquier duda sobre tu salud.',
        '¿En qué área específica necesitas ayuda? Medicamentos, citas o monitoreo de salud.',
        'Puedo ayudarte con recordatorios, información médica y coordinar con tu familia.',
        '💡 Tip: Mantener un registro diario de tu salud te ayudará mucho.'
      ],
      quickReplies: [
        'Medicamentos',
        'Citas médicas',
        'Signos vitales',
        'Consejos de salud'
      ]
    }
  };

  const healthTips = [
    "💡 Recuerda tomar mucha agua durante el día, especialmente en Jalisco donde el clima puede ser cálido.",
    "🚶‍♀️ Una caminata de 15 minutos al día puede mejorar significativamente tu salud cardiovascular.",
    "😴 Dormir 7-8 horas es fundamental para tu recuperación y bienestar general.",
    "🥗 Incluir frutas y verduras locales en tu dieta aporta vitaminas esenciales.",
    "🧘‍♀️ Unos minutos de relajación al día pueden ayudar a controlar el estrés y la presión arterial."
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Buscar palabras clave para determinar la categoría
    let category: 'medication' | 'health' | 'appointment' | 'emergency' | 'general' = 'general';
    let responseData = botResponses.general;

    for (const [cat, data] of Object.entries(botResponses)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        category = cat as any;
        responseData = data;
        break;
      }
    }

    // Respuestas especiales para ciertas frases
    let responseText = '';
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenas')) {
      responseText = `¡Hola de nuevo ${user.name}! 😊 ¿En qué puedo ayudarte ahora?`;
    } else if (lowerMessage.includes('gracias')) {
      responseText = '¡De nada! Estoy aquí para ayudarte siempre. ¿Hay algo más en lo que pueda asistirte? 😊';
    } else if (lowerMessage.includes('consejos') || lowerMessage.includes('tips')) {
      responseText = healthTips[Math.floor(Math.random() * healthTips.length)];
    } else {
      responseText = responseData.responses[Math.floor(Math.random() * responseData.responses.length)];
    }

    return {
      id: messages.length + 1,
      content: responseText,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      category,
      quickReplies: responseData.quickReplies
    };
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simular tiempo de respuesta del bot
    setTimeout(() => {
      const botResponse = generateBotResponse(currentMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleQuickReply = (reply: string) => {
    setCurrentMessage(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'medication': return <Pill className="h-4 w-4 text-blue-500" />;
      case 'health': return <Activity className="h-4 w-4 text-green-500" />;
      case 'appointment': return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="h-[85vh] flex flex-col">
          {/* Header */}
          <CardHeader className="border-b bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:bg-white/20 p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12 bg-white">
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-green-400 text-white">
                      <Bot className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white">
                    <Sparkles className="h-2 w-2 text-white ml-0.5 mt-0.5" />
                  </div>
                </div>
                
                <div>
                  <CardTitle className="text-xl">VitaBot</CardTitle>
                  <CardDescription className="text-blue-100">
                    Asistente de Salud Personal • Siempre disponible
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Stethoscope className="h-3 w-3 mr-1" />
                  IA Médica
                </Badge>
              </div>
            </div>
          </CardHeader>

          {/* Área de mensajes */}
          <CardContent className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`p-4 rounded-2xl shadow-sm ${
                        message.sender === 'user' 
                          ? 'bg-blue-500 text-white ml-4' 
                          : 'bg-white border mr-4'
                      }`}>
                        {message.sender === 'bot' && message.category && (
                          <div className="flex items-center space-x-2 mb-2 text-gray-500">
                            {getCategoryIcon(message.category)}
                            <span className="text-xs uppercase tracking-wide">
                              {message.category === 'medication' ? 'Medicamentos' :
                               message.category === 'health' ? 'Salud' :
                               message.category === 'appointment' ? 'Citas' :
                               message.category === 'emergency' ? 'Emergencia' :
                               'General'}
                            </span>
                          </div>
                        )}
                        
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        
                        <div className={`flex items-center justify-end space-x-1 mt-2 text-xs ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' ? 'order-1 ml-2' : 'order-2 mr-2'
                    }`}>
                      {message.sender === 'user' ? (
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Respuestas rápidas */}
                  {message.sender === 'bot' && message.quickReplies && (
                    <div className="flex flex-wrap gap-2 ml-12">
                      {message.quickReplies.map((reply, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs h-8 px-3 bg-white hover:bg-blue-50 border-blue-200 text-blue-600"
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 mr-12">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-white border p-3 rounded-2xl shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Input de mensaje */}
          <div className="border-t p-4 bg-white">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Escribe tu pregunta sobre salud..."
                  className="pr-12 text-base py-3 rounded-full border-2 border-gray-200 focus:border-blue-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  disabled={isTyping}
                />
              </div>
              
              <Button 
                onClick={handleSendMessage} 
                disabled={!currentMessage.trim() || isTyping}
                className="rounded-full w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 mt-2 text-center">
              VitaBot está diseñado para ayudarte con información general de salud. En emergencias reales, contacta servicios médicos.
            </div>
          </div>
        </Card>

        {/* Información adicional */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <HelpCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-800">Pregunta cualquier duda sobre tus medicamentos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-800">Recibe recordatorios y consejos personalizados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-purple-800">Gestiona tus citas médicas fácilmente</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}