import { motion } from "framer-motion";
import { ReactNode } from "react";

export function Marquee({
  children,
  speed = 40,
  className = "",
  reverse = false,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        <div className="flex gap-12 shrink-0">{children}</div>
        <div className="flex gap-12 shrink-0" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
