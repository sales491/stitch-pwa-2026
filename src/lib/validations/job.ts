import { z } from 'zod';

export const jobSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    company_name: z.string().min(2, "Company name must be at least 2 characters"),
    location: z.string(),
    employment_type: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Casual']),
    salary_range: z.string().optional(),
    description: z.string().min(20, "Description must be at least 20 characters"),
    requirements: z.array(z.string()).optional(),
    contact: z.object({
        phone: z.string().optional(),
        email: z.string().optional(),
        fbUsername: z.string().optional()
    }).optional(),
    slug: z.string()
});

export type JobInput = z.infer<typeof jobSchema>;
