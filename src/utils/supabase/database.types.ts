export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            business_profiles: {
                Row: {
                    business_name: string
                    business_type: string | null
                    categories: string[] | null
                    contact_info: Json | null
                    created_at: string | null
                    description: string | null
                    gallery_image: string | null
                    id: string
                    location: string | null
                    operating_hours: string | null
                    social_media: Json | null
                    stats: Json | null
                    updated_at: string | null
                    user_id: string | null
                    website: string | null
                }
            }
        }
    }
}
