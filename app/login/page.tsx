"use client";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

export default function Login() {
  function handleSuccess(credentials: CredentialResponse) {
    console.log(credentials);
  }

  function handleError() {
    console.error("Login failed");
  }

  return (
    <div>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} useOneTap />
    </div>
  );
}
