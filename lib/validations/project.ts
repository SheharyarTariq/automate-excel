import * as Yup from "yup";

export const projectSchema = Yup.object({
  name: Yup.string().required("Project name is required").min(2, "Too short"),
  client_name: Yup.string().required("Client name is required"),
  start_date: Yup.string().required("Start date is required"),
  fee_type: Yup.string()
    .oneOf(["fixed", "hourly", "retainer"])
    .required("Fee type is required"),
  fee_amount: Yup.number()
    .positive("Must be positive")
    .required("Fee amount is required"),
  team_size: Yup.number()
    .integer()
    .min(1, "At least 1 member")
    .required("Team size is required"),
  platform: Yup.string()
    .oneOf(["upwork", "direct", "fiverr", "toptal", "other"])
    .required("Platform is required"),
  status: Yup.string()
    .oneOf(["active", "paused", "completed", "cancelled"])
    .required("Status is required"),
  currency: Yup.string().default("USD"),
  description: Yup.string().optional(),
  end_date: Yup.string().optional().nullable(),
});

export type ProjectFormValues = Yup.InferType<typeof projectSchema>;
