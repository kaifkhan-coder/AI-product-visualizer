
import React, { useState } from 'react';
import { MarketingMedium } from './types';
import { generateMarketingImage, editImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import MediumSelector from './components/MediumSelector';
import ImageEditor from './components/ImageEditor';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (base64Image: string) => {
    setProductImage(base64Image);
    setGeneratedImage(null);
    setError(null);
  };

  const handleGenerate = async (medium: MarketingMedium) => {
    if (!productImage) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateMarketingImage(productImage, medium);
      setGeneratedImage(result);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (prompt: string) => {
    if (!generatedImage) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await editImage(generatedImage, prompt);
      setGeneratedImage(result);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setProductImage(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 sticky top-0 z-20">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            AI Product Visualizer
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {error && (
            <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls */}
          <div className="flex flex-col space-y-6">
            {!productImage ? (
                <div>
                    <h2 className="text-lg font-semibold text-gray-200 mb-4">1. Upload your product image</h2>
                    <ImageUploader onImageUpload={handleImageUpload} />
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-200 mb-4">1. Your product image</h2>
                        <div className="relative">
                            <img src={productImage} alt="Uploaded Product" className="w-full rounded-lg shadow-lg border border-gray-700" />
                             <button onClick={handleReset} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full text-sm transition-colors">
                                Reset
                            </button>
                        </div>
                    </div>
                    {!generatedImage && !isLoading && <MediumSelector onSelectMedium={handleGenerate} isLoading={isLoading} />}
                </div>
            )}
            
            {generatedImage && <ImageEditor imageSrc={generatedImage} onEdit={handleEdit} isLoading={isLoading} onReset={handleReset} />}
          </div>

          {/* Right Column: Display */}
          <div className="flex items-center justify-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 min-h-[400px] lg:min-h-0 sticky top-24">
            {!generatedImage && !isLoading && (
                 <div className="text-center text-gray-500">
                    <p className="text-lg">Your generated image will appear here.</p>
                    <p className="text-sm">Upload an image and select a medium to start.</p>
                </div>
            )}
            {isLoading && !generatedImage && (
                <div className="text-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-gray-400">Generating visualization...</p>
                </div>
            )}
            {generatedImage && !isLoading && (
                <img src={generatedImage} alt="Generated Visualization" className="max-w-full max-h-full object-contain rounded-md" />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
