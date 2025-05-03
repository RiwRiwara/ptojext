import React, { useEffect, useState } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { TbEye, TbDownload, TbRefresh } from 'react-icons/tb';
import { useFlowStore } from '../store';
import { NodeParameter } from '../store/types';
import { NodeBase, ParameterControl } from './NodeBase';

export function ImageOutputNode({ data, id, selected }: NodeProps) {
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [showProperties, setShowProperties] = useState<boolean>(false);
  const [parameters, setParameters] = useState<NodeParameter[]>([]);
  
  // Using individual selectors to prevent re-renders
  const getNodeInputImage = useFlowStore(state => state.getNodeInputImage);
  const setNodeInputImage = useFlowStore(state => state.setNodeInputImage);
  const processFlow = useFlowStore(state => state.processFlow);
  const getNodeParameters = useFlowStore(state => state.getNodeParameters);
  const updateNodeParameter = useFlowStore(state => state.updateNodeParameter);
  
  // Load node parameters only once when the component mounts or when the id changes
  useEffect(() => {
    // Adding a small delay to ensure store is initialized
    const fetchParams = () => {
      const params = getNodeParameters(id as string);
      if (params) {
        setParameters(params);
      }
    };
    
    fetchParams();
  }, [id]); // Remove getNodeParameters from dependencies
  
  // Monitor for input image changes
  useEffect(() => {
    const checkInputImage = () => {
      const newInputImage = getNodeInputImage(id as string);
      if (newInputImage && inputImage !== newInputImage) {
        setInputImage(newInputImage);
        setOutputImage(newInputImage); // For output nodes, input = output
      }
    };
    
    // Set up an interval to check for input changes
    const intervalId = setInterval(checkInputImage, 100);
    checkInputImage(); // Check immediately as well
    
    return () => clearInterval(intervalId);
  }, [id, inputImage]); // Remove getNodeInputImage from dependencies
  
  // Force refresh the node
  const handleRefresh = () => {
    if (inputImage) {
      setOutputImage(inputImage);
    }
    // Use setTimeout to avoid state updates during render
    setTimeout(() => {
      processFlow([], []);
    }, 0);
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
  
  // Handle parameter change
  const handleParameterChange = (paramName: string, value: number | boolean | string) => {
    // Use setTimeout to avoid state updates during render
    setTimeout(() => {
      updateNodeParameter(id as string, paramName, value);
    }, 0);
  };

  // Create input section content
  const inputSectionContent = (
    inputImage ? (
      <div className="relative">
        <img src={inputImage} alt="Input" className="w-full h-auto rounded border border-gray-200 max-h-24 object-cover" />
      </div>
    ) : (
      <div className="w-full h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
        No input
      </div>
    )
  );

  // Create properties section content
  const propertiesSectionContent = parameters.length > 0 ? (
    <>
      {parameters.map((param) => (
        <ParameterControl 
          key={param.name} 
          parameter={param} 
          onChange={handleParameterChange} 
        />
      ))}
    </>
  ) : null;

  // Create output section content with download button
  const outputSectionContent = (
    outputImage ? (
      <div className="relative">
        <img src={outputImage} alt="Output" className="w-full h-auto rounded border border-gray-200 max-h-24 object-cover" />
        <div className="flex justify-end mt-1">
          <button 
            onClick={handleDownload}
            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-100"
          >
            <TbDownload size={12} />
            <span>Save</span>
          </button>
        </div>
      </div>
    ) : (
      <div className="w-full h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
        Waiting for input...
      </div>
    )
  );

  // Create node right side controls
  const nodeRight = (
    <div className="flex gap-1">
      <button 
        onClick={handleRefresh}
        className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100"
        title="Refresh output"
      >
        <TbRefresh size={14} />
      </button>
      {outputImage && (
        <button 
          onClick={handleDownload}
          className="text-gray-400 hover:text-green-500 p-1 rounded-full hover:bg-gray-100"
          title="Download image"
        >
          <TbDownload size={14} />
        </button>
      )}
    </div>
  );

  // Create node handles
  const handles = (
    <Handle
      type="target"
      position={Position.Left}
      id="input"
      style={{ background: '#83AFC9', width: 10, height: 10 }}
    />
  );
  
  return (
    <NodeBase
      id={id}
      title={typeof data === 'object' && data && 'label' in data ? String(data.label) : 'Output'}
      icon={<TbEye size={16} />}
      type="imageOutput"
      selected={selected}
      nodeRight={nodeRight}
      node={{ id, data, type: 'imageOutput' } as Node}
      inputSection={inputSectionContent}
      propertiesSection={parameters.length > 0 ? {
        show: showProperties,
        setShow: setShowProperties,
        content: propertiesSectionContent
      } : undefined}
      outputSection={outputSectionContent}
      handles={handles}
    />
  );
}
