import * as Yup from "yup";

export const milestoneSchema = Yup.object({
  title: Yup.string().required("Title is required").min(2, "Too short"),
  due_date: Yup.string().required("Due date is required"),
  amount: Yup.number()
    .min(0, "Cannot be negative")
    .required("Amount is required"),
  notes: Yup.string().optional(),
  is_completed: Yup.boolean().default(false),
});

export type MilestoneFormValues = Yup.InferType<typeof milestoneSchema>;
