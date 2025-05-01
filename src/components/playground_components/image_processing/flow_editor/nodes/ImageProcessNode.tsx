import React, { useEffect, useState } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { FaFilter } from 'react-icons/fa';
import { useFlowStore } from '../store';

export function ImageProcessNode({ data, id, selected }: NodeProps) {
  const [processingImage, setProcessingImage] = useState<boolean>(false);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [inputImage, setInputImage] = useState<string | null>(null);
  
  const { 
    setSelectedNode, 
    getNodeInputImage, 
    getNodeOutputImage,
    setNodeInputImage,
    processNode,
    processFlow
  } = useFlowStore();
  
  // Handle node selection for properties panel
  const handleNodeClick = () => {
    setSelectedNode({ id, data } as Node);
  };
  
  // Monitor for input image changes and process the node
  useEffect(() => {
    console.log(`ImageProcessNode ${id} checking for input image`);
    const newInputImage = getNodeInputImage(id as string);
    if (newInputImage) {
      console.log(`ImageProcessNode ${id} received input image`);
      setInputImage(newInputImage);
      setProcessingImage(true);
      // The actual processing happens in the store
      processNode(id as string, [], []);
    }
  }, [id, getNodeInputImage, processNode]);
  
  // Monitor for output image changes
  useEffect(() => {
    console.log(`ImageProcessNode ${id} checking for output image`);
    const newOutputImage = getNodeOutputImage(id as string);
    if (newOutputImage) {
      console.log(`ImageProcessNode ${id} received output image`);
      setOutputImage(newOutputImage);
      setProcessingImage(false);
    }
  }, [id, getNodeOutputImage]);
  
  // Force reprocessing when the node is selected
  useEffect(() => {
    if (selected && inputImage) {
      console.log(`ImageProcessNode ${id} selected, reprocessing...`);
      processNode(id as string, [], []);
    }
  }, [selected, id, inputImage, processNode]);
  
  return (
    <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 min-w-[220px]" onClick={handleNodeClick}>
      <div className="font-medium text-sm mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaFilter className="text-[#83AFC9]" />
          <span>{typeof data === 'object' && data && 'label' in data ? String(data.label) : 'Process'}</span>
        </div>
        {/* Show processing status */}
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${outputImage ? 'bg-green-500' : 'bg-gray-300'} ${outputImage ? 'animate-pulse' : ''}`}></span>
          {outputImage ? 'Active' : 'Waiting'}
        </div>
      </div>
      
      <div className="space-y-2">
        {/* Input Image Preview */}
        <div className="border-t border-gray-100 pt-2">
          <div className="text-xs text-gray-500 mb-1">Input</div>
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
        
        {/* Output Image Preview */}
        <div className="border-t border-gray-100 pt-2">
          <div className="text-xs text-gray-500 mb-1">Output</div>
          {outputImage ? (
            <div className="relative">
              <img src={outputImage} alt="Processed" className="w-full h-auto rounded border border-gray-200" />
              <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">Out</div>
            </div>
          ) : (
            <div className="w-full h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
              Processing...
            </div>
          )}
        </div>
      </div>
      
      {/* Node handles for connections */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: '#83AFC9', width: 10, height: 10 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: '#83AFC9', width: 10, height: 10 }}
      />
    </div>
  );
}
