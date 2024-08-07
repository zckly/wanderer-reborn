import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

function ContextNode({
  data,
}: {
  data: {
    label: string;
  };
}) {
  return (
    <div className="z-50 max-w-[500px] rounded-md bg-muted p-6">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="text-xs">{data.label}</div>
      </div>

      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
    </div>
  );
}

export default memo(ContextNode);
