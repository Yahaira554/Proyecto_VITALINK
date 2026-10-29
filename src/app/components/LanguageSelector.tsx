import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Languages, 
  Globe, 
  Check,
  X,
  Volume2,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  flag: string;
  description: string;
  voiceCode: string;
}

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (languageCode: string) => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const languages: Language[] = [
    {
      code: 'es-MX',
      name: 'Español',
      nativeName: 'Español (México)',
      region: 'Nacional',
      flag: '🇲🇽',
      description: 'Idioma principal',
      voiceCode: 'es-MX'
    },
    {
      code: 'wix',
      name: 'Wixárika',
      nativeName: 'Wixárika',
      region: 'Jalisco (Norte)',
      flag: '🏔️',
      description: 'Lengua huichol del norte de Jalisco',
      voiceCode: 'es-MX' // Fallback a español para síntesis de voz
    },
    {
      code: 'nah',
      name: 'Náhuatl',
      nativeName: 'Nāhuatl',
      region: 'Jalisco (Sur)',
      flag: '🌄',
      description: 'Lengua náhuatl del sur de Jalisco',
      voiceCode: 'es-MX'
    },
    {
      code: 'pur',
      name: 'Purépecha',
      nativeName: "P'urhépecha",
      region: 'Región Occidental',
      flag: '🌺',
      description: 'Lengua purépecha de comunidades de Jalisco',
      voiceCode: 'es-MX'
    },
    {
      code: 'en-US',
      name: 'English',
      nativeName: 'English (US)',
      region: 'Internacional',
      flag: '🇺🇸',
      description: 'For international users',
      voiceCode: 'en-US'
    }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language.code);
    setIsOpen(false);
    
    // Feedback en el nuevo idioma
    const messages: Record<string, string> = {
      'es-MX': 'Idioma cambiado a Español',
      'wix': 'Iwi keniuki Wixárika (Idioma cambiado a Wixárika)',
      'nah': 'Tlahtolli mopatla Nāhuatl (Idioma cambiado a Náhuatl)',
      'pur': 'Kuinchekua jimboka Purhépecha (Idioma cambiado a Purépecha)',
      'en-US': 'Language changed to English'
    };

    toast.success(`${language.flag} ${language.nativeName}`, {
      description: messages[language.code],
      duration: 4000,
    });

    // Síntesis de voz
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(messages[language.code]);
      utterance.lang = language.voiceCode;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Selector de idioma abierto. Elige tu lengua preferida.');
      utterance.lang = 'es-MX';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Botón compacto de idioma actual */}
      <Button
        onClick={handleOpen}
        variant="outline"
        className="flex items-center space-x-2 border-2 hover:border-blue-500 transition-all"
      >
        <Globe className="h-5 w-5" />
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden md:inline">{currentLang.name}</span>
      </Button>

      {/* Panel selector de idiomas */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-3xl border-4 border-blue-600 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Languages className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl">Selecciona tu Idioma</h2>
                    <p className="text-gray-600">Choose your language / Kenia iwi</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-12 w-12"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="space-y-3">
                {languages.map((language) => {
                  const isSelected = currentLanguage === language.code;
                  
                  return (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language)}
                      className={`
                        w-full p-5 rounded-xl border-4 transition-all
                        ${isSelected 
                          ? 'bg-blue-50 border-blue-600 shadow-lg scale-105' 
                          : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-4xl">{language.flag}</div>
                          <div className="text-left">
                            <div className="flex items-center space-x-2">
                              <p className="text-xl font-medium">{language.nativeName}</p>
                              {language.name !== language.nativeName && (
                                <Badge variant="outline" className="text-xs">
                                  {language.name}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="h-3 w-3 text-gray-500" />
                              <p className="text-sm text-gray-600">{language.region}</p>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{language.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div
                            role="button"
                            tabIndex={0}
                            className="inline-flex items-center justify-center rounded-md px-3 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if ('speechSynthesis' in window) {
                                const sampleTexts: Record<string, string> = {
                                  'es-MX': 'Bienvenido a VitaLink, tu asistente de salud personal',
                                  'wix': 'Ma kai VitaLink, neiyari tsikari nierika',
                                  'nah': 'Ximopanolti VitaLink, mo tlaneltoconi pamitl',
                                  'pur': 'Iamendu VitaLink, jima jurámukua tsimaneni',
                                  'en-US': 'Welcome to VitaLink, your personal health assistant'
                                };
                                
                                const utterance = new SpeechSynthesisUtterance(sampleTexts[language.code]);
                                utterance.lang = language.voiceCode;
                                utterance.rate = 0.9;
                                window.speechSynthesis.speak(utterance);
                                
                                toast.info(`🔊 Ejemplo de ${language.name}`, {
                                  duration: 3000,
                                });
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.click();
                              }
                            }}
                          >
                            <Volume2 className="h-4 w-4" />
                          </div>
                          
                          {isSelected && (
                            <Check className="h-8 w-8 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3">
                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <p className="text-sm text-purple-900">
                    🏔️ <strong>Lenguas Indígenas de Jalisco:</strong> VitaLink respeta y promueve las lenguas originarias de nuestras comunidades. La traducción incluye términos médicos adaptados culturalmente.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <p className="text-sm text-blue-900">
                    💡 <strong>Nota:</strong> La síntesis de voz para lenguas indígenas usa pronunciación en español. Estamos trabajando para mejorar esto.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 h-14 bg-blue-600 hover:bg-blue-700 text-lg"
              >
                {currentLanguage === 'es-MX' ? 'Cerrar' : 
                 currentLanguage === 'wix' ? "Tepu'uka" :
                 currentLanguage === 'nah' ? 'Tzacua' :
                 currentLanguage === 'pur' ? 'Amberakua' :
                 'Close'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
