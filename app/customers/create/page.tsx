import { CustomerForm } from "@/components/customer-form";

export default function Page() {
  return (
    <div>
      <h1>Create Customer</h1>
      <CustomerForm className="max-w-[600px]" hideCancel />
    </div>
  );
}
