"use client";

import { User } from "@firebase/auth";
import { User as DbUser } from "@/user/v1/user_pb";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, signOut } from "@/lib/auth";
import { Plain } from "@/types";
import { Org } from "@/org/v1/org_pb";
import { getUserByFirebaseUid } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";

type AuthState = "pending" | "signedIn" | "signedOut";

type IUseAuth = {
  firebaseUser: User | null;
  user: Plain<DbUser> | null;
  orgs: Array<Plain<Org>>;
  currentOrg: Plain<Org> | null;
  authState: AuthState;
};

export const AuthContext = createContext<IUseAuth>({
  firebaseUser: null,
  user: null,
  orgs: [],
  currentOrg: null,
  authState: "pending",
});

export function getLocalOrg(): string | null {
  if (typeof window === "undefined") return null;
  const localOrg = window.localStorage.getItem("orgId");
  if (!localOrg) return null;
  return localOrg;
}

export function setLocalOrg(orgId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("orgId", orgId);
}

export function removeLocalOrg(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("orgId");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Plain<DbUser> | null>(null);
  const [orgs, setOrgs] = useState<Array<Plain<Org>>>([]);
  const [currentOrg, setCurrentOrg] = useState<Plain<Org> | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>("pending");
  const router = useRouter();
  const pathname = usePathname();

  const handleUserAuthenticated = useCallback(
    async (user: User) => {
      try {
        const res = await getUserByFirebaseUid(user.uid);

        if (!res || !res.user || typeof res.orgs === "undefined") {
          setAuthState("signedOut");
          await signOut();
          return;
        }

        setFirebaseUser(user);
        setAuthState("signedIn");
        setUser(res.user);
        setOrgs(res.orgs);

        const localOrg = getLocalOrg();
        if (localOrg) {
          const org = res.orgs.find((o) => o.id === localOrg);
          if (!org) {
            removeLocalOrg();

            if (pathname === "/auth/org") {
              return;
            }

            router.push("/auth/org");
            return;
          }

          setCurrentOrg(org);

          if (pathname === "/auth/login") {
            router.push("/");
          }
          return;
        }

        if (pathname === "/auth/org") {
          return;
        }

        router.push("/auth/org");
      } catch {
        await signOut();
        router.push("/auth/login");
      }
    },
    [pathname, router],
  );

  useEffect(() => {
    const cleanup = onAuthStateChanged(async (user) => {
      if (user) {
        await handleUserAuthenticated(user);
      } else {
        setFirebaseUser(null);
        setCurrentOrg(null);
        setOrgs([]);
        setUser(null);
        setAuthState("signedOut");
      }
    });

    return () => {
      cleanup();
    };
  }, [handleUserAuthenticated, pathname, router]);

  return (
    <AuthContext.Provider
      value={{ orgs, user, firebaseUser, authState, currentOrg }}
    >
      {children}
    </AuthContext.Provider>
  );
}
