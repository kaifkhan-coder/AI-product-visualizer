
import React, { useState } from 'react';
import Spinner from './Spinner';

interface ImageEditorProps {
  imageSrc: string;
  onEdit: (prompt: string) => void;
  isLoading: boolean;
  onReset: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, onEdit, isLoading, onReset }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onEdit(prompt);
    }
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-lg font-semibold text-gray-200">3. Edit your image</h2>
      <div className="relative aspect-square w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
        {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
                <Spinner />
            </div>
        )}
        <img src={imageSrc} alt="Generated Visualization" className="object-contain w-full h-full" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Add a retro filter' or 'Change the background to a beach'"
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition"
          rows={3}
          disabled={isLoading}
        />
        <div className="flex flex-col sm:flex-row gap-3">
            <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="flex-grow px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
            Apply Edit
            </button>
            <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="flex-grow px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
            Start Over
            </button>
        </div>
      </form>
    </div>
  );
};

export default ImageEditor;
