import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface PDFPreviewProps {
    pdfUrl: string | null;
    texCode: string;
}

export function PDFPreview({ pdfUrl, texCode }: PDFPreviewProps) {
    return (
        <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center text-gray-200">
                    <FileText className="w-4 h-4 mr-2 text-blue-400" />
                    <span className="font-semibold text-sm">Live Preview</span>
                </div>
                <div className="flex space-x-2">
                    {pdfUrl && (
                        <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition-colors"
                        >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Open
                        </a>
                    )}
                </div>
            </div>

            <div className="flex-1 bg-gray-500 relative">
                {pdfUrl ? (
                    <iframe
                        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-full absolute inset-0 border-none"
                        title="Resume Preview"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <p>Generating Preview...</p>
                    </div>
                )}
            </div>

            <div className="bg-gray-800 p-3 border-t border-gray-700 flex justify-between items-center">
                <span className="text-xs text-gray-500">Powered by Tectonic</span>
                <button
                    onClick={() => {
                        const blob = new Blob([texCode], { type: 'application/x-tex' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = "resume.tex";
                        a.click();
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                    Download Source (.tex)
                </button>
            </div>
        </div>
    );
}
