"use client";

import { useProject } from "@/hooks/use-projects";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  const project = useProject(String(id));

  return (
    <div>
      <h1>{project.data?.name}</h1>
    </div>
  );
}
