import React from "react";
import { useReactFlow, Node } from "@xyflow/react";
import { renderCollapsedHandles, TargetHandle } from "../controls/Handles";
import { nodeBaseStyle } from "../../utils/layout";
import { ActionButton } from "../controls/ActionButton";
import { ElementRow } from "./ElementRow";
import { useNodeState } from "../../contexts/NodeStateContext";
import IconSchemeConnected from "../icons/IconSchemeConnected";
import IconMagnifier from "../icons/Magnifier";
import { useContentModel } from "../../hooks/useContentModel";
import { useAppContext } from "../../contexts/AppContext";
import { AnnotatedElement } from "../../utils/mapi";

type ContentTypeNodeData = Node<
  {
    id: string;
    label: string;
    isExpanded?: boolean;
    elements: AnnotatedElement[];
    selfReferences?: string[];
  }
>;

export const ContentTypeNode: React.FC<ContentTypeNodeData> = ({
  data,
  selected,
}) => {
  const { expandedNodes, toggleNode, isolateRelated, isolateSingle } = useNodeState();
  const { fitView } = useReactFlow();
  const { snippets } = useContentModel();

  const isExpanded = expandedNodes.has(data.id);

  const handleIsolateRelated = (e: React.MouseEvent) => {
    e.stopPropagation();
    isolateRelated(data.id);
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const handleIsolateSingle = (e: React.MouseEvent) => {
    e.stopPropagation();
    isolateSingle(data.id);
    toggleNode(data.id, true);
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const containerStyle: React.CSSProperties = {
    ...nodeBaseStyle,
    background: selected ? "#f3f3fe" : "white",
    minWidth: 250,
  };

  const filteredElements = data.elements.filter(el => el.type !== "guidelines");

  const { customApp } = useAppContext();

  return (
    <div onClick={() => toggleNode(data.id)} style={containerStyle}>
      <div className="flex text-gray-400 justify-between items-center">
        <div className="text-xs px-2">Type</div>
        <a
          className="px-2"
          href={`https://app.kontent.ai/${customApp.context.environmentId}/content-models/types/edit/${data.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ActionButton title="Edit content type" onClick={() => {}} icon="✎" />
        </a>
      </div>
      <div className="flex justify-between items-center px-2 py-1">
        <div className="font-bold">{data.label}</div>
        <span className="flex-1"></span>
        <ActionButton
          onClick={handleIsolateRelated}
          title="Show related nodes"
          icon={<IconSchemeConnected />}
        />
        <ActionButton
          onClick={handleIsolateSingle}
          title="Isolate node"
          icon={<IconMagnifier />}
        />
      </div>
      <TargetHandle id="target" />
      {isExpanded
        ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredElements
              .map((el, i) => (
                <ElementRow
                  key={el.id}
                  element={el.type === "snippet"
                    ? {
                      ...el,
                      fromSnippet: false,
                      name: snippets.find(s => s.id === el.snippet?.id)?.name ?? "Unknown Snippet",
                    }
                    : el}
                  isLast={i === filteredElements.length - 1}
                  selfReferences={data.selfReferences?.includes(el.id ?? "")}
                />
              ))}
          </div>
        )
        : (
          <div>
            {filteredElements.map(renderCollapsedHandles)}
          </div>
        )}
    </div>
  );
};
