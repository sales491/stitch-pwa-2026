import { z } from 'zod';

export const businessSchema = z.object({
    business_name: z.string().min(2, "Business name must be at least 2 characters").max(100),
    business_type: z.string().nullable().optional(),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000).nullable().optional(),
    location: z.string().min(2, "Location is required").nullable().optional(),
    contact_info: z.object({
        email: z.string().email("Invalid email").optional().or(z.literal('')),
        phone: z.string().optional(),
        address: z.string().optional(),
    }).nullable().optional(),
    operating_hours: z.string().nullable().optional(),
    social_media: z.object({
        facebook: z.string().optional(),
        messenger: z.string().optional(),
        logo: z.string().optional(),
    }).nullable().optional(),
    website: z.string().url("Invalid URL").optional().or(z.literal('')).nullable().optional(),
    categories: z.array(z.string()).optional(),
    gallery_image: z.string().url("Invalid image URL").optional().or(z.literal('')).nullable().optional(),
    gallery_images: z.array(z.string()).optional(),
});

export type BusinessInput = z.infer<typeof businessSchema>;
