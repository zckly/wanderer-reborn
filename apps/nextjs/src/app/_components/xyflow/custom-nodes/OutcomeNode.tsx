import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function OutcomeNode({
  data,
}: {
  data: {
    label: string;
  };
}) {
  return (
    <div className="max-w-[600px] rounded-md border border-stone-200 bg-white p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <Markdown
          remarkPlugins={[remarkGfm]}
          className="flex flex-col gap-2 text-xs"
        >
          {data.label}
        </Markdown>
      </div>

      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
    </div>
  );
}

export default memo(OutcomeNode);
