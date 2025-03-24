import { ContentTypeElements } from "@kontent-ai/management-sdk";
import Dagre from "@dagrejs/dagre";
import { Node, Edge, NodeTypes } from "@xyflow/react";
import { Element } from "./mapi";
import { ContentTypeNode } from "../components/nodes/ContentTypeNode";
import { SnippetNode } from "../components/nodes/SnippetNode";
import { layoutConfig } from "./config";

export const nodeBaseStyle: React.CSSProperties = {
  paddingTop: 5,
  paddingBottom: 5,
  border: "1px solid #ddd",
  borderRadius: 10,
  cursor: "pointer",
  position: "relative",
  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
};

export const nodeTypes = {
  contentType: ContentTypeNode as unknown as NodeTypes["contentType"],
  snippet: SnippetNode as unknown as NodeTypes["snippet"],
} as const satisfies NodeTypes;

type RelationshipElement =
  | ContentTypeElements.ILinkedItemsElement
  | ContentTypeElements.ISubpagesElement
  | ContentTypeElements.IRichTextElement;

type RequirableElement = Exclude<Element, ContentTypeElements.IGuidelinesElement | ContentTypeElements.ISnippetElement>;

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const baseNodeHeight = 76;
  const baseNodeWidth = 172;
  // Split nodes into visible and hidden
  const visibleNodes = nodes.filter(node => !node.hidden);
  const hiddenNodes = nodes.filter(node => node.hidden);

  // Only use visible edges (those connecting visible nodes)
  const visibleEdges = edges.filter(edge =>
    visibleNodes.some(node => node.id === edge.source)
    && visibleNodes.some(node => node.id === edge.target)
  );

  const graph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: layoutConfig.rankDirection,
    nodesep: layoutConfig.nodeSeparation,
    ranksep: layoutConfig.rankSeparation,
    align: layoutConfig.alignment,
    ranker: layoutConfig.ranker,
    acyclicer: layoutConfig.acyclicer,
  });

  // Process only visible nodes for layout
  visibleNodes.forEach((node) => {
    const width = node.width ?? node.measured?.width ?? baseNodeWidth;
    const height = node.height ?? node.measured?.height ?? baseNodeHeight;

    graph.setNode(node.id, { width, height });
  });

  visibleEdges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  Dagre.layout(graph);

  // Process visible nodes with new positions
  const layoutedVisibleNodes = visibleNodes.map((node) => {
    const nodeWithPosition = graph.node(node.id);
    const width = node.width ?? node.measured?.width ?? baseNodeWidth;
    const height = node.height ?? node.measured?.height ?? baseNodeHeight;

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  // Combine layouted visible nodes with unchanged hidden nodes
  return {
    nodes: [...layoutedVisibleNodes, ...hiddenNodes],
    edges,
  };
};

export const isRelationshipElement = (
  element: Element,
): element is RelationshipElement =>
  (element.type === "modular_content"
    || element.type === "subpages"
    || element.type === "rich_text")
  && Array.isArray(element.allowed_content_types);

export const isRequirableElement = (element: Element): element is RequirableElement =>
  element.type !== "guidelines"
  && element.type !== "snippet";

export const isNodeRelated = (nodeId: string, targetId: string, edges: Edge[]): boolean =>
  nodeId === targetId
    ? true
    : edges.some(edge =>
      (edge.source === nodeId && edge.target === targetId)
      || (edge.target === nodeId && edge.source === targetId)
    );
