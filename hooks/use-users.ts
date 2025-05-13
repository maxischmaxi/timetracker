import { createUser, getAllUsers, updateUser } from "@/lib/api";
import { createUserSchema } from "@/lib/schemas";
import { VacationRequestStatus } from "@/user/v1/user_pb";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    async queryFn() {
      return await getAllUsers().then((res) => {
        if (!res) return [];
        return res;
      });
    },
  });
}

export function useCreateUser() {
  return useMutation({
    async mutationFn(data: z.infer<typeof createUserSchema>) {
      return await createUser({
        name: data.name,
        tags: data.tags ?? [],
        email: data.email,
        employmentState: data.employmentState,
        projectIds: data.projectIds ?? [],
        role: data.role,
        vacations: data.vacations ?? [],
        address: {
          city: data.address.city,
          country: data.address.country,
          state: data.address.state,
          street: data.address.street,
          zip: data.address.zip,
        },
      });
    },
  });
}

export function useUpdateUser() {
  return useMutation({
    async mutationFn(data: z.infer<typeof createUserSchema> & { id: string }) {
      return await updateUser(data.id, {
        address: {
          city: data.address.city,
          country: data.address.country,
          state: data.address.state,
          street: data.address.street,
          zip: data.address.zip,
        },
        vacations: data.vacations || [],
        role: data.role,
        email: data.email,
        employmentState: data.employmentState,
        projectIds: data.projectIds || [],
        tags: data.tags || [],
        name: data.name,
        vacationRequests: data.vacationRequests.map((v) => ({
          comment: v.comment,
          status: VacationRequestStatus.PENDING,
          days: v.days,
          endDate: v.endDate,
          startDate: v.startDate,
        })),
      });
    },
  });
}
