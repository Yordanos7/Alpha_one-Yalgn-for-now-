"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient, trpc, trpcClient } from "@/utils/trpc"; // Import trpc and trpcClient
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
// import { authClient } from "@/lib/auth-client"; // Removed as Provider is not directly available

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          {children} {/* Removed authClient.Provider */}
          <ReactQueryDevtools />
        </trpc.Provider>
      </QueryClientProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}
