"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  signOut as _signOut,
  User,
  onIdTokenChanged,
  GoogleAuthProvider,
  signInWithPopup as _signInWithPopup,
} from "@firebase/auth";
import { Plain } from "@/types";
import { getUserByFirebaseUid } from "@/lib/api";
import { firebaseConfig } from "@/lib/firebase";
import { initializeApp } from "@firebase/app";
import { getLang } from "@/lib/locale";
import Cookie from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { GetUserByFirebaseUidResponse } from "@/auth/v1/auth_pb";
import { queryClient } from "./providers";

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");
googleProvider.addScope("https://www.googleapis.com/auth/calendar");

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = getLang();

export async function signInWithPopup() {
  const result = await _signInWithPopup(auth, googleProvider);
  const credentials = GoogleAuthProvider.credentialFromResult(result);
  if (credentials?.accessToken) {
    Cookie.set("__access_token", credentials.accessToken, {
      sameSite: "none",
      secure: true,
      path: "/",
    });
  }
}

export async function signOut() {
  await _signOut(auth);
  Cookie.remove("__session");
  Cookie.remove("__access_token");
}

export async function getToken(): Promise<string | null> {
  return (await auth.currentUser?.getIdToken()) || null;
}

type IUseAuth = {
  firebaseUser: User | null;
  user: Plain<GetUserByFirebaseUidResponse> | null;
};

export const AuthContext = createContext<IUseAuth>({
  firebaseUser: null,
  user: null,
});

export async function signInWithEmailAndPassword(
  email: string,
  password: string,
): Promise<void> {
  await _signInWithEmailAndPassword(auth, email, password).then(
    (res) => res.user,
  );
}

export async function refetchUser(uid: string | undefined) {
  await queryClient.refetchQueries({
    queryKey: ["getUserByFirebaseUid", uid || ""],
  });
}

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: User;
}) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(
    initialUser || null,
  );

  const { data, refetch } = useQuery({
    enabled: !!firebaseUser,
    queryKey: ["getUserByFirebaseUid", firebaseUser?.uid || ""],
    async queryFn({ queryKey }) {
      return await getUserByFirebaseUid(queryKey[1]);
    },
    initialData: null,
  });

  useEffect(() => {
    return onIdTokenChanged(auth, async (user) => {
      console.log("onidtokenchanged", user);
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
        user: data || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
