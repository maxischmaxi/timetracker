"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import { toast } from "sonner";
import { useState } from "react";
import { EyeClosedIcon, EyeIcon, Loader } from "lucide-react";
import Link from "next/link";
import { signInWithEmailAndPassword, signInWithPopup } from "./auth-provider";
import { GoogleIcon } from "./icons";

type Props = {
  orgId?: string;
  token?: string;
  className?: string;
};

export function LoginForm({ className, orgId, token }: Props) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true);

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    await signInWithEmailAndPassword(data.email, data.password);

    if (orgId && token) {
      return;
    }
  }

  async function googleSignIn() {
    await signInWithPopup();
  }

  function onError() {
    toast.error("An error occured while logging in");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Gib deine Email ein um dich in deinen Account einzuloggen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit, onError)}
            >
              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.info("to be implemented")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button>
                <Button
                  disabled={form.formState.isSubmitting}
                  onClick={googleSignIn}
                  variant="outline"
                  className="w-full"
                  type="button"
                >
                  <GoogleIcon />
                  Login with Google
                </Button>
              </div>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    autoComplete="email"
                    autoCorrect="off"
                    autoCapitalize="off"
                    type="email"
                    placeholder="m@example.com"
                    required
                    {...form.register("email")}
                    disabled={form.formState.isSubmitting}
                  />
                  {!!form.formState.errors.email?.message && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.email?.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      style={{
                        pointerEvents: form.formState.isSubmitting
                          ? "none"
                          : undefined,
                      }}
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <div className="flex flex-row flex-nowrap gap-2">
                    <Input
                      autoComplete="current-password"
                      autoCapitalize="off"
                      autoCorrect="off"
                      type={passwordHidden ? "password" : "text"}
                      required
                      {...form.register("password")}
                      disabled={form.formState.isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPasswordHidden((prev) => !prev)}
                      disabled={form.formState.isSubmitting}
                    >
                      {passwordHidden ? <EyeIcon /> : <EyeClosedIcon />}
                    </Button>
                  </div>
                  {!!form.formState.errors.password?.message && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.password?.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  style={{
                    pointerEvents: form.formState.isSubmitting
                      ? "none"
                      : undefined,
                  }}
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
