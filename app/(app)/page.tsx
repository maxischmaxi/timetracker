import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { verifyIdToken } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await verifyIdToken();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable />
    </div>
  );
}
