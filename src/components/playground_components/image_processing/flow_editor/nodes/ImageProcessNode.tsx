import React, { useEffect, useState } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { FaFilter } from 'react-icons/fa';
import { useFlowStore } from '../store';
import { NodeParameter } from '../store/types';
import { NodeBase, ParameterControl } from './NodeBase';

export function ImageProcessNode({ data, id, selected }: NodeProps) {
  const [processingImage, setProcessingImage] = useState<boolean>(false);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [showProperties, setShowProperties] = useState<boolean>(false);
  const [parameters, setParameters] = useState<NodeParameter[]>([]);
  
  // Using individual selectors to prevent re-renders
  const setSelectedNode = useFlowStore(state => state.setSelectedNode);
  const getNodeInputImage = useFlowStore(state => state.getNodeInputImage);
  const getNodeOutputImage = useFlowStore(state => state.getNodeOutputImage);
  const processNode = useFlowStore(state => state.processNode);
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
  
  // Handle node selection for properties panel
  const handleNodeClick = () => {
    setSelectedNode({ id, data } as Node);
  };
  
  // Monitor for input image changes and process the node
  useEffect(() => {
    const newInputImage = getNodeInputImage(id as string);
    if (newInputImage && inputImage !== newInputImage) {
      setInputImage(newInputImage);
      setProcessingImage(true);
      // The actual processing happens in the store
      setTimeout(() => {
        processNode(id as string, [], []);
      }, 0);
    }
  }, [id, inputImage]); // Remove getNodeInputImage and processNode from dependencies
  
  // Monitor for output image changes
  useEffect(() => {
    const checkOutputImage = () => {
      const newOutputImage = getNodeOutputImage(id as string);
      if (newOutputImage && outputImage !== newOutputImage) {
        setOutputImage(newOutputImage);
        setProcessingImage(false);
      }
    };
    
    // Set up an interval to check for output changes
    const intervalId = setInterval(checkOutputImage, 100);
    checkOutputImage(); // Check immediately as well
    
    return () => clearInterval(intervalId);
  }, [id, outputImage]); // Remove getNodeOutputImage from dependencies
  
  // Force reprocessing when the node is selected
  useEffect(() => {
    if (selected && inputImage) {
      // Use setTimeout to avoid state updates during render
      setTimeout(() => {
        processNode(id as string, [], []);
      }, 0);
    }
  }, [selected, id, inputImage]); // Remove processNode from dependencies
  
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

  // Create properties section content with better organization
  const propertiesSectionContent = (
    <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
      {parameters.map((param, index) => (
        <React.Fragment key={param.name}>
          <ParameterControl 
            parameter={param} 
            onChange={handleParameterChange} 
          />
          {/* Add a divider between parameters if there are more after this one */}
          {index < parameters.length - 1 && (
            <div className="border-t border-gray-100 my-2"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Create output section content
  const outputSectionContent = (
    outputImage ? (
      <div className="relative">
        <img src={outputImage} alt="Processed" className="w-full h-auto rounded border border-gray-200 max-h-24 object-cover" />
      </div>
    ) : (
      <div className="w-full h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
        {processingImage ? 'Processing...' : 'No output'}
      </div>
    )
  );

  // Create node status indicator
  const nodeRight = (
    <div className="text-xs text-gray-500 flex items-center gap-1">
      <span className={`w-2 h-2 rounded-full ${outputImage ? 'bg-green-500' : 'bg-gray-300'} ${processingImage ? 'animate-pulse' : ''}`}></span>
      {processingImage ? 'Processing' : (outputImage ? 'Ready' : 'Waiting')}
    </div>
  );

  // Create node handles
  const handles = (
    <>
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
    </>
  );
  
  return (
    <NodeBase
      id={id}
      title={typeof data === 'object' && data && 'label' in data ? String(data.label) : 'Process'}
      icon={<FaFilter size={16} />}
      type="imageProcess"
      selected={selected}
      nodeRight={nodeRight}
      node={{ id, data, type: 'imageProcess' } as Node}
      inputSection={inputSectionContent}
      propertiesSection={{
        show: showProperties,
        setShow: setShowProperties,
        content: propertiesSectionContent
      }}
      outputSection={outputSectionContent}
      onNodeClick={handleNodeClick}
      handles={handles}
    />
  );
}
