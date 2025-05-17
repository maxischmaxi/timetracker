"use client";

import { User as DbUser } from "@/user/v1/user_pb";
import { createContext, ReactNode, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  signOut as _signOut,
  User,
  onIdTokenChanged,
} from "@firebase/auth";
import { Plain } from "@/types";
import { Org } from "@/org/v1/org_pb";
import { getUserByFirebaseUid } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import { firebaseConfig } from "@/lib/firebase";
import { initializeApp } from "@firebase/app";
import { getLang } from "@/lib/locale";
import { deleteCookie, setCookie } from "@/lib/cookies";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = getLang();

export async function signOut() {
  await _signOut(auth);
}

export async function getToken(): Promise<string | null> {
  return (await auth.currentUser?.getIdToken()) || null;
}

type IUseAuth = {
  firebaseUser: User | null;
  user: Plain<DbUser> | null;
  orgs: Array<Plain<Org>>;
  currentOrg: Plain<Org> | null;
};

export const AuthContext = createContext<IUseAuth>({
  firebaseUser: null,
  user: null,
  orgs: [],
  currentOrg: null,
});

onIdTokenChanged(auth, async (user) => {
  console.log("token changed", user);
  if (user) {
    const token = await user.getIdToken();
    setCookie("__session", token);
  } else {
    deleteCookie("__session");
  }
});

export async function signInWithEmailAndPassword(
  email: string,
  password: string,
): Promise<void> {
  await _signInWithEmailAndPassword(auth, email, password).then(
    (res) => res.user,
  );
}

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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancel = false;

    const cleanup = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("auth state changed");
        console.log(user);
        try {
          const res = await getUserByFirebaseUid(user.uid);
          if (cancel) return;
          console.log(res);

          if (!res || !res.user || typeof res.orgs === "undefined") {
            // await signOut();
            return;
          }

          setFirebaseUser(user);
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

          if (pathname !== "/auth/org") {
            router.push("/auth/org");
          }
        } catch {
          await signOut();
          router.push("/auth/login");
        }
      } else {
        console.log("no user");
        setFirebaseUser(null);
        setCurrentOrg(null);
        setOrgs([]);
        setUser(null);
      }
    });

    return () => {
      cancel = true;
      cleanup();
    };
  }, [pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        orgs,
        user,
        firebaseUser,
        currentOrg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
