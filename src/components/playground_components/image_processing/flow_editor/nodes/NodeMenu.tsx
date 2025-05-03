import React from 'react';
import { Node } from '@xyflow/react';
import { TbTrash, TbSettings, TbCopy, TbPencil } from 'react-icons/tb';
import { useFlowStore } from '../store';

interface NodeMenuProps {
  node: Node;
  position: { x: number; y: number };
  onClose: () => void;
}

export const NodeMenu: React.FC<NodeMenuProps> = ({ node, position, onClose }) => {
  const removeNode = useFlowStore(state => state.removeNode);
  const setSelectedNode = useFlowStore(state => state.setSelectedNode);
  
  const handleDelete = () => {
    removeNode(node.id);
    onClose();
  };
  
  const handleEdit = () => {
    setSelectedNode(node);
    onClose();
  };
  
  const handleDuplicate = () => {
    // Implement node duplication logic here
    // This would create a copy of the node with a new ID
    onClose();
  };

  // Prevent clicks inside the menu from propagating to canvas
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div 
      className="fixed bg-white rounded-md shadow-lg z-[1000] min-w-[180px] border border-gray-200"
      style={{ 
        left: position.x,
        top: position.y - 10, // Offset slightly
        transform: 'translate(-50%, -100%)' // Position menu above the button
      }}
      onClick={handleMenuClick}
    >
      <div className="py-1 border-b border-gray-100">
        <div className="px-3 py-2 text-sm font-medium text-gray-700 truncate">
          {node.data && typeof node.data === 'object' && 'label' in node.data ? 
            String(node.data.label) : 'Node'}
        </div>
      </div>
      
      <div className="py-1">
        <button
          className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          onClick={handleEdit}
        >
          <TbSettings size={16} className="text-gray-500" />
          <span>Properties</span>
        </button>
        
        <button
          className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          onClick={handleDuplicate}
        >
          <TbCopy size={16} className="text-gray-500" />
          <span>Duplicate</span>
        </button>
        
        <button
          className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          onClick={() => {}}
        >
          <TbPencil size={16} className="text-gray-500" />
          <span>Rename</span>
        </button>
      </div>
      
      <div className="py-1 border-t border-gray-100">
        <button
          className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
          onClick={handleDelete}
        >
          <TbTrash size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
