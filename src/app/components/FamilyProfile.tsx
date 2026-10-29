import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Navigation } from './Navigation';
import { 
  Users, 
  Settings, 
  Shield, 
  Heart,
  Bell,
  Eye,
  Lock,
  Smartphone,
  Clock,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

export function FamilyProfile({ user, onNavigate }) {
  const [currentSection, setCurrentSection] = useState('general');
  
  const [generalSettings, setGeneralSettings] = useState({
    patientName: 'María González',
    familyGroupName: 'Familia González',
    description: 'Red de apoyo para el cuidado de María González',
    timezone: 'America/Mexico_City',
    language: 'es-MX'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    medicationMissed: true,
    vitalAbnormal: true,
    emergencyAlerts: true,
    dailyReports: false,
    weeklyReports: true,
    appointmentReminders: true,
    familyMessages: true,
    systemUpdates: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareLocation: true,
    shareHealthData: true,
    shareMedications: true,
    allowFamilyPhotos: true,
    dataRetention: '1year',
    thirdPartySharing: false
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    cloudBackup: true,
    localBackup: false
  });

  const familyMembers = [
    {
      id: 1,
      name: 'Ana González',
      role: 'Administrador',
      permissions: ['full_access'],
      joinDate: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Carlos González',
      role: 'Colaborador',
      permissions: ['health_view', 'emergency_alerts'],
      joinDate: '2024-02-10',
      status: 'active'
    },
    {
      id: 3,
      name: 'Dr. María Rodríguez',
      role: 'Especialista',
      permissions: ['health_view', 'medication_manage'],
      joinDate: '2024-01-20',
      status: 'active'
    }
  ];

  const systemInfo = {
    version: '2.1.3',
    lastBackup: '2024-10-04 08:30:00',
    dataSize: '156 MB',
    membersSince: '15 de enero, 2024',
    totalRecords: 1247
  };

  const menuItems = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'members', label: 'Miembros', icon: Users },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'privacy', label: 'Privacidad', icon: Shield },
    { id: 'backup', label: 'Respaldo', icon: Download },
    { id: 'system', label: 'Sistema', icon: Info }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
          <CardDescription>Configuración básica del grupo familiar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">Nombre del paciente</Label>
              <Input
                id="patientName"
                value={generalSettings.patientName}
                onChange={(e) => setGeneralSettings({...generalSettings, patientName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="groupName">Nombre del grupo familiar</Label>
              <Input
                id="groupName"
                value={generalSettings.familyGroupName}
                onChange={(e) => setGeneralSettings({...generalSettings, familyGroupName: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={generalSettings.description}
              onChange={(e) => setGeneralSettings({...generalSettings, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timezone">Zona horaria</Label>
              <select
                id="timezone"
                value={generalSettings.timezone}
                onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="America/Mexico_City">Guadalajara (GMT-6)</option>
                <option value="America/Monterrey">Monterrey (GMT-6)</option>
                <option value="America/Cancun">Cancún (GMT-5)</option>
              </select>
            </div>
            <div>
              <Label htmlFor="language">Idioma</Label>
              <select
                id="language"
                value={generalSettings.language}
                onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="es-MX">Español (México)</option>
                <option value="en-US">English (US)</option>
              </select>
            </div>
          </div>
          
          <Button className="w-full">Guardar Configuración General</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderMembersSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Miembros</CardTitle>
          <CardDescription>Administra los miembros de tu red familiar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {familyMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{member.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    <p className="text-xs text-gray-500">Miembro desde: {member.joinDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  {member.role !== 'Administrador' && (
                    <Button variant="outline" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Button className="w-full mt-4" variant="outline">
            Invitar Nuevo Miembro
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Notificaciones</CardTitle>
          <CardDescription>Personaliza las alertas para toda la familia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-4">Alertas Médicas</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Medicamentos no tomados</Label>
                  <p className="text-sm text-gray-600">Notificar cuando se pierda una dosis</p>
                </div>
                <Switch
                  checked={notificationSettings.medicationMissed}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, medicationMissed: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Signos vitales anormales</Label>
                  <p className="text-sm text-gray-600">Alertar sobre lecturas fuera de rango</p>
                </div>
                <Switch
                  checked={notificationSettings.vitalAbnormal}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, vitalAbnormal: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Alertas de emergencia</Label>
                  <p className="text-sm text-gray-600">Notificaciones críticas inmediatas</p>
                </div>
                <Switch
                  checked={notificationSettings.emergencyAlerts}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emergencyAlerts: checked})}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Reportes</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Reporte diario</Label>
                  <p className="text-sm text-gray-600">Resumen diario de medicamentos y salud</p>
                </div>
                <Switch
                  checked={notificationSettings.dailyReports}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, dailyReports: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Reporte semanal</Label>
                  <p className="text-sm text-gray-600">Resumen semanal con tendencias</p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})}
                />
              </div>
            </div>
          </div>
          
          <Button className="w-full">Guardar Configuración de Notificaciones</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Privacidad</CardTitle>
          <CardDescription>Controla qué información se comparte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-4">Datos Compartidos</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Ubicación GPS</Label>
                  <p className="text-sm text-gray-600">Compartir ubicación en emergencias</p>
                </div>
                <Switch
                  checked={privacySettings.shareLocation}
                  onCheckedChange={(checked) => setPrivacySettings({...privacySettings, shareLocation: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Datos de salud</Label>
                  <p className="text-sm text-gray-600">Signos vitales y mediciones</p>
                </div>
                <Switch
                  checked={privacySettings.shareHealthData}
                  onCheckedChange={(checked) => setPrivacySettings({...privacySettings, shareHealthData: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Información de medicamentos</Label>
                  <p className="text-sm text-gray-600">Horarios y adherencia</p>
                </div>
                <Switch
                  checked={privacySettings.shareMedications}
                  onCheckedChange={(checked) => setPrivacySettings({...privacySettings, shareMedications: checked})}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Retención de Datos</h4>
            <div>
              <Label htmlFor="dataRetention">Tiempo de conservación</Label>
              <select
                id="dataRetention"
                value={privacySettings.dataRetention}
                onChange={(e) => setPrivacySettings({...privacySettings, dataRetention: e.target.value})}
                className="w-full p-2 border rounded-md mt-1"
              >
                <option value="6months">6 meses</option>
                <option value="1year">1 año</option>
                <option value="2years">2 años</option>
                <option value="indefinite">Indefinido</option>
              </select>
            </div>
          </div>
          
          <Button className="w-full">Guardar Configuración de Privacidad</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Respaldo</CardTitle>
          <CardDescription>Protege tu información con copias de seguridad</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-4">Respaldo Automático</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Respaldo automático</Label>
                  <p className="text-sm text-gray-600">Crear copias de seguridad automáticamente</p>
                </div>
                <Switch
                  checked={backupSettings.autoBackup}
                  onCheckedChange={(checked) => setBackupSettings({...backupSettings, autoBackup: checked})}
                />
              </div>
              
              <div>
                <Label htmlFor="backupFrequency">Frecuencia de respaldo</Label>
                <select
                  id="backupFrequency"
                  value={backupSettings.backupFrequency}
                  onChange={(e) => setBackupSettings({...backupSettings, backupFrequency: e.target.value})}
                  className="w-full p-2 border rounded-md mt-1"
                  disabled={!backupSettings.autoBackup}
                >
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Acciones de Respaldo</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-16 flex flex-col">
                <Download className="h-6 w-6 mb-1" />
                <span>Descargar Respaldo</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex flex-col">
                <Upload className="h-6 w-6 mb-1" />
                <span>Restaurar Respaldo</span>
              </Button>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Último respaldo</p>
                <p className="text-sm text-blue-700">{systemInfo.lastBackup}</p>
                <p className="text-sm text-blue-700">Tamaño: {systemInfo.dataSize}</p>
              </div>
            </div>
          </div>
          
          <Button className="w-full">Crear Respaldo Ahora</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
          <CardDescription>Detalles técnicos y estadísticas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <Label>Versión de la aplicación</Label>
                <p className="text-sm font-medium">{systemInfo.version}</p>
              </div>
              
              <div>
                <Label>Miembro desde</Label>
                <p className="text-sm font-medium">{systemInfo.membersSince}</p>
              </div>
              
              <div>
                <Label>Total de registros</Label>
                <p className="text-sm font-medium">{systemInfo.totalRecords.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label>Último respaldo</Label>
                <p className="text-sm font-medium">{systemInfo.lastBackup}</p>
              </div>
              
              <div>
                <Label>Tamaño de datos</Label>
                <p className="text-sm font-medium">{systemInfo.dataSize}</p>
              </div>
              
              <div>
                <Label>Estado del sistema</Label>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Funcionando correctamente</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t space-y-2">
            <Button variant="outline" className="w-full">
              Comprobar Actualizaciones
            </Button>
            
            <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Eliminar Cuenta Familiar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'general':
        return renderGeneralSettings();
      case 'members':
        return renderMembersSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'backup':
        return renderBackupSettings();
      case 'system':
        return renderSystemSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation user={user} currentView="family-profile" onNavigate={onNavigate} />
      
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Configuración Familiar</h1>
          <p className="text-gray-600">Administra la configuración de tu red de apoyo familiar</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Menú lateral */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        onClick={() => setCurrentSection(item.id)}
                        variant={currentSection === item.id ? "default" : "ghost"}
                        className="w-full justify-start space-x-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {renderCurrentSection()}
          </div>
        </div>
      </div>
    </div>
  );
}