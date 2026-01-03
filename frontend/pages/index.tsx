import { useState } from 'react';
import Head from 'next/head';
import { UploadZone } from '../components/UploadZone';
import { ResumeEditor } from '../components/ResumeEditor';
import { PDFPreview } from '../components/PDFPreview';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (selectedFile: File) => {
    setFile(selectedFile);
    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDataUpdate = (newData: any) => {
    // In a real app, we'd debounce this and send it back to the backend to re-compile latex
    // For now, we just update local state, but we need a "Regenerate PDF" endpoint or logic
    // to actually see changes in PDF.
    // Since we don't have that yet, this is just for UI demo.
    console.log("Data updated:", newData);
    setResult((prev: any) => ({ ...prev, structured_data: newData }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 font-sans overflow-hidden">
      <Head>
        <title>LinkToTeX - Resume Architect</title>
      </Head>

      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">LinkToTeX</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Toolbar items can go here */}
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Error Toast */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center z-50 animate-fade-in-down">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {!result ? (
          // Upload View
          <div className="w-full h-full flex items-center justify-center p-6 animate-fade-in">
            <div className="max-w-xl w-full">
              <UploadZone onFileSelect={handleUpload} isUploading={uploading} />
            </div>
          </div>
        ) : (
          // Split View
          <div className="w-full h-full flex">
            <div className="w-1/2 h-full p-4 border-r border-gray-200 overflow-hidden">
              <ResumeEditor data={result.structured_data} onUpdate={handleDataUpdate} />
            </div>
            <div className="w-1/2 h-full p-4 bg-gray-800">
              <PDFPreview pdfUrl={result.pdf_url} texCode={result.generated_tex} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
