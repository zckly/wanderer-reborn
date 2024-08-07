import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

function MicroDecisionNode({
  data,
}: {
  data: {
    label: string;
  };
}) {
  return (
    <div className="max-w-[340px] rounded-md border border-stone-200 bg-white px-4 py-4">
      <div className="flex items-center justify-center">
        <div className="text-center text-xs font-medium text-muted-foreground">
          {data.label}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
    </div>
  );
}

export default memo(MicroDecisionNode);
