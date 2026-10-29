import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Navigation } from './Navigation';
import { MedicationPhotoCapture } from './MedicationPhotoCapture';
import { toast } from 'sonner';
import { 
  Pill, 
  Clock, 
  Plus, 
  Camera,
  Bell,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2,
  Image,
  Download
} from 'lucide-react';

export function MedicationReminders({ user, onNavigate }) {
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Metformina',
      dosage: '500mg',
      frequency: 'Cada 8 horas',
      times: ['08:00', '16:00', '00:00'],
      color: 'blue',
      shape: 'oval',
      nextDose: '16:00',
      taken: [true, false, false],
      instructions: 'Tomar con alimentos',
      photos: []
    },
    {
      id: 2,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Una vez al día',
      times: ['08:00'],
      color: 'white',
      shape: 'round',
      nextDose: '08:00',
      taken: [true],
      instructions: 'Tomar en ayunas',
      photos: []
    },
    {
      id: 3,
      name: 'Aspirina',
      dosage: '100mg',
      frequency: 'Una vez al día',
      times: ['20:00'],
      color: 'white',
      shape: 'round',
      nextDose: '20:00',
      taken: [false],
      instructions: 'Tomar después de cenar',
      photos: []
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [currentMedicationForPhoto, setCurrentMedicationForPhoto] = useState(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    times: ['08:00'],
    color: 'white',
    shape: 'round',
    instructions: ''
  });

  const handleTakeMedication = (medId, timeIndex) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medId) {
        const newTaken = [...med.taken];
        newTaken[timeIndex] = true;
        return { ...med, taken: newTaken };
      }
      return med;
    }));
  };

  const handleTakePhoto = (medId) => {
    const medication = medications.find(med => med.id === medId);
    if (medication) {
      setCurrentMedicationForPhoto(medication);
      setShowPhotoCapture(true);
    }
  };

  const handlePhotoTaken = (photoData) => {
    if (currentMedicationForPhoto) {
      setMedications(prev => prev.map(med => {
        if (med.id === currentMedicationForPhoto.id) {
          return {
            ...med,
            photos: [...(med.photos || []), {
              id: Date.now(),
              url: photoData.url,
              timestamp: photoData.timestamp,
              blob: photoData.blob
            }]
          };
        }
        return med;
      }));
      
      // Notificar a familiares
      // Aquí se podría integrar con el sistema de chat para enviar la foto
      console.log('Foto tomada del medicamento:', currentMedicationForPhoto.name);
    }
    setCurrentMedicationForPhoto(null);
  };

  const handleAddMedication = () => {
    // Validar campos requeridos
    if (!newMedication.name.trim() || !newMedication.dosage.trim()) {
      toast.error('Por favor, completa al menos el nombre y la dosis del medicamento.');
      return;
    }

    // Crear horarios por defecto si no se especifican
    const defaultTimes = newMedication.times[0].trim() ? newMedication.times : ['08:00'];
    
    // Crear nuevo medicamento
    const medicationToAdd = {
      id: Date.now(),
      name: newMedication.name.trim(),
      dosage: newMedication.dosage.trim(),
      frequency: newMedication.frequency.trim() || 'Una vez al día',
      times: defaultTimes,
      color: newMedication.color,
      shape: newMedication.shape,
      nextDose: defaultTimes[0],
      taken: new Array(defaultTimes.length).fill(false),
      instructions: newMedication.instructions.trim() || 'Seguir indicaciones médicas',
      photos: []
    };

    // Agregar al estado
    setMedications(prev => [...prev, medicationToAdd]);

    // Marcar como recién agregado
    setRecentlyAddedId(medicationToAdd.id);
    setTimeout(() => setRecentlyAddedId(null), 3000); // Remover el indicador después de 3 segundos

    // Limpiar formulario
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      times: ['08:00'],
      color: 'white',
      shape: 'round',
      instructions: ''
    });

    // Cerrar diálogo
    setShowAddDialog(false);

    // Mensaje de confirmación
    toast.success(`¡Medicamento "${medicationToAdd.name}" agregado exitosamente!`, {
      description: `Dosis: ${medicationToAdd.dosage} • Horario: ${medicationToAdd.times[0]}`
    });
  };

  const handleDeleteMedication = (medId) => {
    const medication = medications.find(med => med.id === medId);
    if (confirm(`¿Estás seguro de que quieres eliminar "${medication?.name}"?`)) {
      setMedications(prev => prev.filter(med => med.id !== medId));
      toast.success(`Medicamento "${medication?.name}" eliminado exitosamente`);
    }
  };

  const getCurrentTimeStatus = (times, taken) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    let nextDoseIndex = -1;
    let nextDoseTime = '';

    for (let i = 0; i < times.length; i++) {
      const [hour, minute] = times[i].split(':').map(Number);
      const doseTime = hour * 60 + minute;

      if (doseTime >= currentTime && !taken[i]) {
        nextDoseIndex = i;
        nextDoseTime = times[i];
        break;
      }
    }

    if (nextDoseIndex === -1) {
      // Look for tomorrow's first dose
      for (let i = 0; i < times.length; i++) {
        if (!taken[i]) {
          nextDoseIndex = i;
          nextDoseTime = times[i];
          break;
        }
      }
    }

    return { nextDoseIndex, nextDoseTime };
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      red: 'bg-red-500',
      white: 'bg-gray-100 border-2 border-gray-300',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      pink: 'bg-pink-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation user={user} currentView="medications" onNavigate={onNavigate} />
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">Recordatorios de Medicamentos</h1>
            <p className="text-gray-600">Gestiona tus medicamentos y horarios</p>
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="space-x-2">
                <Plus className="h-4 w-4" />
                <span>Agregar Medicamento</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Medicamento</DialogTitle>
                <DialogDescription>
                  Completa la información del medicamento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="med-name">Nombre del medicamento</Label>
                  <Input
                    id="med-name"
                    placeholder="Ej: Paracetamol"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="med-dosage">Dosis</Label>
                  <Input
                    id="med-dosage"
                    placeholder="Ej: 500mg"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="med-frequency">Frecuencia</Label>
                  <Input
                    id="med-frequency"
                    placeholder="Ej: Cada 8 horas, Una vez al día"
                    value={newMedication.frequency}
                    onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="med-time">Horario principal</Label>
                  <Input
                    id="med-time"
                    type="time"
                    value={newMedication.times[0]}
                    onChange={(e) => setNewMedication({...newMedication, times: [e.target.value]})}
                  />
                </div>
                <div>
                  <Label htmlFor="med-color">Color del medicamento</Label>
                  <select
                    id="med-color"
                    value={newMedication.color}
                    onChange={(e) => setNewMedication({...newMedication, color: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="white">Blanco</option>
                    <option value="blue">Azul</option>
                    <option value="red">Rojo</option>
                    <option value="yellow">Amarillo</option>
                    <option value="green">Verde</option>
                    <option value="pink">Rosa</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="med-instructions">Instrucciones</Label>
                  <Input
                    id="med-instructions"
                    placeholder="Ej: Tomar con alimentos"
                    value={newMedication.instructions}
                    onChange={(e) => setNewMedication({...newMedication, instructions: e.target.value})}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowAddDialog(false)} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleAddMedication} className="flex-1">
                    Agregar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Medicamentos próximos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-orange-600" />
              <span>Próximas Dosis</span>
            </CardTitle>
            <CardDescription>Medicamentos que debes tomar pronto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {medications.map((med) => {
                const { nextDoseIndex, nextDoseTime } = getCurrentTimeStatus(med.times, med.taken);
                
                if (nextDoseIndex === -1 || med.taken[nextDoseIndex]) return null;
                
                return (
                  <div key={`${med.id}-${nextDoseIndex}`} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full ${getColorClass(med.color)}`}></div>
                        <div>
                          <h3 className="font-medium">{med.name}</h3>
                          <p className="text-sm text-gray-600">{med.dosage} • {med.instructions}</p>
                          <p className="text-sm text-orange-600 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Próxima dosis: {nextDoseTime}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleTakePhoto(med.id)}
                        size="sm"
                        variant="outline"
                        className="space-x-1"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Foto</span>
                      </Button>
                      <Button
                        onClick={() => handleTakeMedication(med.id, nextDoseIndex)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 space-x-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Tomado</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Lista completa de medicamentos */}
        <div className="grid gap-6">
          {medications.map((med) => (
            <Card key={med.id} className={`${recentlyAddedId === med.id ? 'ring-2 ring-green-400 ring-opacity-50 bg-green-50/30' : ''} transition-all duration-300`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full ${getColorClass(med.color)}`}></div>
                    <div>
                      <CardTitle>{med.name}</CardTitle>
                      <CardDescription>{med.dosage} • {med.frequency}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteMedication(med.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Instrucciones:</p>
                    <p className="text-sm bg-gray-50 p-2 rounded">{med.instructions}</p>
                  </div>

                  {/* Galería de fotos del medicamento */}
                  {med.photos && med.photos.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Fotos del medicamento:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {med.photos.slice(-4).map((photo) => (
                          <div key={photo.id} className="relative group">
                            <img
                              src={photo.url}
                              alt={`${med.name} - ${new Date(photo.timestamp).toLocaleDateString()}`}
                              className="w-full h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
                              onClick={() => window.open(photo.url, '_blank')}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <div className="text-white text-center">
                                <Image className="h-4 w-4 mx-auto mb-1" />
                                <p className="text-xs">{new Date(photo.timestamp).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTakePhoto(med.id)}
                        className="mt-2 text-blue-600 hover:text-blue-700"
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Tomar nueva foto
                      </Button>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Horarios de hoy:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {med.times.map((time, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                          med.taken[index] 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">{time}</span>
                          </div>
                          
                          {med.taken[index] ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Tomado
                            </Badge>
                          ) : (
                            <Button
                              onClick={() => handleTakeMedication(med.id, index)}
                              size="sm"
                              variant="outline"
                            >
                              Marcar
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Configuración de alertas */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-6 w-6 text-blue-600" />
              <span>Configuración de Alertas</span>
            </CardTitle>
            <CardDescription>Personaliza tus recordatorios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notificaciones Sonoras</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Sonido de alerta</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Vibración</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Notificación en pantalla</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Alertas Familiares</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Notificar si no tomo medicamento</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Reporte diario a familiares</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Alertas de emergencia</span>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal de captura de fotos */}
        <MedicationPhotoCapture
          isOpen={showPhotoCapture}
          onClose={() => {
            setShowPhotoCapture(false);
            setCurrentMedicationForPhoto(null);
          }}
          medicationName={currentMedicationForPhoto?.name || ''}
          onPhotoTaken={handlePhotoTaken}
        />
      </div>
    </div>
  );
}