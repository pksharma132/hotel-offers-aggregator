import z from "zod";

export const querySchema = z.object({
  city: z.string().min(1),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional()
});

export type QueryParams = z.infer<typeof querySchema>;