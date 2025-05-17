"use client";

import { registerSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRegister } from "@/hooks/use-users";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

type Props = {
  defaultEmail?: string;
  joinToken?: string;
  orgId?: string;
};

export function RegisterForm(props: Props) {
  const router = useRouter();
  const register = useRegister({
    onSuccess() {
      if (props.joinToken && props.orgId) {
        router.push(
          `/auth/login?orgId=${props.orgId}&token=${props.joinToken}`,
        );
      }
    },
  });
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: props.defaultEmail || "",
      password: "",
      passwordConfirm: "",
    },
  });

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    await register.mutateAsync({
      ...data,
      orgId: props.orgId,
    });
  }

  return (
    <Card className="max-w-[800px]">
      <CardHeader>Registrieren</CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <Input
              control={form.control}
              name="name"
              label="Name"
              placeholder="Max Mustermann"
            />
            <Input
              type="email"
              autoCorrect="off"
              autoCapitalize="off"
              autoComplete="email"
              control={form.control}
              name="email"
              label="Email"
              placeholder="max@mustermann.de"
            />
            <Input
              type="password"
              control={form.control}
              name="password"
              label="Passwort"
            />
            <Input
              type="password"
              control={form.control}
              name="passwordConfirm"
              label="Passwort bestätigen"
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Jetzt registrieren!
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
