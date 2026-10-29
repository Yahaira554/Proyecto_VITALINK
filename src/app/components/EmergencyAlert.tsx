import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  AlertTriangle, 
  Phone, 
  Users, 
  MapPin, 
  X,
  Loader2,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

export function EmergencyAlert({ user, onClose }) {
  const [countdown, setCountdown] = useState(5);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [alertingSent, setAlertingSent] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(true);

  // Obtener ubicación del usuario
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGettingLocation(false);
        },
        () => {
          setGettingLocation(false);
        }
      );
    } else {
      setGettingLocation(false);
    }
  }, []);

  // Countdown antes de enviar alerta automática
  useEffect(() => {
    if (isConfirmed || alertingSent) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown llegó a 0, enviar alerta automática
      handleConfirmEmergency();
    }
  }, [countdown, isConfirmed, alertingSent]);

  const handleConfirmEmergency = () => {
    setIsConfirmed(true);
    
    // Simular envío de alertas a familiares
    toast.error('🚨 ALERTA DE EMERGENCIA ACTIVADA', {
      description: 'Notificando a tus contactos de emergencia...',
      duration: 5000,
    });

    setTimeout(() => {
      setAlertingSent(true);
      
      // Notificaciones simuladas a familiares
      toast.success('📱 Familia notificada', {
        description: 'Ana González y Carlos González han sido alertados',
        duration: 4000,
      });

      if (userLocation) {
        toast.info('📍 Ubicación compartida', {
          description: 'Tu ubicación ha sido enviada a tus contactos',
          duration: 4000,
        });
      }
    }, 2000);
  };

  const handleCall911 = () => {
    window.location.href = 'tel:911';
    
    toast.error('📞 Llamando a Emergencias', {
      description: 'Conectando con 911...',
      duration: 3000,
    });
  };

  const handleCallFamily = () => {
    // Simular llamada al contacto principal
    window.location.href = 'tel:3312345678';
    
    toast.info('📞 Llamando a Ana González', {
      description: 'Conectando con tu contacto de emergencia...',
      duration: 3000,
    });
  };

  const handleCancel = () => {
    toast.warning('❌ Alerta cancelada', {
      description: 'La alerta de emergencia ha sido cancelada',
      duration: 3000,
    });
    onClose();
  };

  const emergencyContacts = [
    { name: 'Ana González', relation: 'Hija', phone: '33-1234-5678', color: 'pink' },
    { name: 'Carlos González', relation: 'Hijo', phone: '33-8765-4321', color: 'blue' },
    { name: 'Dr. Martínez', relation: 'Médico', phone: '33-9999-0000', color: 'green' }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl border-4 border-red-600 shadow-2xl animate-in fade-in zoom-in duration-300">
        <CardHeader className="bg-red-600 text-white pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600 animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-2xl mb-1">Emergencia Activada</CardTitle>
                <CardDescription className="text-red-100">
                  {!isConfirmed && !alertingSent && `Enviando alerta en ${countdown} segundos...`}
                  {isConfirmed && !alertingSent && 'Enviando alertas...'}
                  {alertingSent && 'Alerta enviada exitosamente'}
                </CardDescription>
              </div>
            </div>
            
            {!isConfirmed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="text-white hover:bg-red-700"
              >
                <X className="h-6 w-6" />
              </Button>
            )}
          </div>

          {/* Barra de progreso del countdown */}
          {!isConfirmed && !alertingSent && (
            <div className="mt-4 bg-red-800 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-white h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 5) * 100}%` }}
              ></div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Estado de la ubicación */}
          {gettingLocation ? (
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <p className="text-sm text-blue-900">Obteniendo tu ubicación...</p>
            </div>
          ) : userLocation ? (
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Ubicación obtenida</p>
                <p className="text-xs text-green-700">
                  Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-900">No se pudo obtener la ubicación</p>
            </div>
          )}

          {/* Botones de acción principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleCall911}
              className="h-24 bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center space-y-2"
              size="lg"
            >
              <Phone className="h-8 w-8" />
              <div>
                <p className="font-bold">Llamar a 911</p>
                <p className="text-xs opacity-90">Emergencias México</p>
              </div>
            </Button>

            <Button
              onClick={handleCallFamily}
              className="h-24 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center space-y-2"
              size="lg"
            >
              <Users className="h-8 w-8" />
              <div>
                <p className="font-bold">Llamar a Familia</p>
                <p className="text-xs opacity-90">Contacto de emergencia</p>
              </div>
            </Button>
          </div>

          {/* Estado de alertas enviadas */}
          {alertingSent && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <p className="font-medium">Alertas enviadas exitosamente</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">Contactos notificados:</p>
                {emergencyContacts.map((contact, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-${contact.color}-500 rounded-full flex items-center justify-center`}>
                        <span className="text-white font-medium">{contact.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-gray-600">{contact.relation} • {contact.phone}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `tel:${contact.phone.replace(/-/g, '')}`}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Llamar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón de confirmación manual */}
          {!isConfirmed && !alertingSent && (
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3 text-center">
                ¿Necesitas ayuda inmediata?
              </p>
              <Button
                onClick={handleConfirmEmergency}
                className="w-full bg-orange-600 hover:bg-orange-700 h-14"
                size="lg"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                Confirmar Emergencia Ahora
              </Button>
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Usuario:</strong> {user.name}<br />
              <strong>Hora:</strong> {new Date().toLocaleTimeString('es-MX', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          </div>

          {/* Botón cancelar (solo si no se ha confirmado) */}
          {!isConfirmed && !alertingSent && (
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full"
            >
              Cancelar Alerta
            </Button>
          )}

          {alertingSent && (
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Cerrar
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
