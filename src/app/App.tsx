import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { MedicationReminders } from './components/MedicationReminders';
import { HealthMonitoring } from './components/HealthMonitoring';
import { FamilyNetwork } from './components/FamilyNetwork';
import { FamilyChat } from './components/FamilyChat';
import { MedicationAlert } from './components/MedicationAlert';
import { UserProfile } from './components/UserProfile';
import { FamilyProfile } from './components/FamilyProfile';
import { EmergencyButton } from './components/EmergencyButton';
import { EmergencyAlert } from './components/EmergencyAlert';
import { AccessibilityControls } from './components/AccessibilityControls';
import { VoiceCommandsSystem } from './components/VoiceCommandsSystem';
import { BrowserNotificationService, useMedicationNotifications } from './components/NotificationService';
import { NotificationPermissionPrompt } from './components/NotificationPermissionPrompt';
import { Toaster } from './components/ui/sonner';
import { toast } from "sonner";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showWelcome, setShowWelcome] = useState(true);
  const [medicationAlert, setMedicationAlert] = useState(null);
  const [takenMedications, setTakenMedications] = useState(new Set());
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('es-MX');
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    voiceEnabled: true,
    highContrast: false,
    largeText: true,
    simplifiedMode: false,
    autoRead: true,
    language: 'es-MX'
  });

  // Sistema de medicamentos con horarios reales
  const createTodaySchedule = () => {
    const today = new Date();
    const medications = [
      {
        id: 1,
        name: 'Metformina',
        dosage: '500mg',
        time: '08:00',
        color: 'blue',
        description: 'Para control de glucosa en sangre',
        instructions: 'Tomar con alimentos. No saltar dosis.',
        frequency: 'daily'
      },
      {
        id: 2,
        name: 'Lisinopril',
        dosage: '10mg',
        time: '12:00',
        color: 'red',
        description: 'Para controlar la presión arterial',
        instructions: 'Tomar a la misma hora cada día.',
        frequency: 'daily'
      },
      {
        id: 3,
        name: 'Aspirina',
        dosage: '81mg',
        time: '20:00',
        color: 'white',
        description: 'Anticoagulante para prevención cardiovascular',
        instructions: 'Tomar después de cenar.',
        frequency: 'daily'
      }
    ];

    return medications.map(med => {
      const [hours, minutes] = med.time.split(':').map(Number);
      const scheduledFor = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
      
      return {
        ...med,
        scheduledFor,
        takenToday: takenMedications.has(`${med.id}-${today.toDateString()}`)
      };
    });
  };

  const [scheduledMedications, setScheduledMedications] = useState(createTodaySchedule);

  // Sistema de notificaciones inteligentes sincronizadas
  useMedicationNotifications(
    scheduledMedications,
    (medication) => {
      // Cuando es hora de un medicamento, mostrar la alerta
      setMedicationAlert(medication);
      
      // Reproducir sonido adicional
      BrowserNotificationService.playNotificationSound();
    },
    !!currentUser // Solo activar cuando hay usuario logueado
  );

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    
    // Mostrar prompt de notificaciones después del login
    setTimeout(() => {
      // Solo mostrar si no se han configurado las notificaciones antes
      if (Notification.permission === 'default') {
        setShowNotificationPrompt(true);
      } else if (Notification.permission === 'granted') {
        toast.success('🔔 Notificaciones Activas', {
          description: 'Recibirás alertas de tus medicamentos',
          duration: 3000,
        });
      }
    }, 1500);
  };

  const handleAcceptNotifications = async () => {
    setShowNotificationPrompt(false);
    const hasPermission = await BrowserNotificationService.requestPermission();
    
    if (hasPermission) {
      toast.success('🔔 ¡Notificaciones Activadas!', {
        description: 'Te avisaremos cuando sea hora de tomar tus medicamentos',
        duration: 5000,
      });
      
      // Mostrar una notificación de prueba
      setTimeout(() => {
        BrowserNotificationService.show(
          '✅ Notificaciones Configuradas',
          {
            body: 'Recibirás alertas como esta cuando sea hora de tomar tus medicamentos',
            icon: '/favicon.ico',
          }
        );
      }, 1000);
    } else {
      toast.info('📱 Recordatorios en la App', {
        description: 'Los recordatorios se mostrarán dentro de VitaLink',
        duration: 4000,
      });
    }
  };

  const handleDeclineNotifications = () => {
    setShowNotificationPrompt(false);
    toast.info('📱 Recordatorios en la App', {
      description: 'Los recordatorios se mostrarán dentro de VitaLink. Puedes activar las notificaciones más tarde.',
      duration: 5000,
    });
  };

  const handleLogout = () => {
    // Limpiar todos los estados
    setCurrentUser(null);
    setCurrentView('dashboard');
    setShowWelcome(false); // Ir directamente al login, no a welcome
    setMedicationAlert(null);
    setTakenMedications(new Set());
    setShowEmergencyAlert(false);
    
    toast.success('👋 Sesión Cerrada Exitosamente', {
      description: 'Regresando a la pantalla de inicio de sesión...',
      duration: 3000,
    });
  };

  const handleEmergency = () => {
    setShowEmergencyAlert(true);
    
    toast.error('🚨 EMERGENCIA ACTIVADA', {
      description: 'Preparando alertas de emergencia...',
      duration: 3000,
    });
  };

  const handleVoiceAction = (action: string, params?: any) => {
    switch (action) {
      case 'logout':
        handleLogout();
        break;
      case 'emergency':
        handleEmergency();
        break;
      case 'back':
        setCurrentView('dashboard');
        break;
      case 'close':
        // Cerrar modales si están abiertos
        setMedicationAlert(null);
        setShowEmergencyAlert(false);
        break;
      case 'menu':
        // Abrir navegación (esto se puede expandir)
        break;
      case 'accessibility':
        // El botón de accesibilidad ya es visible
        toast.info('🔮 Mira el botón morado en la esquina superior derecha', {
          duration: 3000,
        });
        break;
      default:
        break;
    }
  };

  // Sincronizar idioma con accesibilidad
  useEffect(() => {
    if (accessibilitySettings.language) {
      setCurrentLanguage(accessibilitySettings.language);
    }
  }, [accessibilitySettings]);

  const handleCloseEmergency = () => {
    setShowEmergencyAlert(false);
  };

  const handleContinueFromWelcome = () => {
    setShowWelcome(false);
  };

  // Actualizar el estado de los medicamentos periódicamente
  useEffect(() => {
    if (!currentUser) return;

    const updateMedicationStatus = () => {
      const updatedSchedule = createTodaySchedule();
      setScheduledMedications(updatedSchedule);
    };

    // Actualizar cada minuto
    const interval = setInterval(updateMedicationStatus, 60000);
    updateMedicationStatus(); // Actualizar inmediatamente
    
    return () => clearInterval(interval);
  }, [currentUser, takenMedications]);

  const handleMedicationTaken = () => {
    if (medicationAlert) {
      const today = new Date();
      const medicationKey = `${medicationAlert.id}-${today.toDateString()}`;
      
      // Marcar como tomado para hoy
      setTakenMedications(prev => new Set([...prev, medicationKey]));
      
      toast.success(`¡Excelente! Has tomado ${medicationAlert.name}`, {
        description: 'Medicamento registrado correctamente',
        duration: 4000,
      });
      
      // Notificar a la familia (simulación)
      setTimeout(() => {
        toast.info('📱 Familia notificada', {
          description: 'Tus familiares han sido notificados que tomaste tu medicamento',
          duration: 3000,
        });
      }, 1000);
    }
    setMedicationAlert(null);
  };

  const handleMedicationSnoozed = () => {
    if (medicationAlert) {
      toast.warning('⏰ Recordatorio pospuesto', {
        description: 'Te recordaremos nuevamente en 5 minutos',
        duration: 3000,
      });
      
      // Programar nueva alerta en 5 minutos reales
      setTimeout(() => {
        setMedicationAlert(medicationAlert);
      }, 5 * 60 * 1000); // 5 minutos reales
    }
    setMedicationAlert(null);
  };

  const handleMedicationDismissed = () => {
    if (medicationAlert) {
      toast.error('❌ Recordatorio descartado', {
        description: 'Recuerda tomar tu medicamento cuando puedas',
        duration: 3000,
      });
    }
    setMedicationAlert(null);
  };

  // Mostrar pantalla de bienvenida al inicio
  if (showWelcome) {
    return <WelcomeScreen onContinue={handleContinueFromWelcome} />;
  }

  // Mostrar formulario de login si no hay usuario autenticado
  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={currentUser} onNavigate={setCurrentView} onShowMedicationAlert={setMedicationAlert} onLogout={handleLogout} />;
      case 'medications':
        return <MedicationReminders user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} />;
      case 'health':
        return <HealthMonitoring user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} />;
      case 'family':
        return <FamilyNetwork user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} />;
      case 'chat':
        return <FamilyChat user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} />;
      case 'profile':
        return <UserProfile user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} />;
      case 'family-profile':
        return <FamilyProfile user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} />;
      default:
        return <Dashboard user={currentUser} onNavigate={setCurrentView} onShowMedicationAlert={setMedicationAlert} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {renderCurrentView()}
      
      {/* Controles de accesibilidad (siempre visibles) */}
      <AccessibilityControls onSettingsChange={setAccessibilitySettings} />
      
      {/* Sistema de comandos de voz (solo cuando hay usuario logueado) */}
      {currentUser && (
        <VoiceCommandsSystem 
          onNavigate={setCurrentView}
          onAction={handleVoiceAction}
          currentLanguage={currentLanguage}
        />
      )}
      
      {/* Botón de emergencia flotante (solo cuando hay usuario logueado) */}
      {currentUser && <EmergencyButton onEmergency={handleEmergency} />}
      
      {/* Alerta de medicamento (overlay) */}
      {medicationAlert && (
        <MedicationAlert
          medication={medicationAlert}
          onTaken={handleMedicationTaken}
          onSnooze={handleMedicationSnoozed}
          onDismiss={handleMedicationDismissed}
        />
      )}
      
      {/* Alerta de emergencia (overlay) */}
      {showEmergencyAlert && (
        <EmergencyAlert
          user={currentUser}
          onClose={handleCloseEmergency}
        />
      )}
      
      {/* Prompt de permisos de notificación */}
      {showNotificationPrompt && (
        <NotificationPermissionPrompt
          onAccept={handleAcceptNotifications}
          onDecline={handleDeclineNotifications}
        />
      )}
      
      <Toaster />
    </div>
  );
}