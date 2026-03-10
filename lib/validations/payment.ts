import * as Yup from "yup";

export const paymentSchema = Yup.object({
  amount: Yup.number()
    .positive("Must be positive")
    .required("Amount is required"),
  payment_date: Yup.string().required("Payment date is required"),
  payment_type: Yup.string()
    .oneOf(["advance", "milestone", "partial", "final"])
    .required("Payment type is required"),
  note: Yup.string().optional(),
});

export type PaymentFormValues = Yup.InferType<typeof paymentSchema>;
