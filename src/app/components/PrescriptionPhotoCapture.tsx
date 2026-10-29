import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Camera, 
  X, 
  Check, 
  AlertCircle,
  FileText,
  Calendar,
  Scan,
  ArrowLeft,
  Save,
  Eye,
  Clock,
  Pill,
  User,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PrescriptionPhotoCaptureProps {
  onBack: () => void;
  onSave: (data: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      instructions: string;
      duration: string;
    }>;
    doctorName: string;
    date: Date;
    photo: string;
    notes?: string;
  }) => void;
}

export function PrescriptionPhotoCapture({ onBack, onSave }: PrescriptionPhotoCaptureProps) {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target?.result as string;
        setCapturedPhoto(photoData);
        processPrescriptionText(photoData);
      };
      reader.readAsDataURL(file);
    }
  };

  const processPrescriptionText = (photoData: string) => {
    setIsProcessing(true);
    
    // Simular procesamiento de Machine Learning para OCR médico
    setTimeout(() => {
      // Simulación de datos extraídos de la receta
      const simulatedExtraction = {
        doctorName: "Dr. Carlos Mendoza Ruiz",
        cedula: "12345678",
        date: new Date(),
        medications: [
          {
            name: "Metformina",
            dosage: "500mg",
            frequency: "Cada 12 horas",
            instructions: "Tomar con alimentos, preferiblemente después de las comidas principales",
            duration: "30 días",
            confidence: 0.94
          },
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Una vez al día",
            instructions: "Tomar en ayunas, preferiblemente por la mañana",
            duration: "30 días",
            confidence: 0.89
          },
          {
            name: "Atorvastatina",
            dosage: "20mg", 
            frequency: "Una vez al día",
            instructions: "Tomar por la noche, puede ser con o sin alimentos",
            duration: "30 días",
            confidence: 0.91
          }
        ],
        additionalNotes: "Paciente debe monitorear glucosa regularmente. Cita de seguimiento en 1 mes.",
        confidence: 0.91
      };
      
      setExtractedData(simulatedExtraction);
      setIsProcessing(false);
      setShowResults(true);
      
      toast.success('🤖 Receta procesada exitosamente', {
        description: `Se detectaron ${simulatedExtraction.medications.length} medicamentos`,
        duration: 4000,
      });
    }, 3000);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!extractedData) return;
    
    onSave({
      medications: extractedData.medications.map(med => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        instructions: med.instructions,
        duration: med.duration
      })),
      doctorName: extractedData.doctorName,
      date: extractedData.date,
      photo: capturedPhoto!,
      notes: extractedData.additionalNotes
    });
    
    toast.success('✅ Receta guardada', {
      description: 'La información ha sido guardada en tu perfil médico',
      duration: 4000,
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 0.8) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.9) return 'Alta confianza';
    if (confidence >= 0.8) return 'Confianza media';
    return 'Verificar manualmente';
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
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
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
                  <FileText className="h-6 w-6" />
                  <span>Capturar Receta Médica</span>
                </CardTitle>
                <CardDescription className="text-purple-100">
                  IA médica para interpretar recetas escritas a mano
                </CardDescription>
              </div>
              
              <div className="w-10"></div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Información de la captura */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="text-purple-800">Fecha de captura</span>
              </div>
              <p className="text-purple-700 text-sm capitalize">{currentTimestamp}</p>
            </div>

            {/* Captura de foto */}
            <div className="space-y-4">
              {!capturedPhoto ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <div className="space-y-4">
                    <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                      <Camera className="h-10 w-10 text-purple-600" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl mb-2">Fotografía tu receta médica</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Asegúrate de que el texto sea legible y esté bien iluminado
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Button onClick={handleCameraClick} className="w-full max-w-sm bg-purple-600 hover:bg-purple-700">
                        <Camera className="h-4 w-4 mr-2" />
                        Tomar Foto de Receta
                      </Button>
                      
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 max-w-sm mx-auto">
                        <div className="flex items-start space-x-2">
                          <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">IA Médica Avanzada</p>
                            <p>Interpreto letras de doctor y extraigo medicamentos automáticamente</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <ImageWithFallback
                      src={capturedPhoto}
                      alt="Receta médica capturada"
                      className="w-full h-96 object-contain rounded-lg border-2 border-gray-200 bg-gray-50"
                    />
                    
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg text-center max-w-sm">
                          <Scan className="h-8 w-8 mx-auto mb-3 animate-spin text-purple-600" />
                          <h4 className="font-medium mb-2">Procesando con IA Médica</h4>
                          <p className="text-sm text-gray-600 mb-2">Analizando letra manuscrita...</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full animate-pulse w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCapturedPhoto(null);
                        setExtractedData(null);
                        setShowResults(false);
                      }}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
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

            {/* Resultados de la extracción */}
            {showResults && extractedData && (
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">Receta procesada exitosamente</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-green-700">
                    <Badge className={getConfidenceColor(extractedData.confidence)}>
                      {getConfidenceText(extractedData.confidence)} ({Math.round(extractedData.confidence * 100)}%)
                    </Badge>
                  </div>
                </div>

                {/* Información del médico */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                      <span>Información del Médico</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Nombre del médico</p>
                        <p className="font-medium">{extractedData.doctorName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cédula profesional</p>
                        <p className="font-medium">{extractedData.cedula}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medicamentos extraídos */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Pill className="h-5 w-5 text-green-600" />
                      <span>Medicamentos Prescritos ({extractedData.medications.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    {extractedData.medications.map((med, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-lg text-gray-800">{med.name}</h4>
                          <Badge className={getConfidenceColor(med.confidence)}>
                            {Math.round(med.confidence * 100)}%
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Dosis</p>
                            <p className="font-medium">{med.dosage}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Frecuencia</p>
                            <p className="font-medium">{med.frequency}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-gray-600">Duración del tratamiento</p>
                            <p className="font-medium">{med.duration}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-gray-600">Instrucciones</p>
                            <p className="font-medium">{med.instructions}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Notas adicionales */}
                {extractedData.additionalNotes && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <Eye className="h-5 w-5 text-amber-600" />
                        <span>Notas Médicas</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-700">{extractedData.additionalNotes}</p>
                    </CardContent>
                  </Card>
                )}

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
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Receta
                  </Button>
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span>Consejos para mejor captura</span>
              </h4>
              <div className="text-sm space-y-1 text-gray-600">
                <p>• Asegúrate de que haya buena iluminación</p>
                <p>• Mantén la receta plana y sin arrugas</p>
                <p>• Centra toda la receta en la imagen</p>
                <p>• Verifica que todo el texto sea legible</p>
                <p className="text-xs mt-2 text-gray-500">
                  * Siempre verifica la información extraída con tu médico
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}