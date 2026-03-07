import { z } from 'zod';

export const transportServiceSchema = z.object({
    driver_name: z.string().min(2, "Driver name is required"),
    vehicle_type: z.enum(['Tricycle', 'Motorcycle', 'Jeepney', 'Van / UV Express', 'Private Car', 'Truck']),
    service_type: z.enum(['Passenger', 'Delivery', 'Both']),
    base_town: z.string().min(2, "Base town is required"),
    contact_number: z.string().min(7, "Contact number is required"),
    is_available: z.boolean().default(true),
    notes: z.string().optional(),
    route: z.object({
        from: z.string().optional(),
        to: z.string().optional()
    }).optional(),
    schedule: z.array(z.object({
        day: z.string(),
        time: z.string()
    })).optional(),
    charter_avail: z.boolean().default(false),
    charter_details: z.object({
        min_pax: z.number().optional(),
        rate: z.number().optional(),
        notes: z.string().optional()
    }).optional(),
    seats_available: z.number().optional(),
    price_per_seat: z.number().optional(),
    contact_details: z.object({
        fb_username: z.string().optional(),
        email: z.string().optional()
    }).optional(),
    towns_covered: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
});

export type TransportServiceInput = z.infer<typeof transportServiceSchema>;
