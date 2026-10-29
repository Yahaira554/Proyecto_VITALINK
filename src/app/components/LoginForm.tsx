import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Heart, Shield, Users, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { CaregiverRegistration } from './CaregiverRegistration';

export function LoginForm({ onLogin }) {
  const [showCaregiverRegistration, setShowCaregiverRegistration] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    birthDate: '',
    address: '',
    medicalInsurance: '',
    userType: 'patient',
    emergencyContacts: [
      { name: '', phone: '', relationship: 'Hijo/a' },
      { name: '', phone: '', relationship: 'Cónyuge' }
    ]
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulación de login exitoso
    onLogin({
      id: 1,
      name: 'María González',
      email: loginData.email,
      userType: 'patient',
      phone: '+52 333 123 4567',
      birthDate: '1955-03-15',
      emergencyContact: 'Ana González',
      relationshipType: 'Hija'
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Si es cuidador, redirigir al formulario especializado
    if (registerData.userType === 'caregiver') {
      setShowCaregiverRegistration(true);
      return;
    }
    
    // Simulación de registro exitoso para paciente
    onLogin({
      id: 2,
      ...registerData,
      emergencyContacts: registerData.emergencyContacts.filter(contact => contact.name && contact.phone)
    });
  };

  const handleCaregiverRegistrationComplete = (userData) => {
    onLogin(userData);
  };

  const handleBackFromCaregiverRegistration = () => {
    setShowCaregiverRegistration(false);
  };

  // Si se está mostrando el formulario de cuidador, renderizarlo
  if (showCaregiverRegistration) {
    return (
      <CaregiverRegistration 
        onComplete={handleCaregiverRegistrationComplete}
        onBack={handleBackFromCaregiverRegistration}
      />
    );
  }

  const updateEmergencyContact = (index, field, value) => {
    const updatedContacts = [...registerData.emergencyContacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setRegisterData({ ...registerData, emergencyContacts: updatedContacts });
  };

  const addEmergencyContact = () => {
    setRegisterData({
      ...registerData,
      emergencyContacts: [...registerData.emergencyContacts, { name: '', phone: '', relationship: 'Familiar' }]
    });
  };

  const removeEmergencyContact = (index) => {
    if (registerData.emergencyContacts.length > 1) {
      const updatedContacts = registerData.emergencyContacts.filter((_, i) => i !== index);
      setRegisterData({ ...registerData, emergencyContacts: updatedContacts });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-3">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl mb-2 text-blue-900">VitaLink</h1>
          <p className="text-gray-600">Tu asistente de salud digital</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="text-lg py-3">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register" className="text-lg py-3">Crear Cuenta</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Bienvenido de vuelta</CardTitle>
                <CardDescription className="text-center">
                  Ingresa tus datos para acceder a VitaLink
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="text-lg py-3"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="text-lg py-3"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full text-lg py-3 mt-6">
                    Iniciar Sesión
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Crear nueva cuenta</CardTitle>
                <CardDescription className="text-center">
                  Completa tus datos para comenzar con VitaLink
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userType">Tipo de usuario</Label>
                    <Select value={registerData.userType} onValueChange={(value) => setRegisterData({...registerData, userType: value})}>
                      <SelectTrigger className="text-lg py-3">
                        <SelectValue placeholder="Selecciona tipo de usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4" />
                            <span>Paciente</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="caregiver">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4" />
                            <span>Cuidador/Familiar</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      placeholder="Tu nombre completo"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                      className="text-lg py-3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Correo electrónico</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="tu"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      className="text-lg py-3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+52 333 123 4567"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                      className="text-lg py-3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={registerData.birthDate}
                      onChange={(e) => setRegisterData({...registerData, birthDate: e.target.value})}
                      className="text-lg py-3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Calle, número, colonia, ciudad"
                      value={registerData.address}
                      onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                      className="text-lg py-3"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Esta información se usará en caso de emergencia
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalInsurance">Seguro Médico</Label>
                    <Select 
                      value={registerData.medicalInsurance} 
                      onValueChange={(value) => setRegisterData({...registerData, medicalInsurance: value})}
                    >
                      <SelectTrigger className="text-lg py-3">
                        <SelectValue placeholder="Selecciona tu seguro médico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imss">IMSS (Instituto Mexicano del Seguro Social)</SelectItem>
                        <SelectItem value="issste">ISSSTE (Instituto de Seguridad y Servicios Sociales de los Trabajadores del Estado)</SelectItem>
                        <SelectItem value="insabi">INSABI (Instituto de Salud para el Bienestar)</SelectItem>
                        <SelectItem value="seguro-popular">Seguro Popular</SelectItem>
                        <SelectItem value="privado-gnp">GNP Seguros</SelectItem>
                        <SelectItem value="privado-metlife">MetLife</SelectItem>
                        <SelectItem value="privado-axa">AXA Seguros</SelectItem>
                        <SelectItem value="privado-mapfre">MAPFRE</SelectItem>
                        <SelectItem value="privado-inbursa">Seguros Inbursa</SelectItem>
                        <SelectItem value="privado-banorte">Seguros Banorte</SelectItem>
                        <SelectItem value="privado-otro">Otro seguro privado</SelectItem>
                        <SelectItem value="ninguno">Sin seguro médico</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">
                      Selecciona tu seguro médico para facilitar la atención en emergencias
                    </p>
                  </div>

                  {/* Contactos de emergencia */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg">Contactos de Emergencia</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addEmergencyContact}
                        className="flex items-center space-x-1"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Agregar</span>
                      </Button>
                    </div>
                    
                    {registerData.emergencyContacts.map((contact, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-700">Contacto {index + 1}</h4>
                          {registerData.emergencyContacts.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEmergencyContact(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <Label htmlFor={`contact-name-${index}`}>Nombre completo</Label>
                            <Input
                              id={`contact-name-${index}`}
                              placeholder="Nombre del contacto"
                              value={contact.name}
                              onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                              className="mt-1"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`contact-phone-${index}`}>Teléfono</Label>
                            <Input
                              id={`contact-phone-${index}`}
                              type="tel"
                              placeholder="+52 333 123 4567"
                              value={contact.phone}
                              onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                              className="mt-1"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`contact-relationship-${index}`}>Parentesco</Label>
                            <Select 
                              value={contact.relationship} 
                              onValueChange={(value) => updateEmergencyContact(index, 'relationship', value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecciona parentesco" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Hijo/a">Hijo/a</SelectItem>
                                <SelectItem value="Cónyuge">Cónyuge</SelectItem>
                                <SelectItem value="Hermano/a">Hermano/a</SelectItem>
                                <SelectItem value="Nieto/a">Nieto/a</SelectItem>
                                <SelectItem value="Padre/Madre">Padre/Madre</SelectItem>
                                <SelectItem value="Cuidador">Cuidador</SelectItem>
                                <SelectItem value="Médico">Médico</SelectItem>
                                <SelectItem value="Amigo/a">Amigo/a</SelectItem>
                                <SelectItem value="Otro">Otro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-2">
                        <Users className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Red de Apoyo Familiar</p>
                          <p>Estos contactos formarán parte de tu red de apoyo y podrán recibir notificaciones sobre tu salud y medicamentos.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Contraseña</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      className="text-lg py-3"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full text-lg py-3 mt-6">
                    Crear Cuenta
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}