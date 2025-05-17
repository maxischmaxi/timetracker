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
import { signInWithEmailAndPassword } from "@/lib/auth";
import { useState } from "react";
import { EyeClosedIcon, EyeIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getLocalOrg } from "./auth-provider";

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
  const router = useRouter();
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true);

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    await signInWithEmailAndPassword(data.email, data.password);

    if (orgId && token) {
      router.push(`/auth/join-org?orgId=${orgId}&token=${token}`);
    }

    if (!getLocalOrg()) {
      router.push("/auth/org");
    } else {
      router.push("/");
    }
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
                    <p className="text-red-500 text-xs">
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
                    <p className="text-red-500 text-xs">
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
                    <Loader className="animate-spin h-4 w-4" />
                  ) : (
                    "Login"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  Login with Google
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
