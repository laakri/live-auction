// components/ui/image-upload.tsx
import React, { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface ImageUploadProps {
  onChange: (urls: string[]) => void;
  maxImages: number;
  className?: string;
}

export function ImageUpload({
  onChange,
  maxImages,
  className,
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      const updatedImages = [...images, ...newImages].slice(0, maxImages);
      setImages(updatedImages);
      onChange(updatedImages);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onChange(updatedImages);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Uploaded ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg shadow-md transition-all duration-300 group-hover:opacity-75"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => removeImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {images.length < maxImages && (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 flex flex-col">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              multiple
              accept="image/*"
            />
          </label>
        )}
      </div>
      {images.length > 0 && (
        <p className="text-sm text-gray-500">
          {images.length} of {maxImages} images uploaded
        </p>
      )}
    </div>
  );
}
