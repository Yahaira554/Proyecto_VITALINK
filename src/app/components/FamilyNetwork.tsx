import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Navigation } from './Navigation';
import { 
  Users, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  Heart,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  UserPlus,
  Star
} from 'lucide-react';

export function FamilyNetwork({ user, onNavigate }) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [newInvite, setNewInvite] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: ''
  });

  // Generar miembros de la familia basados en los contactos del usuario
  const generateFamilyMembers = () => {
    const baseMembers = [];
    
    // Si el usuario tiene contactos de emergencia, usarlos
    if (user.emergencyContacts && user.emergencyContacts.length > 0) {
      user.emergencyContacts.forEach((contact, index) => {
        if (contact.name && contact.phone) {
          baseMembers.push({
            id: index + 1,
            name: contact.name,
            relationship: contact.relationship,
            role: index === 0 ? 'Cuidador Principal' : 'Contacto de Apoyo',
            phone: contact.phone,
            email: contact.email || `${contact.name.toLowerCase().replace(' ', '.')}@email.com`,
            status: Math.random() > 0.5 ? 'online' : 'offline',
            lastActive: index === 0 ? 'Hace 5 min' : `Hace ${Math.floor(Math.random() * 60)} min`,
            permissions: index === 0 ? ['medications', 'health', 'emergencies'] : ['health', 'emergencies'],
            avatar: contact.name.charAt(0).toUpperCase(),
            isPrimary: index === 0,
            location: 'Guadalajara, Jalisco'
          });
        }
      });
    }
    
    // Si no hay contactos o hay pocos, agregar algunos predeterminados
    if (baseMembers.length === 0) {
      baseMembers.push({
        id: 1,
        name: 'Ana González',
        relationship: 'Hija',
        role: 'Cuidadora Principal',
        phone: '+52 333 456 7890',
        email: 'ana',
        status: 'online',
        lastActive: 'Hace 5 min',
        permissions: ['medications', 'health', 'emergencies'],
        avatar: 'A',
        isPrimary: true,
        location: 'Guadalajara, Jalisco'
      });
    }
    
    return baseMembers;
  };

  const familyMembers = [
    ...generateFamilyMembers(),
    // Agregar médico predeterminado si no hay uno en los contactos
    ...(generateFamilyMembers().some(member => member.relationship === 'Médico') ? [] : [{
      id: 99,
      name: 'Dr. María Rodríguez',
      relationship: 'Médico',
      role: 'Especialista',
      phone: '+52 333 987 6543',
      email: 'dra.rodriguez',
      status: 'busy',
      lastActive: 'Hace 1 hora',
      permissions: ['health', 'medications'],
      avatar: 'M',
      isPrimary: false,
      location: 'Hospital San Javier'
    }])
  ];

  const recentActivity = [
    {
      id: 1,
      user: 'Ana González',
      action: 'Revisó el reporte de medicamentos',
      time: 'Hace 30 min',
      type: 'medication'
    },
    {
      id: 2,
      user: 'Carlos González',
      action: 'Agregó una nueva cita médica',
      time: 'Hace 2 horas',
      type: 'appointment'
    },
    {
      id: 3,
      user: 'Dr. María Rodríguez',
      action: 'Revisó los signos vitales',
      time: 'Hace 4 horas',
      type: 'health'
    }
  ];

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

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'En línea';
      case 'busy':
        return 'Ocupado';
      case 'offline':
        return 'Desconectado';
      default:
        return 'Desconocido';
    }
  };

  const handleSendInvite = () => {
    // Aquí se enviaría la invitación
    setShowInviteDialog(false);
    setNewInvite({
      name: '',
      email: '',
      phone: '',
      relationship: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation user={user} currentView="family" onNavigate={onNavigate} />
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">Red de Apoyo Familiar</h1>
            <p className="text-gray-600">Conecta con tu familia y cuidadores</p>
          </div>
          
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button className="space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Invitar Familiar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Invitar Nuevo Familiar</DialogTitle>
                <DialogDescription>
                  Envía una invitación para unirse a tu red de apoyo
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="invite-name">Nombre completo</Label>
                  <Input
                    id="invite-name"
                    placeholder="Nombre del familiar"
                    value={newInvite.name}
                    onChange={(e) => setNewInvite({...newInvite, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="invite-email">Correo electrónico</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="email"
                    value={newInvite.email}
                    onChange={(e) => setNewInvite({...newInvite, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="invite-phone">Teléfono</Label>
                  <Input
                    id="invite-phone"
                    type="tel"
                    placeholder="+52 333 123 4567"
                    value={newInvite.phone}
                    onChange={(e) => setNewInvite({...newInvite, phone: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="invite-relationship">Parentesco</Label>
                  <select
                    id="invite-relationship"
                    value={newInvite.relationship}
                    onChange={(e) => setNewInvite({...newInvite, relationship: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="hijo">Hijo/a</option>
                    <option value="esposo">Esposo/a</option>
                    <option value="hermano">Hermano/a</option>
                    <option value="nieto">Nieto/a</option>
                    <option value="cuidador">Cuidador</option>
                    <option value="medico">Médico</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={() => setShowInviteDialog(false)} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleSendInvite} className="flex-1">
                    Enviar Invitación
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Miembros de la familia */}
        <div className="grid gap-6 mb-8">
          {familyMembers.map((member) => (
            <Card key={member.id} className={member.isPrimary ? 'border-blue-200 bg-blue-50' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-semibold">{member.avatar}</span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(member.status)} rounded-full border-2 border-white`}></div>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-xl">{member.name}</CardTitle>
                        {member.isPrimary && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Star className="h-3 w-3 mr-1" />
                            Principal
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {member.relationship} • {member.role}
                      </CardDescription>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                        <span className="text-sm text-gray-600">
                          {getStatusText(member.status)} • {member.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Información de Contacto</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-600" />
                        <span>{member.phone}</span>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          Llamar
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-600" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span>{member.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Permisos y Acceso</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.permissions.includes('medications') && (
                        <Badge variant="secondary" className="space-x-1">
                          <Shield className="h-3 w-3" />
                          <span>Medicamentos</span>
                        </Badge>
                      )}
                      {member.permissions.includes('health') && (
                        <Badge variant="secondary" className="space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>Salud</span>
                        </Badge>
                      )}
                      {member.permissions.includes('emergencies') && (
                        <Badge variant="secondary" className="space-x-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Emergencias</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-6">
                  <Button variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Mensaje
                  </Button>
                  <Button 
                    onClick={() => onNavigate('chat')}
                    variant="outline" 
                    className="flex-1"
                  >
                    Chat Familiar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actividad reciente */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <span>Actividad Reciente</span>
            </CardTitle>
            <CardDescription>Últimas acciones de tu red de apoyo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.type === 'medication' && <Shield className="h-5 w-5 text-blue-600" />}
                    {activity.type === 'appointment' && <Clock className="h-5 w-5 text-green-600" />}
                    {activity.type === 'health' && <Heart className="h-5 w-5 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuración de notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Notificaciones Familiares</CardTitle>
            <CardDescription>Personaliza qué notificaciones recibe tu familia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notificaciones Automáticas</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Medicamentos no tomados</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Signos vitales anormales</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Todas las mediciones de salud</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Citas médicas próximas</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Alertas de Emergencia</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Botón de pánico activado</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Múltiples medicamentos perdidos</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Ubicación GPS de emergencia</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Falta de actividad prolongada</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Button className="w-full">
                Guardar Configuración de Notificaciones
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}