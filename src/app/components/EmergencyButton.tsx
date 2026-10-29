import React, { useState } from 'react';
import { Button } from './ui/button';
import { AlertTriangle, Phone } from 'lucide-react';
import { toast } from 'sonner';

export function EmergencyButton({ onEmergency }) {
  const [showPulse, setShowPulse] = useState(false);

  const handleClick = () => {
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 300);
    onEmergency();
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      <Button
        onClick={handleClick}
        className={`
          w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 hover:bg-red-700 
          shadow-2xl border-4 border-white
          flex flex-col items-center justify-center
          transition-all duration-300
          ${showPulse ? 'scale-110' : 'scale-100'}
        `}
        aria-label="Botón de emergencia"
      >
        <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-white mb-0.5 md:mb-1" />
        <span className="text-xs text-white font-bold">SOS</span>
      </Button>
      
      {/* Anillo de pulso animado */}
      <div className="absolute inset-0 -z-10">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 animate-ping opacity-20"></div>
      </div>
    </div>
  );
}
