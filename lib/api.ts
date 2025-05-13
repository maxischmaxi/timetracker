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
import { CreateUser, UpdateUser, User, UserService } from "@/user/v1/user_pb";

const transport = createConnectTransport({
  baseUrl: process.env.NEXT_PUBLIC_API_GATEWAY as string,
  fetch: (url, init) => {
    return fetch(url, {
      ...init,
      cache: "no-store",
      next: {
        revalidate: 0,
      },
    });
  },
});

const customerClient = createClient(CustomerService, transport);
const projectClient = createClient(ProjectService, transport);
const jobsClient = createClient(JobService, transport);
const userClient = createClient(UserService, transport);
const tagsClient = createClient(TagsService, transport);

export async function getCustomers(): Promise<Plain<Customer>[] | undefined> {
  return await customerClient.getCustomers({}).then((res) => res.customers);
}

export async function getProjects(): Promise<Plain<Project>[] | undefined> {
  return await projectClient.getProjects({}).then((res) => res.projects);
}

export async function getProjectsByCustomer(
  id: string,
): Promise<Plain<Project>[] | undefined> {
  return await projectClient
    .getProjectsByCustomer({ customerId: id })
    .then((res) => res.projects);
}

export async function deleteProject(id: string): Promise<string | undefined> {
  return await projectClient.deleteProject({ id }).then((res) => res.id);
}

export async function updateProject(
  data: Plain<UpdateProject>,
): Promise<Plain<Project> | undefined> {
  return await projectClient
    .updateProject({ project: data })
    .then((res) => res.project);
}

export async function getProject(
  id: string,
): Promise<Plain<Project> | undefined> {
  return await projectClient.getProject({ id }).then((res) => res.project);
}

export async function getCustomer(
  id: string,
): Promise<Plain<Customer> | undefined> {
  return await customerClient.getCustomer({ id }).then((res) => res.customer);
}

export async function deleteCustomer(id: string): Promise<string | undefined> {
  return await customerClient.deleteCustomer({ id }).then((res) => res.id);
}

export async function updateCustomer(
  data: Plain<UpdateCustomer>,
): Promise<Plain<Customer> | undefined> {
  return await customerClient
    .updateCustomer({ customer: data })
    .then((res) => res.customer);
}

export async function createCustomer(
  data: Plain<CreateCustomer>,
): Promise<Plain<Customer> | undefined> {
  return await customerClient
    .createCustomer({ customer: data })
    .then((res) => res.customer);
}

export async function getJob(id: string): Promise<Plain<Job> | undefined> {
  return await jobsClient.getJob({ id }).then((res) => res.job);
}

export async function getJobs(): Promise<Array<Plain<Job>> | undefined> {
  return await jobsClient.getJobs({}).then((res) => res.jobs);
}

export async function getJobsByProject(
  id: string,
): Promise<Array<Plain<Job>> | undefined> {
  return await jobsClient
    .getJobsByProject({ projectId: id })
    .then((res) => res.jobs);
}

export async function deleteJob(id: string): Promise<string | undefined> {
  return await jobsClient.deleteJob({ id }).then((res) => res.id);
}

export async function updateJob(data: Job): Promise<Plain<Job> | undefined> {
  return await jobsClient.updateJob({ job: data }).then((res) => res.job);
}

export async function createJob(
  data: Plain<CreateJob>,
): Promise<Plain<Job> | undefined> {
  return await jobsClient.createJob({ job: data }).then((res) => res.job);
}

export async function getJobByCustomer(
  id: string,
): Promise<Array<Plain<Job>> | undefined> {
  return await jobsClient
    .getJobsByCustomer({ customerId: id })
    .then((res) => res.jobs);
}

export async function getJobsByDate(
  date: Date,
): Promise<Array<Plain<JobsByDateResponse>> | undefined> {
  return await jobsClient
    .getJobsByDate({
      date: format(date, "yyyy-MM-dd"),
    })
    .then((res) => res.jobs);
}

export async function createProject(
  data: Plain<CreateProject>,
): Promise<Plain<Project> | undefined> {
  return await projectClient
    .createProject({ project: data })
    .then((res) => res.project);
}

export async function getUserById(
  id: string,
): Promise<Plain<User> | undefined> {
  return await userClient.getUserById({ id }).then((res) => res.user);
}

export async function getAllUsers(): Promise<Array<Plain<User>> | undefined> {
  return await userClient.getAllUsers({}).then((res) => res.users);
}

export async function getAllTags(): Promise<string[] | undefined> {
  return await tagsClient.getAllTags({}).then((res) => res.tags);
}

export async function createUser(
  data: Plain<CreateUser>,
): Promise<Plain<User> | undefined> {
  return await userClient.createUser({ user: data }).then((res) => res.user);
}

export async function updateUser(
  id: string,
  data: Plain<UpdateUser>,
): Promise<Plain<User> | undefined> {
  return await userClient
    .updateUser({
      id,
      user: data,
    })
    .then((res) => res.user);
}
