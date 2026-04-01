import { z } from 'zod';

export const eventSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    event_date: z.string(), // ISO date
    event_time: z.string(), // HH:mm
    town: z.string(),
    location: z.string().min(2, "Specific venue/location required"),
    category: z.string(),
    image: z.string().optional(),
    images: z.array(z.string()).optional(),
    event_date_end: z.string().optional(), // Optional end date
    day_of_month: z.number().int().optional(),
    month: z.number().int().optional(),
    date: z.string().optional(), // Display date like "MAR 15"
    full_date: z.string().optional(), // Full display date
    time: z.string().optional() // Display time
});

export type EventInput = z.infer<typeof eventSchema>;
