import LocalBusinessProfilePage, { BusinessProfile } from '@/components/LocalBusinessProfilePage';

export default function Page() {
  const defaultBusiness: BusinessProfile = {
    id: '10000000-0000-0000-0000-000000000001',
    user_id: null,
    business_name: 'Gasan Garden Cafe',
    business_type: 'Cafe & Restaurant',
    description: 'Experience the finest local coffee and delicacies in the heart of Gasan. Our garden setting provides a relaxing escape with views of the Marinduque landscape. Famous for our Ube Cheesecake and Barako blend.',
    location: 'Gasan',
    contact_info: {
      email: 'info@gasangarden.com',
      phone: '+63 917 123 4567',
      address: '123 Rizal Street, Poblacion, Gasan, Marinduque'
    },
    operating_hours: 'Daily 7:00 AM - 9:00 PM',
    social_media: {
      logo: '',
      facebook: 'gasangardencafe',
      messenger: 'businessmessenger'
    },
    website: null,
    categories: ['Free Wi-Fi', 'Outdoor Seating', 'Pet Friendly'],
    stats: {
      total_sales: 0,
      customer_count: 500,
      products_listed: 0
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    gallery_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGP-ZxzoCe3nKC46VvWed2xm1XpG8SWAEWp5-x71K0GckFZhOUGPXl4gSAL5A4yEO1f1L2_QAly2LbkjyOt2FrHw2emmxcljncbcj-dhM10gkJO9Bc_axUMVzpmr1Dr2645HIMwoEadRWHip5wPzHrHbA1mJHzcQwXcmFDjBtnQIhgyMurnouZAMklXeOamdNYkNDq4_Oy_UjJvNmwxGsojLnClxO42NhMtIqffNaXX-2r4VFBZYCRCTj3Hj3Dxdhc6qcyVFvoDR4'
  };

  return <LocalBusinessProfilePage business={defaultBusiness} />;
}
