import React, { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation as NavigationIcon,
  Loader2,
  AlertCircle,
  Store,
  Map,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

// Farmacias simuladas en Jalisco (Guadalajara y alrededores)
const pharmaciesData = [
  {
    id: 1,
    name: 'Farmacia Guadalajara Centro',
    address: 'Av. Juárez 500, Centro, Guadalajara',
    phone: '33-3614-5678',
    hours: '24 horas',
    services: ['Entrega a domicilio', 'Consulta médica', 'Laboratorio'],
    coordinates: [20.6767, -103.3475],
    zone: 'Centro'
  },
  {
    id: 2,
    name: 'Farmacia del Ahorro Chapultepec',
    address: 'Av. Chapultepec 240, Americana, Guadalajara',
    phone: '33-3825-1234',
    hours: '24 horas',
    services: ['Entrega a domicilio', 'Venta de insulina'],
    coordinates: [20.6735, -103.3625],
    zone: 'Americana'
  },
  {
    id: 3,
    name: 'Farmacia Benavides Providencia',
    address: 'Av. Providencia 2500, Providencia, Guadalajara',
    phone: '33-3640-9876',
    hours: '7:00 AM - 11:00 PM',
    services: ['Consulta médica', 'Vacunación'],
    coordinates: [20.6850, -103.3890],
    zone: 'Providencia'
  },
  {
    id: 4,
    name: 'Farmacia San Pablo Tlaquepaque',
    address: 'Av. Revolución 45, Centro, Tlaquepaque',
    phone: '33-3635-4321',
    hours: '24 horas',
    services: ['Entrega a domicilio', 'Medición de glucosa'],
    coordinates: [20.6400, -103.3120],
    zone: 'Tlaquepaque'
  },
  {
    id: 5,
    name: 'Farmacia Similares Zapopan',
    address: 'Av. Patria 1891, Zapopan',
    phone: '33-3833-5678',
    hours: '8:00 AM - 10:00 PM',
    services: ['Consulta $35', 'Genéricos de calidad'],
    coordinates: [20.7100, -103.4100],
    zone: 'Zapopan'
  },
  {
    id: 6,
    name: 'Farmacia Guadalajara Periférico',
    address: 'Periférico Sur 7800, Tlaquepaque',
    phone: '33-3123-8888',
    hours: '24 horas',
    services: ['Entrega a domicilio', 'Estacionamiento'],
    coordinates: [20.6200, -103.2900],
    zone: 'Tlaquepaque'
  },
  {
    id: 7,
    name: 'Farmacia YZA Minerva',
    address: 'Av. López Mateos Sur 2077, Col. Jardines Plaza del Sol',
    phone: '33-3647-2222',
    hours: '8:00 AM - 9:00 PM',
    services: ['Medición de presión', 'Perfumería'],
    coordinates: [20.6550, -103.3950],
    zone: 'Col. Jardines'
  },
  {
    id: 8,
    name: 'Farmacia del Ahorro Tonalá',
    address: 'Av. Tonaltecas 280, Tonalá',
    phone: '33-3683-1111',
    hours: '24 horas',
    services: ['Entrega a domicilio', 'Laboratorio clínico'],
    coordinates: [20.6250, -103.2350],
    zone: 'Tonalá'
  }
];

export function PharmacyMap({ user, onNavigate }) {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  // Obtener ubicación del usuario
  useEffect(() => {
    if ('geolocation' in navigator) {
      toast.info('📍 Obteniendo tu ubicación...', {
        description: 'Esto nos ayudará a mostrarte las farmacias más cercanas',
        duration: 3000,
      });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLoading(false);
          
          toast.success('✅ Ubicación obtenida', {
            description: 'Mostrando farmacias cercanas',
            duration: 3000,
          });
        },
        (err) => {
          // Manejo detallado de errores de geolocalización
          let errorMessage = 'No se pudo obtener tu ubicación';
          
          if (err.code === 1) {
            // PERMISSION_DENIED
            errorMessage = 'Permisos de ubicación denegados';
            toast.warning('📍 Permisos necesarios', {
              description: 'Para mostrar farmacias cercanas, permite el acceso a tu ubicación',
              duration: 5000,
            });
          } else if (err.code === 2) {
            // POSITION_UNAVAILABLE
            errorMessage = 'Ubicación no disponible en este momento';
            toast.warning('📍 Ubicación no disponible', {
              description: 'Mostrando farmacias en el centro de Guadalajara',
              duration: 4000,
            });
          } else if (err.code === 3) {
            // TIMEOUT
            errorMessage = 'Tiempo de espera agotado al obtener ubicación';
            toast.warning('📍 Tiempo agotado', {
              description: 'Mostrando farmacias en el centro de Guadalajara',
              duration: 4000,
            });
          } else {
            toast.warning('📍 Ubicación no disponible', {
              description: 'Mostrando farmacias en el centro de Guadalajara',
              duration: 4000,
            });
          }
          
          setError(errorMessage);
          setLoading(false);
        },
        {
          enableHighAccuracy: false, // Cambiar a false para mayor compatibilidad
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setError('Tu navegador no soporta geolocalización');
      setLoading(false);
      
      toast.warning('📍 Navegador no compatible', {
        description: 'Mostrando farmacias en el centro de Guadalajara',
        duration: 4000,
      });
    }
  }, []);

  // Calcular distancia entre dos puntos (fórmula de Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Ordenar farmacias por distancia
  const sortedPharmacies = userLocation
    ? [...pharmaciesData].sort((a, b) => {
        const distA = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          a.coordinates[0],
          a.coordinates[1]
        );
        const distB = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          b.coordinates[0],
          b.coordinates[1]
        );
        return distA - distB;
      })
    : pharmaciesData;

  const handleViewOnMap = (pharmacy) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${pharmacy.coordinates[0]},${pharmacy.coordinates[1]}`;
    window.open(url, '_blank');
    
    toast.success('🗺️ Abriendo Google Maps', {
      description: `Mostrando ubicación de ${pharmacy.name}`,
      duration: 3000,
    });
  };

  const handleGetDirections = (pharmacy) => {
    let url;
    if (userLocation) {
      url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${pharmacy.coordinates[0]},${pharmacy.coordinates[1]}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.coordinates[0]},${pharmacy.coordinates[1]}`;
    }
    window.open(url, '_blank');
    
    toast.success('🗺️ Abriendo Google Maps', {
      description: 'Te mostraremos cómo llegar a la farmacia',
      duration: 3000,
    });
  };

  const handleCallPharmacy = (phone) => {
    window.location.href = `tel:${phone}`;
    
    toast.info('📞 Iniciando llamada', {
      description: 'Llamando a la farmacia...',
      duration: 2000,
    });
  };

  const handleViewAllOnMap = () => {
    const center = userLocation 
      ? `${userLocation.lat},${userLocation.lng}`
      : '20.6767,-103.3475';
    const url = `https://www.google.com/maps/search/farmacia/@${center},13z`;
    window.open(url, '_blank');
    
    toast.success('🗺️ Abriendo Google Maps', {
      description: 'Mostrando todas las farmacias cercanas',
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation user={user} currentView="pharmacy-map" onNavigate={onNavigate} />
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl mb-2 flex items-center space-x-3">
                <MapPin className="h-8 w-8 text-red-600" />
                <span>Farmacias Cercanas</span>
              </h1>
              <p className="text-gray-600">Encuentra la farmacia más cercana para surtir tus medicamentos</p>
            </div>
            
            <Button
              onClick={handleViewAllOnMap}
              className="bg-red-600 hover:bg-red-700"
              size="lg"
            >
              <Map className="h-5 w-5 mr-2" />
              Ver en Mapa
            </Button>
          </div>
        </div>

        {/* Estado de ubicación */}
        {loading && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6 flex items-center space-x-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Obteniendo tu ubicación...</p>
                <p className="text-sm text-blue-700">Esto nos ayudará a mostrarte las farmacias más cercanas</p>
              </div>
            </CardContent>
          </Card>
        )}

        {userLocation && !loading && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-green-900">Ubicación detectada</p>
                <p className="text-sm text-green-700">
                  Las farmacias están ordenadas por distancia a tu ubicación actual
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {error && !loading && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="p-6 flex items-start space-x-4">
              <AlertCircle className="h-8 w-8 text-yellow-600 shrink-0" />
              <div>
                <p className="font-medium text-yellow-900">Ubicación no disponible</p>
                <p className="text-sm text-yellow-700">
                  {error}. Mostrando farmacias en el centro de Guadalajara.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grid de farmacias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {sortedPharmacies.map((pharmacy) => {
            const distance = userLocation
              ? calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  pharmacy.coordinates[0],
                  pharmacy.coordinates[1]
                )
              : null;

            return (
              <Card
                key={pharmacy.id}
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  selectedPharmacy?.id === pharmacy.id
                    ? 'border-2 border-red-500 shadow-lg'
                    : 'border-2 border-transparent'
                }`}
                onClick={() => setSelectedPharmacy(pharmacy)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="flex items-start space-x-2 mb-2">
                        <Store className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                        <span>{pharmacy.name}</span>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Badge variant="outline">{pharmacy.zone}</Badge>
                        {distance && (
                          <Badge className="bg-red-100 text-red-800">
                            {distance.toFixed(1)} km
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start text-sm text-gray-700">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-gray-500" />
                      <span>{pharmacy.address}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-700">
                      <Clock className="h-4 w-4 mr-2 shrink-0 text-gray-500" />
                      <span>{pharmacy.hours}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-700">
                      <Phone className="h-4 w-4 mr-2 shrink-0 text-gray-500" />
                      <span>{pharmacy.phone}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-600 mb-2">Servicios disponibles:</p>
                    <div className="flex flex-wrap gap-1">
                      {pharmacy.services.map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetDirections(pharmacy);
                      }}
                    >
                      <NavigationIcon className="h-4 w-4 mr-1" />
                      Cómo llegar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOnMap(pharmacy);
                      }}
                    >
                      <Map className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCallPharmacy(pharmacy.phone);
                      }}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="h-5 w-5 text-red-600" />
                <span>Consejos para surtir medicamentos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-red-600 shrink-0" />
                  <span>Lleva siempre tu receta médica original</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-red-600 shrink-0" />
                  <span>Verifica que el medicamento sea el correcto antes de salir</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-red-600 shrink-0" />
                  <span>Pregunta sobre genéricos para ahorrar dinero</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-red-600 shrink-0" />
                  <span>Muchas farmacias ofrecen entrega a domicilio gratuita</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-red-600 shrink-0" />
                  <span>Puedes llamar antes para verificar disponibilidad</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>¿Cómo usar esta función?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs shrink-0 mr-2">1</span>
                  <span>Haz clic en "Cómo llegar" para ver direcciones en Google Maps</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs shrink-0 mr-2">2</span>
                  <span>Usa el botón del mapa para ver la ubicación exacta</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs shrink-0 mr-2">3</span>
                  <span>Llama directamente con el botón de teléfono</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs shrink-0 mr-2">4</span>
                  <span>Las farmacias más cercanas aparecen primero</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
