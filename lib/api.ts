"use client";

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
  CreateJob,
  Job,
  JobsByDateResponse,
  JobService,
} from "@/job/v1/job_pb";
import {
  CreateProject,
  Project,
  ProjectService,
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

const transport = createConnectTransport({
  baseUrl: process.env.NEXT_PUBLIC_API_GATEWAY as string,
  fetch: async (input, init) => {
    const headers = new Headers(init?.headers);
    const token = await getToken();
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }

    return fetch(input, {
      ...init,
      headers,
    });
  },
});

const customerClient = createClient(CustomerService, transport);
const projectClient = createClient(ProjectService, transport);
const jobsClient = createClient(JobService, transport);
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

export async function updateCustomer(
  data: Plain<UpdateCustomer>,
): Promise<Plain<Customer> | undefined> {
  return await customerClient
    .updateCustomer({ customer: data })
    .then((res) => res.customer as unknown as Plain<Customer>);
}

export async function createCustomer(
  data: Plain<CreateCustomer>,
): Promise<Plain<Customer> | undefined> {
  return await customerClient
    .createCustomer({ customer: data })
    .then((res) => res.customer as unknown as Plain<Customer>);
}

export async function getJob(id: string): Promise<Plain<Job> | undefined> {
  return await jobsClient
    .getJob({ id })
    .then((res) => res.job as unknown as Plain<Job>);
}

export async function getJobs(): Promise<Array<Plain<Job>> | undefined> {
  return await jobsClient
    .getJobs({})
    .then((res) => res.jobs as unknown as Array<Plain<Job>>);
}

export async function getJobsByProject(
  id: string,
): Promise<Array<Plain<Job>> | undefined> {
  return await jobsClient
    .getJobsByProject({ projectId: id })
    .then((res) => res.jobs as unknown as Array<Plain<Job>>);
}

export async function deleteJob(id: string): Promise<string | undefined> {
  return await jobsClient.deleteJob({ id }).then((res) => res.id);
}

export async function updateJob(data: Job): Promise<Plain<Job> | undefined> {
  return await jobsClient
    .updateJob({ job: data })
    .then((res) => res.job as unknown as Plain<Job>);
}

export async function createJob(
  data: Plain<CreateJob>,
): Promise<Plain<Job> | undefined> {
  return await jobsClient
    .createJob({
      job: {
        date: data.date,
        description: data.description,
        projectId: data.projectId,
        hours: BigInt(data.hours),
        minutes: BigInt(data.minutes),
        type: data.type,
      },
    })
    .then((res) => res.job as unknown as Plain<Job>);
}

export async function getJobByCustomer(
  id: string,
): Promise<Array<Plain<Job>> | undefined> {
  return await jobsClient
    .getJobsByCustomer({ customerId: id })
    .then((res) => res.jobs as unknown as Array<Plain<Job>>);
}

export async function getJobsByDate(
  date: Date,
): Promise<Array<Plain<JobsByDateResponse>> | undefined> {
  return await jobsClient
    .getJobsByDate({
      date: format(date, "yyyy-MM-dd"),
    })
    .then((res) => res.jobs as unknown as Array<Plain<JobsByDateResponse>>);
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
