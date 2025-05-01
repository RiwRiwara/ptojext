import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import { useFlowStore, NodeParameter } from './store';
import { TbX, TbInfoCircle, TbRefresh } from 'react-icons/tb';
import { FaSliders } from 'react-icons/fa6';

interface PropertiesPanelProps {
  node: Node | null;
}

export function PropertiesPanel({ node }: PropertiesPanelProps) {
  const { getNodeParameters, updateNodeParameter, setSelectedNode, processNode } = useFlowStore();
  const [showDescriptions, setShowDescriptions] = useState<boolean>(false);
  
  if (!node) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm p-4 text-center">
        <div className="max-w-xs">
          <FaSliders className="mx-auto mb-3 text-2xl text-gray-400" />
          <p>Select a node to view and edit its properties</p>
        </div>
      </div>
    );
  }
  
  const parameters = getNodeParameters(node.id);
  
  const handleSliderChange = (paramName: string, value: number) => {
    updateNodeParameter(node.id, paramName, value);
  };
  
  const handleToggleChange = (paramName: string, value: boolean) => {
    updateNodeParameter(node.id, paramName, value);
  };
  
  const handleClose = () => {
    setSelectedNode(null);
  };

  const resetToDefaults = () => {
    // Reset all parameters to their default values
    parameters.forEach(param => {
      if (param.defaultValue !== undefined) {
        updateNodeParameter(node.id, param.name, param.defaultValue);
      }
    });
    
    // Reprocess the node
    processNode(node.id, [], []);
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">
          {typeof node.data === 'object' && node.data && 'label' in node.data ? String(node.data.label) : 'Node'} Properties
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowDescriptions(!showDescriptions)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            title="Toggle parameter descriptions"
          >
            <TbInfoCircle size={18} />
          </button>
          <button 
            onClick={resetToDefaults}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            title="Reset to defaults"
          >
            <TbRefresh size={18} />
          </button>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            title="Close panel"
          >
            <TbX size={18} />
          </button>
        </div>
      </div>
      
      {parameters.length === 0 ? (
        <div className="text-gray-500 text-sm p-4 bg-gray-50 rounded-lg text-center">
          No editable properties for this node
        </div>
      ) : (
        <div className="space-y-4">
          {parameters.map((param) => (
            <div key={param.name} className="space-y-1 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  {param.label || param.name}
                </label>
                {param.defaultValue !== undefined && param.value !== param.defaultValue && (
                  <button 
                    onClick={() => updateNodeParameter(node.id, param.name, param.defaultValue as number | boolean | string)}
                    className="text-xs text-[#83AFC9] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              
              {showDescriptions && param.description && (
                <div className="text-xs text-gray-500 mb-2 italic">
                  {param.description}
                </div>
              )}
              
              {param.type === 'slider' && (
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={param.value as number}
                    onChange={(e) => handleSliderChange(param.name, parseFloat(e.target.value))}
                    className="w-full accent-[#83AFC9]"
                  />
                  <span className="text-sm text-gray-600 min-w-[40px] text-right">
                    {param.value}
                  </span>
                </div>
              )}
              
              {param.type === 'toggle' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={param.value as boolean}
                    onChange={(e) => handleToggleChange(param.name, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#83AFC9] focus:ring-[#83AFC9]"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {param.value ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              )}
              
              {param.type === 'color' && (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={param.value as string}
                    onChange={(e) => updateNodeParameter(node.id, param.name, e.target.value)}
                    className="h-8 w-8 rounded border-gray-300"
                  />
                  <input 
                    type="text" 
                    value={param.value as string} 
                    onChange={(e) => updateNodeParameter(node.id, param.name, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#83AFC9] focus:ring-[#83AFC9] text-sm"
                  />
                </div>
              )}
              
              {param.type === 'select' && param.options && (
                <select
                  value={param.value as string}
                  onChange={(e) => updateNodeParameter(node.id, param.name, e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#83AFC9] focus:ring-[#83AFC9] sm:text-sm"
                >
                  {param.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 mb-2">Node Information</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">ID:</span>
            <span className="font-mono text-gray-800">{node.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="text-gray-800">{node.type}</span>
          </div>
          {typeof node.data === 'object' && node.data && 'category' in node.data && (
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="text-gray-800">{String(node.data.category)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
