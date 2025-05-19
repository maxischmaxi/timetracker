"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactNode } from "react";
import { AuthProvider } from "./auth-provider";
import { User } from "@firebase/auth";
import { SearchProvider } from "./search-provider";
import { SettingsProvider } from "./settings-provider";
import { ThemeProvider } from "./theme-provider";

type Props = {
  children: ReactNode;
  initialUser?: User;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 1000 * 60 * 5,
      retry: false,
    },
  },
});

export function Providers({ children, initialUser }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialUser={initialUser}>
          <SearchProvider>
            <SettingsProvider>{children}</SettingsProvider>
          </SearchProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
