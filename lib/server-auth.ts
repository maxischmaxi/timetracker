import "server-only";
import { cookies } from "next/headers";
import { initializeApp, initializeServerApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { NextRequest } from "next/server";
import { firebaseConfig } from "./firebase";

export async function isRequestFromApi(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return false;
  if (!authHeader.includes("Bearer ")) return false;
  return true;
}

export async function getAuthenticatedAppForUser() {
  const authIdToken = (await cookies()).get("__session")?.value;

  const firebaseServerApp = initializeServerApp(initializeApp(firebaseConfig), {
    authIdToken,
  });

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
}
