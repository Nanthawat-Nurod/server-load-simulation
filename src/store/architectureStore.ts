import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { Node, Edge, Connection, NodeChange, EdgeChange } from '@xyflow/react';
import type { AllNodeConfigs, AnyNodeConfig } from '../types/nodes';

export type AppNode = Node<AnyNodeConfig>;

interface ArchitectureState {
    nodes: AppNode[];
    edges: Edge[];
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    setNodes: (nodes: AppNode[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNode: (node: AppNode) => void;
    updateNodeConfig: (id: string, config: Partial<AllNodeConfigs>) => void;
    removeNode: (id: string) => void;
}

export const useArchitectureStore = create<ArchitectureState>((set, get) => ({
    nodes: [],
    edges: [],
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes) as AppNode[],
        });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
    },
    setNodes: (nodes: AppNode[]) => set({ nodes }),
    setEdges: (edges: Edge[]) => set({ edges }),
    addNode: (node: AppNode) => set({ nodes: [...get().nodes, node] }),
    updateNodeConfig: (id: string, config: Partial<AllNodeConfigs>) => set({
        nodes: get().nodes.map(node => {
            if (node.id === id) {
                return { ...node, data: { ...node.data, ...config } as AnyNodeConfig };
            }
            return node;
        })
    }),
    removeNode: (id: string) => set({
        nodes: get().nodes.filter(n => n.id !== id),
        edges: get().edges.filter(e => e.source !== id && e.target !== id)
    }),
}));
