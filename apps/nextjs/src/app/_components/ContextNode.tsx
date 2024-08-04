import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

function ContextNode({
  data,
}: {
  data: {
    label: string;
    consequences?: {
      health: {
        change: number;
        reasoning: string;
      };
      love: {
        change: number;
        reasoning: string;
      };
      play: {
        change: number;
        reasoning: string;
      };
      wealth: {
        change: number;
        reasoning: string;
      };
    };
  };
}) {
  return (
    <div className="z-50 max-w-[500px] rounded-md bg-muted p-6">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="text-xs">{data.label}</div>
        {data.consequences && (
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <div>
              Health: {data.consequences.health.change >= 0 ? "+" : ""}
              {data.consequences.health.change}.{" "}
              {data.consequences.health.reasoning}
            </div>
            <div>
              Love: {data.consequences.love.change >= 0 ? "+" : ""}
              {data.consequences.love.change}.{" "}
              {data.consequences.love.reasoning}
            </div>
            <div>
              Play: {data.consequences.play.change >= 0 ? "+" : ""}
              {data.consequences.play.change}.{" "}
              {data.consequences.play.reasoning}
            </div>
            <div>
              Wealth: {data.consequences.wealth.change >= 0 ? "+" : ""}
              {data.consequences.wealth.change}.{" "}
              {data.consequences.wealth.reasoning}
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
    </div>
  );
}

export default memo(ContextNode);
