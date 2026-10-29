import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Mic, MessageCircle, Navigation as NavIcon, AlertTriangle } from 'lucide-react';

interface VoiceCommandsHelpProps {
  className?: string;
}

export function VoiceCommandsHelp({ className = '' }: VoiceCommandsHelpProps) {
  const exampleCommands = [
    {
      category: 'Navegación',
      icon: NavIcon,
      color: 'blue',
      examples: [
        'Ir a medicamentos',
        'Abrir salud',
        'Ver familia',
        'Chat'
      ]
    },
    {
      category: 'Acciones',
      icon: MessageCircle,
      color: 'green',
      examples: [
        'Emergencia',
        'Atrás',
        'Cerrar',
        'Menú'
      ]
    },
    {
      category: 'Ayuda',
      icon: AlertTriangle,
      color: 'purple',
      examples: [
        'Ayuda de voz',
        'Qué puedo decir',
        'Comandos'
      ]
    }
  ];

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Ejemplos de Comandos de Voz</h3>
            <p className="text-sm text-gray-600">Di estos comandos cuando el micrófono esté activo</p>
          </div>
        </div>

        <div className="space-y-4">
          {exampleCommands.map((category, idx) => (
            <div key={idx}>
              <div className="flex items-center space-x-2 mb-2">
                <category.icon className={`h-4 w-4 text-${category.color}-600`} />
                <span className="font-medium text-sm">{category.category}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.examples.map((example, exIdx) => (
                  <Badge 
                    key={exIdx} 
                    variant="outline" 
                    className={`border-${category.color}-300 text-${category.color}-700`}
                  >
                    "{example}"
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
          <p className="text-xs text-blue-900">
            💡 <strong>Consejo:</strong> Habla claro y pausado. El sistema mejora con el uso.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
