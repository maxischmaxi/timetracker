import { CustomerForm } from "@/components/customer-form";
import { getCustomer } from "@/lib/server-api";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const customer = await getCustomer(id);

  return (
    <div>
      <CustomerForm customer={customer} hideCancel className="max-w-[600px]" />
    </div>
  );
}
