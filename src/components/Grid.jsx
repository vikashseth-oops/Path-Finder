import React, { useRef } from 'react';
import { Node } from './Node';

export function Grid({
  grid,
  gridSize,
  showHeatmap,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onTouchStart,
  onTouchMove,
}) {
  const containerRef = useRef(null);

  // Dynamic grid layout style based on size
  const gridStyle = {
    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
  };

  return (
    <div className="w-full flex justify-center items-center p-2 sm:p-4">
      <div
        ref={containerRef}
        style={gridStyle}
        onMouseLeave={onMouseUp}
        className="grid gap-[1px] bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-[850px] aspect-square overflow-hidden touch-none"
      >
        {grid.map((row, rIdx) =>
          row.map((node, cIdx) => (
            <Node
              key={`${rIdx}-${cIdx}`}
              row={node.row}
              col={node.col}
              type={node.type}
              isVisited={node.isVisited}
              isShortestPath={node.isShortestPath}
              heuristicValue={node.heuristicDistance}
              showHeatmap={showHeatmap}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onMouseUp={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
            />
          ))
        )}
      </div>
    </div>
  );
}
