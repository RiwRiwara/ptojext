import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { TbUpload, TbRefresh, TbTrash } from 'react-icons/tb';
import { FaImage } from 'react-icons/fa';
import { useFlowStore } from '../store';

export function ImageInputNode({ data, id, selected }: NodeProps) {
  const [image, setImage] = useState<string | null>(null);
  const { setNodeInputImage, setNodeOutputImage, getNodeOutputImage, processFlow } = useFlowStore();
  
  // When an image is uploaded, update the local state and the store
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        console.log(`ImageInputNode ${id} uploaded image`);
        setImage(imageData);
        
        // Set both input and output image in the store
        setNodeInputImage(id as string, imageData);
        setNodeOutputImage(id as string, imageData);
        
        // Trigger flow processing to propagate the image to connected nodes
        setTimeout(() => {
          console.log(`ImageInputNode ${id} triggering flow processing`);
          processFlow([], []);
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Reset the image
  const handleReset = () => {
    setImage(null);
    setNodeInputImage(id as string, null);
    setNodeOutputImage(id as string, null);
    
    // Trigger flow processing to update connected nodes
    setTimeout(() => {
      processFlow([], []);
    }, 100);
  };
  
  // Check for output image from the store
  useEffect(() => {
    const outputImage = getNodeOutputImage(id as string);
    if (outputImage && outputImage !== image) {
      setImage(outputImage);
    }
  }, [id, getNodeOutputImage, image]);
  
  return (
    <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 min-w-[200px]">
      <div className="font-medium text-sm mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaImage className="text-[#83AFC9]" />
          <span>{typeof data === 'object' && data && 'label' in data ? String(data.label) : 'Image Input'}</span>
        </div>
        {image && (
          <button 
            onClick={handleReset}
            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
            title="Remove image"
          >
            <TbTrash size={14} />
          </button>
        )}
      </div>
      
      <div className="border-t border-gray-100 pt-2">
        <div className="text-xs text-gray-500 mb-1">Output</div>
        <div className="bg-gray-50 rounded-md overflow-hidden relative">
          {image ? (
            <div className="relative">
              <img src={image} alt="Input" className="w-full h-auto rounded border border-gray-200" />
              <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">Out</div>
            </div>
          ) : (
            <div className="w-full h-[120px] flex flex-col items-center justify-center p-4 text-center">
              <TbUpload className="text-gray-400 mb-2" size={24} />
              <label className="cursor-pointer text-sm text-gray-600 hover:text-[#83AFC9]">
                <span>Click to upload image</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          )}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: '#83AFC9', width: 10, height: 10 }}
      />
    </div>
  );
}
