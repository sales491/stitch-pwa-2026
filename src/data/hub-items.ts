export type HubItem = {
    id: string;
    type: 'classifieds' | 'jobs' | 'transport' | 'businesses' | 'gems' | 'event' | 'roro';
    categoryLabel: string;
    title: string;
    subtitle: string;
    image: string;
    link: string;
    extraInfo?: string;
};

export const HUB_ITEMS: HubItem[] = [
    {
        id: 'c1',
        type: 'classifieds',
        categoryLabel: 'CLASSIFIEDS',
        title: 'Test Honda Wave 125',
        subtitle: 'Torrijos',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpsr3tKOjO2tjaIku0K9bRAzdKnGWe3k7jmlMM98ds7goUc7QpDZLQ9d1NGOWyvWKTLWNQW3UWMTSy1vPIIxx0MgE_ybpXK4OR_VFCyO4qwN0ABBmQDueAoeG3ZHDz2RHrXVk5K06u70vuHAHcvD-sv4S6BfJGUx5sLxatw_fGIacPLIOmGcHcpYHKxGtaagofVD6CKKCy3I6JJN1AHKtK2MWEqa39vXlfYSO9gVsrY6Mj-gWkeHnA2KdpGu_AW2usBZFHUCBlE4c',
        link: '/listing/test-honda-wave-125-torrijos',
        extraInfo: '₱45,000'
    },
    {
        id: 'c2',
        type: 'classifieds',
        categoryLabel: 'CLASSIFIEDS',
        title: 'Test Samsung 43" Smart TV',
        subtitle: 'Boac',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB75bSRr_mr6-RzYCQYNTHSn7vWmzswSsSbML4-_Y_gocvVAcNZ4wpZSHGwmAzO4pB6w2zGnh_v67JhHQDKHoR6Qc0j2eMGSYfUYhYQTl9kNeJRie9H73d3-xdtOR5-WqF6XzyH20LKc9nkeR054vrcof0jEZF3Qs3xALEKKZv1VG-mTyM33uFHKN70uiDGBHBsPQN5iGrMdlNjtQXSzSQlPJuMUgXPYa6-RiKyv-rJODQJRS9c31mXd_qClW-EScYw6Ok4FkbTkD0',
        link: '/listing/test-samsung-43-smart-tv-boac',
        extraInfo: '₱12,000'
    },
    {
        id: 'j1',
        type: 'jobs',
        categoryLabel: 'JOBS',
        title: 'Test Store Manager',
        subtitle: 'Test Boac Trading Post',
        image: '/images/hub/store_manager.webp',
        link: '/job/test-store-manager-boac',
        extraInfo: '₱15k - ₱20k'
    },
    {
        id: 'j2',
        type: 'jobs',
        categoryLabel: 'JOBS',
        title: 'Test Tricycle Driver',
        subtitle: 'Test Local Hirer • Gasan',
        image: '/images/hub/tricycle_driver.webp',
        link: '/job/test-tricycle-driver-gasan',
        extraInfo: '₱500/day'
    },
    {
        id: 't1',
        type: 'transport',
        categoryLabel: 'TRANSPORT',
        title: 'Test Boac → Manila Van',
        subtitle: 'D&G Transport',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK6cGLQroflv-XbpRE_ZAzmWB662TfBFwLZOB5n3AJqf558C3FNrS6av06aOhrjQh-lFiw3-PimEdiDu9AH8fOakqA3fb0OYKr5VKCajxgw0rdEoZv0nLXp1lndHxbUrplKj73pqoDcYpwVY_m9245KLcORBaEWNQMe8Qrh7eAmUnfq0pRt-sLyjBv43LOg5MW3uOS0eKQMeXwmOAUNGLNW1kDhBJkcj4XhtdUaD3llUnwUbVvOW3myAnvnGLzwYpVK06rDEvYzeY',
        link: '/commuter-delivery-hub',
        extraInfo: '₱1,400'
    },
    {
        id: 't2',
        type: 'transport',
        categoryLabel: 'TRANSPORT',
        title: 'Test Boac Delivery Rider',
        subtitle: 'Kuya Tonyo',
        image: '/images/hub/delivery_rider.webp',
        link: '/commuter-delivery-hub',
        extraInfo: 'From ₱50'
    },
    {
        id: 'b1',
        type: 'businesses',
        categoryLabel: 'Verified Local Partners',
        title: 'Test Casa de Don Emilio',
        subtitle: 'Boac, Marinduque',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop',
        link: '/business/test-casa-de-don-emilio',
        extraInfo: '4.8 ★'
    },
    {
        id: 'b2',
        type: 'businesses',
        categoryLabel: 'Verified Local Partners',
        title: 'Test Balar Hotel and Spa',
        subtitle: 'Boac • Hotel & Resort',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
        link: '/business/test-balar-hotel-and-spa',
        extraInfo: '4.9 ★'
    },
    {
        id: 'g1',
        type: 'gems',
        categoryLabel: 'LOCAL GEMS',
        title: 'Test Poctoy White Beach',
        subtitle: 'Torrijos, Marinduque',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtrXOqDVgL69LjOxVWAA9nO_SXy0z31K588lI3K9hsFvDzKDZv71X6oygWgA4pTC0aY3LFAEPIxtKuipbf6b-zp8QgZIWVuUuKz89TOdp0YJtgd7_r3VyzI5FJdVC9GuSDRxlcYRZkZwpKDB8DR5HW7JGBjhtHfOq7NM5ItoetwkCLXS5Q9tmK-6i1MfZx5kULnmoVt9k_gTNuIVFDsruwsz9aqm-PnWuQkEW-c61AYlOy43tk89AWx9RuiqXfLMbXLCHvlzRgvQA',
        link: '/gem/poctoy-white-beach',
        extraInfo: 'Trending'
    },
    {
        id: 'g2',
        type: 'gems',
        categoryLabel: 'LOCAL GEMS',
        title: 'Test Maniwaya Island',
        subtitle: 'Santa Cruz',
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=500&h=500&fit=crop',
        link: '/gem/maniwaya-island',
        extraInfo: 'Popular'
    },
    {
        id: 'e1',
        type: 'event',
        categoryLabel: 'EVENTS',
        title: 'Test Moriones Grand Parade',
        subtitle: 'Boac Town Plaza',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV0I0T9NGtATyFYab1qdP7SReO_db4ErLS9IIxKsDWGpOauFvR-2JtBe5u1Sl5QrEH2KRFmrlXY1I-g5C3sKkEPCQ6-N9lvLR74xYc7ny27IswCrUCGskqFFLhjgzNoctsjjRbcQdfmgKLLfQ-cFG1Cplwn-URaCKjaiMU-w97_FZjZccZxpTfiwblE4dUYQuO-47jJ9KvLmV-e7uDXTRquMEfqbQvykEF0EDR_HTGG5Y_Sc9OqfHCLiRu13ahwbCzi3Juk3Q2rSw',
        link: '/events',
        extraInfo: 'Trending'
    },
    {
        id: 'r1',
        type: 'roro',
        categoryLabel: 'RORO PORT',
        title: 'Test Port Status: Cawit',
        subtitle: 'Live Terminal Updates',
        image: '/images/hub/cawit_port.webp',
        link: '/roro-port-information-hub',
        extraInfo: 'Normal'
    }
];
