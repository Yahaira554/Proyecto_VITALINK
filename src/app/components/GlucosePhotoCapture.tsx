import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  AlertCircle,
  Activity,
  Calendar,
  Clock,
  Image,
  Scan,
  ArrowLeft,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

interface GlucosePhotoCaptureProps {
  onBack: () => void;
  onSave: (data: {
    value: number;
    timestamp: Date;
    photo?: string;
    notes?: string;
  }) => void;
}

export function GlucosePhotoCapture({ onBack, onSave }: GlucosePhotoCaptureProps) {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [glucoseValue, setGlucoseValue] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedValue, setDetectedValue] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target?.result as string;
        setCapturedPhoto(photoData);
        simulateGlucoseDetection(photoData);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateGlucoseDetection = (photoData: string) => {
    setIsProcessing(true);
    
    // Simular procesamiento de IA para detectar valor de glucosa
    setTimeout(() => {
      // Valores de glucosa simulados realistas
      const simulatedValues = [95, 105, 120, 135, 140, 156, 180, 200, 89, 112];
      const randomValue = simulatedValues[Math.floor(Math.random() * simulatedValues.length)];
      
      setDetectedValue(randomValue);
      setGlucoseValue(randomValue.toString());
      setIsProcessing(false);
      
      toast.success('📊 Valor detectado automáticamente', {
        description: `Se detectó glucosa: ${randomValue} mg/dL`,
        duration: 3000,
      });
    }, 2000);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    const value = parseFloat(glucoseValue);
    
    if (!value || value < 50 || value > 500) {
      toast.error('⚠️ Valor inválido', {
        description: 'El valor de glucosa debe estar entre 50 y 500 mg/dL',
        duration: 3000,
      });
      return;
    }

    const glucoseData = {
      value,
      timestamp: new Date(),
      photo: capturedPhoto || undefined,
      notes: notes.trim() || undefined
    };

    onSave(glucoseData);
    
    toast.success('✅ Glucosa registrada', {
      description: `Valor ${value} mg/dL guardado correctamente`,
      duration: 4000,
    });
  };

  const getGlucoseStatus = (value: number) => {
    if (value < 70) return { status: 'Bajo', color: 'text-red-600 bg-red-50 border-red-200' };
    if (value <= 140) return { status: 'Normal', color: 'text-green-600 bg-green-50 border-green-200' };
    if (value <= 200) return { status: 'Alto', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
    return { status: 'Muy Alto', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  const currentTimestamp = new Date().toLocaleString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:bg-white/20 p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="text-center">
                <CardTitle className="flex items-center space-x-2 justify-center">
                  <Activity className="h-6 w-6" />
                  <span>Registrar Glucosa</span>
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Captura la lectura de tu glucómetro
                </CardDescription>
              </div>
              
              <div className="w-10"></div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Información de la medición */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800">Fecha y hora actual</span>
              </div>
              <p className="text-blue-700 text-sm capitalize">{currentTimestamp}</p>
            </div>

            {/* Captura de foto */}
            <div className="space-y-4">
              <Label className="text-lg">Fotografía del Glucómetro</Label>
              
              {!capturedPhoto ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Camera className="h-8 w-8 text-blue-600" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg mb-2">Toma una foto de tu glucómetro</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Asegúrate de que la pantalla sea visible y esté bien iluminada
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Button onClick={handleCameraClick} className="w-full max-w-xs">
                        <Camera className="h-4 w-4 mr-2" />
                        Tomar Foto
                      </Button>
                      
                      <p className="text-xs text-gray-500">
                        La IA detectará automáticamente el valor
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={capturedPhoto}
                      alt="Lectura de glucómetro"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg text-center">
                          <Scan className="h-6 w-6 mx-auto mb-2 animate-pulse text-blue-600" />
                          <p className="text-sm">Detectando valor...</p>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCapturedPhoto(null);
                        setDetectedValue(null);
                        setGlucoseValue('');
                      }}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {detectedValue && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-800">Valor detectado automáticamente</span>
                      </div>
                      <p className="text-green-700">
                        Glucosa: <strong>{detectedValue} mg/dL</strong>
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={handleCameraClick}
                    className="w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Tomar Nueva Foto
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />
            </div>

            {/* Valor manual */}
            <div className="space-y-4">
              <Label className="text-lg">Valor de Glucosa</Label>
              
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="number"
                    value={glucoseValue}
                    onChange={(e) => setGlucoseValue(e.target.value)}
                    placeholder="Ingresa el valor..."
                    className="pr-16 text-lg h-12"
                    min="50"
                    max="500"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    mg/dL
                  </div>
                </div>
                
                {glucoseValue && !isNaN(parseFloat(glucoseValue)) && (
                  <div className="flex items-center space-x-2">
                    <Badge className={getGlucoseStatus(parseFloat(glucoseValue)).color}>
                      {getGlucoseStatus(parseFloat(glucoseValue)).status}
                    </Badge>
                    
                    {parseFloat(glucoseValue) < 70 || parseFloat(glucoseValue) > 200 ? (
                      <div className="flex items-center space-x-1 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Consulta con tu médico</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label>Notas (Opcional)</Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Antes del desayuno, después de ejercicio..."
                className="w-full h-20 p-3 border rounded-lg resize-none"
                maxLength={200}
              />
              <div className="text-xs text-gray-500 text-right">
                {notes.length}/200 caracteres
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Cancelar
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={!glucoseValue || isNaN(parseFloat(glucoseValue))}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Lectura
              </Button>
            </div>

            {/* Información adicional */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span>Valores de Referencia</span>
              </h4>
              <div className="text-sm space-y-1 text-gray-600">
                <p>• <strong>Normal:</strong> 70-140 mg/dL</p>
                <p>• <strong>Bajo:</strong> Menos de 70 mg/dL</p>
                <p>• <strong>Alto:</strong> Más de 140 mg/dL</p>
                <p className="text-xs mt-2 text-gray-500">
                  * Consulta con tu médico para interpretar tus resultados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}