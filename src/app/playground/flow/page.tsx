"use client";
import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';
import {
    ReactFlow,
    OnConnect,
    useNodesState,
    useEdgesState,
    addEdge,
    Edge,
    Node,
} from '@xyflow/react';

import { NumNode } from '@/components/flow/nodes/num-node';
import { SumNode } from '@/components/flow/nodes/sum-node';

import { DataEdge } from '@/components/flow/data-edge';

const nodeTypes = {
    num: NumNode,
    sum: SumNode,
};

const initialNodes: Node[] = [
    { id: 'a', type: 'num', data: { value: 0 }, position: { x: 0, y: 0 } },
    { id: 'b', type: 'num', data: { value: 0 }, position: { x: 0, y: 200 } },
    { id: 'c', type: 'sum', data: { value: 0 }, position: { x: 300, y: 100 } },
    { id: 'd', type: 'num', data: { value: 0 }, position: { x: 0, y: 400 } },
    { id: 'e', type: 'sum', data: { value: 0 }, position: { x: 600, y: 400 } },
];

const edgeTypes = {
    data: DataEdge,
};

const initialEdges: Edge[] = [
    {
        id: 'a->c',
        type: 'data',
        data: { key: 'value' },
        source: 'a',
        target: 'c',
        targetHandle: 'x',
    },
    {
        id: 'b->c',
        type: 'data',
        data: { key: 'value' },
        source: 'b',
        target: 'c',
        targetHandle: 'y',
    },
    {
        id: 'c->e',
        type: 'data',
        data: { key: 'value' },
        source: 'c',
        target: 'e',
        targetHandle: 'x',
    },
    {
        id: 'd->e',
        type: 'data',
        data: { key: 'value' },
        source: 'd',
        target: 'e',
        targetHandle: 'y',
    },
];

function App() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect: OnConnect = useCallback(
        (params) => {
            setEdges((edges) =>
                addEdge({ type: 'data', data: { key: 'value' }, ...params }, edges),
            );
        },
        [setEdges],
    );

    return (
        <div className="h-screen w-screen p-8">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
            />
        </div>
    );
}

export default App;