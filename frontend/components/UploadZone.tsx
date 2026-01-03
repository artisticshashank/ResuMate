import React from 'react';
import { Upload } from 'lucide-react';

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
    isUploading: boolean;
}

export function UploadZone({ onFileSelect, isUploading }: UploadZoneProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50 hover:bg-blue-50 transition-colors h-full min-h-[400px]">
            <div className="bg-blue-100 p-4 rounded-full mb-6">
                <Upload className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Upload your Resume
            </h3>
            <p className="text-gray-500 mb-8 text-center max-w-sm">
                Drag and drop your LinkedIn PDF export here, or click to browse.
            </p>

            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
            />
            <label
                htmlFor="file-upload"
                className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-transform transform active:scale-95 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {isUploading ? "Processing..." : "Select PDF Document"}
            </label>
        </div>
    );
}
