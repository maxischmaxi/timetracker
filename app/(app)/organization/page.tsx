import { OrgServiceTypes } from "@/components/org-service-types";
import {
  getCustomersByOrg,
  getOrgById,
  getProjectsByOrg,
} from "@/lib/server-api";
import { getAuthenticatedAppForUser } from "@/lib/server-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    redirect("/auth/login");
  }

  const orgId = (await cookies()).get("__org")?.value;

  if (!orgId) {
    redirect("/auth/org");
  }

  const org = await getOrgById(orgId);

  if (!org) {
    throw new Error("Org not found!");
  }

  const customers = await getCustomersByOrg(org.id);
  const projects = await getProjectsByOrg(org.id);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <p>{org.name}</p>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50">
          <p>{customers.length} Kunden</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50">
          <p>{projects.length} Projekte</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50"></div>
      </div>
      <div className="flex-1 rounded-xl bg-muted/50 min-h-min p-4">
        <OrgServiceTypes />
      </div>
    </div>
  );
}
