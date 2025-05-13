"use client";

import { initializeApp } from "@firebase/app";
import {
  getAuth,
  onAuthStateChanged as _onAuthStateChanged,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  signInWithPopup as _signInWithPopup,
  onIdTokenChanged as _onIdTokenChanged,
  signOut as _signOut,
  User,
  NextOrObserver,
  CompleteFn,
  ErrorFn,
  Unsubscribe,
  GoogleAuthProvider,
} from "@firebase/auth";
import { getLang } from "./locale";
import { deleteCookie, setCookie } from "./cookies";
import { firebaseConfig } from "./firebase";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = getLang();

const googleProvider = new GoogleAuthProvider();

_onIdTokenChanged(auth, async (user) => {
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
): Promise<User> {
  return await _signInWithEmailAndPassword(auth, email, password).then(
    (res) => res.user,
  );
}

export function onAuthStateChanged(
  nextOrObserver: NextOrObserver<User>,
  error?: ErrorFn,
  completed?: CompleteFn,
): Unsubscribe {
  return _onAuthStateChanged(auth, nextOrObserver, error, completed);
}

export async function signInWithPopup(): Promise<User> {
  return await _signInWithPopup(auth, googleProvider).then((res) => res.user);
}

export async function getToken(): Promise<string | null> {
  return (await auth.currentUser?.getIdToken()) || null;
}

export async function signOut() {
  await _signOut(auth);
}
