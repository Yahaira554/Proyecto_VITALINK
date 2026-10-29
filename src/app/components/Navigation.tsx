import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  Home, 
  Pill, 
  Heart, 
  Users, 
  MessageCircle, 
  User, 
  Settings,
  Menu,
  LogOut
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { t, LanguageCode } from './TranslationService';

export function Navigation({ user, currentView, onNavigate, onLogout }) {
  const [language, setLanguage] = useState<LanguageCode>('es-MX');

  // Sincronizar idioma con localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('vitalink-language');
    if (savedLanguage) {
      setLanguage(savedLanguage as LanguageCode);
    }
    
    // Escuchar cambios de idioma
    const handleStorageChange = () => {
      const newLanguage = localStorage.getItem('vitalink-language');
      if (newLanguage) {
        setLanguage(newLanguage as LanguageCode);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getNavigationLabel = (id: string) => {
    const labels: Record<string, Record<LanguageCode, string>> = {
      'dashboard': {
        'es-MX': 'Inicio',
        'wix': 'Temuki',
        'nah': 'Ixpantli',
        'pur': 'Jimbani',
        'en-US': 'Home'
      },
      'medications': {
        'es-MX': 'Medicamentos',
        'wix': 'Hapuene',
        'nah': 'Pahtli',
        'pur': 'Jarhasti',
        'en-US': 'Medications'
      },
      'health': {
        'es-MX': 'Salud',
        'wix': 'Nierika',
        'nah': 'Yoliztli',
        'pur': 'Iretarhu',
        'en-US': 'Health'
      },
      'family': {
        'es-MX': 'Familia',
        'wix': 'Yukali',
        'nah': 'Chanehquetl',
        'pur': 'Echeri',
        'en-US': 'Family'
      },
      'chat': {
        'es-MX': 'Chat',
        'wix': 'Neixa',
        'nah': 'Notlatol',
        'pur': "K'uinchekua",
        'en-US': 'Chat'
      },
      'profile': {
        'es-MX': 'Perfil',
        'wix': 'Nierika nuu',
        'nah': 'Notoca',
        'pur': 'Jicha nuu',
        'en-US': 'Profile'
      }
    };
    
    return labels[id]?.[language] || labels[id]?.['es-MX'] || id;
  };

  const navigationItems = [
    { id: 'dashboard', icon: Home },
    { id: 'medications', icon: Pill },
    { id: 'health', icon: Heart },
    { id: 'family', icon: Users },
    { id: 'chat', icon: MessageCircle },
    { id: 'profile', icon: User }
  ];

  const NavigationContent = () => (
    <div className="flex flex-col space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            variant={currentView === item.id ? "default" : "ghost"}
            className="w-full justify-start space-x-3 text-lg py-3"
          >
            <Icon className="h-5 w-5" />
            <span>{getNavigationLabel(item.id)}</span>
          </Button>
        );
      })}
      
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <Button
          onClick={() => onNavigate('family-profile')}
          variant="ghost"
          className="w-full justify-start space-x-3 text-lg py-3"
        >
          <Settings className="h-5 w-5" />
          <span>{t('settings', language)}</span>
        </Button>
        
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start space-x-3 text-lg py-3 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>{t('logout', language)}</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 rounded-full p-2">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-semibold text-blue-900">VitaLink</span>
                </div>
                
                <nav className="flex space-x-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        variant={currentView === item.id ? "default" : "ghost"}
                        className="space-x-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{getNavigationLabel(item.id)}</span>
                      </Button>
                    );
                  })}
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.userType === 'patient' ? 'Paciente' : 'Cuidador'}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{user.name.charAt(0)}</span>
                </div>
                <Button
                  onClick={onLogout}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden xl:inline">
                    {language === 'es-MX' && 'Cerrar Sesión'}
                    {language === 'wix' && "Tepu'uka"}
                    {language === 'nah' && 'Tzacua'}
                    {language === 'pur' && 'Amberakua'}
                    {language === 'en-US' && 'Logout'}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-full p-2">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-blue-900">VitaLink</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
              </div>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Menú de Navegación</SheetTitle>
                    <SheetDescription>Navega por las diferentes secciones de VitaLink</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <div className="flex items-center space-x-3 mb-6 pb-6 border-b">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-lg">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.userType === 'patient' ? 'Paciente' : 'Cuidador'}</p>
                      </div>
                    </div>
                    <NavigationContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}