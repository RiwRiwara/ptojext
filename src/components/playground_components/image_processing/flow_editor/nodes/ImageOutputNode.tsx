import React, { useEffect, useState } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { TbEye, TbDownload, TbRefresh } from 'react-icons/tb';
import { useFlowStore } from '../store';

export function ImageOutputNode({ data, id, selected }: NodeProps) {
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [inputImage, setInputImage] = useState<string | null>(null);
  const { getNodeInputImage, setNodeInputImage, processFlow } = useFlowStore();
  
  // Monitor for input image changes
  useEffect(() => {
    console.log(`ImageOutputNode ${id} checking for input image`);
    const newInputImage = getNodeInputImage(id as string);
    if (newInputImage) {
      console.log(`ImageOutputNode ${id} received input image`);
      setInputImage(newInputImage);
      setOutputImage(newInputImage); // For output nodes, input = output
    }
  }, [id, getNodeInputImage]);
  
  // Force refresh the node
  const handleRefresh = () => {
    console.log(`ImageOutputNode ${id} manually refreshing`);
    if (inputImage) {
      setOutputImage(inputImage);
    }
    processFlow([], []);
  };
  
  // Handle image download
  const handleDownload = () => {
    if (outputImage) {
      // Create a more descriptive filename
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
      const timeStr = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;
      
      const link = document.createElement('a');
      link.href = outputImage;
      link.download = `processed-image-${dateStr}-${timeStr}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 min-w-[200px]">
      <div className="font-medium text-sm mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TbEye className="text-[#83AFC9]" />
          <span>{typeof data === 'object' && data && 'label' in data ? String(data.label) : 'Output'}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleRefresh}
            className="text-gray-400 hover:text-[#83AFC9] p-1 rounded-full hover:bg-gray-100"
            title="Refresh output"
          >
            <TbRefresh size={14} />
          </button>
          {outputImage && (
            <button 
              onClick={handleDownload}
              className="text-gray-400 hover:text-[#83AFC9] p-1 rounded-full hover:bg-gray-100"
              title="Download image"
            >
              <TbDownload size={14} />
            </button>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-2">
        <div className="text-xs text-gray-500 mb-1">Input</div>
        <div className="bg-gray-50 rounded-md overflow-hidden relative">
          {inputImage ? (
            <div className="relative">
              <img src={inputImage} alt="Input" className="w-full h-auto rounded border border-gray-200" />
              <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">In</div>
            </div>
          ) : (
            <div className="w-full h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
              No input
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-2 mt-2">
        <div className="text-xs text-gray-500 mb-1">Final Output</div>
        <div className="bg-gray-50 rounded-md overflow-hidden relative">
          {outputImage ? (
            <div className="relative">
              <img src={outputImage} alt="Output" className="w-full h-auto rounded border border-gray-200" />
              <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">Out</div>
            </div>
          ) : (
            <div className="w-full h-[120px] flex items-center justify-center text-gray-400 text-xs">
              Waiting for input...
            </div>
          )}
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: '#83AFC9', width: 10, height: 10 }}
      />
    </div>
  );
}
