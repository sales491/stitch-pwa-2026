import { z } from 'zod';

export const gemSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    town: z.string().min(1, "Town is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    images: z.array(z.string().url()).optional(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
});

export type GemInput = z.infer<typeof gemSchema>;
