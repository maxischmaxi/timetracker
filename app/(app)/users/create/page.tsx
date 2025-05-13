"use client";

import { UserForm } from "@/components/user-form";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 md:px-6">
      <UserForm className="max-w-[600px]" />
    </div>
  );
}
