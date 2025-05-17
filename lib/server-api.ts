import "server-only";

import {
  CreateCustomer,
  Customer,
  CustomerService,
  UpdateCustomer,
} from "@/customer/v1/customer_pb";
import {
  CreateProject,
  Project,
  ProjectService,
  UpdateProject,
} from "@/project/v1/project_pb";
import { TagsService } from "@/tags/v1/tags_pb";
import { Plain } from "@/types";
import {
  CreateUser,
  GetUserByEmailResponse,
  GetUserByIdResponse,
  UpdateUser,
  User,
  UserService,
} from "@/user/v1/user_pb";
import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { Org, OrgService } from "@/org/v1/org_pb";
import { AuthService, GetUserByFirebaseUidResponse } from "@/auth/v1/auth_pb";

const transport = createConnectTransport({
  baseUrl: process.env.NEXT_PUBLIC_API_GATEWAY as string,
  fetch: async (url, init) => {
    const headers = new Headers(init?.headers);
    headers.append("Authorization", "Bearer ITISTHEAPI");

    return fetch(url, {
      ...init,
      headers,
      cache: "no-store",
      next: {
        revalidate: 0,
      },
    });
  },
});

const authClient = createClient(AuthService, transport);
const orgsClient = createClient(OrgService, transport);
const customerClient = createClient(CustomerService, transport);
const projectClient = createClient(ProjectService, transport);
const userClient = createClient(UserService, transport);
const tagsClient = createClient(TagsService, transport);

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
  await customerClient.updateCustomer({ customer: data });
}

export async function createCustomer(
  data: Plain<CreateCustomer>,
): Promise<Plain<Customer> | undefined> {
  return await customerClient
    .createCustomer({ customer: data })
    .then((res) => res.customer as unknown as Plain<Customer>);
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

export async function getOrgById(id: string): Promise<Plain<Org> | undefined> {
  return await orgsClient
    .getOrgById({ id })
    .then((res) => res.org as unknown as Plain<Org>);
}

export async function acceptEmailInvite(
  token: string,
  orgId: string,
  firebaseUid: string,
): Promise<void> {
  await orgsClient.acceptEmailInvite({ orgId, token, firebaseUid });
}

export async function getAllOrgsByFirebaseUid(uid: string) {
  return await userClient
    .getAllOrgsByFirebaseUid({ firebaseUid: uid })
    .then((res) => res.orgs as unknown as Plain<Org>[]);
}

export async function getCustomersByOrg(orgId: string) {
  return await customerClient
    .getCustomersByOrg({ orgId })
    .then((res) => res.customers as unknown as Plain<Customer>[]);
}

export async function getProjectsByOrg(orgId: string) {
  return await projectClient
    .getProjectsByOrg({
      orgId,
    })
    .then((res) => res.projects as unknown as Plain<Project>[]);
}
