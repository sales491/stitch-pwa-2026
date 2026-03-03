export type Business = {
    id: string;
    name: string;
    type: string;
    location: string;
    rating: number;
    reviewsCount: number;
    image: string;
    about: string;
    tags: string[];
    phone: string;
    messenger?: string;
    address: string;
    status: 'Open Now' | 'Closed';
    closingTime?: string;
    photos: string[];
};

export const BUSINESSES: Business[] = [
    {
        id: 'casa-de-don-emilio',
        name: 'Casa de Don Emilio',
        type: 'Filipino Cafe & Restaurant',
        location: 'Boac, Marinduque',
        rating: 4.8,
        reviewsCount: 156,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop',
        about: 'Experience authentic Filipino cuisine in a beautiful heritage house setting. Located in the heart of Boac, Casa de Don Emilio offers a glimpse into Marinduque\'s rich history combined with delicious local flavors.',
        tags: ['Filipino', 'Cafe', 'Heritage'],
        phone: '+639171112222',
        address: 'Rizal St, Poblacion, Boac, Marinduque',
        status: 'Open Now',
        closingTime: '9 PM',
        photos: [
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop',
            'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&h=300&fit=crop'
        ]
    },
    {
        id: 'balar-hotel-and-spa',
        name: 'Balar Hotel and Spa',
        type: 'Hotel & Resort',
        location: 'Boac, Marinduque',
        rating: 4.9,
        reviewsCount: 128,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
        about: 'Balar Hotel and Spa is your premier destination for luxury and relaxation in Boac. Offering modern amenities, a relaxing spa, and exceptional service to make your stay in Marinduque unforgettable.',
        tags: ['Hotel', 'Spa', 'Luxury'],
        phone: '+639173334444',
        address: 'Brgy. Baluarte, Boac, Marinduque',
        status: 'Open Now',
        closingTime: '10 PM',
        photos: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
            'https://images.unsplash.com/photo-1582719502893-bc5abc448211?w=500&h=300&fit=crop',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=300&fit=crop'
        ]
    },
    {
        id: 'rejanos-bakery',
        name: "Rejano's Bakery",
        type: 'Bakery & Pasalubong',
        location: 'Sta. Cruz, Marinduque',
        rating: 4.7,
        reviewsCount: 85,
        image: 'https://images.unsplash.com/photo-1606836576983-8b458e75221d?w=500&h=300&fit=crop',
        about: "The home of the famous Arrowroot (Uraro) cookies. Rejano's Bakery has been a staple in Marinduque for generations, providing the best pasalubong items for tourists and locals alike.",
        tags: ['Bakery', 'Pasalubong', 'Uraro'],
        phone: '+639175556666',
        address: 'Poblacion, Sta. Cruz, Marinduque',
        status: 'Open Now',
        closingTime: '7 PM',
        photos: [
            'https://images.unsplash.com/photo-1606836576983-8b458e75221d?w=500&h=300&fit=crop',
            'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=300&fit=crop',
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=300&fit=crop'
        ]
    },
    {
        id: 'gasan-garden-cafe',
        name: 'Gasan Garden Cafe',
        type: 'Cafe & Restaurant',
        location: 'Gasan, Marinduque',
        rating: 4.8,
        reviewsCount: 92,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGP-ZxzoCe3nKC46VvWed2xm1XpG8SWAEWp5-x71K0GckFZhOUGPXl4gSAL5A4yEO1f1L2_QAly2LbkjyOt2FrHw2emmxcljncbcj-dhM10gkJO9Bc_axUMVzpmr1Dr2645HIMwoEadRWHip5wPzHrHbA1mJHzcQwXcmFDjBtnQIhgyMurnouZAMklXeOamdNYkNDq4_Oy_UjJvNmwxGsojLnClxO42NhMtIqffNaXX-2r4VFBZYCRCTj3Hj3Dxdhc6qcyVFvoDR4',
        about: 'Experience the finest local coffee and delicacies in the heart of Gasan. Our garden setting provides a relaxing escape with views of the Marinduque landscape. Famous for our Ube Cheesecake and Barako blend.',
        tags: ['Free Wi-Fi', 'Outdoor Seating', 'Pet Friendly'],
        phone: '+639171234567',
        messenger: 'businessmessenger',
        address: '123 Rizal Street, Poblacion, Gasan, Marinduque',
        status: 'Open Now',
        closingTime: '9 PM',
        photos: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCPJGAchV0fqaDCGOnePjsZ7Gi9DUkJwYgSFBSf_ZHIaNtk64WVL-jXWuSBDGgxdQBzgAwlDH8_J0bGcX0yaIWbvwaiY44kVPDyF_CB_O8D6ybUTPeDR1cJQZ8paoRb7fMJPri4QTfDeqjDigYQgB7d-z-XrEdzSUzby4DQOOVrkScfYCWAQBgFvXurcPmcu6LBzFHHnXSgKtkT67H4XY0LkTR8cHwsuaR5Ej3SNtnRMYya0n1bu6WM6LffNhrIVT17ppgDXHJRurs',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDHia1cgth27M5Em9TJD56R_irTAUfNAdy-IkLPPS7JuTD1N3K8pWAyB0GDJwJJArCVUJQ2zqDZNZeYIsRYX-YVHkIfcrNvjuBh9Bjb60KUhHuern84G1NmUJnN9sG6ZSMSviwv1IICyxsNe57hEvB9-aRouof7RZ4v49M7KCuTpMmUcg30hK52qM1vJ-ME-Cmgu1MwZq0X6IoqdHaFNwdxCRYdCXLhdRVn0IR6aAaxpoonNjV7gsetRi0bFkvSSiSdjpa8gqVdtnY',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDyxPGy8cv6A3iaPqHSorFND6l9DUxksbYB_SBvoLYIfa3DV3yrD8xRunvHWaLs27NVjw2VxkUVzPfdE329ydFbNmRhiI8l5YmqAzOvpxE8_cK_0mcFcigEckqr2qKnVvL6B0ewXRD-ZcN3HVMWu95u9pex-_sw0qmKrAoxE30K5kLqBXWhqyZagn3NEidCYrbeF4l-65d_LUiZueJ8lNC7Q9tltoNiM54i0avZEKKpvjHHNrULVUoglHwfz5DDZnW-F7_32apma9s'
        ]
    },
    {
        id: 'kusina-sa-plaza',
        name: 'Kusina sa Plaza',
        type: 'Filipino Comfort Food',
        location: 'Boac, Marinduque',
        rating: 4.6,
        reviewsCount: 112,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCysVo8oFOBDiS79rZVx1ynYQ04oW7FonWVi9iR-TbPrQOD_of_4bgeMRO-v3Nar7eyoVRGjSlzSckgoRiEOJkBih900nd4yp2-sQRCiUy0HvIbozCjaA54qmXTg4d-ETXLVzOW8fHqniSjE22YkMvC4AvLj3KnEhAd7Dsuw9_lF6HTy-pZuj29RYtl48VlFboG8-bNaiC0zDOeQVAwT9G2pDIjV9o8xVWfdWVMwxBGV4VDqjudnFO59XzdXOyqri7xlBKU4pvjBdg',
        about: 'Located right next to the town plaza, Kusina sa Plaza is the perfect spot for authentic Marinduqueño dishes. Our home-cooked meals have been a favorite for locals and visitors alike for years.',
        tags: ['Filipino', 'Comfort Food', 'Plaza View'],
        phone: '+639177778888',
        address: 'Plaza Lane, Boac, Marinduque',
        status: 'Open Now',
        closingTime: '8 PM',
        photos: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCysVo8oFOBDiS79rZVx1ynYQ04oW7FonWVi9iR-TbPrQOD_of_4bgeMRO-v3Nar7eyoVRGjSlzSckgoRiEOJkBih900nd4yp2-sQRCiUy0HvIbozCjaA54qmXTg4d-ETXLVzOW8fHqniSjE22YkMvC4AvLj3KnEhAd7Dsuw9_lF6HTy-pZuj29RYtl48VlFboG8-bNaiC0zDOeQVAwT9G2pDIjV9o8xVWfdWVMwxBGV4VDqjudnFO59XzdXOyqri7xlBKU4pvjBdg'
        ]
    },
    {
        id: 'boac-hotel-cafe',
        name: 'Boac Hotel Café',
        type: 'Coffee & Pastries',
        location: 'Boac, Marinduque',
        rating: 4.5,
        reviewsCount: 78,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYnVyvqvR2Z4NZI_nwzK4DcV12VTpI4BjHW2yTggePSeFKrj_6vfpoHr2hgoD_ome2Q6lpSQ0bx05KLt6YOKRaApAOZkc6FKrLC4RkYQu6yFr1w4homrjILaLOrA0uSA0QIkmAZPJ7iKyVCdw5fnsnIGOHUW0_hA82eSluPGePD7AJXe81V0HyxNatZq4882fV1lOgKpvmltbhtgqLq3m_qJHvNSe3f2QvvkB_YJyMjm6MU9wHRVojdvnaXIkdkvp8VURxR4R-2lQ',
        about: 'Enjoy a cup of locally roasted coffee in the historic Boac Hotel. Our café offers a quiet atmosphere perfect for morning coffee or afternoon merienda.',
        tags: ['Coffee', 'Pastries', 'Historic'],
        phone: '+639179990000',
        address: 'Boac Hotel, Boac, Marinduque',
        status: 'Open Now',
        closingTime: '10 PM',
        photos: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAYnVyvqvR2Z4NZI_nwzK4DcV12VTpI4BjHW2yTggePSeFKrj_6vfpoHr2hgoD_ome2Q6lpSQ0bx05KLt6YOKRaApAOZkc6FKrLC4RkYQu6yFr1w4homrjILaLOrA0uSA0QIkmAZPJ7iKyVCdw5fnsnIGOHUW0_hA82eSluPGePD7AJXe81V0HyxNatZq4882fV1lOgKpvmltbhtgqLq3m_qJHvNSe3f2QvvkB_YJyMjm6MU9wHRVojdvnaXIkdkvp8VURxR4R-2lQ'
        ]
    },
    {
        id: 'boac-cathedral-shop',
        name: 'The Boac Cathedral Shop',
        type: 'Souvenirs & Religious Items',
        location: 'Boac, Marinduque',
        rating: 4.7,
        reviewsCount: 64,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZdA984PYXW7iZ2VQlSazRPyzYdEqWl5I3YHScMhVG-4z0g1MXcry8r8Q9hwzMqF3vltJWB-cBcapg2d5HtLnAiacrfGWjumRruePkeVIzzM6CFOU5LeuzbXClBI6vyrMDzaQTWhjAPDxaWmOdEDNDmTXGbkZW79DgQ29i52LjNehCe96a4a0MP8qJhhyAib77n9MwZVzcdsUX8bRpy7ERTlLyFVabtY_tjFP6mJvFTTpgmOgb1uR3-QR7_c5n2CsqnksQ23e-BFU',
        about: 'Located at the historic Boac Cathedral, our shop offers a variety of religious items, local handicrafts, and souvenirs to remember your visit to Marinduque.',
        tags: ['Souvenirs', 'Handicrafts', 'Religious'],
        phone: '+639171113333',
        address: 'Boac Cathedral Grounds, Boac, Marinduque',
        status: 'Open Now',
        closingTime: '5 PM',
        photos: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAZdA984PYXW7iZ2VQlSazRPyzYdEqWl5I3YHScMhVG-4z0g1MXcry8r8Q9hwzMqF3vltJWB-cBcapg2d5HtLnAiacrfGWjumRruePkeVIzzM6CFOU5LeuzbXClBI6vyrMDzaQTWhjAPDxaWmOdEDNDmTXGbkZW79DgQ29i52LjNehCe96a4a0MP8qJhhyAib77n9MwZVzcdsUX8bRpy7ERTlLyFVabtY_tjFP6mJvFTTpgmOgb1uR3-QR7_c5n2CsqnksQ23e-BFU'
        ]
    }
];
