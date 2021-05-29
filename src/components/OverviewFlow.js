import React from "react";
import ReactFlow, { useStoreState, Controls, useZoomPanHelper } from "react-flow-renderer";

const onLoad = (reactFlowInstance) => {
  reactFlowInstance.fitView();
};

const OverviewFlow = ({ editMode, graphElements = [] }) => {
  const transformState = useStoreState((store) => store.transform);
  const { transform } = useZoomPanHelper();
  const onMoveStart = (flowTransform) => {
    transform({ x: transformState[0], y: transformState[1], zoom: transformState[2] });
  };

  return (
    <ReactFlow
      nodesConnectable={false}
      nodesDraggable={editMode}
      elements={graphElements}
      onLoad={onLoad}
      onMoveStart={onMoveStart}
      selectNodesOnDrag={false}
      minZoom={0.3}
      elementsSelectable={false}
      arrowHeadColor="black"
      snapToGrid={true}
      snapGrid={[10, 10]}

      //
    >
      <Controls showInteractive={false} />
    </ReactFlow>
  );
};

export default OverviewFlow;