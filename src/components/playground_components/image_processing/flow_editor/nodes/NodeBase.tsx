import React, { ReactNode, useState, useRef } from 'react';
import { FaChevronDown, FaChevronUp, FaEllipsisV } from 'react-icons/fa';
import { TbAdjustments, TbSettings, TbTrash, TbCopy, TbPencil } from 'react-icons/tb';
import { Node } from '@xyflow/react';
import { CustomSlider } from './CustomSlider';
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { useFlowStore } from '../store';

export interface NodeSectionProps {
  title: string;
  badge?: {
    text: string;
    color: string;
  };
  children: ReactNode;
}

export interface NodeBaseProps {
  id: string;
  title: string;
  icon: ReactNode;
  type?: string;
  selected?: boolean;
  nodeRight?: ReactNode;
  inputSection?: ReactNode;
  propertiesSection?: {
    show: boolean;
    setShow: (show: boolean) => void;
    content: ReactNode;
  };
  outputSection?: ReactNode;
  onNodeClick?: () => void;
  handles?: ReactNode;
  node?: Node;
}

export const NodeSection: React.FC<NodeSectionProps> = ({
  title,
  badge,
  children
}) => {
  return (
    <div className="bg-gray-50 p-2 rounded border border-gray-100">
      <div className="text-xs font-medium text-gray-700 mb-1 flex justify-between items-center">
        <span>{title}</span>
        {badge && (
          <div className={`px-1.5 py-0.5 bg-${badge.color}-100 text-${badge.color}-800 rounded-full text-xs`}>
            {badge.text}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export const NodeBase: React.FC<NodeBaseProps> = ({
  id,
  title,
  icon,
  type,
  selected,
  nodeRight,
  inputSection,
  propertiesSection,
  outputSection,
  onNodeClick,
  handles,
  node
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // Get store functions directly rather than through getState to fix TypeScript errors
  const storeRemoveNode = useFlowStore(state => state.removeNode);
  const storeSetSelectedNode = useFlowStore(state => state.setSelectedNode);
  
  // Create handler functions
  const removeNode = node?.id ? () => storeRemoveNode(node.id) : undefined;
  const setSelectedNode = () => node && storeSetSelectedNode(node);

  // Event handlers for node menu actions
  const handleMenuItemClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent node selection when clicking menu items
  };

  // Helper function to determine the input section visibility based on node type
  const shouldShowInputSection = (type?: string) => {
    // ONLY show input section for imageInput nodes
    return type === 'imageInput';
  };

  return (
    <div
      ref={nodeRef}
      className={`bg-white rounded-md shadow-md border ${selected ? 'border-blue-500' : 'border-gray-200'} w-64 overflow-hidden`}
      onClick={onNodeClick}
    >
      {/* Node Header */}
      <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="text-[#83AFC9]">
            {icon}
          </div>
          <div className="font-medium text-sm text-gray-800">{title}</div>
        </div>
        <div className="flex items-center gap-1">
          {nodeRight}
          <Popover placement="top-end">
            <PopoverTrigger>
              <button
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200"
                onClick={(e) => e.stopPropagation()} // Prevent node selection when clicking this button
              >
                <FaEllipsisV size={12} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 min-w-[180px]" onClick={handleMenuItemClick}>
              <div className="py-1 border-b border-gray-100">
                <div className="px-3 py-2 text-sm font-medium text-gray-700 truncate">
                  {node && typeof node.data === 'object' && 'label' in node.data ?
                    String(node.data.label) : 'Node'}
                </div>
              </div>

              <div className="py-1">
                <button
                  className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode();
                  }}
                >
                  <TbSettings size={16} className="text-gray-500" />
                  <span>Properties</span>
                </button>

                <button
                  className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <TbCopy size={16} className="text-gray-500" />
                  <span>Duplicate</span>
                </button>

                <button
                  className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <TbPencil size={16} className="text-gray-500" />
                  <span>Rename</span>
                </button>

                {removeNode && (
                  <button
                    className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (removeNode) removeNode();
                    }}
                  >
                    <TbTrash size={16} className="text-red-500" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Node Content */}
      <div className="p-2 space-y-2">
        {/* Input Section */}
        {shouldShowInputSection(type) && inputSection && (
          <NodeSection title="Input" badge={{ text: 'Image', color: 'blue' }}>
            {inputSection}
          </NodeSection>
        )}

        {/* Properties Section - Collapsible */}
        {propertiesSection && (
          <div className="bg-gray-50 p-2 rounded border border-gray-100">
            <button
              className="w-full text-xs font-medium text-gray-700 flex justify-between items-center"
              onClick={(e) => {
                e.stopPropagation();
                propertiesSection.setShow(!propertiesSection.show);
              }}
            >
              <div className="flex items-center gap-1">
                <TbAdjustments size={14} />
                <span>Properties</span>
              </div>
              {propertiesSection.show ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
            </button>

            {propertiesSection.show && (
              <div className="mt-2 space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                {propertiesSection.content}
              </div>
            )}
          </div>
        )}

        {/* Output Section */}
        {outputSection && (
          <NodeSection title="Output" badge={{ text: 'Image', color: 'green' }}>
            {outputSection}
          </NodeSection>
        )}
      </div>

      {/* Node handles for connections */}
      {handles}
    </div>
  );
};

// This function is no longer needed as we've updated the grayscale parameter to be a slider
// Keeping it for backward compatibility with any existing nodes
const shouldUseSliderInstead = (paramName: string) => {
  return false; // We now use proper parameter types directly
};

export interface ParameterControlProps {
  parameter: {
    name: string;
    label: string;
    type: 'slider' | 'toggle' | 'select' | 'color';
    value: number | boolean | string;
    min?: number;
    max?: number;
    step?: number;
    options?: { label: string; value: string }[];
    description?: string;
  };
  onChange: (name: string, value: number | boolean | string) => void;
}

export const ParameterControl: React.FC<ParameterControlProps> = ({
  parameter,
  onChange,
}) => {
  const preventPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  // Check if this parameter should use a slider instead of its default type
  const shouldUseSlider = parameter.type === 'slider' ||
    (parameter.type === 'toggle' && shouldUseSliderInstead(parameter.name));

  return (
    <div className="flex flex-col mb-2">
      <div className="flex justify-between items-center mb-1">
        <div className="text-xs text-gray-600">{parameter.label || parameter.name}</div>
        <div className="text-xs font-mono bg-gray-100 px-1 py-0.5 rounded">{parameter.value?.toString()}</div>
      </div>

      {shouldUseSlider && (
        <CustomSlider
          value={typeof parameter.value === 'boolean'
            ? (parameter.value ? 1 : 0) // Convert boolean to number range if needed
            : parameter.value as number}
          min={parameter.min || 0}
          max={parameter.max || 100}
          step={parameter.step || 1}
          label=""
          onChange={(value) => {
            onChange(parameter.name, value);
          }}
        />
      )}

      {parameter.type === 'toggle' && !shouldUseSliderInstead(parameter.name) && (
        <div className="flex items-center" onMouseDown={preventPropagation} onClick={preventPropagation}>
          <input
            type="checkbox"
            checked={parameter.value as boolean}
            onChange={(e) => onChange(parameter.name, e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-xs text-gray-700">Enable</label>
        </div>
      )}

      {parameter.type === 'color' && (
        <input
          type="color"
          value={parameter.value as string}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onChange(parameter.name, e.target.value)}
          className="w-full h-6 cursor-pointer"
        />
      )}

      {parameter.type === 'select' && parameter.options && (
        <select
          value={parameter.value as string}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onChange(parameter.name, e.target.value)}
          className="w-full text-xs p-1 border border-gray-200 rounded"
        >
          {parameter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {parameter.description && (
        <p className="text-xs text-gray-400 italic">{parameter.description}</p>
      )}
    </div>
  );
};
