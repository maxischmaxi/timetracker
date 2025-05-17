"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  signOut as _signOut,
  User,
  onIdTokenChanged,
} from "@firebase/auth";
import { Plain } from "@/types";
import { Org } from "@/org/v1/org_pb";
import { getUserByFirebaseUid } from "@/lib/api";
import { firebaseConfig } from "@/lib/firebase";
import { initializeApp } from "@firebase/app";
import { getLang } from "@/lib/locale";
import Cookie from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { GetUserByFirebaseUidResponse } from "@/auth/v1/auth_pb";
import { queryClient } from "./providers";
import { useRouter } from "next/navigation";

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
  currentOrg: Plain<Org> | null;
  user: Plain<GetUserByFirebaseUidResponse> | null;
};

export const AuthContext = createContext<IUseAuth>({
  firebaseUser: null,
  user: null,
  currentOrg: null,
});

export async function signInWithEmailAndPassword(
  email: string,
  password: string,
): Promise<void> {
  await _signInWithEmailAndPassword(auth, email, password).then(
    (res) => res.user,
  );
}

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: User;
}) {
  const [currentOrg, setCurrentOrg] = useState<Plain<Org> | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(
    initialUser || null,
  );
  const router = useRouter();

  const { isPending, data, refetch } = useQuery({
    enabled: !!firebaseUser,
    queryKey: ["getUserByFirebaseUid", firebaseUser?.uid || ""],
    async queryFn({ queryKey }) {
      return await getUserByFirebaseUid(queryKey[1]);
    },
    initialData: null,
  });

  useEffect(() => {
    if (isPending) {
      setCurrentOrg(null);
      return;
    }

    if (!data) {
      setCurrentOrg(null);
      return;
    }

    const orgId = Cookie.get("__org");
    if (!orgId) {
      Cookie.remove("__org");
      setCurrentOrg(null);
      router.push("/auth/org");
      return;
    }

    const org = data.orgs.find((o) => o.id === orgId);
    if (!org) {
      setCurrentOrg(null);
      Cookie.remove("__org");
      router.push("/auth/org");
      return;
    }

    setCurrentOrg(org);
  }, [data, isPending, router]);

  useEffect(() => {
    return onIdTokenChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        const idToken = await user.getIdToken();
        Cookie.set("__session", idToken);
        refetch();
      } else {
        setFirebaseUser(null);
        Cookie.remove("__session");
        queryClient.invalidateQueries({
          queryKey: ["getUserByFirebaseUid", firebaseUser?.uid || ""],
        });
      }

      if (initialUser?.uid === user?.uid) {
        return;
      }

      window.location.reload();
    });
  }, [firebaseUser?.uid, initialUser?.uid, refetch]);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        currentOrg,
        user: data || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
