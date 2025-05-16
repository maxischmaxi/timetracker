import { UserForm } from "@/components/user-form";
import { getUserById } from "@/lib/server-api";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user?.user) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 md:px-6">
      <UserForm user={user.user} className="max-w-[600px]" />
    </div>
  );
}
