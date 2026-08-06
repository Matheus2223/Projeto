"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Intentional mounted-gate: next-themes can't know the real theme until
    // after hydration, so this must flip in an effect, not during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 rounded-lg text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Alternar tema"
    >
      {mounted && resolvedTheme === "dark" ? <Sun className="size-[17px]" /> : <Moon className="size-[17px]" />}
    </Button>
  );
}
