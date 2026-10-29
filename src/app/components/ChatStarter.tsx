import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  MessageCircle, 
  Users, 
  AlertTriangle,
  Heart,
  Calendar,
  Pill,
  Activity,
  Phone,
  Video,
  Send,
  Plus,
  Search,
  Star
} from 'lucide-react';

interface ChatStarterProps {
  user: any;
  onStartChat: (chatData: {
    type: 'individual' | 'group' | 'emergency';
    participants: string[];
    subject: string;
    message: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
  }) => void;
}

export function ChatStarter({ user, onStartChat }: ChatStarterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatType, setChatType] = useState<'individual' | 'group' | 'emergency'>('individual');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');

  // Simulación de contactos disponibles
  const availableContacts = [
    { 
      id: '2', 
      name: 'Ana González', 
      role: 'Hija', 
      relationship: 'family',
      avatar: 'A',
      status: 'online',
      isPreferred: true
    },
    { 
      id: '3', 
      name: 'Carlos González', 
      role: 'Hijo', 
      relationship: 'family',
      avatar: 'C',
      status: 'offline',
      isPreferred: true
    },
    { 
      id: '4', 
      name: 'Dr. María Rodríguez', 
      role: 'Médico de Familia', 
      relationship: 'medical',
      avatar: 'M',
      status: 'busy',
      isPreferred: true
    },
    { 
      id: '5', 
      name: 'Enfermera Laura', 
      role: 'Enfermera', 
      relationship: 'medical',
      avatar: 'L',
      status: 'online',
      isPreferred: false
    },
    { 
      id: '6', 
      name: 'Dr. José Hernández', 
      role: 'Cardiólogo', 
      relationship: 'medical',
      avatar: 'J',
      status: 'offline',
      isPreferred: false
    }
  ];

  // Plantillas de mensajes predefinidos
  const messageTemplates = {
    medication: [
      'Tengo una pregunta sobre mi medicamento',
      'Necesito renovar mi receta médica',
      'Estoy teniendo efectos secundarios',
      'Se me olvidó tomar mi medicamento'
    ],
    health: [
      'Quiero reportar mis signos vitales',
      'Me siento un poco mal',
      'Tengo una consulta médica',
      'Necesito agendar una cita'
    ],
    family: [
      'Quiero contarles cómo me siento',
      'Necesito ayuda con algo',
      'Tengo buenas noticias que compartir',
      'Me gustaría que me visiten'
    ],
    emergency: [
      'Necesito ayuda urgente',
      'Me siento muy mal',
      'No puedo contactar a nadie',
      'Tengo una emergencia médica'
    ]
  };

  const handleStartChat = () => {
    if (selectedParticipants.length === 0 || !message.trim()) return;

    onStartChat({
      type: chatType,
      participants: selectedParticipants,
      subject: subject || getDefaultSubject(),
      message: message.trim(),
      priority
    });

    // Resetear formulario
    setSelectedParticipants([]);
    setSubject('');
    setMessage('');
    setPriority('normal');
    setIsOpen(false);
  };

  const getDefaultSubject = () => {
    switch (chatType) {
      case 'emergency':
        return 'Solicitud de Ayuda Urgente';
      case 'group':
        return 'Conversación Familiar';
      default:
        return 'Nueva Conversación';
    }
  };

  const toggleParticipant = (contactId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const selectTemplate = (template: string) => {
    setMessage(template);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTemplateIcon = (category: string) => {
    switch (category) {
      case 'medication': return <Pill className="h-4 w-4" />;
      case 'health': return <Activity className="h-4 w-4" />;
      case 'family': return <Heart className="h-4 w-4" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="space-x-2">
          <MessageCircle className="h-4 w-4" />
          <span>Nueva Conversación</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Iniciar Nueva Conversación</DialogTitle>
          <DialogDescription className="text-lg">
            Conecta con tu familia y equipo médico fácilmente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tipo de conversación */}
          <div>
            <h3 className="font-medium mb-3">Tipo de Conversación</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant={chatType === 'individual' ? 'default' : 'outline'}
                onClick={() => setChatType('individual')}
                className="justify-start space-x-2 h-auto p-4"
              >
                <MessageCircle className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Individual</div>
                  <div className="text-xs opacity-70">Hablar con una persona</div>
                </div>
              </Button>

              <Button
                variant={chatType === 'group' ? 'default' : 'outline'}
                onClick={() => setChatType('group')}
                className="justify-start space-x-2 h-auto p-4"
              >
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Grupo</div>
                  <div className="text-xs opacity-70">Conversación familiar</div>
                </div>
              </Button>

              <Button
                variant={chatType === 'emergency' ? 'default' : 'outline'}
                onClick={() => {
                  setChatType('emergency');
                  setPriority('urgent');
                }}
                className="justify-start space-x-2 h-auto p-4 border-red-200 hover:bg-red-50"
              >
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div className="text-left">
                  <div className="font-medium text-red-600">Emergencia</div>
                  <div className="text-xs opacity-70">Ayuda urgente</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Selección de participantes */}
          <div>
            <h3 className="font-medium mb-3">Participantes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableContacts
                .sort((a, b) => (b.isPreferred ? 1 : 0) - (a.isPreferred ? 1 : 0))
                .map((contact) => (
                <Card 
                  key={contact.id}
                  className={`cursor-pointer transition-all ${
                    selectedParticipants.includes(contact.id) 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => toggleParticipant(contact.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          contact.relationship === 'family' ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                          <span className="text-white font-medium">{contact.avatar}</span>
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(contact.status)} rounded-full border border-white`}></div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{contact.name}</h4>
                          {contact.isPreferred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                        </div>
                        <p className="text-sm text-gray-600">{contact.role}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {contact.relationship === 'family' ? 'Familia' : 'Médico'}
                        </Badge>
                      </div>

                      {selectedParticipants.includes(contact.id) && (
                        <div className="text-blue-500">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Plantillas de mensajes */}
          <div>
            <h3 className="font-medium mb-3">Plantillas de Mensajes</h3>
            <div className="space-y-4">
              {Object.entries(messageTemplates).map(([category, templates]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                    {getTemplateIcon(category)}
                    <span className="capitalize">
                      {category === 'medication' ? 'Medicamentos' :
                       category === 'health' ? 'Salud' :
                       category === 'family' ? 'Familia' :
                       category === 'emergency' ? 'Emergencia' : category}
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {templates.map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => selectTemplate(template)}
                        className="justify-start text-left h-auto p-3 text-sm"
                      >
                        {template}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prioridad */}
          {chatType !== 'emergency' && (
            <div>
              <h3 className="font-medium mb-3">Prioridad</h3>
              <div className="flex space-x-2">
                {(['low', 'normal', 'high'] as const).map((p) => (
                  <Button
                    key={p}
                    variant={priority === p ? 'default' : 'outline'}
                    onClick={() => setPriority(p)}
                    size="sm"
                    className={priority === p ? '' : getPriorityColor(p)}
                  >
                    {p === 'low' ? 'Baja' : 
                     p === 'normal' ? 'Normal' : 
                     p === 'high' ? 'Alta' : p}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Mensaje personalizado */}
          <div>
            <h3 className="font-medium mb-3">Tu Mensaje</h3>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí o selecciona una plantilla arriba..."
              className="min-h-[100px] text-base"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {message.length}/500 caracteres
            </div>
          </div>

          {/* Resumen */}
          {selectedParticipants.length > 0 && message && (
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">Resumen de la Conversación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Tipo:</strong> {
                    chatType === 'individual' ? 'Individual' :
                    chatType === 'group' ? 'Grupo' :
                    'Emergencia'
                  }</p>
                  <p><strong>Participantes:</strong> {
                    selectedParticipants.map(id => 
                      availableContacts.find(c => c.id === id)?.name
                    ).join(', ')
                  }</p>
                  <p><strong>Prioridad:</strong> 
                    <Badge className={`ml-2 ${getPriorityColor(priority)}`}>
                      {priority === 'low' ? 'Baja' : 
                       priority === 'normal' ? 'Normal' : 
                       priority === 'high' ? 'Alta' : 
                       'Urgente'}
                    </Badge>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>

            <div className="space-x-2">
              {chatType === 'emergency' && (
                <Button
                  variant="outline"
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar Emergencia
                </Button>
              )}

              <Button
                onClick={handleStartChat}
                disabled={selectedParticipants.length === 0 || !message.trim()}
                className="space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Iniciar Conversación</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}