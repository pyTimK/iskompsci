import React, { useContext, useRef } from "react";
import ReactFlow, {
  useStoreState,
  useZoomPanHelper,
  useStoreActions,
  OnLoadFunc,
  Node,
  FlowTransform,
} from "react-flow-renderer";
import { useHistory } from "react-router";
import { LocalStorageHelper } from "../classes/LocalStorageHelper";
import { CrossFadePageContext, EditModeContext } from "../Home";
import { DataContext } from "../App";
import { GraphPositions } from "../classes/GraphData";
import { NodeData } from "../interfaces/NodeData";

const onLoad: OnLoadFunc = (reactFlowInstance) => reactFlowInstance.fitView();

const OverviewFlow: React.FC = () => {
  const history = useHistory();
  const divRef = useRef<HTMLDivElement | null>(null);
  const initialTapPosition = useRef<[number, number]>([0, 0]);
  const initialTransformState = useRef<[number, number]>([0, 0]);
  const isMouseDown = useRef(false);
  const numMoves = useRef(0);
  const divFullScreenAnimate = useContext(CrossFadePageContext);
  const data = useContext(DataContext);
  const editMode = useContext(EditModeContext)![0];

  const { transform } = useZoomPanHelper();
  const transformState = useStoreState((store) => store.transform);
  const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);

  const onMoveStart = (flowTransform: FlowTransform | undefined) => {
    if (numMoves.current > 2) return;
    transform({ x: transformState[0], y: transformState[1], zoom: transformState[2] });
    numMoves.current++;
  };

  const exitAnimate = async (node: Node<NodeData>) => {
    if (!node.data) return;

    if (divRef.current === null) {
      divFullScreenAnimate?.set({
        y: document.documentElement.clientHeight,
        width: window.screen.width,
        height: document.documentElement.clientHeight,
        backgroundColor: `var(--${node.data.status}Color)`,
      });
    } else {
      const domRect = divRef.current.getBoundingClientRect();
      divFullScreenAnimate?.set({
        x: domRect.x,
        y: domRect.y,
        width: domRect.width,
        height: domRect.height,
        backgroundColor: `var(--${node.data.status}Color)`,
      });
    }

    await divFullScreenAnimate?.start({
      opacity: 1,
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,

      backgroundColor: "var(--materialgreen)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    });
  };

  return (
    <ReactFlow
      nodesConnectable={false}
      nodesDraggable={editMode}
      elements={data.graphData.elements}
      onLoad={onLoad}
      onMoveStart={onMoveStart}
      onNodeDragStop={(_, node) => {
        const savedGraphPositions = LocalStorageHelper.get<GraphPositions>("graphPositions", {});
        savedGraphPositions[node.id] = node.position;
        LocalStorageHelper.set("graphPositions", savedGraphPositions);
      }}
      minZoom={0.3}
      selectNodesOnDrag={false}
      onSelectionChange={(elements) => {
        if (editMode || !elements || elements.length === 0) return;

        if (!divRef.current) {
          setSelectedElements([]);
          return;
        }

        const node = elements[0] as Node<NodeData>;
        const subject = encodeURIComponent(node.id);
        exitAnimate(node).then(() => history.push(`/course/${subject}`));
      }}
      onMouseDown={(e) => {
        if (editMode) return;
        isMouseDown.current = true;
        divRef.current = e.target as HTMLDivElement;
        initialTapPosition.current = [e.clientX, e.clientY];
        initialTransformState.current = [transformState[0], transformState[1]];
      }}
      onMouseMove={(e) => {
        if (editMode) return;
        if (!isMouseDown.current) return;

        divRef.current = null;
        const dx = e.clientX - initialTapPosition.current[0];
        const dy = e.clientY - initialTapPosition.current[1];
        transform({
          x: initialTransformState.current[0] + dx,
          y: initialTransformState.current[1] + dy,
          zoom: transformState[2],
        });
      }}
      onMouseUp={() => {
        if (editMode) return;
        isMouseDown.current = false;
      }}
      onTouchStart={(e) => {
        if (editMode) return;
        divRef.current = e.target as HTMLDivElement;
        const touch = e.touches[0] || e.changedTouches[0];
        initialTapPosition.current = [touch.pageX, touch.pageY];
        initialTransformState.current = [transformState[0], transformState[1]];
      }}
      onTouchMove={(e) => {
        if (editMode) return;
        const touch = e.touches[0] || e.changedTouches[0];
        const dx = touch.pageX - initialTapPosition.current[0];
        const dy = touch.pageY - initialTapPosition.current[1];
        transform({
          x: initialTransformState.current[0] + dx,
          y: initialTransformState.current[1] + dy,
          zoom: transformState[2],
        });
      }}
      arrowHeadColor='black'
      snapToGrid={true}
      snapGrid={[10, 10]}
    />
  );
};

export default OverviewFlow;