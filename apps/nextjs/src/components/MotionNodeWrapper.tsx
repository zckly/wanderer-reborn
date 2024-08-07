import { motion } from "framer-motion";

import { cn } from "@acme/ui";

interface MotionNodeWrapperProps {
  rotation?: number;
  children: React.ReactNode;
}

export const MotionNodeWrapper: React.FC<MotionNodeWrapperProps> = ({
  rotation = 0,
  children,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    style={{ transform: `rotate(${rotation}deg)` }}
    className={cn("bg-white")}
  >
    {children}
  </motion.div>
);
