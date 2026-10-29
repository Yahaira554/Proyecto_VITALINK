import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bell, BellOff, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { BrowserNotificationService } from './NotificationService';
import { toast } from 'sonner';

export function NotificationStatusCard() {
  const [notificationStatus, setNotificationStatus] = useState<'granted' | 'denied' | 'default'>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const hasPermission = await BrowserNotificationService.requestPermission();
    
    if (hasPermission) {
      setNotificationStatus('granted');
      toast.success('🔔 Notificaciones Activadas', {
        description: 'Ahora recibirás alertas de tus medicamentos',
        duration: 4000,
      });
      
      // Notificación de prueba
      setTimeout(() => {
        BrowserNotificationService.show(
          '✅ Notificaciones Configuradas',
          {
            body: 'Recibirás alertas cuando sea hora de tus medicamentos',
          }
        );
      }, 1000);
    } else {
      setNotificationStatus('denied');
      toast.error('❌ Notificaciones Bloqueadas', {
        description: 'Activa las notificaciones desde la configuración de tu navegador',
        duration: 5000,
      });
    }
  };

  const getStatusColor = () => {
    switch (notificationStatus) {
      case 'granted':
        return 'bg-green-50 border-green-200';
      case 'denied':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusIcon = () => {
    switch (notificationStatus) {
      case 'granted':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'denied':
        return <BellOff className="h-6 w-6 text-red-600" />;
      default:
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
    }
  };

  const getStatusText = () => {
    switch (notificationStatus) {
      case 'granted':
        return {
          title: 'Notificaciones Activas',
          description: 'Recibirás alertas cuando sea hora de tomar tus medicamentos',
          color: 'text-green-800'
        };
      case 'denied':
        return {
          title: 'Notificaciones Desactivadas',
          description: 'Actívalas desde la configuración de tu navegador para no perderte recordatorios',
          color: 'text-red-800'
        };
      default:
        return {
          title: 'Notificaciones Disponibles',
          description: 'Activa las notificaciones para recibir recordatorios de medicamentos',
          color: 'text-yellow-800'
        };
    }
  };

  const status = getStatusText();

  return (
    <Card className={`border-2 ${getStatusColor()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <CardTitle className={status.color}>{status.title}</CardTitle>
              <CardDescription className="text-base mt-1">
                {status.description}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      {notificationStatus !== 'granted' && (
        <CardContent>
          <div className="space-y-3">
            {notificationStatus === 'default' && (
              <Button
                onClick={handleEnableNotifications}
                className="w-full"
                size="lg"
              >
                <Bell className="h-5 w-5 mr-2" />
                Activar Notificaciones
              </Button>
            )}
            
            {notificationStatus === 'denied' && (
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-3">
                  Para activar las notificaciones:
                </p>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Haz clic en el ícono de candado o información en la barra de direcciones</li>
                  <li>Busca la opción "Notificaciones"</li>
                  <li>Cambia el permiso a "Permitir"</li>
                  <li>Recarga la página</li>
                </ol>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
