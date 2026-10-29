import React, { useState } from 'react';
import { Button } from './ui/button';
import { Lock, Plus, Heart, User } from 'lucide-react';
import vitalinkLogo from 'figma:asset/2b088a125050270d6b7389bda5a5d258fb0569a4.png';

interface WelcomeScreenProps {
  onContinue: () => void;
  onCreateAccount?: () => void;
}

export function WelcomeScreen({ onContinue, onCreateAccount }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-4">
      {/* Tarjeta principal */}
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          {/* Logo VitaLink */}
          <div className="mb-6">
            <div className="mb-4 flex justify-center">
              <img 
                src={vitalinkLogo} 
                alt="VitaLink Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>

          {/* Título y subtítulo */}
          <div className="mb-8">
            <h1 className="text-2xl mb-2 text-gray-900">
              Bienvenido a VITALINK
            </h1>
            <p className="text-gray-500">
              Tu salud en tus manos.
            </p>
          </div>

          {/* Icono de corazón con persona */}
          <div className="mb-12">
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <div className="relative">
                <Heart className="h-10 w-10 text-blue-500" fill="currentColor" />
                <User className="h-6 w-6 text-blue-500 absolute bottom-0 right-0 bg-white rounded-full p-1" />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-4">
            <Button 
              onClick={onContinue}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 text-lg rounded-xl flex items-center justify-center space-x-3"
            >
              <span>Iniciar Sesión</span>
              <Lock className="h-5 w-5" />
            </Button>

            <Button 
              onClick={onCreateAccount || onContinue}
              variant="outline"
              className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 py-4 text-lg rounded-xl flex items-center justify-center space-x-3"
            >
              <span>Crear Cuenta</span>
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Indicadores de navegación móvil */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <div className="w-6 h-6 bg-gray-400 rounded-sm flex items-center justify-center">
          <div className="w-3 h-0.5 bg-white"></div>
        </div>
        <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
        <div className="w-6 h-6 bg-gray-400 rounded-sm"></div>
      </div>
    </div>
  );
}