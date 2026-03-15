"use client";
import React, { useMemo } from 'react';
import { ReactFlow, Controls, Background, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { KnowledgeItem } from './types';

interface GraphViewProps {
  items: KnowledgeItem[];
  onNodeClick: (id: number) => void;
  isDark: boolean;
}

export default function GraphView({ items, onNodeClick, isDark }: GraphViewProps) {

  const { nodes, edges } = useMemo(() => {
    const nds: Node[] = [];
    const eds: Edge[] = [];

    const nbSet = new Set<string>();
    const tagSet = new Set<string>();

    const colors = {
      note: isDark ? '#4ade80' : '#10b981',
      notebook: isDark ? '#818cf8' : '#6366f1',
      tag: isDark ? '#f472b6' : '#ec4899',
      bg: isDark ? '#1e1e24' : '#fff',
      text: isDark ? '#fff' : '#111827',
      border: isDark ? '#333' : '#e5e7eb'
    };

    // Extract unique notebooks and tags
    items.forEach(i => {
      if (i.notebook) nbSet.add(i.notebook);
      if (i.tags) {
        i.tags.split(',').forEach(t => {
          const cleanTag = t.trim();
          if (cleanTag) tagSet.add(cleanTag);
        });
      }
    });

    // Create Notebook Nodes
    let xOffset = 100;
    Array.from(nbSet).forEach((nb, i) => {
      nds.push({
        id: `nb-${nb}`,
        position: { x: xOffset + i * 250, y: 100 },
        data: { label: nb },
        style: {
          background: colors.bg,
          color: colors.text,
          border: `2px solid ${colors.notebook}`,
          borderRadius: 8,
          fontWeight: 700,
          padding: '10px 15px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }
      });
    });

    // Create Tag Nodes
    xOffset = 100;
    Array.from(tagSet).forEach((tag, i) => {
      nds.push({
        id: `tag-${tag}`,
        position: { x: xOffset + i * 150, y: 600 },
        data: { label: `#${tag}` },
        style: {
          background: colors.bg,
          color: colors.tag,
          border: `1px solid ${colors.tag}`,
          borderRadius: 16,
          fontSize: 12,
          padding: '6px 12px'
        }
      });
    });

    // Create Note Nodes & Edges
    items.forEach((item, i) => {
      const noteId = `note-${item.id}`;
      // Randomize layout a bit between notebooks and tags
      const nx = 150 + (i % 5) * 200 + Math.random() * 50;
      const ny = 300 + Math.random() * 200;

      nds.push({
        id: noteId,
        position: { x: nx, y: ny },
        data: { label: item.title || 'Untitled' },
        style: {
          background: colors.note,
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontWeight: 600,
          padding: '8px 14px',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }
      });

      // Edge to Notebook
      if (item.notebook) {
        eds.push({
          id: `e-${noteId}-nb-${item.notebook}`,
          source: noteId,
          target: `nb-${item.notebook}`,
          animated: true,
          style: { stroke: isDark ? '#555' : '#cbd5e1', strokeWidth: 1.5 }
        });
      }

      // Edge to Tags
      if (item.tags) {
        item.tags.split(',').forEach(t => {
          const cleanTag = t.trim();
          if (cleanTag) {
            eds.push({
              id: `e-${noteId}-tag-${cleanTag}`,
              source: noteId,
              target: `tag-${cleanTag}`,
              animated: false,
              style: { stroke: colors.tag, strokeWidth: 1, opacity: 0.4, strokeDasharray: '4 4' }
            });
          }
        });
      }
    });

    return { nodes: nds, edges: eds };
  }, [items, isDark]);

  return (
    <div style={{ width: '100%', height: '100vh', background: isDark ? 'var(--bg-base)' : 'var(--bg-base)' }}>
      <div style={{ position: 'absolute', top: 20, left: 80, zIndex: 10 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-brand)', color: 'var(--text-primary)' }}>
          Knowledge Graph 🧠
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Map of your Second Brain connections.</p>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodeClick={(e, node) => {
          if (node.id.startsWith('note-')) {
            const id = parseInt(node.id.replace('note-', ''));
            onNodeClick(id);
          }
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color={isDark ? '#444' : '#ccc'} gap={24} size={2} />
        <Controls style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }} />
      </ReactFlow>
    </div>
  );
}
