import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

function RootNode({
  data,
}: {
  data: {
    label: string;
  };
}) {
  return (
    <div className="w-36 rounded-md border-2 border-stone-200 bg-white px-4 py-2">
      <div className="flex items-center justify-center">
        <div className="text-sm font-medium">{data.label}</div>
      </div>

      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}

export default memo(RootNode);
