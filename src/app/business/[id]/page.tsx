'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import LocalBusinessProfilePage, { BusinessProfile } from '@/components/LocalBusinessProfilePage';
import { BUSINESSES } from '@/data/businesses';

export default function BusinessDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const business = BUSINESSES.find((b) => b.id === id);

    if (!business) {
        notFound();
    }

    // Map the old Business structure to the new database-aligned BusinessProfile
    const businessProfile: BusinessProfile = {
        id: business.id,
        user_id: null,
        business_name: business.name,
        business_type: business.type,
        description: business.about,
        location: business.location.split(',')[0].trim(),
        contact_info: {
            phone: business.phone,
            address: business.address
        },
        operating_hours: business.status === 'Open Now' ? `Closes ${business.closingTime || '9 PM'}` : 'Closed',
        social_media: {
            messenger: business.messenger
        },
        website: null,
        categories: business.tags,
        stats: {
            customer_count: business.reviewsCount
        },
        created_at: null,
        updated_at: null,
        gallery_image: business.image
    };

    return <LocalBusinessProfilePage business={businessProfile} />;
}
