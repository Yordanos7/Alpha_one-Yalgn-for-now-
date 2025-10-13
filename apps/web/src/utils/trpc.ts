import { QueryCache, QueryClient } from "@tanstack/react-query"; // Core tools for managing, caching, and synchronizing server state in your React application.
import { createTRPCClient, httpBatchLink } from "@trpc/client"; // Re-import createTRPCClient
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@Alpha/api/routers/index";
import { toast } from "sonner";

// Trigger type refresh
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message, {
        action: {
          label: "retry",
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
});

export const trpcClient = createTRPCClient<AppRouter>({
  // Create trpcClient instance
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

export const trpc = createTRPCReact<AppRouter>();
