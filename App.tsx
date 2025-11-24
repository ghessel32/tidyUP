import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { Button } from './components/Button';
import { analyzeRoomImage } from './services/geminiService';
import { AppState, RoomAnalysis, UploadedImage } from './types';
import { ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [analysisResult, setAnalysisResult] = useState<RoomAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (image: UploadedImage) => {
    setCurrentImage(image);
    setAppState(AppState.ANALYZING);
    setError(null);
    
    // Smooth scroll to analysis area
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const result = await analyzeRoomImage(image.base64);
      setAnalysisResult(result);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("We couldn't analyze this image properly. Please try a clearer photo or a different angle.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setCurrentImage(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Intro / Hero - Only show when IDLE */}
        {appState === AppState.IDLE && (
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
              Transform your chaos into <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">calm.</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Upload a photo of your cluttered room. Our AI will analyze it and create a personalized step-by-step organization plan just for you.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-12">
          
          {/* Uploader Section - Show when IDLE or ERROR */}
          {(appState === AppState.IDLE || appState === AppState.ERROR) && (
            <div className="max-w-2xl mx-auto w-full">
               {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start text-red-700">
                  <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              <div className="bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50">
                <ImageUploader onImageSelected={handleImageSelected} />
              </div>
            </div>
          )}

          {/* Analyzing State */}
          {appState === AppState.ANALYZING && currentImage && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative w-64 h-64 mb-8 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white">
                <img 
                  src={currentImage.previewUrl} 
                  alt="Analyzing room" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent flex items-end justify-center p-6">
                  {/* Scan line animation */}
                  <div className="absolute inset-0 bg-white/20 h-1 w-full animate-scan"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Analyzing your space...</h3>
              <p className="text-gray-500 animate-pulse">Identifying clutter patterns and storage opportunities</p>
            </div>
          )}

          {/* Results State */}
          {appState === AppState.SUCCESS && analysisResult && currentImage && (
            <div className="space-y-10">
              {/* Top Bar with Image Thumbnail */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={currentImage.previewUrl} 
                    alt="Original room" 
                    className="w-16 h-16 rounded-lg object-cover ring-1 ring-gray-200"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Analyzed Image</p>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{currentImage.file.name}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  icon={<RefreshCw className="w-4 h-4" />}
                >
                  Start Over
                </Button>
              </div>

              <AnalysisResult analysis={analysisResult} onReset={handleReset} />
            </div>
          )}
        </div>
      </main>

      {/* Styles for custom animations */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
