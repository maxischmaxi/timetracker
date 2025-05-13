import {
  googleLogout,
  useGoogleLogin,
  type TokenResponse,
} from "@react-oauth/google";
import { createContext, useEffect, useState } from "react";

type IUseUserContext = {
  user: User | null;
  profile: object | null;
  login: () => void;
  logout: () => void;
};

const UserContext = createContext<IUseUserContext>({
  user: null,
  profile: null,
  login: () => {},
  logout: () => {},
});

type User = Omit<TokenResponse, "error" | "error_description" | "error_uri">;

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<object | null>(null);

  const login = useGoogleLogin({
    onSuccess: (res) => setUser(res),
    onError: () => setUser(null),
  });

  const logout = () => {
    googleLogout();
    setUser(null);
    setProfile(null);
    sessionStorage.removeItem("token");
  };

  useEffect(() => {
    let cancel = false;

    if (user) {
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      }).then((res) => {
        if (cancel) {
          setUser(null);
          return;
        }
        if (!res.ok) {
          setUser(null);
          return;
        }

        if (res.status !== 200) {
          setUser(null);
          return;
        }

        res.json().then((data) => {
          if (cancel) {
            setUser(null);
            return;
          }
          console.log(data);
          setProfile(data.data);
          sessionStorage.setItem("token", user.access_token);
        });
      });
    }

    return () => {
      cancel = true;
    };
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
