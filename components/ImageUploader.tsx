
import React, { useState, useCallback } from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (base64Image: string) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
};


const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(async (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        onImageUpload(base64);
    }
  }, [onImageUpload]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
        handleFileChange(e.target.files[0]);
     }
  };


  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
        ${isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700'}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <UploadIcon className="w-10 h-10 mb-4 text-gray-400" />
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
        </div>
        <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={onFileSelect} />
      </label>
    </div>
  );
};

export default ImageUploader;
