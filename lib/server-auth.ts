import "server-only";
import { cookies } from "next/headers";
import {
  FirebaseServerApp,
  initializeApp,
  initializeServerApp,
} from "@firebase/app";
import { getAuth, User } from "@firebase/auth";
import { firebaseConfig } from "./firebase";

async function getSessionCookie(): Promise<string | null> {
  const c = await cookies();
  const token = c.get("__session");
  return token?.value || null;
}

export async function verifyIdToken(): Promise<{
  currentUser: User;
  app: FirebaseServerApp;
} | null> {
  const token = await getSessionCookie();
  if (!token) return null;

  const app = initializeServerApp(initializeApp(firebaseConfig), {
    automaticDataCollectionEnabled: false,
    authIdToken: token,
  });

  const auth = getAuth(app);
  await auth.authStateReady();

  if (!auth.currentUser) {
    return null;
  }

  return { app: app, currentUser: auth.currentUser };
}

export async function isLoggedIn(): Promise<boolean> {
  try {
    const token = await getSessionCookie();
    if (!token) throw new Error("no auth token");

    const app = initializeServerApp(initializeApp(firebaseConfig), {
      automaticDataCollectionEnabled: false,
      authIdToken: token,
    });

    const auth = getAuth(app);
    await auth.authStateReady();

    return true;
  } catch {
    return false;
  }
}
