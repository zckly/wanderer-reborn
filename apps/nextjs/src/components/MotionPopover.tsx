"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";

import { cn } from "@acme/ui";

import useClickOutside from "~/hooks/useClickOutside";

const TRANSITION = {
  type: "spring",
  bounce: 0.05,
  duration: 0.3,
};

export default function MotionPopover({
  onSubmit,
  isGenerating,
  mode = "decision",
}: {
  onSubmit: (decision: string) => void;
  isGenerating: boolean;
  mode?: "decision" | "option";
}) {
  const uniqueId = useId();
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState<null | string>(null);

  const openMenu = () => {
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setNote(null);
  };

  useClickOutside(formContainerRef, () => {
    closeMenu();
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <MotionConfig transition={TRANSITION}>
      <div className="nodrag relative flex items-center justify-center">
        <motion.button
          key="button"
          layoutId={`popover-${uniqueId}`}
          className={cn(
            "flex h-10 w-[360px] items-center justify-center border border-dotted border-zinc-900/10 bg-white px-4 py-3 text-zinc-950 dark:border-zinc-50/10 dark:bg-zinc-700 dark:text-zinc-50",
          )}
          style={{
            borderRadius: 8,
          }}
          onClick={openMenu}
        >
          <motion.span
            layoutId={`popover-label-${uniqueId}`}
            className="text-xs text-zinc-500"
          >
            {isGenerating ? (
              <div className={"flex items-center gap-1"}>
                <svg
                  className="mr-2 h-4 w-4 animate-spin text-zinc-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Thinking...
              </div>
            ) : mode === "decision" ? (
              "(Add decision)"
            ) : (
              "(Add option)"
            )}
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={formContainerRef}
              layoutId={`popover-${uniqueId}`}
              className="absolute z-50 h-[200px] w-[364px] overflow-hidden border border-zinc-950/10 bg-white outline-none dark:bg-zinc-700"
              style={{
                borderRadius: 12,
              }}
            >
              <form
                className="flex h-full flex-col"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Add Note");
                }}
              >
                <motion.span
                  layoutId={`popover-label-${uniqueId}`}
                  aria-hidden="true"
                  style={{
                    opacity: note ? 0 : 1,
                  }}
                  className="absolute left-4 top-3 select-none text-xs text-zinc-500 dark:text-zinc-400"
                >
                  {mode === "decision"
                    ? "Add future decision"
                    : "Add your own option"}
                </motion.span>
                <textarea
                  className="h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-xs outline-none"
                  autoFocus
                  onChange={(e) => setNote(e.target.value)}
                />
                <div key="close" className="flex justify-between px-4 py-3">
                  <button
                    type="button"
                    className="flex items-center"
                    onClick={closeMenu}
                    aria-label="Close popover"
                  >
                    <ArrowLeftIcon
                      size={16}
                      className="text-zinc-900 dark:text-zinc-100"
                    />
                  </button>
                  <button
                    className="relative ml-1 flex h-8 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 bg-transparent px-2 text-xs font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800"
                    type="button"
                    aria-label={
                      mode === "decision" ? "Add decision" : "Add option"
                    }
                    onClick={() => {
                      onSubmit(note ?? "");
                      closeMenu();
                    }}
                  >
                    Add
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
