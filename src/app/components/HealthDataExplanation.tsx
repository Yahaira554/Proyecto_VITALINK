import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { 
  Droplets, 
  Heart, 
  Wind, 
  AlertCircle, 
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export function HealthDataExplanation({ type, isOpen, onClose, currentValue, trend }) {
  const explanations = {
    glucose: {
      title: '📊 Niveles de Glucosa en Sangre',
      icon: <Droplets className="h-8 w-8 text-blue-600" />,
      description: 'La glucosa es el azúcar que tu cuerpo usa como energía. Es especialmente importante monitorearla si tienes diabetes.',
      unit: 'mg/dL (miligramos por decilitro)',
      ranges: [
        {
          label: 'Hipoglucemia (Muy Bajo)',
          range: 'Menor a 70',
          color: 'bg-red-100 border-red-300 text-red-900',
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          description: '⚠️ Nivel peligrosamente bajo. Puede causar mareos, temblores, sudoración y confusión.',
          action: 'Consume azúcar rápidamente (jugo, dulce) y contacta a tu médico si persiste.'
        },
        {
          label: 'Precaución Baja',
          range: '70 - 80',
          color: 'bg-yellow-100 border-yellow-300 text-yellow-900',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
          description: '⚡ Un poco bajo. Podrías sentirte débil o con hambre.',
          action: 'Considera comer algo saludable pronto.'
        },
        {
          label: 'Nivel Normal (Ideal)',
          range: '80 - 140',
          color: 'bg-green-100 border-green-300 text-green-900',
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
          description: '✅ Perfecto! Este es el rango saludable para la mayoría de las personas.',
          action: 'Mantén tu rutina actual de alimentación y medicamentos.'
        },
        {
          label: 'Precaución Alta',
          range: '140 - 180',
          color: 'bg-orange-100 border-orange-300 text-orange-900',
          icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
          description: '⚡ Un poco elevado. Puede indicar que necesitas ajustar tu dieta o medicamento.',
          action: 'Evita azúcares y consulta con tu médico si se mantiene elevado.'
        },
        {
          label: 'Hiperglucemia (Muy Alto)',
          range: 'Mayor a 180',
          color: 'bg-red-100 border-red-300 text-red-900',
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          description: '⚠️ Nivel peligrosamente alto. Puede causar sed excesiva, visión borrosa y fatiga.',
          action: 'Toma tu medicamento si corresponde y contacta a tu médico pronto.'
        }
      ],
      tips: [
        '🍎 Mantén una dieta balanceada con menos azúcares refinados',
        '💊 Toma tus medicamentos exactamente como te indicó tu médico',
        '🚶 El ejercicio regular ayuda a controlar la glucosa',
        '📅 Mide tu glucosa a las mismas horas cada día',
        '💧 Mantente bien hidratado con agua'
      ],
      whenToMeasure: [
        'En ayunas (antes del desayuno)',
        'Antes de cada comida principal',
        '2 horas después de comer',
        'Antes de dormir',
        'Si te sientes mareado o débil'
      ]
    },
    pressure: {
      title: '❤️ Presión Arterial',
      icon: <Heart className="h-8 w-8 text-red-600" />,
      description: 'La presión arterial mide la fuerza que ejerce la sangre contra las paredes de tus arterias. Tiene dos números importantes:',
      unit: 'mmHg (milímetros de mercurio)',
      components: [
        {
          name: 'Presión Sistólica (Número Superior)',
          description: 'Es la presión cuando tu corazón late y empuja la sangre',
          example: 'En 120/80, el 120 es la sistólica'
        },
        {
          name: 'Presión Diastólica (Número Inferior)',
          description: 'Es la presión cuando tu corazón descansa entre latidos',
          example: 'En 120/80, el 80 es la diastólica'
        }
      ],
      ranges: [
        {
          label: 'Hipotensión (Muy Baja)',
          range: 'Menor a 90/60',
          color: 'bg-blue-100 border-blue-300 text-blue-900',
          icon: <AlertTriangle className="h-5 w-5 text-blue-600" />,
          description: '⚠️ Presión muy baja. Puede causar mareos al levantarte o debilidad.',
          action: 'Levántate despacio, mantente hidratado y consulta a tu médico.'
        },
        {
          label: 'Presión Normal (Ideal)',
          range: '90/60 - 120/80',
          color: 'bg-green-100 border-green-300 text-green-900',
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
          description: '✅ Excelente! Tu presión está en rango saludable.',
          action: 'Continúa con tus buenos hábitos de vida.'
        },
        {
          label: 'Presión Elevada',
          range: '120-129/menor a 80',
          color: 'bg-yellow-100 border-yellow-300 text-yellow-900',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
          description: '⚡ Ligeramente elevada. Podrías desarrollar hipertensión.',
          action: 'Reduce la sal, haz más ejercicio y monitorea regularmente.'
        },
        {
          label: 'Hipertensión Etapa 1',
          range: '130-139/80-89',
          color: 'bg-orange-100 border-orange-300 text-orange-900',
          icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
          description: '⚠️ Presión alta. Aumenta el riesgo cardiovascular.',
          action: 'Consulta con tu médico sobre medicamentos y cambios de estilo de vida.'
        },
        {
          label: 'Hipertensión Etapa 2',
          range: '140/90 o mayor',
          color: 'bg-red-100 border-red-300 text-red-900',
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          description: '🚨 Presión muy alta. Riesgo significativo de problemas cardíacos.',
          action: 'Contacta a tu médico pronto. Puede necesitar medicamento o ajuste.'
        },
        {
          label: 'Crisis Hipertensiva',
          range: 'Mayor a 180/120',
          color: 'bg-red-200 border-red-400 text-red-950',
          icon: <AlertCircle className="h-5 w-5 text-red-700" />,
          description: '🚨 EMERGENCIA! Riesgo inmediato de daño a órganos.',
          action: '¡Busca atención médica de emergencia inmediatamente!'
        }
      ],
      tips: [
        '🧂 Reduce el consumo de sal en tus comidas',
        '🥗 Come más frutas, verduras y granos enteros',
        '🚭 No fumes y evita el alcohol en exceso',
        '😌 Practica técnicas de relajación para el estrés',
        '⚖️ Mantén un peso saludable',
        '💊 Toma tus medicamentos según indicación médica'
      ],
      whenToMeasure: [
        'Por la mañana antes de comer',
        'Por la noche antes de dormir',
        'Siempre a la misma hora',
        'Después de descansar 5 minutos sentado',
        'Si tienes dolor de cabeza o mareos'
      ]
    },
    oxygen: {
      title: '🫁 Saturación de Oxígeno',
      icon: <Wind className="h-8 w-8 text-green-600" />,
      description: 'La saturación de oxígeno (SpO2) mide qué porcentaje de tu sangre está transportando oxígeno. Es vital para que todos tus órganos funcionen bien.',
      unit: '% (porcentaje)',
      ranges: [
        {
          label: 'Peligrosamente Bajo',
          range: 'Menor a 90%',
          color: 'bg-red-100 border-red-300 text-red-900',
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          description: '🚨 Nivel crítico. Tu cuerpo no está recibiendo suficiente oxígeno.',
          action: '¡Busca atención médica de emergencia inmediatamente!'
        },
        {
          label: 'Bajo - Requiere Atención',
          range: '90% - 94%',
          color: 'bg-orange-100 border-orange-300 text-orange-900',
          icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
          description: '⚠️ Bajo. Podrías sentir falta de aire o cansancio.',
          action: 'Respira profundamente y contacta a tu médico pronto.'
        },
        {
          label: 'Precaución',
          range: '95% - 96%',
          color: 'bg-yellow-100 border-yellow-300 text-yellow-900',
          icon: <Info className="h-5 w-5 text-yellow-600" />,
          description: '⚡ Un poco bajo del ideal. Monitorea si persiste.',
          action: 'Si tienes problemas respiratorios, consulta a tu médico.'
        },
        {
          label: 'Normal (Ideal)',
          range: '97% - 100%',
          color: 'bg-green-100 border-green-300 text-green-900',
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
          description: '✅ Perfecto! Tu sangre está transportando oxígeno correctamente.',
          action: 'Mantén tus buenos hábitos de salud respiratoria.'
        }
      ],
      tips: [
        '🌬️ Practica ejercicios de respiración profunda',
        '🚭 No fumes - daña gravemente la capacidad pulmonar',
        '🪟 Ventila bien tu hogar con aire fresco',
        '🚶 Haz ejercicio regular para fortalecer pulmones',
        '😷 Usa cubrebocas si tienes problemas respiratorios',
        '🌳 Pasa tiempo en áreas con aire limpio'
      ],
      whenToMeasure: [
        'En reposo (más preciso)',
        'Si sientes falta de aire',
        'Si tienes tos persistente',
        'Durante episodios de enfermedad respiratoria',
        'Si tienes condiciones pulmonares crónicas'
      ],
      importantNotes: [
        '💅 El esmalte de uñas oscuro puede afectar la lectura',
        '🥶 Los dedos fríos pueden dar lecturas bajas - caliéntalos primero',
        '🤲 Mantén la mano quieta durante la medición',
        '📱 Algunos oxímetros caseros pueden variar ±2%'
      ]
    }
  };

  if (!type || !explanations[type]) return null;

  const data = explanations[type];

  const getCurrentRangeStatus = () => {
    if (!currentValue) return null;

    if (type === 'glucose') {
      const value = parseFloat(currentValue);
      if (value < 70) return data.ranges[0];
      if (value < 80) return data.ranges[1];
      if (value <= 140) return data.ranges[2];
      if (value <= 180) return data.ranges[3];
      return data.ranges[4];
    } else if (type === 'pressure') {
      // Extraer sistólica y diastólica del currentValue (formato: "120/80")
      const [systolic, diastolic] = currentValue.split('/').map(v => parseInt(v));
      if (systolic < 90 || diastolic < 60) return data.ranges[0];
      if (systolic <= 120 && diastolic < 80) return data.ranges[1];
      if (systolic <= 129 && diastolic < 80) return data.ranges[2];
      if (systolic <= 139 || diastolic <= 89) return data.ranges[3];
      if (systolic < 180 && diastolic < 120) return data.ranges[4];
      return data.ranges[5];
    } else if (type === 'oxygen') {
      const value = parseFloat(currentValue);
      if (value < 90) return data.ranges[0];
      if (value <= 94) return data.ranges[1];
      if (value <= 96) return data.ranges[2];
      return data.ranges[3];
    }
  };

  const currentStatus = getCurrentRangeStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            {data.icon}
            <span>{data.title}</span>
          </DialogTitle>
          <DialogDescription className="text-lg mt-2">
            {data.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Valor Actual */}
          {currentValue && currentStatus && (
            <Card className={`border-2 ${currentStatus.color}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {currentStatus.icon}
                      <h3 className="font-semibold text-xl">Tu Valor Actual: {currentValue} {data.unit}</h3>
                    </div>
                    <p className="text-lg mb-2">{currentStatus.label}</p>
                    <p className="mb-3">{currentStatus.description}</p>
                    <div className="bg-white/50 p-3 rounded-lg">
                      <p className="font-medium">💡 Recomendación:</p>
                      <p>{currentStatus.action}</p>
                    </div>
                  </div>
                  {trend && (
                    <div className="ml-4">
                      <Badge variant="outline" className="text-lg px-3 py-2">
                        {trend === 'up' ? (
                          <>
                            <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
                            Subiendo
                          </>
                        ) : trend === 'down' ? (
                          <>
                            <TrendingDown className="h-5 w-5 mr-2 text-blue-600" />
                            Bajando
                          </>
                        ) : (
                          'Estable'
                        )}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Unidad de Medida */}
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <h4 className="font-semibold mb-2 flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-600" />
              Unidad de Medida
            </h4>
            <p className="text-lg">{data.unit}</p>
          </div>

          {/* Componentes (solo para presión arterial) */}
          {data.components && (
            <div className="space-y-3">
              <h4 className="font-semibold text-xl">📋 Componentes de la Medición</h4>
              {data.components.map((component, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-4">
                    <h5 className="font-semibold text-lg mb-2">{component.name}</h5>
                    <p className="mb-2">{component.description}</p>
                    <p className="text-sm text-gray-600 italic">Ejemplo: {component.example}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Rangos de Valores */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xl">📊 Rangos de Valores y Significado</h4>
            {data.ranges.map((range, index) => (
              <Card key={index} className={`border-2 ${range.color}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {range.icon}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-lg">{range.label}</h5>
                        <Badge variant="outline" className="text-sm">
                          {range.range} {data.unit}
                        </Badge>
                      </div>
                      <p className="mb-2">{range.description}</p>
                      <div className="bg-white/50 p-2 rounded">
                        <p className="text-sm">
                          <strong>Qué hacer:</strong> {range.action}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Consejos */}
          <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
            <h4 className="font-semibold text-xl mb-3">💚 Consejos para Mantener Valores Saludables</h4>
            <ul className="space-y-2">
              {data.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-lg mr-2">•</span>
                  <span className="text-lg">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuándo Medir */}
          <div className="bg-purple-50 p-5 rounded-lg border-2 border-purple-200">
            <h4 className="font-semibold text-xl mb-3">⏰ ¿Cuándo Debo Medir?</h4>
            <ul className="space-y-2">
              {data.whenToMeasure.map((time, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-lg mr-2">•</span>
                  <span className="text-lg">{time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Notas Importantes (solo para oxígeno) */}
          {data.importantNotes && (
            <div className="bg-yellow-50 p-5 rounded-lg border-2 border-yellow-200">
              <h4 className="font-semibold text-xl mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                Notas Importantes
              </h4>
              <ul className="space-y-2">
                {data.importantNotes.map((note, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-lg mr-2">•</span>
                    <span className="text-lg">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recordatorio Final */}
          <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-200 text-center">
            <p className="text-lg font-medium">
              ⚕️ Recuerda: Esta información es educativa. Siempre consulta con tu médico 
              sobre tus valores específicos y tratamiento personalizado.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
