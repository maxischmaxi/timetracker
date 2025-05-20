import { OffersTable } from "@/components/offers-table";

export default async function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <OffersTable />
    </div>
  );
}
