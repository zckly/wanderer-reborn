import { ChevronDown, Plus, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import type { Canvas } from "~/hooks/store-types";
import { useNodeStore } from "~/hooks/useNodeStore";
import { initialNodes } from "~/hooks/useStore";

export function CanvasInfo() {
  const {
    canvasTitle,
    setNodes,
    setEdges,
    setCanvasTitle,
    setMessages,
    setSelectedOptions,
    previousCanvases,
    setPreviousCanvases,
    nodes,
    edges,
    messages,
    selectedOptions,
  } = useNodeStore();

  function handleCreateNewCanvas() {
    // Add existing canvas to previous canvases
    if (nodes.length > 1) {
      setPreviousCanvases([
        ...previousCanvases,
        { title: canvasTitle, nodes, edges, messages, selectedOptions },
      ]);
    }

    // TODO: reset canvas position to the center of the screen
    setNodes(initialNodes);
    setEdges([]);
    setMessages([]);
    setSelectedOptions([]);
    setCanvasTitle("");
  }
  // function handleRenameCanvas() {
  //   // TODO: show a modal to rename the canvas
  // }
  function handleDeleteCanvas() {
    // TODO: show a modal to confirm deletion
    // If the current canvas title is in previous canvases, delete it
    if (previousCanvases.some((canvas) => canvas.title === canvasTitle)) {
      setPreviousCanvases(
        previousCanvases.filter((canvas) => canvas.title !== canvasTitle),
      );
    }
    // TODO: reset canvas position to the center of the screen
    setNodes(initialNodes);
    setEdges([]);
    setMessages([]);
    setSelectedOptions([]);
    setCanvasTitle("");
  }
  function onPreviousCanvasClick(canvas: Canvas) {
    setNodes(canvas.nodes);
    setEdges(canvas.edges);
    setMessages(canvas.messages);
    setSelectedOptions(canvas.selectedOptions);
    setCanvasTitle(canvas.title);
  }
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-row items-center gap-2 rounded-lg border bg-white p-4 font-mono shadow-sm">
          <div className="text-sm font-semibold">
            {canvasTitle.replace(/"/g, "") || `untitled - ${currentDate}`}
          </div>
          <ChevronDown className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="w-[300px]">
        <DropdownMenuGroup>
          {/* <DropdownMenuItem onClick={handleRenameCanvas}>
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={handleDeleteCanvas}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Previous canvases</DropdownMenuLabel>
          {previousCanvases.map((canvas, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => onPreviousCanvasClick(canvas)}
            >
              <span className="truncate">{canvas.title || `Untitled`}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {previousCanvases.length > 0 && <DropdownMenuSeparator />}
        <DropdownMenuItem onClick={handleCreateNewCanvas}>
          <Plus className="mr-2 h-4 w-4" />
          <span>Create new</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
