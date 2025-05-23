"use client";

import { z } from "zod";
import Cookie from "js-cookie";
import { createClient } from "@connectrpc/connect";
import { format } from "date-fns";
import { createConnectTransport } from "@connectrpc/connect-web";
import { TagsService } from "@/tags/v1/tags_pb";
import {
  CreateCustomer,
  Customer,
  CustomerService,
  UpdateCustomer,
} from "@/customer/v1/customer_pb";
import {
  CreateJobRequest,
  CreateProject,
  DateJob,
  Job,
  Project,
  ProjectService,
  ProjectType,
  UpdateProject,
} from "@/project/v1/project_pb";
import { Plain } from "@/types";
import {
  CreateUser,
  EmploymentState,
  GetUserByEmailResponse,
  GetUserByIdResponse,
  SetUserActiveStateResponse,
  UpdateUser,
  User,
  UserService,
} from "@/user/v1/user_pb";
import { InviteEmailToOrgResponse, OrgService } from "@/org/v1/org_pb";
import { getToken } from "@/components/auth-provider";
import { AuthService, GetUserByFirebaseUidResponse } from "@/auth/v1/auth_pb";
import { Offer, OffersService } from "@/offers/v1/offers_pb";
import { createOfferSchema, updateOfferSchema } from "./schemas";

const transport = createConnectTransport({
  baseUrl: process.env.NEXT_PUBLIC_API_GATEWAY as string,
  fetch: async (input, init) => {
    const headers = new Headers(init?.headers);
    const token = await getToken();
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
    const orgId = Cookie.get("__org");
    if (orgId) {
      headers.append("x-org-id", orgId);
    }

    return fetch(input, {
      ...init,
      headers,
    });
  },
});

const offersClient = createClient(OffersService, transport);
const customerClient = createClient(CustomerService, transport);
const projectClient = createClient(ProjectService, transport);
const userClient = createClient(UserService, transport);
const tagsClient = createClient(TagsService, transport);
const orgsClient = createClient(OrgService, transport);
const authClient = createClient(AuthService, transport);

export async function getCustomers(): Promise<Plain<Customer>[] | undefined> {
  return await customerClient
    .getCustomers({})
    .then((res) => res.customers as unknown as Array<Plain<Customer>>);
}

export async function getProjects(): Promise<Plain<Project>[] | undefined> {
  return await projectClient
    .getProjects({})
    .then((res) => res.projects as unknown as Array<Plain<Project>>);
}

export async function getProjectsByCustomer(
  id: string,
): Promise<Plain<Project>[] | undefined> {
  return await projectClient
    .getProjectsByCustomer({ customerId: id })
    .then((res) => res.projects as unknown as Array<Plain<Project>>);
}

export async function deleteProject(id: string): Promise<string | undefined> {
  return await projectClient.deleteProject({ id }).then((res) => res.id);
}

export async function updateProject(
  data: Plain<UpdateProject>,
): Promise<Plain<Project> | undefined> {
  return await projectClient
    .updateProject({ project: data })
    .then((res) => res.project as unknown as Plain<Project>);
}

export async function getProject(
  id: string,
): Promise<Plain<Project> | undefined> {
  return await projectClient
    .getProject({ id })
    .then((res) => res.project as unknown as Plain<Project>);
}

export async function getCustomer(
  id: string,
): Promise<Plain<Customer> | undefined> {
  return await customerClient
    .getCustomer({ id })
    .then((res) => res.customer as unknown as Plain<Customer>);
}

export async function deleteCustomer(id: string): Promise<string | undefined> {
  return await customerClient.deleteCustomer({ id }).then((res) => res.id);
}

export async function updateCustomer(data: Plain<UpdateCustomer>) {
  const orgId = Cookie.get("__org");
  if (!orgId) {
    throw new Error("org_id not found");
  }

  await customerClient.updateCustomer({ customer: data, orgId });
}

export async function createCustomer(
  data: Plain<CreateCustomer>,
): Promise<Plain<Customer> | undefined> {
  const orgId = Cookie.get("__org");
  if (!orgId) {
    throw new Error("org_id not set");
  }

  return await customerClient
    .createCustomer({ customer: data, orgId })
    .then((res) => res.customer as unknown as Plain<Customer>);
}

export async function getJob(id: string): Promise<Plain<Job> | undefined> {
  return await projectClient
    .getJob({ id })
    .then((res) => res.job as unknown as Plain<Job>);
}

export async function getJobsByProject(
  id: string,
): Promise<Array<Plain<Job>> | undefined> {
  return await projectClient
    .getJobsByProject({ projectId: id })
    .then((res) => res.jobs as unknown as Array<Plain<Job>>);
}

export async function deleteJob(id: string, projectId: string) {
  await projectClient.deleteJob({ id, projectId });
}

export async function updateJob(data: Job) {
  await projectClient.updateJob({ job: data });
}

export async function createJob(data: Plain<CreateJobRequest>) {
  await projectClient.createJob({
    ...data,
    hours: BigInt(data.hours),
    minutes: BigInt(data.minutes),
  });
}

export async function getJobByCustomer(
  customerId: string,
  projectId: string,
): Promise<Array<Plain<Job>> | undefined> {
  return await projectClient
    .getJobsByCustomer({ projectId, customerId })
    .then((res) => res.jobs as unknown as Array<Plain<Job>>);
}

