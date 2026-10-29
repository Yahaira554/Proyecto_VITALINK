import React, { useState } from 'react';
import { Button } from './ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useVoice } from './AccessibilityControls';

export function VoiceButton({ text, className = "", size = "sm", variant = "outline" }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { speak, stop } = useVoice();

  const handleClick = () => {
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    } else {
      speak(text);
      setIsSpeaking(true);
      
      // Detectar cuando termina de hablar
      setTimeout(() => {
        setIsSpeaking(false);
      }, text.length * 50); // Estimación aproximada
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`${className} ${isSpeaking ? 'bg-purple-100 border-purple-500' : ''}`}
      aria-label={isSpeaking ? "Detener lectura" : "Escuchar texto"}
    >
      {isSpeaking ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
}
