import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { ArrowRight, EllipsisIcon, XIcon } from "lucide-react";
import { createPortal } from "react-dom";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { ScrollArea } from "@acme/ui/scroll-area";

import Spinner from "./Spinner";

const transition = {
  type: "spring",
  bounce: 0.05,
  duration: 0.3,
};

export default function MotionDialog({
  title,
  subtitle,
  onDecisionChosen,
  loading,
  outcomeGenerated,
}: {
  title: string;
  subtitle: string;
  onDecisionChosen: ({ title }: { title: string }) => void;
  loading?: boolean;
  outcomeGenerated: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const disabled = loading ?? outcomeGenerated;

  // prevents the dialog from pre-renderd on the server
  if (!mounted) {
    return null;
  }

  return (
    <MotionConfig transition={transition}>
      <motion.div
        className={cn(
          `relative ${disabled ? "cursor-not-allowed opacity-50" : ""}`,
        )}
        initial="initial"
        whileHover={disabled ? undefined : "animate"}
        animate={isOpen ? "open" : "closed"}
        tabIndex={disabled ? -1 : 0}
      >
        <motion.div
          className="flex h-[90px] w-[360px] flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900"
          layoutId={`dialog-${uniqueId}`}
          style={{
            borderRadius: "12px",
          }}
        >
          <div className="relative flex flex-grow flex-row items-center justify-center px-4">
            <div>
              <motion.div
                layoutId={`dialog-title-${uniqueId}`}
                className="w-full text-center text-xs text-zinc-950 dark:text-zinc-50"
              >
                {title.startsWith("**") && title.endsWith("**")
                  ? title.slice(2, -2)
                  : title}
              </motion.div>
            </div>
            {!outcomeGenerated && (
              <div
                className={cn(
                  "absolute bottom-1 right-1 flex flex-row items-center",
                )}
              >
                <button
                  type="button"
                  className="relative ml-1 flex h-6 w-6 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-500"
                  aria-label="Open dialog"
                  onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                  <EllipsisIcon size={12} />
                </button>
                <button
                  type="button"
                  className="relative ml-1 flex h-6 w-6 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-primary text-primary transition-colors hover:bg-primary hover:text-white focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-white dark:focus-visible:ring-primary"
                  aria-label="Continue"
                  onClick={() => {
                    if (!disabled) {
                      onDecisionChosen({ title });
                      setIsOpen(false);
                    }
                  }}
                >
                  {loading ? <Spinner size={12} /> : <ArrowRight size={12} />}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      {createPortal(
        <AnimatePresence initial={false} mode="sync">
          {isOpen && (
            <>
              <motion.div
                key={`backdrop-${uniqueId}`}
                className="fixed inset-0 h-full w-full bg-white/40 backdrop-blur-sm dark:bg-black/40"
                variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={() => {
                  setIsOpen(false);
                }}
              />
              <motion.div
                key="dialog"
                className="pointer-events-none fixed inset-0 flex items-center justify-center"
                initial="closed"
                animate="open"
                exit="closed"
              >
                <motion.div
                  className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 sm:w-[600px]"
                  layoutId={`dialog-${uniqueId}`}
                  tabIndex={-1}
                  style={{
                    borderRadius: "24px",
                  }}
                >
                  <div className="p-6">
                    <motion.div
                      layoutId={`dialog-title-${uniqueId}`}
                      className="mb-2 text-2xl text-zinc-950 dark:text-zinc-50"
                    >
                      {title}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="origin-bottom"
                    >
                      <ScrollArea className="lg:h-[360px]">
                        <Markdown
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            h2: (props) => (
                              <h2 className="font-semibold" {...props} />
                            ),
                            p: (props) => (
                              <p
                                className="py-2 text-zinc-500 dark:text-zinc-500"
                                {...props}
                              />
                            ),
                          }}
                          remarkPlugins={[remarkGfm]}
                          className="mt-4 text-zinc-500 dark:text-zinc-500"
                        >
                          {subtitle}
                        </Markdown>
                      </ScrollArea>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="mt-4 flex w-full justify-end"
                    >
                      <Button
                        variant="outline"
                        onClick={() => {
                          onDecisionChosen({ title });
                          setIsOpen(false);
                        }}
                      >
                        Choose this option
                      </Button>
                    </motion.div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-6 top-6 text-zinc-50"
                    type="button"
                    aria-label="Close dialog"
                  >
                    <XIcon size={24} />
                  </button>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </MotionConfig>
  );
}
