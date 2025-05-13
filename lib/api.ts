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
  GetUserByEmailResponse,
  GetUserByIdResponse,
  UpdateUser,
  User,
  UserService,
} from "@/user/v1/user_pb";
import { getToken } from "./auth";

const transport = createConnectTransport({
  baseUrl: process.env.NEXT_PUBLIC_API_GATEWAY as string,
  fetch: async (url, init) => {
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

async function getHeaders(): Promise<Headers> {
  const headers = new Headers();
  const token = await getToken();
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export async function getCustomers(): Promise<Plain<Customer>[] | undefined> {
  return await customerClient
    .getCustomers({}, { headers: await getHeaders() })
    .then((res) => res.customers as unknown as Array<Plain<Customer>>);
}

export async function getProjects(): Promise<Plain<Project>[] | undefined> {
  return await projectClient
    .getProjects({}, { headers: await getHeaders() })
    .then((res) => res.projects as unknown as Array<Plain<Project>>);
}

export async function getProjectsByCustomer(
  id: string,
): Promise<Plain<Project>[] | undefined> {
  return await projectClient
    .getProjectsByCustomer({ customerId: id }, { headers: await getHeaders() })
    .then((res) => res.projects as unknown as Array<Plain<Project>>);
}

export async function deleteProject(id: string): Promise<string | undefined> {
  return await projectClient
    .deleteProject({ id }, { headers: await getHeaders() })
    .then((res) => res.id);
}

export async function updateProject(
  data: Plain<UpdateProject>,
): Promise<Plain<Project> | undefined> {
  return await projectClient
    .updateProject({ project: data }, { headers: await getHeaders() })
    .then((res) => res.project as unknown as Plain<Project>);
}

export async function getProject(
  id: string,
): Promise<Plain<Project> | undefined> {
  return await projectClient
    .getProject({ id }, { headers: await getHeaders() })
    .then((res) => res.project as unknown as Plain<Project>);
}

export async function getCustomer(
  id: string,
): Promise<Plain<Customer> | undefined> {
  return await customerClient
    .getCustomer({ id }, { headers: await getHeaders() })
    .then((res) => res.customer as unknown as Plain<Customer>);
}

export async function deleteCustomer(id: string): Promise<string | undefined> {
  return await customerClient
    .deleteCustomer({ id }, { headers: await getHeaders() })
    .then((res) => res.id);
}

export async function updateCustomer(
  data: Plain<UpdateCustomer>,
): Promise<Plain<Customer> | undefined> {
  return await customerClient
    .updateCustomer({ customer: data }, { headers: await getHeaders() })
    .then((res) => res.customer as unknown as Plain<Customer>);
}

export async function createCustomer(
  data: Plain<CreateCustomer>,
): Promise<Plain<Customer> | undefined> {
  return await customerClient
    .createCustomer({ customer: data }, { headers: await getHeaders() })
    .then((res) => res.customer as unknown as Plain<Customer>);
}

export async function getJob(id: string): Promise<Plain<Job> | undefined> {
  return await jobsClient
    .getJob({ id }, { headers: await getHeaders() })
    .then((res) => res.job as unknown as Plain<Job>);
}

export async function getJobs(): Promise<Array<Plain<Job>> | undefined> {
  return await jobsClient
    .getJobs({}, { headers: await getHeaders() })
    .then((res) => res.jobs as unknown as Array<Plain<Job>>);
}

export async function getJobsByProject(
  id: string,
): Promise<Array<Plain<Job>> | undefined> {
  return await jobsClient
    .getJobsByProject({ projectId: id }, { headers: await getHeaders() })
    .then((res) => res.jobs as unknown as Array<Plain<Job>>);
}

export async function deleteJob(id: string): Promise<string | undefined> {
  return await jobsClient
    .deleteJob({ id }, { headers: await getHeaders() })
    .then((res) => res.id);
}

export async function updateJob(data: Job): Promise<Plain<Job> | undefined> {
  return await jobsClient
    .updateJob({ job: data }, { headers: await getHeaders() })
    .then((res) => res.job as unknown as Plain<Job>);
}

export async function createJob(
  data: Plain<CreateJob>,
): Promise<Plain<Job> | undefined> {
  return await jobsClient
    .createJob(
      {
        job: {
          date: data.date,
          description: data.description,
          projectId: data.projectId,
          hours: BigInt(data.hours),
          minutes: BigInt(data.minutes),
          type: data.type,
        },
      },
      { headers: await getHeaders() },
    )
    .then((res) => res.job as unknown as Plain<Job>);
}

export async function getJobByCustomer(
  id: string,
): Promise<Array<Plain<Job>> | undefined> {
  return await jobsClient
    .getJobsByCustomer({ customerId: id }, { headers: await getHeaders() })
    .then((res) => res.jobs as unknown as Array<Plain<Job>>);
}

export async function getJobsByDate(
  date: Date,
): Promise<Array<Plain<JobsByDateResponse>> | undefined> {
  return await jobsClient
    .getJobsByDate(
      {
        date: format(date, "yyyy-MM-dd"),
      },
      { headers: await getHeaders() },
    )
    .then((res) => res.jobs as unknown as Array<Plain<JobsByDateResponse>>);
}

export async function createProject(
  data: Plain<CreateProject>,
): Promise<Plain<Project> | undefined> {
  return await projectClient
    .createProject({ project: data }, { headers: await getHeaders() })
    .then((res) => res.project as unknown as Plain<Project>);
}

export async function getUserById(
  id: string,
): Promise<Plain<GetUserByIdResponse> | undefined> {
  return await userClient
    .getUserById({ id }, { headers: await getHeaders() })
    .then((res) => res as unknown as Plain<GetUserByIdResponse>);
}

export async function getAllUsers(): Promise<Array<Plain<User>> | undefined> {
  return await userClient
    .getAllUsers({}, { headers: await getHeaders() })
    .then((res) => res.users as unknown as Array<Plain<User>>);
}

export async function getAllTags(): Promise<string[] | undefined> {
  return await tagsClient
    .getAllTags({}, { headers: await getHeaders() })
    .then((res) => res.tags);
}

export async function createUser(
  data: Plain<CreateUser>,
): Promise<Plain<User> | undefined> {
  return await userClient
    .createUser({ user: data }, { headers: await getHeaders() })
    .then((res) => res.user as unknown as Plain<User>);
}

export async function updateUser(
  id: string,
  data: Plain<UpdateUser>,
): Promise<Plain<User> | undefined> {
  return await userClient
    .updateUser(
      {
        id,
        user: {
          address: data.address,
          email: data.email,
          projectIds: data.projectIds,
          employmentState: data.employmentState,
          name: data.name,
          role: data.role,
          vacationRequests: data.vacationRequests.map((v) => ({
            startDate: BigInt(v.startDate),
            endDate: BigInt(v.endDate),
            comment: v.comment,
            days: v.days,
          })),
          vacations: data.vacations,
          tags: data.tags,
        },
      },
      { headers: await getHeaders() },
    )
    .then((res) => res.user as unknown as Plain<User>);
}

export async function getUserByEmail(
  email: string,
): Promise<Plain<GetUserByEmailResponse> | undefined> {
  return await userClient
    .getUserByEmail({ email }, { headers: await getHeaders() })
    .then((res) => res as unknown as Plain<GetUserByEmailResponse>);
}
