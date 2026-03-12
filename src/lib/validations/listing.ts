import { z } from 'zod';

export const listingSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title too long (max 200 chars)"),
    price: z.string().min(1, "Price is required").max(50, "Price value too long"),
    category: z.string().min(1, "Category is required").max(100),
    town: z.string().min(1, "Town is required").max(100),
    description: z.string().min(20, "Description must be at least 20 characters").max(3000, "Description too long (max 3000 chars)"),
    condition: z.enum(['Brand New', 'Like New', 'Good', 'Fair', 'For Parts']),
    images: z.array(z.string().url()).optional(),
    img: z.string().url().optional(),
    slug: z.string().optional(),
    price_value: z.number().optional(),
    status: z.enum(['active', 'pending', 'sold', 'draft']).optional(),
    contact_details: z.record(z.string(), z.string()).optional(),
    delivery: z.boolean().optional(),
});

export type ListingInput = z.infer<typeof listingSchema>;
