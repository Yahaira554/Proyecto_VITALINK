import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

// Servicio de notificaciones del navegador
export class BrowserNotificationService {
  static async requestPermission() {
    if (!('Notification' in window)) {
      console.log('Este navegador no soporta notificaciones de escritorio');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  static show(title: string, options: NotificationOptions = {}) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        ...options,
      });

      // Reproducir sonido de alerta
      this.playNotificationSound();

      return notification;
    }
    return null;
  }

  static playNotificationSound() {
    // Crear un beep usando Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frecuencia en Hz
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      // Segundo beep
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);

        oscillator2.frequency.value = 1000;
        oscillator2.type = 'sine';

        gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.5);
      }, 600);
    } catch (error) {
      console.log('No se pudo reproducir el sonido de notificación');
    }
  }
}

// Hook para gestionar las notificaciones de medicamentos
export function useMedicationNotifications(
  medications: any[],
  onMedicationDue: (medication: any) => void,
  enabled: boolean = true
) {
  const lastCheckedMinuteRef = useRef<number>(-1);
  const notifiedMedicationsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled || !medications || medications.length === 0) return;

    const checkMedications = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      // Solo verificar una vez por minuto
      if (currentTimeInMinutes === lastCheckedMinuteRef.current) {
        return;
      }

      lastCheckedMinuteRef.current = currentTimeInMinutes;
      const today = now.toDateString();

      medications.forEach((medication) => {
        if (!medication.times || medication.times.length === 0) return;

        medication.times.forEach((time: string, index: number) => {
          const [hours, minutes] = time.split(':').map(Number);
          const medTimeInMinutes = hours * 60 + minutes;

          // Crear una clave única para esta dosis específica de hoy
          const notificationKey = `${medication.id}-${time}-${today}`;

          // Verificar si es la hora exacta y no se ha notificado hoy
          if (
            currentTimeInMinutes === medTimeInMinutes &&
            !notifiedMedicationsRef.current.has(notificationKey) &&
            (!medication.taken || !medication.taken[index])
          ) {
            // Marcar como notificado
            notifiedMedicationsRef.current.add(notificationKey);

            // Llamar al callback
            onMedicationDue(medication);

            // Mostrar notificación del navegador
            BrowserNotificationService.show(
              `🔔 ¡Hora de tu medicamento!`,
              {
                body: `Es hora de tomar ${medication.name} (${medication.dosage})`,
                tag: notificationKey,
                icon: '/favicon.ico',
                requireInteraction: true,
              }
            );

            // Mostrar toast
            toast.warning('🔔 ¡Recordatorio de Medicamento!', {
              description: `Es hora de tomar ${medication.name} (${medication.dosage})`,
              duration: 10000,
            });

            console.log(
              `🔔 Notificación enviada: ${medication.name} a las ${time}`
            );
          }
        });
      });
    };

    // Verificar inmediatamente
    checkMedications();

    // Verificar cada 30 segundos para mayor precisión
    const interval = setInterval(checkMedications, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [medications, enabled, onMedicationDue]);

  // Limpiar notificaciones antiguas cada día
  useEffect(() => {
    const cleanOldNotifications = () => {
      const today = new Date().toDateString();
      const keysToRemove: string[] = [];

      notifiedMedicationsRef.current.forEach((key) => {
        if (!key.includes(today)) {
          keysToRemove.push(key);
        }
      });

      keysToRemove.forEach((key) => {
        notifiedMedicationsRef.current.delete(key);
      });
    };

    // Limpiar al medianoche
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    const midnightTimeout = setTimeout(() => {
      cleanOldNotifications();
      // Configurar limpieza diaria
      setInterval(cleanOldNotifications, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);

    return () => {
      clearTimeout(midnightTimeout);
    };
  }, []);
}
