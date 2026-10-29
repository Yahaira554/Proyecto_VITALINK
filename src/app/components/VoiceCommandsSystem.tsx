import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  CheckCircle2,
  Radio,
  Waves,
  X,
  Command
} from 'lucide-react';
import { toast } from 'sonner';

interface VoiceCommandsSystemProps {
  onNavigate: (view: string) => void;
  onAction?: (action: string, params?: any) => void;
  currentLanguage?: string;
}

export function VoiceCommandsSystem({ onNavigate, onAction, currentLanguage = 'es-MX' }: VoiceCommandsSystemProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Comandos disponibles en español
  const commandsES = {
    navigation: {
      'inicio': 'dashboard',
      'ir a inicio': 'dashboard',
      'panel principal': 'dashboard',
      'medicamentos': 'medications',
      'ir a medicamentos': 'medications',
      'mis medicinas': 'medications',
      'salud': 'health',
      'ir a salud': 'health',
      'mis datos de salud': 'health',
      'familia': 'family',
      'ir a familia': 'family',
      'red familiar': 'family',
      'chat': 'chat',
      'ir a chat': 'chat',
      'mensajes': 'chat',
      'perfil': 'profile',
      'mi perfil': 'profile',
    },
    actions: {
      'emergencia': 'emergency',
      'ayuda': 'emergency',
      'socorro': 'emergency',
      'llamar emergencia': 'emergency',
      'atrás': 'back',
      'regresar': 'back',
      'volver': 'back',
      'cerrar': 'close',
      'salir': 'close',
      'cerrar sesión': 'logout',
      'salir de la aplicación': 'logout',
      'terminar sesión': 'logout',
      'menú': 'menu',
      'abrir menú': 'menu',
      'accesibilidad': 'accessibility',
      'opciones': 'accessibility',
      'ayuda de voz': 'show-help',
      'qué puedo decir': 'show-help',
      'comandos': 'show-help',
    }
  };

  // Comandos en Wixárika (Huichol)
  const commandsWixarika = {
    navigation: {
      'temuki': 'dashboard', // inicio
      'hapuene': 'medications', // medicamentos
      'nierika': 'health', // salud
      'yukali': 'family', // familia
      'neixa': 'chat', // conversación
    },
    actions: {
      'nakawe': 'emergency', // emergencia
      'tupari': 'back', // regresar
      'teteima': 'close', // cerrar
    }
  };

  // Inicializar reconocimiento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      // Siempre usar español mexicano para reconocimiento (las lenguas indígenas no tienen soporte nativo)
      recognitionInstance.lang = 'es-MX';
      recognitionInstance.maxAlternatives = 3;

      recognitionInstance.onstart = () => {
        setIsListening(true);
        speak('Escuchando tus comandos', currentLanguage);
      };

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript.toLowerCase().trim();
        setTranscript(transcriptText);

        if (event.results[current].isFinal) {
          processCommand(transcriptText);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          toast.error('Micrófono bloqueado', {
            description: 'Por favor permite el acceso al micrófono en la configuración del navegador',
            duration: 5000,
          });
          setIsActive(false);
        } else if (event.error === 'no-speech') {
          // No hacer nada, es normal que no haya voz a veces
        } else if (event.error !== 'aborted') {
          console.warn('Error de reconocimiento de voz:', event.error);
          toast.warning('Error temporal de voz', {
            description: 'Intentando reconectar...',
            duration: 2000,
          });
        }
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        if (isActive) {
          // Reiniciar automáticamente si está activo
          setTimeout(() => {
            if (isActive) {
              try {
                recognitionInstance.start();
              } catch (e) {
                console.error('Error al reiniciar reconocimiento:', e);
              }
            }
          }, 100);
        }
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
      toast.warning('Comandos de voz no disponibles', {
        description: 'Tu navegador no soporta reconocimiento de voz',
      });
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [currentLanguage]);

  const processCommand = (text: string) => {
    const lowercaseText = text.toLowerCase().trim();
    
    // Buscar comando de navegación
    const navCommand = Object.entries(commandsES.navigation).find(
      ([key]) => lowercaseText.includes(key)
    );

    if (navCommand) {
      const [commandText, view] = navCommand;
      setLastCommand(commandText);
      speak(`Abriendo ${commandText}`, currentLanguage);
      onNavigate(view);
      toast.success(`✓ ${commandText}`, {
        description: 'Comando ejecutado',
        duration: 2000,
      });
      return;
    }

    // Buscar comando de acción
    const actionCommand = Object.entries(commandsES.actions).find(
      ([key]) => lowercaseText.includes(key)
    );

    if (actionCommand) {
      const [commandText, action] = actionCommand;
      setLastCommand(commandText);
      
      if (action === 'show-help') {
        setShowPanel(true);
        speak('Mostrando comandos disponibles', currentLanguage);
      } else if (action === 'logout') {
        speak('Cerrando sesión. Hasta pronto', currentLanguage);
        if (onAction) onAction('logout');
      } else if (action === 'emergency') {
        speak('Activando emergencia', currentLanguage);
        if (onAction) onAction('emergency');
      } else if (action === 'back') {
        speak('Regresando', currentLanguage);
        if (onAction) onAction('back');
      } else if (action === 'close') {
        speak('Cerrando', currentLanguage);
        if (onAction) onAction('close');
      } else if (action === 'menu') {
        speak('Abriendo menú', currentLanguage);
        if (onAction) onAction('menu');
      } else if (action === 'accessibility') {
        speak('Abriendo opciones de accesibilidad', currentLanguage);
        if (onAction) onAction('accessibility');
      }
      
      toast.success(`✓ ${commandText}`, {
        description: 'Comando ejecutado',
        duration: 2000,
      });
      return;
    }

    // Si no se encontró comando
    if (lowercaseText.length > 3) {
      speak('No entendí ese comando. Di "ayuda de voz" para ver los comandos disponibles', currentLanguage);
      toast.warning('Comando no reconocido', {
        description: 'Di "ayuda de voz" para ver los comandos',
        duration: 3000,
      });
    }
  };

  const speak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        setIsActive(true);
        recognition.start();
        toast.success('🎤 Comandos de Voz Activos', {
          description: 'Di "ayuda de voz" para ver comandos disponibles',
          duration: 4000,
        });
      } catch (e) {
        console.error('Error al iniciar reconocimiento:', e);
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      setIsActive(false);
      recognition.stop();
      setIsListening(false);
      setTranscript('');
      toast.info('Comandos de voz desactivados', {
        duration: 2000,
      });
      speak('Comandos de voz desactivados', currentLanguage);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Botón flotante de comandos de voz - Optimizado para móvil */}
      <div className="fixed bottom-24 md:bottom-28 left-4 md:left-auto md:right-6 z-40 flex flex-col items-start md:items-end space-y-2">
        {isActive && (
          <Button
            onClick={() => setShowPanel(!showPanel)}
            variant="outline"
            size="sm"
            className="bg-white shadow-lg border-2 border-blue-500 text-xs md:text-sm"
          >
            <Command className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Comandos
          </Button>
        )}
        
        <Button
          onClick={isActive ? stopListening : startListening}
          className={`
            w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl border-4 border-white
            ${isActive 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
            }
          `}
          aria-label={isActive ? "Desactivar comandos de voz" : "Activar comandos de voz"}
        >
          {isActive ? (
            <MicOff className="h-6 w-6 md:h-7 md:w-7 text-white" />
          ) : (
            <Mic className="h-6 w-6 md:h-7 md:w-7 text-white" />
          )}
        </Button>

        {/* Indicador de escucha */}
        {isListening && (
          <Badge className="bg-red-500 text-white animate-pulse text-xs">
            <Radio className="h-3 w-3 mr-1" />
            Escuchando...
          </Badge>
        )}
      </div>

      {/* Transcripción en tiempo real - Optimizado para móvil */}
      {isListening && transcript && (
        <div className="fixed bottom-44 md:bottom-48 left-4 right-4 md:left-auto md:right-6 z-40">
          <Card className="border-2 border-blue-500 shadow-xl">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Waves className="h-4 w-4 text-blue-600 animate-pulse" />
                <span className="text-xs md:text-sm text-gray-600">Escuchando:</span>
              </div>
              <p className="font-medium text-blue-900 text-sm md:text-base">{transcript}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Panel de ayuda de comandos */}
      {showPanel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-3xl border-4 border-blue-600 shadow-2xl max-h-[90vh] overflow-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Mic className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl">Comandos de Voz</h2>
                    <p className="text-gray-600">Qué puedes decir</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPanel(false)}
                  className="h-12 w-12"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Navegación */}
                <div>
                  <h3 className="text-xl mb-3 text-blue-900 flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Para Navegar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.keys(commandsES.navigation).map((cmd, idx) => (
                      <Badge key={idx} variant="outline" className="justify-start text-base py-2 px-4">
                        <Volume2 className="h-4 w-4 mr-2 text-blue-600" />
                        "{cmd}"
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div>
                  <h3 className="text-xl mb-3 text-green-900 flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Para Acciones
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.keys(commandsES.actions).map((cmd, idx) => (
                      <Badge key={idx} variant="outline" className="justify-start text-base py-2 px-4">
                        <Volume2 className="h-4 w-4 mr-2 text-green-600" />
                        "{cmd}"
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Comandos en Wixárika */}
                {currentLanguage.includes('wix') && (
                  <div>
                    <h3 className="text-xl mb-3 text-purple-900 flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Comandos en Wixárika
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries({...commandsWixarika.navigation, ...commandsWixarika.actions}).map(([cmd, action], idx) => (
                        <Badge key={idx} variant="outline" className="justify-start text-base py-2 px-4">
                          <Volume2 className="h-4 w-4 mr-2 text-purple-600" />
                          "{cmd}"
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <p className="text-sm text-blue-900">
                    💡 <strong>Consejo:</strong> Habla claro y despacio. Los comandos funcionan mejor en lugares silenciosos.
                  </p>
                </div>

                {lastCommand && (
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <p className="text-sm text-green-900">
                      ✓ <strong>Último comando:</strong> "{lastCommand}"
                    </p>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setShowPanel(false)}
                className="w-full mt-6 h-14 bg-blue-600 hover:bg-blue-700 text-lg"
              >
                Cerrar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
