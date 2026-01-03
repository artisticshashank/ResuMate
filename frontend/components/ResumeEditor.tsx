import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Code, FolderGit2 } from 'lucide-react';

interface ResumeEditorProps {
    data: any;
    onUpdate: (newData: any) => void;
}

export function ResumeEditor({ data, onUpdate }: ResumeEditorProps) {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'experience', icon: Briefcase, label: 'Experience' },
        { id: 'education', icon: GraduationCap, label: 'Education' },
        { id: 'projects', icon: FolderGit2, label: 'Projects' },
        { id: 'skills', icon: Code, label: 'Skills' },
    ];

    // Placeholder for actual form logic
    // For now, we just show a JSON editor to prove the split screen works
    const [jsonText, setJsonText] = useState(JSON.stringify(data, null, 2));

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setJsonText(e.target.value);
        try {
            const parsed = JSON.parse(e.target.value);
            onUpdate(parsed);
        } catch (err) {
            // invalid json, ignore update
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex bg-gray-50 border-b border-gray-200 overflow-x-auto scroller-hide">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <Icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                {/* This will be replaced by specific form fields later */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-amber-800 text-sm">
                    ⚠️ Advanced Editor Coming Soon. Edit JSON directly below to update the preview.
                </div>
                <textarea
                    value={jsonText}
                    onChange={handleJsonChange}
                    className="w-full h-full min-h-[500px] font-mono text-xs p-4 bg-gray-900 text-green-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    spellCheck={false}
                />
            </div>
        </div>
    );
}
