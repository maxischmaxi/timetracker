import { ProjectssTable } from "@/components/projects-table";

export default async function Page() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <ProjectssTable />
    </div>
  );
}
