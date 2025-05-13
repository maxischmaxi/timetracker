"use client";

import { ProjectForm } from "@/components/project-form";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div>
      <ProjectForm
        onSuccess={(data) => {
          router.push(`/projects/${data.id}`);
        }}
        className="max-w-[600px]"
        hideCancel
      />
    </div>
  );
}
