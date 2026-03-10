import * as Yup from "yup";

export const costSchema = Yup.object({
  label: Yup.string().required("Label is required"),
  amount: Yup.number()
    .positive("Must be positive")
    .required("Amount is required"),
  cost_date: Yup.string().required("Cost date is required"),
  cost_type: Yup.string()
    .oneOf(["platform_fee", "ad_spend", "tool", "other"])
    .required("Cost type is required"),
  note: Yup.string().optional(),
  project_id: Yup.string().required("Project is required"),
});

export type CostFormValues = Yup.InferType<typeof costSchema>;
