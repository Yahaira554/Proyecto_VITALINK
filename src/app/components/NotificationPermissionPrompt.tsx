import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Bell, CheckCircle, Clock, Smartphone } from 'lucide-react';

interface NotificationPermissionPromptProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function NotificationPermissionPrompt({ onAccept, onDecline }: NotificationPermissionPromptProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-6">
              <Bell className="h-16 w-16 text-blue-600 animate-bounce" />
            </div>
          </div>
          <CardTitle className="text-3xl mb-2">
            ¡Activa las Notificaciones!
          </CardTitle>
          <CardDescription className="text-xl">
            Para no olvidar tus medicamentos
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6 mb-8">
            <div className="bg-blue-50 p-5 rounded-lg">
              <h3 className="mb-4 text-blue-900 text-xl">
                ¿Por qué son importantes?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 text-lg">
                      <strong>Recordatorios a tiempo:</strong> Te avisaremos exactamente cuando debas tomar tus medicamentos
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Bell className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 text-lg">
                      <strong>Alertas con sonido:</strong> Recibirás notificaciones incluso si estás en otra aplicación
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Smartphone className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 text-lg">
                      <strong>En tu celular:</strong> Las notificaciones aparecerán directamente en tu pantalla
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 text-lg">
                      <strong>Nunca olvides una dosis:</strong> Te ayudaremos a mantener tu tratamiento al día
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
              <p className="text-yellow-800 text-center text-lg">
                <strong>Nota:</strong> Puedes desactivar las notificaciones en cualquier momento desde la configuración de tu navegador
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={onAccept}
              size="lg"
              className="w-full h-20 text-2xl bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              <Bell className="h-8 w-8 mr-3" />
              Sí, Activar Notificaciones
            </Button>
            
            <Button
              onClick={onDecline}
              variant="outline"
              size="lg"
              className="w-full h-16 text-xl"
            >
              Ahora No
            </Button>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            VitaLink cuida tu salud manteniéndote al día con tus medicamentos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