export async function getJobsByDate(date: Date) {
  return await projectClient
    .getJobsByDate({
      date: format(date, "yyyy-MM-dd"),
    })
    .then((res) => res.jobs as unknown as Array<Plain<DateJob>>);
}

export async function createProject(
  data: Plain<CreateProject>,
): Promise<Plain<Project> | undefined> {
  return await projectClient
    .createProject({ project: data })
    .then((res) => res.project as unknown as Plain<Project>);
}

export async function getUserById(
  id: string,
): Promise<Plain<GetUserByIdResponse> | undefined> {
  return await userClient
    .getUserById({ id })
    .then((res) => res as unknown as Plain<GetUserByIdResponse>);
}

export async function getAllUsers(): Promise<Array<Plain<User>> | undefined> {
  return await userClient
    .getAllUsers({})
    .then((res) => res.users as unknown as Array<Plain<User>>);
}

export async function getAllTags(): Promise<string[] | undefined> {
  return await tagsClient.getAllTags({}).then((res) => res.tags);
}

export async function createUser(
  data: Plain<CreateUser>,
  orgId: string,
): Promise<Plain<User> | undefined> {
  return await userClient
    .createUser({ user: data, orgId })
    .then((res) => res.user as unknown as Plain<User>);
}

export async function updateUser(
  id: string,
  data: Plain<UpdateUser>,
): Promise<Plain<User> | undefined> {
  return await userClient
    .updateUser({
      id,
      user: {
        address: data.address,
        projectIds: data.projectIds,
        name: data.name,
        tags: data.tags,
      },
    })
    .then((res) => res.user as unknown as Plain<User>);
}

export async function getUserByEmail(
  email: string,
): Promise<Plain<GetUserByEmailResponse> | undefined> {
  return await userClient
    .getUserByEmail({ email })
    .then((res) => res as unknown as Plain<GetUserByEmailResponse>);
}

export async function getUserByFirebaseUid(
  uid: string,
): Promise<Plain<GetUserByFirebaseUidResponse> | undefined> {
  return await authClient
    .getUserByFirebaseUid({ uid })
    .then((res) => res as unknown as Plain<GetUserByFirebaseUidResponse>);
}

export async function setUserActiveState(
  state: EmploymentState,
  id: string,
): Promise<Plain<SetUserActiveStateResponse> | undefined> {
  return await userClient
    .setUserActiveState({ state, id })
    .then((res) => res as unknown as Plain<SetUserActiveStateResponse>);
}

export async function inviteEmailToOrg(
  email: string,
): Promise<Plain<InviteEmailToOrgResponse> | undefined> {
  const localOrg = Cookie.get("__org");
  if (!localOrg) {
    throw new Error("org not set");
  }
  return await orgsClient
    .inviteEmailToOrg({ email, orgId: localOrg })
    .then((res) => res as unknown as Plain<InviteEmailToOrgResponse>);
}

export async function register(
  email: string,
  password: string,
  name: string,
  orgId: string | undefined,
) {
  return await authClient.register({
    email,
    password,
    name,
    orgId,
  });
}

export async function createServiceType(name: string): Promise<void> {
  const orgId = Cookie.get("__org");
  if (!orgId) {
    throw new Error("org_id missing");
  }

  await orgsClient.createServiceType({
    name,
    orgId,
  });
}

export async function updateServiceTypeStatus(
  value: boolean,
  id: string,
): Promise<boolean> {
  const orgId = Cookie.get("__org");
  if (!orgId) {
    throw new Error("org_id missing");
  }

  return await orgsClient
    .updateServiceTypeStatus({
      orgId,
      status: value,
      serviceTypeId: id,
    })
    .then((res) => res.status);
}

export async function deleteServiceType(id: string) {
  const orgId = Cookie.get("__org");
  if (!orgId) {
    throw new Error("org_id missing");
  }

  await orgsClient.deleteServiceType({
    orgId,
    serviceTypeId: id,
  });
}

export async function updateProjectType(projectId: string, value: boolean) {
  await projectClient.updateProjectType({
    projectId,
    projectType: value ? ProjectType.BILLABLE : ProjectType.NON_BILLABLE,
  });
}

export async function setOrgPayment(props: {
  bankName: string;
  legalNotice: string;
  bic: string;
  orgId: string;
  iban: string;
}) {
  await orgsClient.setOrgPayment({
    ...props,
  });
}

export async function createOffer(
  data: z.infer<typeof createOfferSchema>,
  orgId: string,
) {
  return await offersClient
    .createOffer({
      ...data,
      orgId,
    })
    .then((res) => res.offer as unknown as Plain<Offer>);
}

export async function updateOffer(data: z.infer<typeof updateOfferSchema>) {
  return await offersClient
    .updateOffer(data)
    .then((res) => res.offer as unknown as Plain<Offer>);
}

export async function getOffersByOrgId(orgId: string) {
  return await offersClient
    .getOffersByOrgId({
      orgId,
    })
    .then((res) => res.offers as unknown as Plain<Offer>[]);
}

export async function createEmptyOffer(orgId: string) {
  return await offersClient
    .createEmptyOffer({
      orgId,
    })
    .then((res) => res.offer as unknown as Plain<Offer>);
}

export async function getOfferById(id: string) {
  return await offersClient
    .getOfferById({
      id,
    })
    .then((res) => res.offer as unknown as Plain<Offer>);
}

export async function deleteOffer(id: string) {
  await offersClient.deleteOffer({ id });
}
