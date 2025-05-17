import { CustomerForm } from "@/components/customer-form";

export default function Page() {
  return (
    <div>
      <CustomerForm className="max-w-[600px]" hideCancel />
    </div>
  );
}
