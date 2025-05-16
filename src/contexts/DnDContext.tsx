"use client";
import React, { createContext, useContext, useState } from 'react';
import { NodeTypes } from '@/components/flow/types';

interface DnDContextType {
  nodeType: NodeTypes | null;
  setNodeType: (type: NodeTypes | null) => void;
  nodeData: Record<string, unknown> | null;
  setNodeData: (data: Record<string, unknown> | null) => void;
}

const DnDContext = createContext<DnDContextType | undefined>(undefined);

export function DnDProvider({ children }: { children: React.ReactNode }) {
  const [nodeType, setNodeType] = useState<NodeTypes | null>(null);
  const [nodeData, setNodeData] = useState<Record<string, unknown> | null>(null);

  return (
    <DnDContext.Provider value={{ nodeType, setNodeType, nodeData, setNodeData }}>
      {children}
    </DnDContext.Provider>
  );
}

export function useDnD() {
  const context = useContext(DnDContext);
  
  if (context === undefined) {
    throw new Error('useDnD must be used within a DnDProvider');
  }
  
  return context;
}
