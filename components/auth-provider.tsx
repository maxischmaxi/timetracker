import { User } from "@firebase/auth";
import { User as DbUser } from "@/user/v1/user_pb";
import { createContext, ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged } from "@/lib/auth";
import { Plain } from "@/types";
import { Org } from "@/org/v1/org_pb";
import { getUserByEmail } from "@/lib/api";

type AuthState = "pending" | "signedIn" | "signedOut";

type IUseAuth = {
  firebaseUser: User | null;
  user: Plain<DbUser> | null;
  org: Plain<Org> | null;
  authState: AuthState;
};

export const AuthContext = createContext<IUseAuth>({
  firebaseUser: null,
  user: null,
  org: null,
  authState: "pending",
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Plain<DbUser> | null>(null);
  const [org, setOrg] = useState<Plain<Org> | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>("pending");

  useEffect(() => {
    let cancel = false;

    const cleanup = onAuthStateChanged((user) => {
      if (cancel) return;

      if (user) {
        setFirebaseUser(user);
        setAuthState("signedIn");
        if (user.email) {
          getUserByEmail(user.email).then((res) => {
            if (cancel) return;
            if (!res) return;
            if (res.user) {
              setUser(res.user);
            }
            if (res.org) {
              setOrg(res.org);
            }
          });
        }
      } else {
        setFirebaseUser(null);
        setAuthState("signedOut");
      }
    });

    return () => {
      cancel = true;
      cleanup();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ org, user, firebaseUser, authState }}>
      {children}
    </AuthContext.Provider>
  );
}
