import { z } from 'zod';

export const listingSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(200),
    price: z.string().min(1, "Price is required"),
    category: z.string().min(1, "Category is required"),
    town: z.string().min(1, "Town is required"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    condition: z.enum(['Brand New', 'Like New', 'Good', 'Fair', 'For Parts']),
    images: z.array(z.string().url()).optional(),
    img: z.string().url().optional(),
    slug: z.string().optional(),
    price_value: z.number().optional(),
});

export type ListingInput = z.infer<typeof listingSchema>;
