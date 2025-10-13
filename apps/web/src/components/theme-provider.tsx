"use client";

import * as React from "react";
import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Ensure pointer-events are always 'auto' on the body after client-side rendering and theme resolution
    document.body.style.pointerEvents = "auto";
  }, [resolvedTheme]); // Re-run when theme changes

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
