"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export function Providers({ children }: Props) {
  return (
    <GoogleOAuthProvider clientId="804599044684-kn624h4lruc2kjdfcds7qbt1ce8ckv46.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
