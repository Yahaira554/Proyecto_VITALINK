import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Navigation } from './Navigation';
import { GlucosePhotoCapture } from './GlucosePhotoCapture';
import { PrescriptionPhotoCapture } from './PrescriptionPhotoCapture';
import { HealthDataExplanation } from './HealthDataExplanation';
import { toast } from 'sonner';
import { 
  Heart, 
  Droplets, 
  Wind, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Activity,
  Camera,
  FileText,
  Info
} from 'lucide-react';

export function HealthMonitoring({ user, onNavigate }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showGlucoseCapture, setShowGlucoseCapture] = useState(false);
  const [showPrescriptionCapture, setShowPrescriptionCapture] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('glucose');
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationType, setExplanationType] = useState(null);
  const [newReading, setNewReading] = useState({
    type: 'glucose',
    value: '',
    systolic: '',
    diastolic: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5)
  });

  // Estados para datos dinámicos de las gráficas
  const [glucoseData, setGlucoseData] = useState([
    { date: '1/12', value: 95 },
    { date: '2/12', value: 102 },
    { date: '3/12', value: 98 },
    { date: '4/12', value: 110 },
    { date: '5/12', value: 88 },
    { date: '6/12', value: 92 },
    { date: '7/12', value: 105 }
  ]);

  const [pressureData, setPressureData] = useState([
    { date: '1/12', systolic: 120, diastolic: 80 },
    { date: '2/12', systolic: 125, diastolic: 82 },
    { date: '3/12', systolic: 118, diastolic: 78 },
    { date: '4/12', systolic: 130, diastolic: 85 },
    { date: '5/12', systolic: 115, diastolic: 75 },
    { date: '6/12', systolic: 122, diastolic: 81 },
    { date: '7/12', systolic: 128, diastolic: 83 }
  ]);

  const [oxygenData, setOxygenData] = useState([
    { date: '1/12', value: 98 },
    { date: '2/12', value: 97 },
    { date: '3/12', value: 99 },
    { date: '4/12', value: 96 },
    { date: '5/12', value: 98 },
    { date: '6/12', value: 97 },
    { date: '7/12', value: 98 }
  ]);

  const [recentReadings, setRecentReadings] = useState([
    { id: 1, type: 'glucose', value: '105 mg/dL', time: 'Hace 2 horas', status: 'normal' },
    { id: 2, type: 'pressure', value: '128/83 mmHg', time: 'Hace 4 horas', status: 'warning' },
    { id: 3, type: 'oxygen', value: '98%', time: 'Hace 6 horas', status: 'normal' }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'alert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'normal':
        return 'Normal';
      case 'warning':
        return 'Atención';
      case 'alert':
        return 'Alerta';
      default:
        return 'Sin datos';
    }
  };

  // Función para determinar el estado de salud basado en los valores
  const getHealthStatus = (type, value, systolic = null, diastolic = null) => {
    switch (type) {
      case 'glucose':
        const glucoseValue = parseFloat(value);
        if (glucoseValue < 70 || glucoseValue > 180) return 'alert';
        if (glucoseValue < 80 || glucoseValue > 140) return 'warning';
        return 'normal';
      case 'pressure':
        if (systolic >= 140 || diastolic >= 90) return 'alert';
        if (systolic >= 130 || diastolic >= 80) return 'warning';
        return 'normal';
      case 'oxygen':
        const oxygenValue = parseFloat(value);
        if (oxygenValue < 95) return 'alert';
        if (oxygenValue < 97) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  // Función para formatear la fecha para mostrar
  const formatDateForChart = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const handleGlucosePhotoSave = (glucoseData) => {
    const formattedDate = formatDateForChart(glucoseData.timestamp);
    const status = getHealthStatus('glucose', glucoseData.value.toString());
    
    // Agregar a los datos de la gráfica
    const newGlucosePoint = {
      date: formattedDate,
      value: glucoseData.value,
      time: glucoseData.timestamp.toTimeString().split(' ')[0].slice(0, 5)
    };
    setGlucoseData(prev => [...prev.slice(-6), newGlucosePoint]);
    
    // Agregar a las lecturas recientes
    const newReading = {
      id: Date.now(),
      type: 'glucose',
      value: `${glucoseData.value} mg/dL`,
      time: 'Ahora',
      status: status,
      rawValue: glucoseData.value,
      photo: glucoseData.photo,
      notes: glucoseData.notes
    };
    
    setRecentReadings(prev => [newReading, ...prev.slice(0, 9)]);
    
    setShowGlucoseCapture(false);
    
    // Notificar a la familia si hay valores anormales
    if (status === 'alert') {
      setTimeout(() => {
        toast.warning('🚨 Familia notificada', {
          description: 'Tu familia ha sido notificada sobre esta lectura',
          duration: 4000,
        });
      }, 1500);
    }
  };

  const handlePrescriptionSave = (prescriptionData) => {
    // Guardar información de la receta
    toast.success('📋 Receta guardada exitosamente', {
      description: `${prescriptionData.medications.length} medicamentos agregados por ${prescriptionData.doctorName}`,
      duration: 4000,
    });
    
    // Agregar medicamentos al sistema de recordatorios (simulación)
    setTimeout(() => {
      toast.info('💊 Medicamentos programados', {
        description: 'Los nuevos medicamentos han sido agregados a tus recordatorios',
        duration: 4000,
      });
    }, 1500);
    
    setShowPrescriptionCapture(false);
  };

  const handleShowExplanation = (type) => {
    setExplanationType(type);
    setShowExplanation(true);
    
    toast.info('📚 Mostrando información detallada', {
      description: `Aprende sobre tus niveles de ${type === 'glucose' ? 'glucosa' : type === 'pressure' ? 'presión arterial' : 'oxígeno'}`,
      duration: 2000,
    });
  };

  const getTrend = (data, type) => {
    if (data.length < 2) return null;
    
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    
    if (type === 'pressure') {
      if (current.systolic > previous.systolic) return 'up';
      if (current.systolic < previous.systolic) return 'down';
      return 'stable';
    } else {
      if (current.value > previous.value) return 'up';
      if (current.value < previous.value) return 'down';
      return 'stable';
    }
  };

  const getCurrentValue = (type) => {
    if (type === 'glucose' && glucoseData.length > 0) {
      return glucoseData[glucoseData.length - 1].value.toString();
    } else if (type === 'pressure' && pressureData.length > 0) {
      const latest = pressureData[pressureData.length - 1];
      return `${latest.systolic}/${latest.diastolic}`;
    } else if (type === 'oxygen' && oxygenData.length > 0) {
      return oxygenData[oxygenData.length - 1].value.toString();
    }
    return null;
  };

  const handleAddReading = () => {
    // Validaciones
    if (newReading.type !== 'pressure' && !newReading.value) {
      toast.error('Por favor ingresa un valor para la medición');
      return;
    }
    
    if (newReading.type === 'pressure' && (!newReading.systolic || !newReading.diastolic)) {
      toast.error('Por favor ingresa tanto la presión sistólica como la diastólica');
      return;
    }

    const readingDate = formatDateForChart(newReading.date);
    let displayValue = '';
    let status = 'normal';
    
    const newEntry = {
      id: Date.now(),
      type: newReading.type,
      time: `${newReading.time} - ${readingDate}`,
      rawValue: null
    };

    switch (newReading.type) {
      case 'glucose':
        const glucoseValue = parseFloat(newReading.value);
        status = getHealthStatus('glucose', newReading.value);
        displayValue = `${glucoseValue} mg/dL`;
        
        // Actualizar gráfica de glucosa
        setGlucoseData(prev => {
          const newData = [...prev];
          if (newData.length >= 7) {
            newData.shift();
          }
          newData.push({
            date: readingDate,
            value: glucoseValue
          });
          return newData;
        });
        
        newEntry.value = displayValue;
        newEntry.status = status;
        newEntry.rawValue = glucoseValue;
        break;
        
      case 'pressure':
        const systolic = parseInt(newReading.systolic);
        const diastolic = parseInt(newReading.diastolic);
        status = getHealthStatus('pressure', null, systolic, diastolic);
        displayValue = `${systolic}/${diastolic} mmHg`;
        
        // Actualizar gráfica de presión
        setPressureData(prev => {
          const newData = [...prev];
          if (newData.length >= 7) {
            newData.shift();
          }
          newData.push({
            date: readingDate,
            systolic: systolic,
            diastolic: diastolic
          });
          return newData;
        });
        
        newEntry.value = displayValue;
        newEntry.status = status;
        newEntry.rawValue = { systolic, diastolic };
        break;
        
      case 'oxygen':
        const oxygenValue = parseFloat(newReading.value);
        status = getHealthStatus('oxygen', newReading.value);
        displayValue = `${oxygenValue}%`;
        
        // Actualizar gráfica de oxígeno
        setOxygenData(prev => {
          const newData = [...prev];
          if (newData.length >= 7) {
            newData.shift();
          }
          newData.push({
            date: readingDate,
            value: oxygenValue
          });
          return newData;
        });
        
        newEntry.value = displayValue;
        newEntry.status = status;
        newEntry.rawValue = oxygenValue;
        break;
    }

    // Agregar al historial reciente
    setRecentReadings(prev => {
      const newReadings = [newEntry, ...prev];
      return newReadings.slice(0, 10); // Mantener solo las últimas 10 lecturas
    });

    // Mostrar notificación de éxito
    toast.success(`Nueva lectura de ${
      newReading.type === 'glucose' ? 'glucosa' : 
      newReading.type === 'pressure' ? 'presión arterial' : 'oxígeno'
    } registrada`, {
      description: `Valor: ${displayValue}`,
      duration: 3000,
    });

    // Cerrar el diálogo y resetear formulario
    setShowAddDialog(false);
    setNewReading({
      type: 'glucose',
      value: '',
      systolic: '',
      diastolic: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5)
    });
  };

  // Render condicional para los componentes de captura
  if (showGlucoseCapture) {
    return (
      <GlucosePhotoCapture
        onBack={() => setShowGlucoseCapture(false)}
        onSave={handleGlucosePhotoSave}
      />
    );
  }
  
  if (showPrescriptionCapture) {
    return (
      <PrescriptionPhotoCapture
        onBack={() => setShowPrescriptionCapture(false)}
        onSave={handlePrescriptionSave}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation user={user} currentView="health" onNavigate={onNavigate} />
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">Monitoreo de Salud</h1>
            <p className="text-gray-600">Seguimiento de tus signos vitales</p>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => setShowGlucoseCapture(true)}
              variant="outline"
              className="space-x-2 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Camera className="h-4 w-4" />
              <span>Foto Glucosa</span>
            </Button>
            
            <Button 
              onClick={() => setShowPrescriptionCapture(true)}
              variant="outline"
              className="space-x-2 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <FileText className="h-4 w-4" />
              <span>Capturar Receta</span>
            </Button>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Agregar Lectura</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Registrar Nueva Lectura</DialogTitle>
                  <DialogDescription>
                    Agrega una nueva medición de salud
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reading-type">Tipo de medición</Label>
                    <select
                      id="reading-type"
                      value={newReading.type}
                      onChange={(e) => setNewReading({...newReading, type: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="glucose">Glucosa</option>
                      <option value="pressure">Presión Arterial</option>
                      <option value="oxygen">Oxígeno</option>
                    </select>
                  </div>
                  
                  {newReading.type === 'glucose' && (
                    <div>
                      <Label htmlFor="glucose-value">Glucosa (mg/dL)</Label>
                      <Input
                        id="glucose-value"
                        type="number"
                        placeholder="Ej: 105"
                        min="40"
                        max="300"
                        value={newReading.value}
                        onChange={(e) => setNewReading({...newReading, value: e.target.value})}
                      />
                    </div>
                  )}
                  
                  {newReading.type === 'pressure' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="systolic">Sistólica</Label>
                        <Input
                          id="systolic"
                          type="number"
                          placeholder="120"
                          min="70"
                          max="200"
                          value={newReading.systolic}
                          onChange={(e) => setNewReading({...newReading, systolic: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="diastolic">Diastólica</Label>
                        <Input
                          id="diastolic"
                          type="number"
                          placeholder="80"
                          min="40"
                          max="120"
                          value={newReading.diastolic}
                          onChange={(e) => setNewReading({...newReading, diastolic: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                  
                  {newReading.type === 'oxygen' && (
                    <div>
                      <Label htmlFor="oxygen-value">Oxígeno (%)</Label>
                      <Input
                        id="oxygen-value"
                        type="number"
                        placeholder="Ej: 98"
                        min="70"
                        max="100"
                        value={newReading.value}
                        onChange={(e) => setNewReading({...newReading, value: e.target.value})}
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="reading-date">Fecha</Label>
                      <Input
                        id="reading-date"
                        type="date"
                        value={newReading.date}
                        onChange={(e) => setNewReading({...newReading, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reading-time">Hora</Label>
                      <Input
                        id="reading-time"
                        type="time"
                        value={newReading.time}
                        onChange={(e) => setNewReading({...newReading, time: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={() => setShowAddDialog(false)} variant="outline" className="flex-1">
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleAddReading} 
                      className="flex-1"
                      disabled={
                        (newReading.type !== 'pressure' && !newReading.value) ||
                        (newReading.type === 'pressure' && (!newReading.systolic || !newReading.diastolic))
                      }
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Resumen de signos vitales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Glucosa</CardTitle>
              <Droplets className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {glucoseData.length > 0 ? `${glucoseData[glucoseData.length - 1].value} mg/dL` : 'Sin datos'}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getStatusColor(
                  glucoseData.length > 0 ? getHealthStatus('glucose', glucoseData[glucoseData.length - 1].value) : 'normal'
                )}>
                  {getStatusText(
                    glucoseData.length > 0 ? getHealthStatus('glucose', glucoseData[glucoseData.length - 1].value) : 'normal'
                  )}
                </Badge>
                <span className="text-xs text-gray-600">
                  {recentReadings.find(r => r.type === 'glucose')?.time || 'Sin registro'}
                </span>
              </div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                {glucoseData.length >= 2 ? (
                  glucoseData[glucoseData.length - 1].value < glucoseData[glucoseData.length - 2].value ? (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Descendente
                    </>
                  ) : glucoseData[glucoseData.length - 1].value > glucoseData[glucoseData.length - 2].value ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Ascendente
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Estable
                    </>
                  )
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Sin tendencia
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presión Arterial</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pressureData.length > 0 ? 
                  `${pressureData[pressureData.length - 1].systolic}/${pressureData[pressureData.length - 1].diastolic} mmHg` : 
                  'Sin datos'
                }
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getStatusColor(
                  pressureData.length > 0 ? 
                    getHealthStatus('pressure', null, 
                      pressureData[pressureData.length - 1].systolic, 
                      pressureData[pressureData.length - 1].diastolic
                    ) : 'normal'
                )}>
                  {getStatusText(
                    pressureData.length > 0 ? 
                      getHealthStatus('pressure', null, 
                        pressureData[pressureData.length - 1].systolic, 
                        pressureData[pressureData.length - 1].diastolic
                      ) : 'normal'
                  )}
                </Badge>
                <span className="text-xs text-gray-600">
                  {recentReadings.find(r => r.type === 'pressure')?.time || 'Sin registro'}
                </span>
              </div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                {pressureData.length >= 2 ? (
                  pressureData[pressureData.length - 1].systolic < pressureData[pressureData.length - 2].systolic ? (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Descendente
                    </>
                  ) : pressureData[pressureData.length - 1].systolic > pressureData[pressureData.length - 2].systolic ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Ascendente
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Estable
                    </>
                  )
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Sin tendencia
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Oxígeno</CardTitle>
              <Wind className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {oxygenData.length > 0 ? `${oxygenData[oxygenData.length - 1].value}%` : 'Sin datos'}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getStatusColor(
                  oxygenData.length > 0 ? getHealthStatus('oxygen', oxygenData[oxygenData.length - 1].value) : 'normal'
                )}>
                  {getStatusText(
                    oxygenData.length > 0 ? getHealthStatus('oxygen', oxygenData[oxygenData.length - 1].value) : 'normal'
                  )}
                </Badge>
                <span className="text-xs text-gray-600">
                  {recentReadings.find(r => r.type === 'oxygen')?.time || 'Sin registro'}
                </span>
              </div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                {oxygenData.length >= 2 ? (
                  oxygenData[oxygenData.length - 1].value < oxygenData[oxygenData.length - 2].value ? (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Descendente
                    </>
                  ) : oxygenData[oxygenData.length - 1].value > oxygenData[oxygenData.length - 2].value ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Ascendente
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Estable
                    </>
                  )
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Sin tendencia
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficas de tendencias */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-xl transition-all duration-200 hover:border-blue-400" onClick={() => handleShowExplanation('glucose')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  <span>Tendencia de Glucosa</span>
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowExplanation('glucose');
                  }}
                >
                  <Info className="h-4 w-4 mr-1" />
                  <span className="text-sm">Ver explicación</span>
                </Button>
              </div>
              <CardDescription>Niveles de glucosa en los últimos 7 días - Haz clic para más información</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={glucoseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-all duration-200 hover:border-red-400" onClick={() => handleShowExplanation('pressure')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span>Tendencia de Presión Arterial</span>
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowExplanation('pressure');
                  }}
                >
                  <Info className="h-4 w-4 mr-1" />
                  <span className="text-sm">Ver explicación</span>
                </Button>
              </div>
              <CardDescription>Presión sistólica y diastólica últimos 7 días - Haz clic para más información</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pressureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="systolic" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    name="Sistólica"
                    dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="diastolic" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    name="Diastólica"
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-all duration-200 hover:border-green-400" onClick={() => handleShowExplanation('oxygen')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Wind className="h-5 w-5 text-green-600" />
                  <span>Tendencia de Oxígeno</span>
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-green-600 hover:bg-green-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowExplanation('oxygen');
                  }}
                >
                  <Info className="h-4 w-4 mr-1" />
                  <span className="text-sm">Ver explicación</span>
                </Button>
              </div>
              <CardDescription>Saturación de oxígeno últimos 7 días - Haz clic para más información</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={oxygenData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[90, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#16a34a" 
                    strokeWidth={3}
                    name="Oxígeno"
                    dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Historial reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <span>Historial Reciente</span>
            </CardTitle>
            <CardDescription>Últimas mediciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReadings.map((reading) => (
                <div key={reading.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {reading.type === 'glucose' && <Droplets className="h-6 w-6 text-blue-600" />}
                      {reading.type === 'pressure' && <Heart className="h-6 w-6 text-red-600" />}
                      {reading.type === 'oxygen' && <Wind className="h-6 w-6 text-green-600" />}
                    </div>
                    <div>
                      <p className="font-medium">
                        {reading.type === 'glucose' && 'Glucosa'}
                        {reading.type === 'pressure' && 'Presión Arterial'}
                        {reading.type === 'oxygen' && 'Oxígeno'}
                      </p>
                      <p className="text-lg font-semibold">{reading.value}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {reading.time}
                      </p>
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(reading.status)}>
                    {getStatusText(reading.status)}
                  </Badge>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-6">
              Ver historial completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de explicación de datos de salud */}
      <HealthDataExplanation
        type={explanationType}
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        currentValue={explanationType ? getCurrentValue(explanationType) : null}
        trend={explanationType ? getTrend(
          explanationType === 'glucose' ? glucoseData : 
          explanationType === 'pressure' ? pressureData : 
          oxygenData, 
          explanationType
        ) : null}
      />
    </div>
  );
}