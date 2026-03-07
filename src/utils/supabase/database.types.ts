export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            activity_clusters: {
                Row: {
                    created_at: string | null
                    id: string
                    is_active: boolean | null
                    name: string
                    post_count: number | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    name: string
                    post_count?: number | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    name?: string
                    post_count?: number | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            business_claim_requests: {
                Row: {
                    business_id: string
                    created_at: string | null
                    id: string
                    message: string | null
                    proof_of_ownership: string | null
                    rejection_reason: string | null
                    requester_email: string
                    requester_name: string
                    requester_phone: string | null
                    reviewed_at: string | null
                    reviewed_by: string | null
                    status: string
                    updated_at: string | null
                }
                Insert: {
                    business_id: string
                    created_at?: string | null
                    id?: string
                    message?: string | null
                    proof_of_ownership?: string | null
                    rejection_reason?: string | null
                    requester_email: string
                    requester_name: string
                    requester_phone?: string | null
                    reviewed_at?: string | null
                    reviewed_by?: string | null
                    status?: string
                    updated_at?: string | null
                }
                Update: {
                    business_id?: string
                    created_at?: string | null
                    id?: string
                    message?: string | null
                    proof_of_ownership?: string | null
                    rejection_reason?: string | null
                    requester_email?: string
                    requester_name?: string
                    requester_phone?: string | null
                    reviewed_at?: string | null
                    reviewed_by?: string | null
                    status?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "business_claim_requests_business_id_fkey"
                        columns: ["business_id"]
                        isOneToOne: false
                        referencedRelation: "business_profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            business_profiles: {
                Row: {
                    average_rating: number | null
                    business_name: string
                    business_type: string | null
                    categories: string[] | null
                    contact_info: Json | null
                    created_at: string | null
                    description: string | null
                    gallery_image: string | null
                    gallery_images: string[] | null
                    id: string
                    is_verified: boolean | null
                    location: string | null
                    operating_hours: string | null
                    owner_id: string
                    review_count: number | null
                    social_media: Json | null
                    updated_at: string | null
                }
                Insert: {
                    average_rating?: number | null
                    business_name: string
                    business_type?: string | null
                    categories?: string[] | null
                    contact_info?: Json | null
                    created_at?: string | null
                    description?: string | null
                    gallery_image?: string | null
                    gallery_images?: string[] | null
                    id?: string
                    is_verified?: boolean | null
                    location?: string | null
                    operating_hours?: string | null
                    owner_id: string
                    review_count?: number | null
                    social_media?: Json | null
                    updated_at?: string | null
                }
                Update: {
                    average_rating?: number | null
                    business_name?: string
                    business_type?: string | null
                    categories?: string[] | null
                    contact_info?: Json | null
                    created_at?: string | null
                    description?: string | null
                    gallery_image?: string | null
                    gallery_images?: string[] | null
                    id?: string
                    is_verified?: boolean | null
                    location?: string | null
                    operating_hours?: string | null
                    owner_id?: string
                    review_count?: number | null
                    social_media?: Json | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "business_profiles_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: true
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            business_reviews: {
                Row: {
                    author_id: string | null
                    author_name: string
                    business_id: string
                    comment: string | null
                    created_at: string | null
                    id: string
                    rating: number
                    updated_at: string | null
                }
                Insert: {
                    author_id?: string | null
                    author_name: string
                    business_id: string
                    comment?: string | null
                    created_at?: string | null
                    id?: string
                    rating: number
                    updated_at?: string | null
                }
                Update: {
                    author_id?: string | null
                    author_name?: string
                    business_id?: string
                    comment?: string | null
                    created_at?: string | null
                    id?: string
                    rating?: number
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "business_reviews_business_id_fkey"
                        columns: ["business_id"]
                        isOneToOne: false
                        referencedRelation: "business_profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            charter_bookings: {
                Row: {
                    budget_range: string | null
                    created_at: string | null
                    destinations: string[] | null
                    duration_hours: number | null
                    estimated_price: number | null
                    event_type: string
                    frequency: string | null
                    group_size: number
                    id: string
                    is_regular_service: boolean | null
                    notes: string | null
                    operator_id: string | null
                    pickup_date: string | null
                    pickup_location: string
                    pickup_time: string | null
                    requester_id: string | null
                    special_requirements: string | null
                    status: string | null
                    updated_at: string | null
                }
                Insert: {
                    budget_range?: string | null
                    created_at?: string | null
                    destinations?: string[] | null
                    duration_hours?: number | null
                    estimated_price?: number | null
                    event_type: string
                    frequency?: string | null
                    group_size: number
                    id?: string
                    is_regular_service?: boolean | null
                    notes?: string | null
                    operator_id?: string | null
                    pickup_date?: string | null
                    pickup_location: string
                    pickup_time?: string | null
                    requester_id?: string | null
                    special_requirements?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    budget_range?: string | null
                    created_at?: string | null
                    destinations?: string[] | null
                    duration_hours?: number | null
                    estimated_price?: number | null
                    event_type?: string
                    frequency?: string | null
                    group_size?: number
                    id?: string
                    is_regular_service?: boolean | null
                    notes?: string | null
                    operator_id?: string | null
                    pickup_date?: string | null
                    pickup_location?: string
                    pickup_time?: string | null
                    requester_id?: string | null
                    special_requirements?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            comments: {
                Row: {
                    author_id: string
                    content: string
                    created_at: string | null
                    entity_id: string
                    entity_type: string
                    id: string
                    status: string | null
                    updated_at: string | null
                }
                Insert: {
                    author_id: string
                    content: string
                    created_at?: string | null
                    entity_id: string
                    entity_type: string
                    id?: string
                    status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    author_id?: string
                    content?: string
                    created_at?: string | null
                    entity_id?: string
                    entity_type?: string
                    id?: string
                    status?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "comments_author_id_fkey"
                        columns: ["author_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            content_flags: {
                Row: {
                    content_id: string
                    content_type: string
                    created_at: string
                    details: string | null
                    flagged_by: string | null
                    id: string
                    reason: string | null
                }
                Insert: {
                    content_id: string
                    content_type: string
                    created_at?: string
                    details?: string | null
                    flagged_by?: string | null
                    id?: string
                    reason?: string | null
                }
                Update: {
                    content_id?: string
                    content_type?: string
                    created_at?: string
                    details?: string | null
                    flagged_by?: string | null
                    id?: string
                    reason?: string | null
                }
                Relationships: []
            }
            event_attendance: {
                Row: {
                    created_at: string | null
                    event_id: string | null
                    id: string
                    status: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    event_id?: string | null
                    id?: string
                    status?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    event_id?: string | null
                    id?: string
                    status?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "event_attendance_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: false
                        referencedRelation: "events"
                        referencedColumns: ["id"]
                    },
                ]
            }
            events: {
                Row: {
                    author_id: string
                    category: string | null
                    created_at: string | null
                    description: string | null
                    event_date: string
                    event_time: string | null
                    id: string
                    image: string | null
                    images: string[] | null
                    location: string | null
                    title: string
                    town: string | null
                }
                Insert: {
                    author_id: string
                    category?: string | null
                    created_at?: string | null
                    description?: string | null
                    event_date: string
                    event_time?: string | null
                    id?: string
                    image?: string | null
                    images?: string[] | null
                    location?: string | null
                    title: string
                    town?: string | null
                }
                Update: {
                    author_id?: string
                    category?: string | null
                    created_at?: string | null
                    description?: string | null
                    event_date?: string
                    event_time?: string | null
                    id?: string
                    image?: string | null
                    images?: string[] | null
                    location?: string | null
                    title?: string
                    town?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "events_author_id_fkey"
                        columns: ["author_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            feed_subscriptions: {
                Row: {
                    created_at: string | null
                    id: string
                    is_active: boolean | null
                    type: string
                    updated_at: string | null
                    user_id: string | null
                    value: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    type: string
                    updated_at?: string | null
                    user_id?: string | null
                    value?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    type?: string
                    updated_at?: string | null
                    user_id?: string | null
                    value?: string | null
                }
                Relationships: []
            }
            foreigner_blog: {
                Row: {
                    author_id: string
                    content: string
                    cover_image: string | null
                    created_at: string | null
                    excerpt: string
                    id: string
                    location_tag: string | null
                    status: string | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    author_id: string
                    content: string
                    cover_image?: string | null
                    created_at?: string | null
                    excerpt: string
                    id?: string
                    location_tag?: string | null
                    status?: string | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    author_id?: string
                    content?: string
                    cover_image?: string | null
                    created_at?: string | null
                    excerpt?: string
                    id?: string
                    location_tag?: string | null
                    status?: string | null
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "foreigner_blog_author_id_fkey"
                        columns: ["author_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            gems: {
                Row: {
                    author_id: string
                    created_at: string | null
                    description: string
                    id: string
                    images: string[] | null
                    latitude: number | null
                    longitude: number | null
                    title: string
                    town: string
                }
                Insert: {
                    author_id: string
                    created_at?: string | null
                    description: string
                    id?: string
                    images?: string[] | null
                    latitude?: number | null
                    longitude?: number | null
                    title: string
                    town: string
                }
                Update: {
                    author_id?: string
                    created_at?: string | null
                    description?: string
                    id?: string
                    images?: string[] | null
                    latitude?: number | null
                    longitude?: number | null
                    title?: string
                    town?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "gems_author_id_fkey"
                        columns: ["author_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            job_applications: {
                Row: {
                    created_at: string | null
                    id: string
                    job_id: string | null
                    notes: string | null
                    status: string | null
                    updated_at: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    job_id?: string | null
                    notes?: string | null
                    status?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    job_id?: string | null
                    notes?: string | null
                    status?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "job_applications_job_id_fkey"
                        columns: ["job_id"]
                        isOneToOne: false
                        referencedRelation: "jobs"
                        referencedColumns: ["id"]
                    },
                ]
            }
            jobs: {
                Row: {
                    company_name: string
                    contact: Json | null
                    created_at: string | null
                    description: string
                    employer_id: string
                    employment_type: string | null
                    id: string
                    location: string
                    requirements: string[] | null
                    salary_range: string | null
                    slug: string | null
                    status: string | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    company_name: string
                    contact?: Json | null
                    created_at?: string | null
                    description: string
                    employer_id: string
                    employment_type?: string | null
                    id?: string
                    location: string
                    requirements?: string[] | null
                    salary_range?: string | null
                    slug?: string | null
                    status?: string | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    company_name?: string
                    contact?: Json | null
                    created_at?: string | null
                    description?: string
                    employer_id?: string
                    employment_type?: string | null
                    id?: string
                    location?: string
                    requirements?: string[] | null
                    salary_range?: string | null
                    slug?: string | null
                    status?: string | null
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "jobs_employer_id_fkey"
                        columns: ["employer_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            likes: {
                Row: {
                    created_at: string | null
                    entity_id: string
                    entity_type: string
                    id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    entity_id: string
                    entity_type: string
                    id?: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    entity_id?: string
                    entity_type?: string
                    id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "likes_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            listings: {
                Row: {
                    category: string | null
                    condition: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    images: string[] | null
                    img: string | null
                    posted_ago: string | null
                    posted_date: string | null
                    price: string
                    price_value: number | null
                    seller: Json | null
                    seller_id: string
                    seo: Json | null
                    slug: string | null
                    status: string | null
                    title: string
                    town: string | null
                    updated_at: string | null
                    user_id: string | null
                }
                Insert: {
                    category?: string | null
                    condition?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    images?: string[] | null
                    img?: string | null
                    posted_ago?: string | null
                    posted_date?: string | null
                    price: string
                    price_value?: number | null
                    seller?: Json | null
                    seller_id: string
                    seo?: Json | null
                    slug?: string | null
                    status?: string | null
                    title: string
                    town?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    category?: string | null
                    condition?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    images?: string[] | null
                    img?: string | null
                    posted_ago?: string | null
                    posted_date?: string | null
                    price?: string
                    price_value?: number | null
                    seller?: Json | null
                    seller_id?: string
                    seo?: Json | null
                    slug?: string | null
                    status?: string | null
                    title?: string
                    town?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "listings_seller_id_fkey"
                        columns: ["seller_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "listings_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            moderation_queue: {
                Row: {
                    content_id: string
                    content_type: string
                    flag_count: number | null
                    id: string
                    queued_at: string
                    review_note: string | null
                    reviewed_at: string | null
                    reviewed_by: string | null
                    status: string
                }
                Insert: {
                    content_id: string
                    content_type: string
                    flag_count?: number | null
                    id?: string
                    queued_at?: string
                    review_note?: string | null
                    reviewed_at?: string | null
                    reviewed_by?: string | null
                    status?: string
                }
                Update: {
                    content_id?: string
                    content_type?: string
                    flag_count?: number | null
                    id?: string
                    queued_at?: string
                    review_note?: string | null
                    reviewed_at?: string | null
                    reviewed_by?: string | null
                    status?: string
                }
                Relationships: []
            }
            notification_preferences: {
                Row: {
                    created_at: string | null
                    digest_frequency: string | null
                    email_notifications: boolean | null
                    id: string
                    moderation_alerts: boolean | null
                    new_comments: boolean | null
                    new_posts: boolean | null
                    updated_at: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    digest_frequency?: string | null
                    email_notifications?: boolean | null
                    id?: string
                    moderation_alerts?: boolean | null
                    new_comments?: boolean | null
                    new_posts?: boolean | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    digest_frequency?: string | null
                    email_notifications?: boolean | null
                    id?: string
                    moderation_alerts?: boolean | null
                    new_comments?: boolean | null
                    new_posts?: boolean | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Relationships: []
            }
            notifications: {
                Row: {
                    created_at: string
                    id: string
                    is_read: boolean | null
                    message: string | null
                    payload: Json | null
                    title: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    is_read?: boolean | null
                    message?: string | null
                    payload?: Json | null
                    title: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    is_read?: boolean | null
                    message?: string | null
                    payload?: Json | null
                    title?: string
                    user_id?: string
                }
                Relationships: []
            }
            port_updates: {
                Row: {
                    author_id: string
                    created_at: string | null
                    id: string
                    images: string[] | null
                    message: string
                    port_name: string | null
                    status: string | null
                }
                Insert: {
                    author_id: string
                    created_at?: string | null
                    id?: string
                    images?: string[] | null
                    message: string
                    port_name?: string | null
                    status?: string | null
                }
                Update: {
                    author_id?: string
                    created_at?: string | null
                    id?: string
                    images?: string[] | null
                    message?: string
                    port_name?: string | null
                    status?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "port_updates_author_id_fkey"
                        columns: ["author_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            posts: {
                Row: {
                    author_id: string
                    category_label: string | null
                    comments_count: number | null
                    content: string
                    created_at: string | null
                    id: string
                    images: string[] | null
                    likes_count: number | null
                    location: string | null
                    poll_data: Json | null
                    status: string | null
                    tags: string[] | null
                    title: string | null
                    type: string | null
                    updated_at: string | null
                }
                Insert: {
                    author_id: string
                    category_label?: string | null
                    comments_count?: number | null
                    content: string
                    created_at?: string | null
                    id?: string
                    images?: string[] | null
                    likes_count?: number | null
                    location?: string | null
                    poll_data?: Json | null
                    status?: string | null
                    tags?: string[] | null
                    title?: string | null
                    type?: string | null
                    updated_at?: string | null
                }
                Update: {
                    author_id?: string
                    category_label?: string | null
                    comments_count?: number | null
                    content?: string
                    created_at?: string | null
                    id?: string
                    images?: string[] | null
                    likes_count?: number | null
                    location?: string | null
                    poll_data?: Json | null
                    status?: string | null
                    tags?: string[] | null
                    title?: string | null
                    type?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "posts_author_id_fkey"
                        columns: ["author_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    email: string
                    full_name: string | null
                    id: string
                    is_verified: boolean | null
                    location: string | null
                    notification_preferences: Json | null
                    phone: string | null
                    role: string | null
                    trust_score: number | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email: string
                    full_name?: string | null
                    id: string
                    is_verified?: boolean | null
                    location?: string | null
                    notification_preferences?: Json | null
                    phone?: string | null
                    role?: string | null
                    trust_score?: number | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string
                    full_name?: string | null
                    id?: string
                    is_verified?: boolean | null
                    location?: string | null
                    notification_preferences?: Json | null
                    phone?: string | null
                    role?: string | null
                    trust_score?: number | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            transport_services: {
                Row: {
                    base_town: string
                    charter_avail: boolean | null
                    charter_details: Json | null
                    contact_details: Json | null
                    contact_number: string
                    created_at: string | null
                    driver_name: string
                    id: string
                    images: string[] | null
                    is_available: boolean | null
                    notes: string | null
                    price_per_seat: number | null
                    provider_id: string
                    route: Json | null
                    schedule: Json | null
                    seats_available: number | null
                    service_type: string | null
                    towns_covered: string[] | null
                    updated_at: string | null
                    vehicle_type: string | null
                }
                Insert: {
                    base_town: string
                    charter_avail?: boolean | null
                    charter_details?: Json | null
                    contact_details?: Json | null
                    contact_number: string
                    created_at?: string | null
                    driver_name: string
                    id?: string
                    images?: string[] | null
                    is_available?: boolean | null
                    notes?: string | null
                    price_per_seat?: number | null
                    provider_id: string
                    route?: Json | null
                    schedule?: Json | null
                    seats_available?: number | null
                    service_type?: string | null
                    towns_covered?: string[] | null
                    updated_at?: string | null
                    vehicle_type?: string | null
                }
                Update: {
                    base_town?: string
                    charter_avail?: boolean | null
                    charter_details?: Json | null
                    contact_details?: Json | null
                    contact_number?: string
                    created_at?: string | null
                    driver_name?: string
                    id?: string
                    images?: string[] | null
                    is_available?: boolean | null
                    notes?: string | null
                    price_per_seat?: number | null
                    provider_id?: string
                    route?: Json | null
                    schedule?: Json | null
                    seats_available?: number | null
                    service_type?: string | null
                    towns_covered?: string[] | null
                    updated_at?: string | null
                    vehicle_type?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "transport_services_provider_id_fkey"
                        columns: ["provider_id"]
                        isOneToOne: true
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            transport_vouches: {
                Row: {
                    created_at: string | null
                    id: string
                    service_id: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    service_id?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    service_id?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "transport_vouches_service_id_fkey"
                        columns: ["service_id"]
                        isOneToOne: false
                        referencedRelation: "transport_services"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "transport_vouches_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            trending_topics: {
                Row: {
                    count: number | null
                    created_at: string | null
                    id: string
                    topic: string
                    updated_at: string | null
                }
                Insert: {
                    count?: number | null
                    created_at?: string | null
                    id?: string
                    topic: string
                    updated_at?: string | null
                }
                Update: {
                    count?: number | null
                    created_at?: string | null
                    id?: string
                    topic?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            bulk_import_businesses: { Args: { rows: Json }; Returns: undefined }
            decrement_comment_likes: {
                Args: { comment_uuid: string }
                Returns: undefined
            }
            decrement_post_comments: {
                Args: { post_uuid: string }
                Returns: undefined
            }
            decrement_post_likes: { Args: { post_uuid: string }; Returns: undefined }
            get_my_role: { Args: never; Returns: string }
            get_user_listings_count: { Args: { user_uuid: string }; Returns: number }
            increment_comment_likes: {
                Args: { comment_uuid: string }
                Returns: undefined
            }
            increment_post_comments: {
                Args: { post_uuid: string }
                Returns: undefined
            }
            increment_post_likes: { Args: { post_uuid: string }; Returns: undefined }
            is_admin_or_mod: { Args: never; Returns: boolean }
            toggle_event_attendance: {
                Args: { event_id_text: string; increment_val: number }
                Returns: undefined
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const
