import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Navigation } from './Navigation';
import { 
  User, 
  Heart, 
  Shield, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  Edit,
  Save,
  Camera,
  Key,
  Bell,
  Eye,
  Activity
} from 'lucide-react';

export function UserProfile({ user, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || 'María González',
    email: user.email || 'maria.gonzalez',
    phone: user.phone || '+52 333 123 4567',
    birthDate: user.birthDate || '1955-03-15',
    address: 'Av. López Mateos 2375, Guadalajara, Jalisco',
    emergencyContact: user.emergencyContact || 'Ana González',
    emergencyPhone: '+52 333 456 7890',
    relationshipType: user.relationshipType || 'Hija',
    medicalConditions: 'Diabetes tipo 2, Hipertensión arterial',
    allergies: 'Penicilina, Mariscos',
    bloodType: 'O+',
    insurance: 'IMSS - 12345678901',
    doctor: 'Dr. María Rodríguez',
    hospitalPreference: 'Hospital San Javier'
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    sound: true,
    vibration: true,
    familyAlerts: true,
    medicationReminders: true,
    emergencyGPS: true,
    dataSharing: true
  });

  const handleSave = () => {
    // Aquí se guardarían los cambios
    setIsEditing(false);
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation user={user} currentView="profile" onNavigate={onNavigate} />
      
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">Mi Perfil</h1>
            <p className="text-gray-600">Gestiona tu información personal y preferencias</p>
          </div>
          
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="space-x-2"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                <span>Guardar</span>
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                <span>Editar</span>
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Información personal */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-6 w-6 text-blue-600" />
                    <span>Información Personal</span>
                  </CardTitle>
                  <CardDescription>Datos básicos de tu perfil</CardDescription>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-semibold">{profileData.name.charAt(0)}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={profileData.birthDate}
                      onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                    {profileData.birthDate && (
                      <p className="text-sm text-gray-600 mt-1">
                        Edad: {calculateAge(profileData.birthDate)} años
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bloodType">Tipo de sangre</Label>
                    <Input
                      id="bloodType"
                      value={profileData.bloodType}
                      onChange={(e) => setProfileData({...profileData, bloodType: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                      placeholder="Ej: O+"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="insurance">Seguro médico</Label>
                    <Input
                      id="insurance"
                      value={profileData.insurance}
                      onChange={(e) => setProfileData({...profileData, insurance: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                      placeholder="Número de afiliación"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información médica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-red-600" />
                <span>Información Médica</span>
              </CardTitle>
              <CardDescription>Condiciones médicas y tratamientos</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="conditions">Condiciones médicas</Label>
                    <Textarea
                      id="conditions"
                      value={profileData.medicalConditions}
                      onChange={(e) => setProfileData({...profileData, medicalConditions: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                      rows={3}
                      placeholder="Ej: Diabetes tipo 2, Hipertensión"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="allergies">Alergias</Label>
                    <Textarea
                      id="allergies"
                      value={profileData.allergies}
                      onChange={(e) => setProfileData({...profileData, allergies: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                      rows={2}
                      placeholder="Ej: Penicilina, Mariscos"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="doctor">Médico de cabecera</Label>
                    <Input
                      id="doctor"
                      value={profileData.doctor}
                      onChange={(e) => setProfileData({...profileData, doctor: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                      placeholder="Nombre del médico"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hospital">Hospital preferido</Label>
                    <Input
                      id="hospital"
                      value={profileData.hospitalPreference}
                      onChange={(e) => setProfileData({...profileData, hospitalPreference: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                      placeholder="Hospital de preferencia"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacto de emergencia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-orange-600" />
                <span>Contacto de Emergencia</span>
              </CardTitle>
              <CardDescription>Persona a contactar en caso de emergencia</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="emergencyContact">Nombre</Label>
                  <Input
                    id="emergencyContact"
                    value={profileData.emergencyContact}
                    onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emergencyPhone">Teléfono</Label>
                  <Input
                    id="emergencyPhone"
                    value={profileData.emergencyPhone}
                    onChange={(e) => setProfileData({...profileData, emergencyPhone: e.target.value})}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="relationship">Parentesco</Label>
                  <Input
                    id="relationship"
                    value={profileData.relationshipType}
                    onChange={(e) => setProfileData({...profileData, relationshipType: e.target.value})}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferencias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-6 w-6 text-purple-600" />
                <span>Preferencias de Notificaciones</span>
              </CardTitle>
              <CardDescription>Configura cómo quieres recibir las alertas</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Notificaciones Generales</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Notificaciones push</span>
                      <input 
                        type="checkbox" 
                        checked={preferences.notifications}
                        onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
                        className="rounded" 
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Sonidos de alerta</span>
                      <input 
                        type="checkbox" 
                        checked={preferences.sound}
                        onChange={(e) => setPreferences({...preferences, sound: e.target.checked})}
                        className="rounded" 
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Vibración</span>
                      <input 
                        type="checkbox" 
                        checked={preferences.vibration}
                        onChange={(e) => setPreferences({...preferences, vibration: e.target.checked})}
                        className="rounded" 
                      />
                    </label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Notificaciones Familiares</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Alertas a familiares</span>
                      <input 
                        type="checkbox" 
                        checked={preferences.familyAlerts}
                        onChange={(e) => setPreferences({...preferences, familyAlerts: e.target.checked})}
                        className="rounded" 
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Compartir ubicación GPS</span>
                      <input 
                        type="checkbox" 
                        checked={preferences.emergencyGPS}
                        onChange={(e) => setPreferences({...preferences, emergencyGPS: e.target.checked})}
                        className="rounded" 
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Compartir datos de salud</span>
                      <input 
                        type="checkbox" 
                        checked={preferences.dataSharing}
                        onChange={(e) => setPreferences({...preferences, dataSharing: e.target.checked})}
                        className="rounded" 
                      />
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seguridad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-6 w-6 text-gray-600" />
                <span>Seguridad y Privacidad</span>
              </CardTitle>
              <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Key className="h-4 w-4 mr-2" />
                  Cambiar contraseña
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  Revisar datos compartidos
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Historial de actividad
                </Button>
                
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      <strong>Última conexión:</strong> Hoy a las 14:23
                    </p>
                    <p>
                      <strong>Dispositivos activos:</strong> 1 (Este dispositivo)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}