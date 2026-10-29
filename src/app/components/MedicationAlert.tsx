import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Clock, 
  Pill, 
  CheckCircle, 
  RotateCcw, 
  X, 
  AlertTriangle,
  Bell,
  Heart,
  CalendarClock,
  Volume2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useVoice } from './AccessibilityControls';

interface MedicationAlertProps {
  medication: {
    id: number;
    name: string;
    dosage: string;
    time: string;
    color: string;
    description?: string;
    imageUrl?: string;
    instructions?: string;
  };
  onTaken: () => void;
  onSnooze: () => void;
  onDismiss: () => void;
}

export function MedicationAlert({ medication, onTaken, onSnooze, onDismiss }: MedicationAlertProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const { speak, stop } = useVoice();

  // Imágenes de medicamentos por defecto según el color
  const medicationImages = {
    blue: "https://images.unsplash.com/photo-1704214559334-055fc8f8bec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHBpbGxzJTIwdGFibGV0cyUyMG1lZGljYXRpb258ZW58MXx8fHwxNzU5NzI5MzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    red: "https://images.unsplash.com/photo-1550572017-54b7f54d1f75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMGJvdHRsZSUyMHByZXNjcmlwdGlvbiUyMG1lZGljYXRpb258ZW58MXx8fHwxNzU5NzI5MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    white: "https://images.unsplash.com/photo-1656621827127-acced8458f3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx3aGl0ZSUyMHBpbGxzJTIwbWVkaWNpbmUlMjB0YWJsZXRzfGVufDF8fHx8MTc1OTcyOTM1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    default: "https://images.unsplash.com/photo-1704214559334-055fc8f8bec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHBpbGxzJTIwdGFibGV0cyUyMG1lZGljYXRpb258ZW58MXx8fHwxNzU5NzI5MzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  };

  // Leer alerta automáticamente al abrir
  useEffect(() => {
    const message = `¡Atención! Es hora de tomar tu medicamento. ${medication.name}, ${medication.dosage}. ${medication.description || ''}. ${medication.instructions || ''}`;
    const timer = setTimeout(() => {
      speak(message, { rate: 0.75 });
    }, 500);
    
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [medication]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Detener la animación después de 3 segundos
    const animationTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(animationTimer);
    };
  }, []);

  const handleTaken = () => {
    speak('Medicamento marcado como tomado. ¡Muy bien!');
    stop();
    onTaken();
  };

  const handleSnooze = () => {
    speak('Recordatorio pospuesto por 5 minutos');
    stop();
    onSnooze();
  };

  const handleDismiss = () => {
    speak('Recordatorio descartado');
    stop();
    onDismiss();
  };

  const handleRepeatInfo = () => {
    const message = `${medication.name}, ${medication.dosage}. ${medication.description || ''}. ${medication.instructions || 'Tomar según indicación médica'}`;
    speak(message, { rate: 0.75 });
  };

  const formatElapsedTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${remainingSeconds} segundo${remainingSeconds !== 1 ? 's' : ''}`;
    }
    
    return `${minutes} minuto${minutes !== 1 ? 's' : ''} y ${remainingSeconds} segundo${remainingSeconds !== 1 ? 's' : ''}`;
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'from-blue-500 to-blue-600 border-blue-200 shadow-blue-200';
      case 'red':
        return 'from-red-500 to-red-600 border-red-200 shadow-red-200';
      case 'white':
        return 'from-gray-100 to-gray-200 border-gray-300 shadow-gray-200 text-gray-800';
      case 'green':
        return 'from-green-500 to-green-600 border-green-200 shadow-green-200';
      case 'yellow':
        return 'from-yellow-500 to-yellow-600 border-yellow-200 shadow-yellow-200';
      default:
        return 'from-blue-500 to-blue-600 border-blue-200 shadow-blue-200';
    }
  };

  const medicationImageUrl = medication.imageUrl || medicationImages[medication.color as keyof typeof medicationImages] || medicationImages.default;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl mx-auto shadow-2xl border-4 ${isAnimating ? 'animate-pulse' : ''}`}>
        <CardContent className="p-0">
          {/* Header con alarma */}
          <div className={`bg-gradient-to-r ${getColorClasses(medication.color)} text-white p-8 rounded-t-lg relative overflow-hidden`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-white hover:bg-white/20 rounded-full p-3"
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 ${isAnimating ? 'animate-bounce' : ''}`}>
                <Bell className="h-10 w-10 text-white" />
              </div>
              
              <h1 className="text-4xl mb-3">¡Hora de tu Medicamento!</h1>
              <div className="flex items-center justify-center space-x-2 text-2xl">
                <Clock className="h-6 w-6" />
                <span>{medication.time}</span>
              </div>
            </div>

            {/* Indicador de tiempo transcurrido */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/10 px-4 py-3">
              <div className="flex items-center justify-center space-x-2 text-base">
                <CalendarClock className="h-5 w-5" />
                <span>Recordatorio activo: {formatElapsedTime(timeElapsed)}</span>
              </div>
            </div>
          </div>

          {/* Información del medicamento */}
          <div className="p-8 bg-white">
            <div className="text-center mb-6">
              <h2 className="text-5xl mb-3 text-gray-800">{medication.name}</h2>
              <Badge className="text-2xl px-6 py-3 mb-4">
                <Pill className="h-6 w-6 mr-2" />
                {medication.dosage}
              </Badge>
              
              {medication.description && (
                <p className="text-xl text-gray-600 mb-4 mt-4">{medication.description}</p>
              )}
            </div>

            {/* Imagen del medicamento */}
            <div className="mb-6">
              <div className="relative">
                <ImageWithFallback
                  src={medicationImageUrl}
                  alt={`Medicamento ${medication.name}`}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-3">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getColorClasses(medication.color)}`}></div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-lg text-gray-600">
                  Pastilla color {medication.color === 'white' ? 'blanca' : medication.color}
                </p>
              </div>
            </div>

            {/* Instrucciones */}
            {medication.instructions && (
              <div className="mb-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-blue-800 mb-2 text-xl">Instrucciones:</h4>
                    <p className="text-blue-700 text-lg">{medication.instructions}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-4">
              <Button
                onClick={handleTaken}
                size="lg"
                className="w-full h-24 text-3xl bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <CheckCircle className="h-10 w-10 mr-4" />
                Ya Tomé el Medicamento
              </Button>

              <Button
                onClick={handleSnooze}
                variant="outline"
                size="lg"
                className="w-full h-20 text-2xl border-4 border-orange-300 text-orange-700 hover:bg-orange-50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <RotateCcw className="h-8 w-8 mr-3" />
                Recordarme en 5 Minutos
              </Button>

              {/* Botón de voz para releer */}
              <Button
                onClick={handleRepeatInfo}
                variant="outline"
                className="w-full h-20 text-2xl border-4 border-purple-300 hover:bg-purple-50"
              >
                <Volume2 className="h-8 w-8 mr-3" />
                Escuchar Información Nuevamente
              </Button>
            </div>

            {/* Información adicional */}
            <div className="mt-6 pt-4 border-t-2 border-gray-200">
              <div className="grid grid-cols-1 gap-4 text-base text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-lg">Es importante tomar tus medicamentos a tiempo</span>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Si tienes dudas sobre este medicamento, consulta con tu médico
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
