import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  Camera, 
  RotateCcw, 
  Check, 
  X,
  Zap,
  ZapOff,
  Upload,
  Trash2,
  Download
} from 'lucide-react';

interface MedicationPhotoCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  medicationName: string;
  onPhotoTaken: (photoData: { blob: Blob; url: string; timestamp: Date }) => void;
}

export function MedicationPhotoCapture({ 
  isOpen, 
  onClose, 
  medicationName, 
  onPhotoTaken 
}: MedicationPhotoCaptureProps) {
  const [isCamera, setIsCamera] = useState(true);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const constraints = {
        video: {
          facingMode: 'environment', // Usar cámara trasera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('No se pudo acceder a la cámara. Por favor, permite el acceso o usa la opción de subir archivo.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  React.useEffect(() => {
    if (isOpen && isCamera) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen, isCamera, startCamera, stopCamera]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Configurar canvas con las dimensiones del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el frame actual del video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir a blob y URL
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCapturedPhoto(url);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto);
    }
    startCamera();
  };

  const confirmPhoto = () => {
    if (!capturedPhoto || !canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        onPhotoTaken({
          blob,
          url: capturedPhoto,
          timestamp: new Date()
        });
        handleClose();
      }
    }, 'image/jpeg', 0.9);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCapturedPhoto(url);
    setIsCamera(false);
  };

  const handleClose = () => {
    stopCamera();
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto);
    }
    setCapturedPhoto(null);
    setError(null);
    setIsCamera(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Tomar Foto del Medicamento</DialogTitle>
          <DialogDescription className="text-lg">
            Fotografía tu {medicationName} para confirmar la toma
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Opciones de captura */}
          <div className="flex justify-center space-x-4">
            <Button
              variant={isCamera ? "default" : "outline"}
              onClick={() => {
                setIsCamera(true);
                setCapturedPhoto(null);
                startCamera();
              }}
              className="space-x-2"
            >
              <Camera className="h-5 w-5" />
              <span>Cámara</span>
            </Button>
            
            <Button
              variant={!isCamera ? "default" : "outline"}
              onClick={() => {
                setIsCamera(false);
                stopCamera();
                fileInputRef.current?.click();
              }}
              className="space-x-2"
            >
              <Upload className="h-5 w-5" />
              <span>Subir Archivo</span>
            </Button>
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-700 text-center">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Área de captura/preview */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
            {isCamera && !capturedPhoto && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay con guías visuales */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white/70 border-dashed rounded-lg w-3/4 h-3/4 flex items-center justify-center">
                    <div className="text-white/70 text-center">
                      <Camera className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Centra tu medicamento aquí</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {capturedPhoto && (
              <img
                src={capturedPhoto}
                alt="Medicamento capturado"
                className="w-full h-full object-cover"
              />
            )}

            {!isCamera && !capturedPhoto && (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4" />
                  <p>Selecciona un archivo para subir</p>
                </div>
              </div>
            )}
          </div>

          {/* Controles de cámara */}
          {isCamera && !capturedPhoto && (
            <div className="flex justify-center items-center space-x-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFlashOn(!isFlashOn)}
                className="space-x-2"
              >
                {isFlashOn ? <Zap className="h-4 w-4" /> : <ZapOff className="h-4 w-4" />}
                <span>Flash</span>
              </Button>

              <Button
                onClick={capturePhoto}
                size="lg"
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700"
              >
                <Camera className="h-8 w-8" />
              </Button>

              <div className="w-16"></div> {/* Espaciador para equilibrar */}
            </div>
          )}

          {/* Controles de confirmación */}
          {capturedPhoto && (
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={retakePhoto}
                className="space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Repetir</span>
              </Button>

              <Button
                onClick={confirmPhoto}
                className="bg-green-600 hover:bg-green-700 space-x-2"
              >
                <Check className="h-4 w-4" />
                <span>Confirmar Foto</span>
              </Button>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleClose}
              className="space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </Button>

            {capturedPhoto && (
              <Button
                variant="outline"
                onClick={() => {
                  // Crear enlace temporal para descargar
                  const link = document.createElement('a');
                  link.href = capturedPhoto;
                  link.download = `medicamento-${medicationName}-${new Date().toISOString().slice(0, 10)}.jpg`;
                  link.click();
                }}
                className="space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Descargar</span>
              </Button>
            )}
          </div>
        </div>

        {/* Canvas oculto para captura */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {/* Input de archivo oculto */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </DialogContent>
    </Dialog>
  );
}