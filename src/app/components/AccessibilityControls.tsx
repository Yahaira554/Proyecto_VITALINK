import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LanguageSelector } from './LanguageSelector';
import { 
  Volume2, 
  Eye, 
  Type, 
  Settings,
  VolumeX,
  Maximize,
  X,
  Check,
  Mic,
  Languages,
  Gauge
} from 'lucide-react';
import { toast } from 'sonner';
import { t, LanguageCode } from './TranslationService';

export function AccessibilityControls({ onSettingsChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('es-MX');
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    highContrast: false,
    largeText: true,
    simplifiedMode: false,
    autoRead: true,
    voiceSpeed: 0.85,
    voiceVolume: 1.0
  });

  // Aplicar configuraciones al body
  useEffect(() => {
    const body = document.body;
    
    // Alto contraste
    if (settings.highContrast) {
      body.classList.add('high-contrast-mode');
    } else {
      body.classList.remove('high-contrast-mode');
    }
    
    // Texto grande
    if (settings.largeText) {
      body.classList.add('large-text-mode');
    } else {
      body.classList.remove('large-text-mode');
    }
    
    // Modo simplificado
    if (settings.simplifiedMode) {
      body.classList.add('simplified-mode');
    } else {
      body.classList.remove('simplified-mode');
    }
    
    // Notificar cambios al componente padre
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
  }, [settings, onSettingsChange]);

  const toggleSetting = (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };
    setSettings(newSettings);
    
    // Feedback de voz
    const messages = {
      voiceEnabled: !settings.voiceEnabled ? 'Voz activada' : 'Voz desactivada',
      highContrast: !settings.highContrast ? 'Modo de alto contraste activado' : 'Modo normal activado',
      largeText: !settings.largeText ? 'Texto grande activado' : 'Texto normal activado',
      simplifiedMode: !settings.simplifiedMode ? 'Modo simplificado activado' : 'Modo completo activado',
      autoRead: !settings.autoRead ? 'Lectura automática activada' : 'Lectura automática desactivada'
    };
    
    speak(messages[key]);
    
    toast.success(messages[key], {
      duration: 3000,
    });
  };

  const speak = (text, overrideLang?: string) => {
    if (settings.voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = overrideLang || currentLanguage;
      utterance.rate = settings.voiceSpeed;
      utterance.pitch = 1;
      utterance.volume = settings.voiceVolume;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage as LanguageCode);
    localStorage.setItem('vitalink-language', newLanguage);
    
    if (onSettingsChange) {
      onSettingsChange({
        ...settings,
        language: newLanguage
      });
    }
  };

  const handleSpeedChange = (speed: number) => {
    const newSettings = {
      ...settings,
      voiceSpeed: speed
    };
    setSettings(newSettings);
    
    const speedNames: Record<number, string> = {
      0.7: 'muy lenta',
      0.85: 'lenta',
      1.0: 'normal',
      1.2: 'rápida'
    };
    
    speak(`Velocidad de voz ${speedNames[speed] || 'ajustada'}`);
    toast.success(`Velocidad: ${speedNames[speed] || speed}`, {
      duration: 2000,
    });
  };

  const handleVolumeChange = (volume: number) => {
    const newSettings = {
      ...settings,
      voiceVolume: volume
    };
    setSettings(newSettings);
  };

  // Cargar idioma guardado al iniciar
  useEffect(() => {
    const savedLanguage = localStorage.getItem('vitalink-language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage as LanguageCode);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    speak('Menú de accesibilidad abierto');
  };

  const handleClose = () => {
    setIsOpen(false);
    speak('Menú de accesibilidad cerrado');
  };

  return (
    <>
      {/* Botón flotante de accesibilidad - Optimizado para móvil */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-40">
        <Button
          onClick={handleOpen}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-purple-600 hover:bg-purple-700 shadow-2xl border-4 border-white"
          aria-label="Opciones de accesibilidad"
        >
          <Eye className="h-6 w-6 md:h-7 md:w-7 text-white" />
        </Button>
      </div>

      {/* Panel de controles */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl border-4 border-purple-600 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl">Accesibilidad</h2>
                    <p className="text-gray-600">Personaliza tu experiencia</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-12 w-12"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Selector de idioma */}
                <div className="p-6 rounded-xl border-4 border-blue-300 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Languages className="h-8 w-8 text-blue-600" />
                      <div className="text-left">
                        <p className="text-xl font-medium">Idioma / Language</p>
                        <p className="text-sm text-gray-600">
                          Elige tu lengua preferida
                        </p>
                      </div>
                    </div>
                    <LanguageSelector 
                      currentLanguage={currentLanguage}
                      onLanguageChange={handleLanguageChange}
                    />
                  </div>
                </div>

                {/* Comandos de voz */}
                <div className="p-6 rounded-xl border-4 border-green-300 bg-green-50">
                  <div className="flex items-center space-x-4">
                    <Mic className="h-8 w-8 text-green-600" />
                    <div className="text-left flex-1">
                      <p className="text-xl font-medium">Comandos de Voz</p>
                      <p className="text-sm text-gray-600">
                        Controla la app con tu voz (activar en botón azul flotante)
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-white rounded-lg border-2 border-green-200">
                    <p className="text-sm text-green-900">
                      💡 Di "ir a medicamentos", "emergencia", "ayuda de voz" y más
                    </p>
                  </div>
                </div>

                {/* Velocidad de voz */}
                <div className="p-6 rounded-xl border-4 border-purple-300 bg-purple-50">
                  <div className="flex items-center space-x-4 mb-4">
                    <Gauge className="h-8 w-8 text-purple-600" />
                    <div className="text-left">
                      <p className="text-xl font-medium">Velocidad de Voz</p>
                      <p className="text-sm text-gray-600">
                        Ajusta qué tan rápido habla la app
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 0.7, label: 'Muy Lenta' },
                      { value: 0.85, label: 'Lenta' },
                      { value: 1.0, label: 'Normal' },
                      { value: 1.2, label: 'Rápida' }
                    ].map((speed) => (
                      <Button
                        key={speed.value}
                        onClick={() => handleSpeedChange(speed.value)}
                        variant={settings.voiceSpeed === speed.value ? 'default' : 'outline'}
                        className={settings.voiceSpeed === speed.value ? 'bg-purple-600' : ''}
                        size="sm"
                      >
                        {speed.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Voz */}
                <button
                  onClick={() => toggleSetting('voiceEnabled')}
                  className={`
                    w-full p-6 rounded-xl border-4 transition-all
                    ${settings.voiceEnabled 
                      ? 'bg-purple-50 border-purple-600' 
                      : 'bg-gray-50 border-gray-300'
                    }
                    hover:shadow-lg
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {settings.voiceEnabled ? (
                        <Volume2 className="h-8 w-8 text-purple-600" />
                      ) : (
                        <VolumeX className="h-8 w-8 text-gray-600" />
                      )}
                      <div className="text-left">
                        <p className="text-xl font-medium">Lectura por Voz</p>
                        <p className="text-sm text-gray-600">
                          La aplicación te leerá los textos en voz alta
                        </p>
                      </div>
                    </div>
                    {settings.voiceEnabled && (
                      <Check className="h-8 w-8 text-purple-600" />
                    )}
                  </div>
                </button>

                {/* Alto contraste */}
                <button
                  onClick={() => toggleSetting('highContrast')}
                  className={`
                    w-full p-6 rounded-xl border-4 transition-all
                    ${settings.highContrast 
                      ? 'bg-purple-50 border-purple-600' 
                      : 'bg-gray-50 border-gray-300'
                    }
                    hover:shadow-lg
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Eye className="h-8 w-8 text-purple-600" />
                      <div className="text-left">
                        <p className="text-xl font-medium">Alto Contraste</p>
                        <p className="text-sm text-gray-600">
                          Colores más fuertes para ver mejor
                        </p>
                      </div>
                    </div>
                    {settings.highContrast && (
                      <Check className="h-8 w-8 text-purple-600" />
                    )}
                  </div>
                </button>

                {/* Texto grande */}
                <button
                  onClick={() => toggleSetting('largeText')}
                  className={`
                    w-full p-6 rounded-xl border-4 transition-all
                    ${settings.largeText 
                      ? 'bg-purple-50 border-purple-600' 
                      : 'bg-gray-50 border-gray-300'
                    }
                    hover:shadow-lg
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Type className="h-8 w-8 text-purple-600" />
                      <div className="text-left">
                        <p className="text-xl font-medium">Texto Muy Grande</p>
                        <p className="text-sm text-gray-600">
                          Letras extra grandes para leer fácil
                        </p>
                      </div>
                    </div>
                    {settings.largeText && (
                      <Check className="h-8 w-8 text-purple-600" />
                    )}
                  </div>
                </button>

                {/* Modo simplificado */}
                <button
                  onClick={() => toggleSetting('simplifiedMode')}
                  className={`
                    w-full p-6 rounded-xl border-4 transition-all
                    ${settings.simplifiedMode 
                      ? 'bg-purple-50 border-purple-600' 
                      : 'bg-gray-50 border-gray-300'
                    }
                    hover:shadow-lg
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Maximize className="h-8 w-8 text-purple-600" />
                      <div className="text-left">
                        <p className="text-xl font-medium">Modo Simplificado</p>
                        <p className="text-sm text-gray-600">
                          Botones más grandes y menos opciones
                        </p>
                      </div>
                    </div>
                    {settings.simplifiedMode && (
                      <Check className="h-8 w-8 text-purple-600" />
                    )}
                  </div>
                </button>

                {/* Lectura automática */}
                <button
                  onClick={() => toggleSetting('autoRead')}
                  className={`
                    w-full p-6 rounded-xl border-4 transition-all
                    ${settings.autoRead 
                      ? 'bg-purple-50 border-purple-600' 
                      : 'bg-gray-50 border-gray-300'
                    }
                    hover:shadow-lg
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Volume2 className="h-8 w-8 text-purple-600" />
                      <div className="text-left">
                        <p className="text-xl font-medium">Lectura Automática</p>
                        <p className="text-sm text-gray-600">
                          Lee automáticamente al abrir pantallas
                        </p>
                      </div>
                    </div>
                    {settings.autoRead && (
                      <Check className="h-8 w-8 text-purple-600" />
                    )}
                  </div>
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <p className="text-sm text-blue-900 text-center">
                    💡 Estas opciones te ayudarán a usar VitaLink más fácilmente
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <p className="text-sm text-green-900 text-center">
                    🎤 <strong>Nuevo:</strong> Ahora puedes controlar VitaLink con tu voz. Mira el botón azul flotante.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <p className="text-sm text-purple-900 text-center">
                    🏔️ <strong>Lenguas Indígenas:</strong> VitaLink ahora habla Wixárika, Náhuatl y P'urhépecha
                  </p>
                </div>
              </div>

              <Button
                onClick={handleClose}
                className="w-full mt-6 h-16 bg-purple-600 hover:bg-purple-700 text-lg"
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

// Hook para usar la voz en otros componentes
export function useVoice() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('es-MX');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('vitalink-language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage as LanguageCode);
    }
  }, []);

  const speak = (text, options = {}) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || currentLanguage;
      utterance.rate = options.rate || 0.85;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return { speak, stop, currentLanguage };
}
