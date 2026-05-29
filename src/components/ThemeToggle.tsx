import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative h-9 w-9 rounded-xl border border-border bg-surface/60 backdrop-blur grid place-items-center overflow-hidden hover:bg-surface transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.span
            key="moon"
            initial={{ y: -16, rotate: -90, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: 16, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Moon className="h-4 w-4 text-accent" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ y: -16, rotate: -90, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: 16, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Sun className="h-4 w-4 text-primary" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
