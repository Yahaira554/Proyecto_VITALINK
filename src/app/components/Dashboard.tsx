import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Navigation } from './Navigation';
import { VoiceButton } from './VoiceButton';
import { NotificationStatusCard } from './NotificationStatusCard';
import { useVoice } from './AccessibilityControls';
import { t, LanguageCode } from './TranslationService';
import { 
  Pill, 
  Heart, 
  Users, 
  MessageCircle, 
  Calendar, 
  AlertTriangle,
  Clock,
  TrendingUp,
  Bell,
  Plus,
  Mic,
  Languages,
  Sparkles
} from 'lucide-react';

export function Dashboard({ user, onNavigate, onShowMedicationAlert, onLogout }) {
  const { speak, currentLanguage } = useVoice();
  const [language, setLanguage] = useState<LanguageCode>('es-MX');

  // Sincronizar idioma con localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('vitalink-language');
    if (savedLanguage) {
      setLanguage(savedLanguage as LanguageCode);
    }
  }, [currentLanguage]);

  // Leer mensaje de bienvenida al cargar
  useEffect(() => {
    const greetingTexts: Record<LanguageCode, string> = {
      'es-MX': `${t('welcome', language)} ${user.name}. Aquí está tu resumen de ${t('health', language)} de hoy.`,
      'wix': `${t('welcome', 'wix')} ${user.name}. VitaLink nierika yuawi.`,
      'nah': `${t('welcome', 'nah')} ${user.name}. Axcan mo ${t('health', 'nah')}.`,
      'pur': `${t('welcome', 'pur')} ${user.name}. Antuiksï ${t('health', 'pur')}.`,
      'en-US': `${t('welcome', 'en-US')} ${user.name}. Here is your ${t('health', 'en-US')} summary for today.`
    };
    
    const welcomeMessage = greetingTexts[language] || greetingTexts['es-MX'];
    const timer = setTimeout(() => {
      speak(welcomeMessage);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [language]);

  const upcomingMedications = [
    { id: 1, name: 'Metformina', time: '08:00', color: 'blue', taken: false },
    { id: 2, name: 'Lisinopril', time: '12:00', color: 'red', taken: true },
    { id: 3, name: 'Aspirina', time: '20:00', color: 'white', taken: false }
  ];

  const recentVitals = {
    glucose: { value: 120, unit: 'mg/dL', status: 'normal', time: 'Hace 2 horas' },
    pressure: { value: '130/80', unit: 'mmHg', status: 'normal', time: 'Hace 4 horas' },
    oxygen: { value: 98, unit: '%', status: 'normal', time: 'Hace 6 horas' }
  };

  const familyAlerts = [
    { id: 1, message: 'Ana González está monitoreando tus medicamentos', time: 'Hace 1 hora', type: 'info' },
    { id: 2, message: 'Recordatorio: Cita médica mañana a las 10:00 AM', time: 'Hace 2 horas', type: 'warning' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation user={user} currentView="dashboard" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl mb-2">
                {language === 'es-MX' && `¡Hola, ${user.name}!`}
                {language === 'wix' && `${t('welcome', 'wix')}, ${user.name}!`}
                {language === 'nah' && `${t('welcome', 'nah')}, ${user.name}!`}
                {language === 'pur' && `${t('welcome', 'pur')}, ${user.name}!`}
                {language === 'en-US' && `${t('welcome', 'en-US')}, ${user.name}!`}
              </h1>
              <VoiceButton 
                text={`${t('welcome', language)} ${user.name}. ${t('health', language)}`}
                className="mb-2"
              />
            </div>
            <p className="text-gray-600">
              {language === 'es-MX' && 'Aquí está tu resumen de salud de hoy'}
              {language === 'wix' && 'Yau nierika yuawi'}
              {language === 'nah' && `Axcan mo ${t('health', 'nah')}`}
              {language === 'pur' && `Antuiksï ${t('health', 'pur')} jurámukua`}
              {language === 'en-US' && 'Here is your health summary for today'}
            </p>
          </div>
        </div>

        {/* Estado de Notificaciones */}
        <div className="mb-6">
          <NotificationStatusCard />
        </div>

        {/* Características de Accesibilidad Mejoradas */}
        <Card className="mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl mb-1">
                    {language === 'es-MX' && 'Nuevas Funciones de Accesibilidad'}
                    {language === 'wix' && 'Tepu nierika yuawi'}
                    {language === 'nah' && 'Yancuic tequitl'}
                    {language === 'pur' && 'Nánakua jurámukua'}
                    {language === 'en-US' && 'New Accessibility Features'}
                  </h3>
                  <p className="text-purple-100 text-sm">
                    {language === 'es-MX' && 'Control por voz y soporte multilingüe'}
                    {language === 'wix' && 'Neixa ika iwi yuawi'}
                    {language === 'nah' && 'Tlatol ica tlahtolli'}
                    {language === 'pur' && "K'uinchekua itsï iwi"}
                    {language === 'en-US' && 'Voice control and multilingual support'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mic className="h-5 w-5" />
                    <span className="font-medium">
                      {language === 'es-MX' && 'Comandos de Voz'}
                      {language === 'wix' && 'Neixa tlatol'}
                      {language === 'nah' && 'Tlatol nahuatiliztli'}
                      {language === 'pur' && "K'uinchekua iwi"}
                      {language === 'en-US' && 'Voice Commands'}
                    </span>
                  </div>
                  <p className="text-sm text-purple-100">
                    {language === 'es-MX' && 'Controla VitaLink con tu voz. Di "ir a medicamentos", "emergencia" y más.'}
                    {language === 'wix' && 'VitaLink ika neixa. "Hapuene", "nakawe".'}
                    {language === 'nah' && 'VitaLink ica tlatol. "Pahtli", "miequintin".'}
                    {language === 'pur' && 'VitaLink itsï iwi. "Jarhasti", "jimboka".'}
                    {language === 'en-US' && 'Control VitaLink with your voice. Say "go to medications", "emergency" and more.'}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Languages className="h-5 w-5" />
                    <span className="font-medium">
                      {language === 'es-MX' && 'Lenguas Indígenas'}
                      {language === 'wix' && 'Teiwari yuawi'}
                      {language === 'nah' && 'Maseualtlahtolli'}
                      {language === 'pur' && "Iretarhu k'uinchekua"}
                      {language === 'en-US' && 'Indigenous Languages'}
                    </span>
                  </div>
                  <p className="text-sm text-purple-100">
                    {language === 'es-MX' && "Ahora en Wixárika, Náhuatl y P'urhépecha. Accede desde el menú morado."}
                    {language === 'wix' && "Wixárika, Nāhuatl ika P'urhépecha yuawi."}
                    {language === 'nah' && "Wixárika, Nāhuatl ica P'urhépecha."}
                    {language === 'pur' && "Wixárika, Nāhuatl itsï P'urhépecha."}
                    {language === 'en-US' && "Now in Wixárika, Náhuatl and P'urhépecha. Access from the purple menu."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 pt-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {language === 'es-MX' && 'Ideal para adultos mayores'}
                  {language === 'wix' && 'Tatei yuawi'}
                  {language === 'nah' && 'Huehuetque'}
                  {language === 'pur' && 'Jicha sïrankua'}
                  {language === 'en-US' && 'Ideal for seniors'}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30">
                  <Heart className="h-3 w-3 mr-1" />
                  {language === 'es-MX' && 'Inclusivo y accesible'}
                  {language === 'wix' && 'Nierika hauki'}
                  {language === 'nah' && 'Centlamatiliztli'}
                  {language === 'pur' && 'Nánakua echeri'}
                  {language === 'en-US' && 'Inclusive and accessible'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Próximos Medicamentos */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Pill className="h-6 w-6 text-blue-600" />
                  <span>{t('upcoming_medications', language)}</span>
                </CardTitle>
                <CardDescription>
                  {t('medications_for_today', language)}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => onNavigate('medications')} variant="outline">
                  {t('view_all', language)}
                </Button>
                {onShowMedicationAlert && (
                  <Button 
                    variant="outline" 
                    className="space-x-2 text-orange-600 border-orange-300 hover:bg-orange-50"
                    onClick={() => onShowMedicationAlert({
                      id: 999,
                      name: 'Metformina',
                      dosage: '500mg',
                      time: '08:00',
                      color: 'blue',
                      description: 'Para control de glucosa en sangre',
                      instructions: 'Tomar con alimentos. No saltar dosis.'
                    })}
                  >
                    <Bell className="h-4 w-4" />
                    <span>Demo</span>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMedications.map((med) => (
                  <div key={med.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full bg-${med.color}-500 border-2 border-gray-300`}></div>
                      <div>
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {med.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {med.taken ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {t('taken', language)}
                        </Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => onShowMedicationAlert && onShowMedicationAlert({
                            id: med.id,
                            name: med.name,
                            dosage: '500mg',
                            time: med.time,
                            color: med.color,
                            description: `Medicamento ${med.name} programado para las ${med.time}`,
                            instructions: 'Tomar según las indicaciones médicas.'
                          })}
                        >
                          {t('take_now', language)}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Signos Vitales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-red-600" />
                <span>{t('vital_signs', language)}</span>
              </CardTitle>
              <CardDescription>
                {t('latest_measurements', language)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('glucose', language)}</p>
                    <p className="font-medium">{recentVitals.glucose.value} {recentVitals.glucose.unit}</p>
                    <p className="text-xs text-gray-500">{recentVitals.glucose.time}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {t('normal', language)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('blood_pressure', language)}</p>
                    <p className="font-medium">{recentVitals.pressure.value} {recentVitals.pressure.unit}</p>
                    <p className="text-xs text-gray-500">{recentVitals.pressure.time}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {t('normal', language)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('oxygen', language)}</p>
                    <p className="font-medium">{recentVitals.oxygen.value} {recentVitals.oxygen.unit}</p>
                    <p className="text-xs text-gray-500">{recentVitals.oxygen.time}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {t('normal', language)}
                  </Badge>
                </div>
              </div>
              
              <Button 
                onClick={() => onNavigate('health')} 
                variant="outline" 
                className="w-full mt-4"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {t('view_graphs', language)}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Segunda fila */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Red Familiar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-green-600" />
                <span>{t('family_network', language)}</span>
              </CardTitle>
              <CardDescription>{t('connected_family', language)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">A</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Ana González</p>
                    <p className="text-sm text-gray-600">Hija • Cuidadora principal</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">C</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Carlos González</p>
                    <p className="text-sm text-gray-600">Hijo • Apoyo</p>
                  </div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button 
                  onClick={() => onNavigate('family')} 
                  variant="outline" 
                  className="flex-1"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {t('view_family', language)}
                </Button>
                <Button 
                  onClick={() => onNavigate('chat')} 
                  variant="outline" 
                  className="flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {t('chat', language)}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alertas y Notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-6 w-6 text-orange-600" />
                <span>{t('notifications', language)}</span>
              </CardTitle>
              <CardDescription>
                {language === 'es-MX' && 'Alertas importantes'}
                {language === 'wix' && 'Yawatika hauki'}
                {language === 'nah' && 'Tlaixpantiliztli'}
                {language === 'pur' && 'Jukaeraka nánakua'}
                {language === 'en-US' && 'Important alerts'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {familyAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${alert.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                {t('all_notifications', language)}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Accesos Rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => onNavigate('medications')}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <Pill className="h-6 w-6" />
            <span>{t('medications', language)}</span>
          </Button>
          
          <Button
            onClick={() => onNavigate('health')}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <Heart className="h-6 w-6" />
            <span>{t('health', language)}</span>
          </Button>
          
          <Button
            onClick={() => onNavigate('family')}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <Users className="h-6 w-6" />
            <span>{t('family', language)}</span>
          </Button>
          
          <Button
            onClick={() => onNavigate('chat')}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <MessageCircle className="h-6 w-6" />
            <span>{t('chat', language)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}