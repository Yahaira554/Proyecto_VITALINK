import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Heart, 
  Shield, 
  Users, 
  Plus, 
  Trash2, 
  Pill,
  Clock,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function CaregiverRegistration({ onComplete, onBack }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [caregiverData, setCaregiverData] = useState({
    // Datos del cuidador
    caregiverName: '',
    caregiverEmail: '',
    caregiverPhone: '',
    caregiverPassword: '',
    relationship: '',
    
    // Datos del paciente
    patientName: '',
    patientAge: '',
    patientGender: '',
    patientBloodType: '',
    patientAllergies: '',
    patientConditions: '',
    patientAddress: '',
    patientMedicalInsurance: '',
    
    // Medicamentos
    medications: [
      { name: '', dosage: '', frequency: '', time: '', color: 'blue', instructions: '' }
    ],
    
    // Contactos de emergencia
    emergencyContacts: [
      { name: '', phone: '', relationship: '' }
    ]
  });

  const totalSteps = 4;

  // Funciones para manejar medicamentos
  const addMedication = () => {
    setCaregiverData({
      ...caregiverData,
      medications: [...caregiverData.medications, { name: '', dosage: '', frequency: '', time: '', color: 'blue', instructions: '' }]
    });
  };

  const removeMedication = (index) => {
    if (caregiverData.medications.length > 1) {
      const updatedMedications = caregiverData.medications.filter((_, i) => i !== index);
      setCaregiverData({ ...caregiverData, medications: updatedMedications });
    }
  };

  const updateMedication = (index, field, value) => {
    const updatedMedications = [...caregiverData.medications];
    updatedMedications[index] = { ...updatedMedications[index], [field]: value };
    setCaregiverData({ ...caregiverData, medications: updatedMedications });
  };

  // Funciones para manejar contactos de emergencia
  const addEmergencyContact = () => {
    setCaregiverData({
      ...caregiverData,
      emergencyContacts: [...caregiverData.emergencyContacts, { name: '', phone: '', relationship: '' }]
    });
  };

  const removeEmergencyContact = (index) => {
    if (caregiverData.emergencyContacts.length > 1) {
      const updatedContacts = caregiverData.emergencyContacts.filter((_, i) => i !== index);
      setCaregiverData({ ...caregiverData, emergencyContacts: updatedContacts });
    }
  };

  const updateEmergencyContact = (index, field, value) => {
    const updatedContacts = [...caregiverData.emergencyContacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setCaregiverData({ ...caregiverData, emergencyContacts: updatedContacts });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      toast.success('Paso completado', {
        description: `Avanzando al paso ${currentStep + 1} de ${totalSteps}`,
        duration: 2000,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear objeto de usuario combinando cuidador y paciente
    const userData = {
      id: Date.now(),
      userType: 'caregiver',
      name: caregiverData.caregiverName,
      email: caregiverData.caregiverEmail,
      phone: caregiverData.caregiverPhone,
      relationship: caregiverData.relationship,
      patient: {
        name: caregiverData.patientName,
        age: caregiverData.patientAge,
        gender: caregiverData.patientGender,
        bloodType: caregiverData.patientBloodType,
        allergies: caregiverData.patientAllergies,
        conditions: caregiverData.patientConditions,
      },
      medications: caregiverData.medications.filter(med => med.name && med.dosage),
      emergencyContacts: caregiverData.emergencyContacts.filter(contact => contact.name && contact.phone)
    };

    toast.success('¡Registro completado!', {
      description: 'Cuenta de cuidador creada exitosamente',
      duration: 3000,
    });

    onComplete(userData);
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                  currentStep === step
                    ? 'bg-blue-600 border-blue-600 text-white scale-110'
                    : currentStep > step
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-gray-200 border-gray-300 text-gray-500'
                }`}
              >
                {currentStep > step ? <Check className="h-6 w-6" /> : step}
              </div>
              <p className="text-xs mt-2 text-center max-w-[80px]">
                {step === 1 && 'Cuidador'}
                {step === 2 && 'Paciente'}
                {step === 3 && 'Medicamentos'}
                {step === 4 && 'Contactos'}
              </p>
            </div>
            {step < 4 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  currentStep > step ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl mb-2 text-blue-900">Registro de Cuidador</h1>
          <p className="text-gray-600">Completa la información del paciente y su tratamiento</p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Paso {currentStep} de {totalSteps}
            </CardTitle>
            <CardDescription className="text-center text-lg">
              {currentStep === 1 && 'Información del Cuidador'}
              {currentStep === 2 && 'Datos Generales del Paciente'}
              {currentStep === 3 && 'Medicamentos del Paciente'}
              {currentStep === 4 && 'Contactos de Emergencia'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {renderStepIndicator()}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PASO 1: Datos del Cuidador */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 mb-6">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-blue-900 mb-1">Información del Cuidador</p>
                        <p className="text-sm text-blue-700">
                          Ingresa tus datos personales como cuidador o familiar responsable
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caregiverName" className="text-lg">Tu Nombre Completo</Label>
                    <Input
                      id="caregiverName"
                      placeholder="Ej: Ana María González López"
                      value={caregiverData.caregiverName}
                      onChange={(e) => setCaregiverData({...caregiverData, caregiverName: e.target.value})}
                      className="text-lg py-3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caregiverEmail" className="text-lg">Tu Correo Electrónico</Label>
                    <Input
                      id="caregiverEmail"
                      type="email"
                      placeholder="tu"
                      value={caregiverData.caregiverEmail}
                      onChange={(e) => setCaregiverData({...caregiverData, caregiverEmail: e.target.value})}
                      className="text-lg py-3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caregiverPhone" className="text-lg">Tu Teléfono</Label>
                    <Input
                      id="caregiverPhone"
                      type="tel"
                      placeholder="+52 333 123 4567"
                      value={caregiverData.caregiverPhone}
                      onChange={(e) => setCaregiverData({...caregiverData, caregiverPhone: e.target.value})}
                      className="text-lg py-3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship" className="text-lg">Tu Relación con el Paciente</Label>
                    <Select 
                      value={caregiverData.relationship} 
                      onValueChange={(value) => setCaregiverData({...caregiverData, relationship: value})}
                    >
                      <SelectTrigger className="text-lg py-3">
                        <SelectValue placeholder="Selecciona la relación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hijo/a">Hijo/a</SelectItem>
                        <SelectItem value="Hija">Hija</SelectItem>
                        <SelectItem value="Hijo">Hijo</SelectItem>
                        <SelectItem value="Cónyuge">Cónyuge</SelectItem>
                        <SelectItem value="Esposa">Esposa</SelectItem>
                        <SelectItem value="Esposo">Esposo</SelectItem>
                        <SelectItem value="Madre">Madre</SelectItem>
                        <SelectItem value="Padre">Padre</SelectItem>
                        <SelectItem value="Hermano/a">Hermano/a</SelectItem>
                        <SelectItem value="Hermana">Hermana</SelectItem>
                        <SelectItem value="Hermano">Hermano</SelectItem>
                        <SelectItem value="Nieto/a">Nieto/a</SelectItem>
                        <SelectItem value="Nieta">Nieta</SelectItem>
                        <SelectItem value="Nieto">Nieto</SelectItem>
                        <SelectItem value="Abuela">Abuela</SelectItem>
                        <SelectItem value="Abuelo">Abuelo</SelectItem>
                        <SelectItem value="Cuidador Profesional">Cuidador Profesional</SelectItem>
                        <SelectItem value="Enfermero/a">Enfermero/a</SelectItem>
                        <SelectItem value="Enfermera">Enfermera</SelectItem>
                        <SelectItem value="Enfermero">Enfermero</SelectItem>
                        <SelectItem value="Otro Familiar">Otro Familiar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caregiverPassword" className="text-lg">Contraseña</Label>
                    <Input
                      id="caregiverPassword"
                      type="password"
                      placeholder="••••••••"
                      value={caregiverData.caregiverPassword}
                      onChange={(e) => setCaregiverData({...caregiverData, caregiverPassword: e.target.value})}
                      className="text-lg py-3"
                      required
                    />
                  </div>
                </div>
              )}

              {/* PASO 2: Datos del Paciente */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 mb-6">
                    <div className="flex items-start space-x-3">
                      <Heart className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-900 mb-1">Datos del Paciente</p>
                        <p className="text-sm text-green-700">
                          Información médica y personal del adulto mayor que vas a cuidar
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientName" className="text-lg">Nombre Completo del Paciente</Label>
                    <Input
                      id="patientName"
                      placeholder="Ej: María Guadalupe Hernández"
                      value={caregiverData.patientName}
                      onChange={(e) => setCaregiverData({...caregiverData, patientName: e.target.value})}
                      className="text-lg py-3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientAge" className="text-lg">Edad</Label>
                      <Input
                        id="patientAge"
                        type="number"
                        placeholder="75"
                        value={caregiverData.patientAge}
                        onChange={(e) => setCaregiverData({...caregiverData, patientAge: e.target.value})}
                        className="text-lg py-3"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patientGender" className="text-lg">Género</Label>
                      <Select 
                        value={caregiverData.patientGender} 
                        onValueChange={(value) => setCaregiverData({...caregiverData, patientGender: value})}
                      >
                        <SelectTrigger className="text-lg py-3">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Femenino">Femenino</SelectItem>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientBloodType" className="text-lg">Tipo de Sangre</Label>
                    <Select 
                      value={caregiverData.patientBloodType} 
                      onValueChange={(value) => setCaregiverData({...caregiverData, patientBloodType: value})}
                    >
                      <SelectTrigger className="text-lg py-3">
                        <SelectValue placeholder="Selecciona tipo de sangre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientAllergies" className="text-lg">Alergias</Label>
                    <Textarea
                      id="patientAllergies"
                      placeholder="Ej: Penicilina, mariscos, polen..."
                      value={caregiverData.patientAllergies}
                      onChange={(e) => setCaregiverData({...caregiverData, patientAllergies: e.target.value})}
                      className="text-lg min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientConditions" className="text-lg">Condiciones Médicas</Label>
                    <Textarea
                      id="patientConditions"
                      placeholder="Ej: Diabetes tipo 2, hipertensión, artritis..."
                      value={caregiverData.patientConditions}
                      onChange={(e) => setCaregiverData({...caregiverData, patientConditions: e.target.value})}
                      className="text-lg min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientAddress" className="text-lg">Dirección del Paciente</Label>
                    <Input
                      id="patientAddress"
                      type="text"
                      placeholder="Calle, número, colonia, ciudad"
                      value={caregiverData.patientAddress}
                      onChange={(e) => setCaregiverData({...caregiverData, patientAddress: e.target.value})}
                      className="text-lg py-3"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Esta información se usará en caso de emergencia
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientMedicalInsurance" className="text-lg">Seguro Médico del Paciente</Label>
                    <Select 
                      value={caregiverData.patientMedicalInsurance} 
                      onValueChange={(value) => setCaregiverData({...caregiverData, patientMedicalInsurance: value})}
                    >
                      <SelectTrigger className="text-lg py-3">
                        <SelectValue placeholder="Selecciona el seguro médico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imss">IMSS (Instituto Mexicano del Seguro Social)</SelectItem>
                        <SelectItem value="issste">ISSSTE (Instituto de Seguridad y Servicios Sociales de los Trabajadores del Estado)</SelectItem>
                        <SelectItem value="insabi">INSABI (Instituto de Salud para el Bienestar)</SelectItem>
                        <SelectItem value="seguro-popular">Seguro Popular</SelectItem>
                        <SelectItem value="privado-gnp">GNP Seguros</SelectItem>
                        <SelectItem value="privado-metlife">MetLife</SelectItem>
                        <SelectItem value="privado-axa">AXA Seguros</SelectItem>
                        <SelectItem value="privado-mapfre">MAPFRE</SelectItem>
                        <SelectItem value="privado-inbursa">Seguros Inbursa</SelectItem>
                        <SelectItem value="privado-banorte">Seguros Banorte</SelectItem>
                        <SelectItem value="privado-otro">Otro seguro privado</SelectItem>
                        <SelectItem value="ninguno">Sin seguro médico</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">
                      Facilita la atención médica en caso de emergencia
                    </p>
                  </div>
                </div>
              )}

              {/* PASO 3: Medicamentos */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200 mb-6">
                    <div className="flex items-start space-x-3">
                      <Pill className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-purple-900 mb-1">Medicamentos del Paciente</p>
                        <p className="text-sm text-purple-700">
                          Agrega todos los medicamentos que el paciente debe tomar regularmente
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-lg">Listado de Medicamentos</Label>
                    <Button
                      type="button"
                      onClick={addMedication}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agregar Medicamento</span>
                    </Button>
                  </div>

                  {caregiverData.medications.map((medication, index) => (
                    <div key={index} className="p-6 border-2 rounded-lg bg-white shadow-sm space-y-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-lg flex items-center">
                          <Pill className="h-5 w-5 mr-2 text-purple-600" />
                          Medicamento {index + 1}
                        </h4>
                        {caregiverData.medications.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMedication(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`med-name-${index}`}>Nombre del Medicamento</Label>
                          <Input
                            id={`med-name-${index}`}
                            placeholder="Ej: Metformina"
                            value={medication.name}
                            onChange={(e) => updateMedication(index, 'name', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`med-dosage-${index}`}>Dosis</Label>
                          <Input
                            id={`med-dosage-${index}`}
                            placeholder="Ej: 500mg"
                            value={medication.dosage}
                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`med-frequency-${index}`}>Frecuencia</Label>
                          <Select 
                            value={medication.frequency} 
                            onValueChange={(value) => updateMedication(index, 'frequency', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Una vez al día">Una vez al día</SelectItem>
                              <SelectItem value="Dos veces al día">Dos veces al día</SelectItem>
                              <SelectItem value="Tres veces al día">Tres veces al día</SelectItem>
                              <SelectItem value="Cada 8 horas">Cada 8 horas</SelectItem>
                              <SelectItem value="Cada 12 horas">Cada 12 horas</SelectItem>
                              <SelectItem value="Según necesidad">Según necesidad</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`med-time-${index}`}>Horario Principal</Label>
                          <Input
                            id={`med-time-${index}`}
                            type="time"
                            value={medication.time}
                            onChange={(e) => updateMedication(index, 'time', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`med-color-${index}`}>Color de la Pastilla</Label>
                          <Select 
                            value={medication.color} 
                            onValueChange={(value) => updateMedication(index, 'color', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar color" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="blue">Azul</SelectItem>
                              <SelectItem value="red">Roja</SelectItem>
                              <SelectItem value="white">Blanca</SelectItem>
                              <SelectItem value="yellow">Amarilla</SelectItem>
                              <SelectItem value="green">Verde</SelectItem>
                              <SelectItem value="orange">Naranja</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`med-instructions-${index}`}>Instrucciones Especiales</Label>
                          <Textarea
                            id={`med-instructions-${index}`}
                            placeholder="Ej: Tomar con alimentos, no tomar con lácteos..."
                            value={medication.instructions}
                            onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PASO 4: Contactos de Emergencia */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200 mb-6">
                    <div className="flex items-start space-x-3">
                      <Users className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-orange-900 mb-1">Contactos de Emergencia</p>
                        <p className="text-sm text-orange-700">
                          Personas que deben ser notificadas en caso de emergencia médica
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-lg">Contactos de Emergencia</Label>
                    <Button
                      type="button"
                      onClick={addEmergencyContact}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agregar Contacto</span>
                    </Button>
                  </div>

                  {caregiverData.emergencyContacts.map((contact, index) => (
                    <div key={index} className="p-6 border-2 rounded-lg bg-white shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-lg">Contacto {index + 1}</h4>
                        {caregiverData.emergencyContacts.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEmergencyContact(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`contact-name-${index}`}>Nombre Completo</Label>
                          <Input
                            id={`contact-name-${index}`}
                            placeholder="Nombre del contacto"
                            value={contact.name}
                            onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`contact-phone-${index}`}>Teléfono</Label>
                          <Input
                            id={`contact-phone-${index}`}
                            type="tel"
                            placeholder="+52 333 123 4567"
                            value={contact.phone}
                            onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`contact-relationship-${index}`}>Parentesco</Label>
                          <Select 
                            value={contact.relationship} 
                            onValueChange={(value) => updateEmergencyContact(index, 'relationship', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Hijo/a">Hijo/a</SelectItem>
                              <SelectItem value="Cónyuge">Cónyuge</SelectItem>
                              <SelectItem value="Hermano/a">Hermano/a</SelectItem>
                              <SelectItem value="Nieto/a">Nieto/a</SelectItem>
                              <SelectItem value="Médico">Médico</SelectItem>
                              <SelectItem value="Enfermero/a">Enfermero/a</SelectItem>
                              <SelectItem value="Vecino/a">Vecino/a</SelectItem>
                              <SelectItem value="Amigo/a">Amigo/a</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 mt-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Red de Apoyo Familiar</p>
                        <p>
                          Estos contactos recibirán notificaciones sobre medicamentos, 
                          alertas de salud y podrán monitorear el bienestar del paciente.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de navegación */}
              <div className="flex items-center justify-between pt-6 border-t-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={currentStep === 1 ? onBack : handlePrevious}
                  className="text-lg py-3 px-6"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  {currentStep === 1 ? 'Volver' : 'Anterior'}
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="text-lg py-3 px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    Siguiente
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="text-lg py-3 px-6 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Completar Registro
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
