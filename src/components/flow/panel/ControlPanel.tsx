import React from 'react'
import { Panel, useReactFlow } from '@xyflow/react'

interface ControlPanelProps {
    processingQuality: 'low' | 'medium' | 'high';
    setProcessingQuality: (quality: 'low' | 'medium' | 'high') => void;
    processImages: () => void;
    processing: boolean;
}


export default function ControlPanel({
    processingQuality,
    setProcessingQuality,
    processImages,
    processing,
}: ControlPanelProps) {
    const { getNodes, getEdges } = useReactFlow();

    function logNodesAndEdges() {
        console.log('Nodes:', getNodes());
        console.log('Edges:', getEdges());
    }

    return (
        <Panel position="top-center" className="p-2">
            <div className="bg-white p-3 rounded-lg shadow-lg flex flex-col gap-3">
                {/* Quality Selection */}
                <div className="space-y-2">
                    <div className="text-sm font-medium">Processing Quality</div>
                    <div className="flex gap-2">
                        {['Low', 'Medium', 'High'].map((quality) => (
                            <button
                                key={quality}
                                className={`px-3 py-1 text-xs rounded ${processingQuality === quality.toLowerCase() ? 'bg-primary text-white' : 'bg-gray-100'
                                    }`}
                                onClick={() => setProcessingQuality(quality.toLowerCase() as 'low' | 'medium' | 'high')}
                            >
                                {quality}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Manual Process Button */}
                <button
                    onClick={() => {
                        processImages();
                        logNodesAndEdges();
                    }}
                    disabled={processing}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary text-white px-3 py-2 rounded font-medium transition-all disabled:opacity-50"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Process Now
                </button>
            </div>
        </Panel>
    )
}
