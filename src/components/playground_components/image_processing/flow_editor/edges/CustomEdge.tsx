import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  EdgeProps,
  useReactFlow,
} from '@xyflow/react';
import { TbTrash, TbSettings } from 'react-icons/tb';
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";

/**
 * CustomEdge component for the Flow Editor
 * This component renders a custom edge with controls for the Flow Editor
 */
export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  // Use React Flow's built-in hook instead of custom store to avoid TypeScript issues
  const { setEdges, getEdges } = useReactFlow();
  
  // Get bezier path for the edge
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Handle edge deletion
  const onEdgeDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (id) {
      // Use React Flow's built-in methods to remove the edge
      // This will filter out the edge with the given ID
      setEdges((edges) => edges.filter((edge) => edge.id !== id));
      console.log('Edge deleted:', id);
    }
  };

  // Prevent propagation for all edge control interactions
  const preventPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Render the actual edge path */}
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      
      {/* Render the edge controls */}
      <EdgeLabelRenderer>
        <div
          className="edge-controls nodrag nopan"
          style={{
            transform: `translate(0%, -15%) translate(${labelX}px,${labelY}px)`,
            zIndex: 1000,
            pointerEvents: 'all',
          }}
          onClick={preventPropagation}
          onMouseDown={preventPropagation}
        >
          {/* Use HeroUI Popover for better positioning */}
          <Popover placement="top">
            <PopoverTrigger>
              <button 
                className="edge-button"
                onClick={preventPropagation}
                onMouseDown={preventPropagation}
                onTouchStart={preventPropagation}
              >
                <TbSettings size={24} className="text-[#83AFC9]" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 min-w-[140px] z-[1001]">
              <div className="py-1 border-b border-gray-100">
                <div className="px-3 py-2 text-xs font-medium text-gray-700">
                  Edge Options
                </div>
              </div>
              
              <div className="py-1">
                <button
                  className="w-full px-3 py-2 text-xs text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                  onClick={onEdgeDelete}
                  onMouseDown={preventPropagation}
                  onTouchStart={preventPropagation}
                >
                  <TbTrash size={14} />
                  <span>Delete Edge</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
