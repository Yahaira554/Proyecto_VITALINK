// Servicio de traducción para VitaLink
// Incluye traducciones a lenguas indígenas de Jalisco

export type LanguageCode = 'es-MX' | 'wix' | 'nah' | 'pur' | 'en-US';

interface Translations {
  [key: string]: {
    [lang in LanguageCode]: string;
  };
}

// Traducciones principales de la aplicación
export const translations: Translations = {
  // Pantallas principales
  'dashboard': {
    'es-MX': 'Panel Principal',
    'wix': 'Temuki Yuawi',
    'nah': 'Ixpantli Neltiliztli',
    'pur': 'Jimbani Jurámukua',
    'en-US': 'Dashboard'
  },
  'medications': {
    'es-MX': 'Medicamentos',
    'wix': 'Hapuene',
    'nah': 'Pahtli',
    'pur': "Jarhasti ts'ïmanekua",
    'en-US': 'Medications'
  },
  'health': {
    'es-MX': 'Salud',
    'wix': 'Nierika',
    'nah': 'Yoliztli',
    'pur': "Iretarhu",
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

  // Saludos
  'welcome': {
    'es-MX': 'Bienvenido',
    'wix': 'Ma kai',
    'nah': 'Ximopanolti',
    'pur': 'Iamendu',
    'en-US': 'Welcome'
  },
  'good_morning': {
    'es-MX': 'Buenos días',
    'wix': 'Hauki tau',
    'nah': 'Cualli tonalli',
    'pur': "Nánakua ts'ïrani",
    'en-US': 'Good morning'
  },
  'good_afternoon': {
    'es-MX': 'Buenas tardes',
    'wix': "Hauki tuka'i",
    'nah': 'Cualli teotlac',
    'pur': "Nánakua japunda",
    'en-US': 'Good afternoon'
  },
  'good_night': {
    'es-MX': 'Buenas noches',
    'wix': 'Hauki yoawi',
    'nah': 'Cualli yohualli',
    'pur': 'Nánakua kaxumbi',
    'en-US': 'Good night'
  },

  // Términos médicos comunes
  'medicine': {
    'es-MX': 'Medicina',
    'wix': 'Hapue',
    'nah': 'Pahtli',
    'pur': 'Jarhasti',
    'en-US': 'Medicine'
  },
  'doctor': {
    'es-MX': 'Doctor',
    'wix': 'Nierika marakame',
    'nah': 'Ticitl',
    'pur': "Ts'ïmaneni ueratini",
    'en-US': 'Doctor'
  },
  'hospital': {
    'es-MX': 'Hospital',
    'wix': 'Nierika kalihuey',
    'nah': 'Cocoxcacalli',
    'pur': "Ts'ïmanekua jimbo",
    'en-US': 'Hospital'
  },
  'pain': {
    'es-MX': 'Dolor',
    'wix': 'Kakayari',
    'nah': 'Cocoa',
    'pur': 'Tembeni',
    'en-US': 'Pain'
  },
  'emergency': {
    'es-MX': 'Emergencia',
    'wix': 'Nakawe',
    'nah': 'Miequintin tlaixpan',
    'pur': 'Jimboka jarhukata',
    'en-US': 'Emergency'
  },

  // Acciones
  'take_medication': {
    'es-MX': 'Tomar medicamento',
    'wix': 'Yukia hapue',
    'nah': 'Cua pahtli',
    'pur': 'Chundirani jarhasti',
    'en-US': 'Take medication'
  },
  'record_data': {
    'es-MX': 'Registrar datos',
    'wix': 'Mahuika yuawi',
    'nah': 'Tlahcuiloa neltiliztli',
    'pur': 'Jarhani sesi',
    'en-US': 'Record data'
  },
  'call_family': {
    'es-MX': 'Llamar familia',
    'wix': 'Yawatia yukali',
    'nah': 'Notza chanehquetl',
    'pur': 'Jukaeri echeri',
    'en-US': 'Call family'
  },

  // Estados de salud
  'blood_pressure': {
    'es-MX': 'Presión arterial',
    'wix': 'Ezkatl yuyuawi',
    'nah': 'Eznenetl',
    'pur': 'Chanakua jarhurheni',
    'en-US': 'Blood pressure'
  },
  'glucose': {
    'es-MX': 'Glucosa',
    'wix': 'Tzapul ezkatl',
    'nah': 'Necuhyotl eztli',
    'pur': "Ts'ïpekua chanakua",
    'en-US': 'Glucose'
  },
  'oxygen': {
    'es-MX': 'Oxígeno',
    'wix': 'Yeka',
    'nah': 'Ehecatl',
    'pur': 'Itakua',
    'en-US': 'Oxygen'
  },
  'temperature': {
    'es-MX': 'Temperatura',
    'wix': 'Tutukari',
    'nah': 'Totonqui',
    'pur': 'Jurhiata',
    'en-US': 'Temperature'
  },

  // Instrucciones médicas
  'before_meals': {
    'es-MX': 'Antes de comer',
    'wix': 'Panima yukia tuwari',
    'nah': 'Achtopa tlacuaz',
    'pur': 'Amberi chundarani',
    'en-US': 'Before meals'
  },
  'after_meals': {
    'es-MX': 'Después de comer',
    'wix': 'Naimika yukia tuwari',
    'nah': 'Zan otlacuac',
    'pur': 'Eska chundarani',
    'en-US': 'After meals'
  },
  'with_water': {
    'es-MX': 'Con agua',
    'wix': 'Ika pa',
    'nah': 'Ica atl',
    'pur': 'Itsï ndauetsï',
    'en-US': 'With water'
  },

  // Botones comunes
  'accept': {
    'es-MX': 'Aceptar',
    'wix': 'Ke',
    'nah': 'Quema',
    'pur': 'Juká',
    'en-US': 'Accept'
  },
  'cancel': {
    'es-MX': 'Cancelar',
    'wix': 'Kewi',
    'nah': 'Ahmo',
    'pur': 'Noka',
    'en-US': 'Cancel'
  },
  'save': {
    'es-MX': 'Guardar',
    'wix': 'Mahuika',
    'nah': 'Piya',
    'pur': 'Jimbikata',
    'en-US': 'Save'
  },
  'close': {
    'es-MX': 'Cerrar',
    'wix': "Tepu'uka",
    'nah': 'Tzacua',
    'pur': 'Amberakua',
    'en-US': 'Close'
  },
  'back': {
    'es-MX': 'Atrás',
    'wix': 'Tupari',
    'nah': 'Occeppa',
    'pur': 'Uarakua',
    'en-US': 'Back'
  },

  // Mensajes del sistema
  'loading': {
    'es-MX': 'Cargando...',
    'wix': 'Yawatika...',
    'nah': 'Motlalia...',
    'pur': 'Jiparaka...',
    'en-US': 'Loading...'
  },
  'success': {
    'es-MX': 'Éxito',
    'wix': 'Hauki',
    'nah': 'Cualli',
    'pur': 'Nánakua',
    'en-US': 'Success'
  },
  'error': {
    'es-MX': 'Error',
    'wix': 'Kewika',
    'nah': 'Ahcualli',
    'pur': 'Ambé nánakua',
    'en-US': 'Error'
  },

  // Días de la semana
  'monday': {
    'es-MX': 'Lunes',
    'wix': 'Hauki tamai',
    'nah': 'Cemilhuitl',
    'pur': 'Jukatanhan',
    'en-US': 'Monday'
  },
  'tuesday': {
    'es-MX': 'Martes',
    'wix': 'Yupa tamai',
    'nah': 'Omilhuitl',
    'pur': 'Tsimankua',
    'en-US': 'Tuesday'
  },
  'today': {
    'es-MX': 'Hoy',
    'wix': 'Yau',
    'nah': 'Axcan',
    'pur': 'Antuiksï',
    'en-US': 'Today'
  },
  'tomorrow': {
    'es-MX': 'Mañana',
    'wix': 'Yaumeka',
    'nah': 'Moztla',
    'pur': 'Juchari',
    'en-US': 'Tomorrow'
  },

  // Frases útiles
  'how_are_you': {
    'es-MX': '¿Cómo estás?',
    'wix': "¿Tewari nierika'i?",
    'nah': '¿Quenin tineми?',
    'pur': "¿Nanhárхi iretarhukxï?",
    'en-US': 'How are you?'
  },
  'thank_you': {
    'es-MX': 'Gracias',
    'wix': 'Yuawi',
    'nah': 'Tlazohcamati',
    'pur': "Dios meiuá",
    'en-US': 'Thank you'
  },
  'help': {
    'es-MX': 'Ayuda',
    'wix': 'Nayarita',
    'nah': 'Palehui',
    'pur': 'Tanimarani',
    'en-US': 'Help'
  },
  
  // Navegación y UI
  'profile': {
    'es-MX': 'Perfil',
    'wix': 'Nierika yuawi',
    'nah': 'Notlahtol',
    'pur': 'Jurámukua',
    'en-US': 'Profile'
  },
  'logout': {
    'es-MX': 'Cerrar sesión',
    'wix': 'Teteima sesión',
    'nah': 'Tzacua sesión',
    'pur': 'Amberakua sesión',
    'en-US': 'Logout'
  },
  'settings': {
    'es-MX': 'Configuración',
    'wix': 'Keniuka yuawi',
    'nah': 'Tlayecana',
    'pur': 'Jimboka sési',
    'en-US': 'Settings'
  },
  'notifications': {
    'es-MX': 'Notificaciones',
    'wix': 'Yawatika yuawi',
    'nah': 'Tlaixpantiliztli',
    'pur': 'Jukaeraka sési',
    'en-US': 'Notifications'
  },
  'view_all': {
    'es-MX': 'Ver todos',
    'wix': 'Niuki yuwi',
    'nah': 'Nochi tlachia',
    'pur': 'Iamintsï nochi',
    'en-US': 'View all'
  },
  'add': {
    'es-MX': 'Agregar',
    'wix': 'Yukatia',
    'nah': 'Tlalia',
    'pur': 'Jimbani',
    'en-US': 'Add'
  },
  'edit': {
    'es-MX': 'Editar',
    'wix': 'Yenuka',
    'nah': 'Patla',
    'pur': 'Amperani',
    'en-US': 'Edit'
  },
  'delete': {
    'es-MX': 'Eliminar',
    'wix': 'Pupuika',
    'nah': 'Poloa',
    'pur': 'Charhakua',
    'en-US': 'Delete'
  },
  
  // Medicamentos
  'take_now': {
    'es-MX': 'Tomar ahora',
    'wix': 'Yukia yau',
    'nah': 'Cua axcan',
    'pur': 'Chundirani antuiksï',
    'en-US': 'Take now'
  },
  'taken': {
    'es-MX': 'Tomado',
    'wix': 'Yukika',
    'nah': 'Ocuac',
    'pur': 'Chundiranhani',
    'en-US': 'Taken'
  },
  'snooze': {
    'es-MX': 'Posponer',
    'wix': 'Yaumeka',
    'nah': 'Moztla',
    'pur': 'Juchari',
    'en-US': 'Snooze'
  },
  'dismiss': {
    'es-MX': 'Descartar',
    'wix': 'Kewi',
    'nah': 'Ahmo',
    'pur': 'Noka',
    'en-US': 'Dismiss'
  },
  'upcoming_medications': {
    'es-MX': 'Próximos Medicamentos',
    'wix': 'Hapuene yaumeka',
    'nah': 'Pahtli moztla',
    'pur': 'Jarhasti juchari',
    'en-US': 'Upcoming Medications'
  },
  'medications_for_today': {
    'es-MX': 'Medicamentos para hoy',
    'wix': 'Hapuene yau',
    'nah': 'Pahtli axcan',
    'pur': 'Jarhasti antuiksï',
    'en-US': 'Medications for today'
  },
  
  // Signos vitales
  'vital_signs': {
    'es-MX': 'Signos Vitales',
    'wix': 'Nierika yuyuawi',
    'nah': 'Yoliztli tlamantli',
    'pur': 'Iretarhu jimbani',
    'en-US': 'Vital Signs'
  },
  'latest_measurements': {
    'es-MX': 'Últimas mediciones',
    'wix': 'Yuawi tukari',
    'nah': 'Tlapohualoni',
    'pur': 'Jimbani sesi',
    'en-US': 'Latest measurements'
  },
  'view_graphs': {
    'es-MX': 'Ver gráficas',
    'wix': 'Niuki yuawi',
    'nah': 'Tlachia tlapohualli',
    'pur': 'Iamintsï sési',
    'en-US': 'View graphs'
  },
  'normal': {
    'es-MX': 'Normal',
    'wix': 'Hauki',
    'nah': 'Cualli',
    'pur': 'Nánakua',
    'en-US': 'Normal'
  },
  
  // Familia
  'family_network': {
    'es-MX': 'Red de Apoyo Familiar',
    'wix': 'Yukali nayarita',
    'nah': 'Chanehquetl palehui',
    'pur': 'Echeri tanimarani',
    'en-US': 'Family Support Network'
  },
  'connected_family': {
    'es-MX': 'Familiares conectados',
    'wix': 'Yukali yawatika',
    'nah': 'Chanehquetl tlaixpan',
    'pur': 'Echeri jukaerhani',
    'en-US': 'Connected family'
  },
  'view_family': {
    'es-MX': 'Ver familia',
    'wix': 'Niuki yukali',
    'nah': 'Tlachia chanehquetl',
    'pur': 'Iamintsï echeri',
    'en-US': 'View family'
  },
  
  // General
  'all_notifications': {
    'es-MX': 'Ver todas las notificaciones',
    'wix': 'Niuki yuwi yawatika',
    'nah': 'Nochi tlachia tlaixpantiliztli',
    'pur': 'Iamintsï nochi jukaeraka',
    'en-US': 'View all notifications'
  }
};

/**
 * Obtiene una traducción para una clave dada
 */
export function t(key: string, language: LanguageCode = 'es-MX'): string {
  if (translations[key] && translations[key][language]) {
    return translations[key][language];
  }
  // Fallback a español si no existe traducción
  return translations[key]?.['es-MX'] || key;
}

/**
 * Obtiene el código de voz apropiado para un idioma
 */
export function getVoiceCode(language: LanguageCode): string {
  const voiceCodes: Record<LanguageCode, string> = {
    'es-MX': 'es-MX',
    'wix': 'es-MX', // Fallback a español
    'nah': 'es-MX', // Fallback a español
    'pur': 'es-MX', // Fallback a español
    'en-US': 'en-US'
  };
  return voiceCodes[language];
}

/**
 * Obtiene todas las traducciones disponibles para mostrar en listas
 */
export function getAllTranslations(key: string): Record<LanguageCode, string> {
  return translations[key] || {
    'es-MX': key,
    'wix': key,
    'nah': key,
    'pur': key,
    'en-US': key
  };
}

/**
 * Verifica si existe una traducción para una clave
 */
export function hasTranslation(key: string): boolean {
  return key in translations;
}

/**
 * Obtiene el nombre nativo del idioma
 */
export function getLanguageName(language: LanguageCode): string {
  const names: Record<LanguageCode, string> = {
    'es-MX': 'Español',
    'wix': 'Wixárika',
    'nah': 'Nāhuatl',
    'pur': "P'urhépecha",
    'en-US': 'English'
  };
  return names[language];
}
