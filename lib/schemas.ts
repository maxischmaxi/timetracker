import { OfferStatus } from "@/offers/v1/offers_pb";
import { DiscountType, PositionUnit } from "@/positions/v1/positions_pb";
import { JobType } from "@/project/v1/project_pb";
import { EmploymentState } from "@/user/v1/user_pb";
import { z } from "zod";

export const createJobSchema = z.object({
  serviceTypeId: z.string().min(1, {
    message: "ServiceTypeId Is required",
  }),
  projectId: z
    .string({
      message: "Project ID is required",
    })
    .trim()
    .min(1, {
      message: "Project ID is required",
    }),
  description: z
    .string({
      message: "Description is required",
    })
    .trim()
    .min(1, {
      message: "Description is required",
    }),
  type: z.nativeEnum(JobType, {
    message: "Type is required",
  }),
  hours: z.number({
    message: "Hours is required",
  }),
  minutes: z.number({
    message: "Minutes is required",
  }),
  date: z
    .string({
      message: "Date is required",
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date is invalid",
    }),
  isMeeting: z.boolean(),
});

export const createProjectSchema = z.object({
  customColor: z.string().optional(),
  name: z.string({
    message: "Name is required",
  }),
  description: z.string({
    message: "Description is required",
  }),
  customerId: z.string({
    message: "Customer ID is required",
  }),
});

export const addressSchema = z.object({
  street: z
    .string({
      message: "Street is required",
    })
    .trim()
    .min(1, {
      message: "Street is required",
    }),
  city: z
    .string({
      message: "City is required",
    })
    .trim()
    .min(1, {
      message: "City is required",
    }),
  state: z
    .string({
      message: "State is required",
    })
    .trim()
    .min(1, {
      message: "State is required",
    }),
  zip: z
    .string({
      message: "Zip code is required",
    })
    .trim()
    .min(1, {
      message: "Zip code is required",
    }),
  country: z
    .string({
      message: "Country is required",
    })
    .trim()
    .min(1, {
      message: "Country is required",
    }),
});

export const createCustomerSchema = z.object({
  tag: z
    .string({
      message: "Tag is required",
    })
    .trim()
    .length(3, "Tag must be three characters"),
  name: z
    .string({
      message: "Name is required",
    })
    .trim()
    .min(1, {
      message: "Name is required",
    }),
  email: z
    .string({
      message: "Email is required",
    })
    .trim()
    .email({
      message: "Email is invalid",
    }),
  phone: z
    .string({
      message: "Phone is required",
    })
    .trim()
    .min(1, {
      message: "Phone is required",
    }),
  address: addressSchema,
});

const vacationSchema = z.object({
  userId: z
    .string({
      message: "User ID is required",
    })
    .trim()
    .min(1, {
      message: "User ID is required",
    }),
  year: z
    .number({
      message: "Year is required",
    })
    .min(2000, {
      message: "Year must be greater than 2023",
    }),
  days: z
    .number({
      message: "Days is required",
    })
    .min(0, {
      message: "Days is required",
    })
    .max(50, {
      message: "Days must be less than 30",
    }),
  specialDays: z
    .number({
      message: "Special days is required",
    })
    .min(0, {
      message: "Special days must be greater than 0",
    })
    .max(50, {
      message: "Special days must be less than 30",
    }),
  sickDaysTaken: z
    .number({
      message: "Sick days taken is required",
    })
    .min(0, {
      message: "Sick days taken must be greater than 0",
    }),
  vacationDaysTaken: z
    .number({
      message: "Vacation days taken is required",
    })
    .min(0, {
      message: "Vacation days taken must be greater than 0",
    }),
});

const vacationRequestSchema = z.object({
  startDate: z.number({
    message: "Start date is required",
  }),
  endDate: z.number({
    message: "End date is required",
  }),
  days: z.number({
    message: "Days is required",
  }),
  comment: z.string({
    message: "Comment is required",
  }),
});

export const createUserSchema = z.object({
  email: z
    .string({
      message: "Email is required",
    })
    .trim()
    .email({
      message: "Email is invalid",
    }),
  name: z
    .string({
      message: "Name is required",
    })
    .trim()
    .min(1, {
      message: "Name is required",
    }),
  address: addressSchema,
  tags: z.array(z.string()).optional(),
  employmentState: z.nativeEnum(EmploymentState, {
    message: "Employment state is required",
  }),
  projectIds: z.array(z.string()).optional(),
  vacations: z.array(vacationSchema).optional(),
  vacationRequests: z.array(vacationRequestSchema),
});

export const loginSchema = z.object({
  email: z
    .string({
      message: "Please enter your email",
    })
    .email({
      message: "Enter a valid email",
    }),
  password: z
    .string({
      message: "Please enter your password",
    })
    .trim()
    .min(8, {
      message: "Your password must be at least 8 characters long",
    })
    .max(4096, {
      message: "Your password cannot be longer than 4096 characters",
    })
    .regex(/[a-z]/, "Must have a lowercase letter")
    .regex(/[A-Z]/, "Must have a uppercase letter")
    .regex(/[0-9]/, "Must have a number")
    .regex(/[^a-zA-Z0-9]/, "Must have a special character"),
});

export const inviteEmailToOrgSchema = z.object({
  email: z.string().email(),
});

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string({
        message: "Please enter your password",
      })
      .trim()
      .min(8, {
        message: "Your password must be at least 8 characters long",
      })
      .max(4096, {
        message: "Your password cannot be longer than 4096 characters",
      })
      .regex(/[a-z]/, "Must have a lowercase letter")
      .regex(/[A-Z]/, "Must have a uppercase letter")
      .regex(/[0-9]/, "Must have a number")
      .regex(/[^a-zA-Z0-9]/, "Must have a special character"),
    passwordConfirm: z.string(),
    name: z.string().trim().min(1, "Bitte gib einen namen an"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Passwörter stimmen nicht überein",
        fatal: true,
      });
    }
  });

export const serviceTypeSchema = z.object({
  name: z.string({ message: "Please add a name" }),
});

export const orgPaymentSchema = z.object({
  iban: z.string(),
  bic: z.string(),
  bankName: z.string(),
  legalNotice: z.string().optional(),
});

export const discountSchema = z.object({
  type: z.nativeEnum(DiscountType),
  value: z.number(),
});

export const positionSchema = z.object({
  name: z.string(),
  description: z.string(),
  count: z.number().min(0),
  price: z.number().min(0),
  unit: z.nativeEnum(PositionUnit),
});

export const createOfferSchema = z.object({
  dateOfIssue: z.string(),
  validUntil: z.string(),
  offerNo: z.string().regex(/(\d{4})-(\d+)/, {
    message:
      "Dokumentennummer muss nach dem Muster `2025-001` formatiert sein.",
  }),
  note: z.string().optional(),
  customerId: z.string(),
  legalNotice: z.string().optional(),
  payment: orgPaymentSchema.optional(),
  positions: z.array(positionSchema),
  discount: discountSchema.optional(),
  status: z.nativeEnum(OfferStatus),
});

export const updateOfferSchema = createOfferSchema.extend({
  id: z.string(),
});
