import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

// Register a custom Date transformer for Safari compatibility
// Safari throws "The string did not match the expected pattern" for some date formats
superjson.registerCustom<Date, string>(
  {
    isApplicable: (v): v is Date => v instanceof Date,
    serialize: (v) => v.toISOString(),
    deserialize: (v) => {
      // Ensure the date string is in ISO 8601 format that Safari accepts
      const date = new Date(v);
      if (isNaN(date.getTime())) {
        // Fallback: try replacing space with T for MySQL-style dates
        const fallback = new Date(v.replace(' ', 'T') + (v.includes('Z') ? '' : 'Z'));
        if (isNaN(fallback.getTime())) {
          console.warn('[SuperJSON] Could not parse date:', v);
          return new Date(0); // Return epoch as safe fallback
        }
        return fallback;
      }
      return date;
    },
  },
  'Date'
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry auth errors
        if (error instanceof TRPCClientError && error.message === UNAUTHED_ERR_MSG) {
          return false;
        }
        // Retry deserialization errors once (Safari date parsing)
        if (error instanceof Error && error.message?.includes('did not match the expected pattern')) {
          return failureCount < 1;
        }
        // Default retry behavior
        return failureCount < 3;
      },
    },
  },
});

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    // Only log non-pattern errors to avoid noise from Safari date parsing
    if (!(error instanceof Error && error.message?.includes('did not match the expected pattern'))) {
      console.error("[API Query Error]", error);
    }
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </HelmetProvider>
);
