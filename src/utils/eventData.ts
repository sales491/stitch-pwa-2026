export interface Event {
    id: string;
    title: string;
    location: string;
    town: string;
    date: string; // e.g., 'APR 12'
    fullDate: string; // e.g., 'April 12, 2026'
    time: string;
    category: string;
    image: string;
    description: string;
    attendees: number;
    trending?: boolean;
    dayOfMonth: number; // For calendar matching
    month: number; // 0-indexed (e.g., 3 for April)
}

export const mockEvents: Event[] = [
    {
        id: 'moriones-grand-parade',
        title: 'Moriones Festival Grand Parade',
        location: 'Boac Town Plaza',
        town: 'Boac',
        date: 'MAR 2',
        fullDate: 'March 2, 2026',
        time: '8:00 AM',
        category: 'Cultural',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV0I0T9NGtATyFYab1qdP7SReO_db4ErLS9IIxKsDWGpOauFvR-2JtBe5u1Sl5QrEH2KRFmrlXY1I-g5C3sKkEPCQ6-N9lvLR74xYc7ny27IswCrUCGskqFFLhjgzNoctsjjRbcQdfmgKLLfQ-cFG1Cplwn-URaCKjaiMU-w97_FZjZccZxpTfiwblE4dUYQuO-47jJ9KvLmV-e7uDXTRquMEfqbQvykEF0EDR_HTGG5Y_Sc9OqfHCLiRu13ahwbCzi3Juk3Q2rSw',
        description: 'The highlight of the Moriones Festival. Watch thousands of Centurions parade through the streets of Boac in a vibrant display of faith and tradition.',
        attendees: 245,
        trending: true,
        dayOfMonth: 2,
        month: 2
    },
    {
        id: 'mogpog-market-day',
        title: 'Barangay Fiesta: Market Day',
        location: 'Mogpog Public Market',
        town: 'Mogpog',
        date: 'MAR 4',
        fullDate: 'March 4, 2026',
        time: '6:00 AM',
        category: 'Community',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbTDXagTE1-WXHm2F6rVuYYiRpUYDYHxGEkUjqFHcMGEADqNFV7Z4cYINmitmjb5mVyrUUJGyRMhrCJEft-bS714a8Saj0WxT97_F6mUpCcCb8lTt9qAaT_tuT1gXUTIvE_Bhc4-ZZLMhcJsZWWFa1nVy3BKvCjuNR9A9-Sye3A92c3yDu7hTKGQb2lwH3uSK8jaX8hIzKkt0OdtBzc4TFXPhpprwHYtUljw0qctAx5d9f8eFI1N1XxXY5BcXFOdd1DybQ7x9YhfY',
        description: 'Experience the local flavors of Mogpog. Join us for fresh produce, local handicrafts, and traditional Marinduque delicacies.',
        attendees: 42,
        dayOfMonth: 4,
        month: 2
    },
    {
        id: 'gasan-basketball-finals',
        title: 'Inter-Brgy Basketball Finals',
        location: 'Covered Court, Brgy. Poblacion',
        town: 'Gasan',
        date: 'MAR 5',
        fullDate: 'March 5, 2026',
        time: '7:00 PM',
        category: 'Sports',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTGVg_3YBrGUS0ArPdxJPQpzLbK2wVhKphJN6HRflI9V-YJrWkRimRa0jf3QAqxV5ukytBvSaarts7Tk0HJ-OYqLLS5Jzy3xdbxI9NgL3x8OvbeJvhmQTYVGh8iMyMrPaPPSh1nIWqWALjNzBOwC6LLCIkzR2QuTvjgkwkZn0FjPeZ8tZggF-JWSzrsaw6YmnutCOoESooTuiRrXSUZ6UrJSiO-RoCZmQneDaCy5_JbAV9ZLb57IlZ5EwnUxAquX4i_sAyIFNxIA4',
        description: 'The final showdown between the top teams of Gasan. Come support your local barangay in this thrilling championship match.',
        attendees: 156,
        dayOfMonth: 5,
        month: 2
    },
    {
        id: 'boac-sunday-mass',
        title: 'Sunday Mass & Procession',
        location: 'Boac Cathedral',
        town: 'Boac',
        date: 'MAR 8',
        fullDate: 'March 8, 2026',
        time: '9:00 AM',
        category: 'Religious',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM-zCUSwhw6EEojDX51CCg3yRxvJjPQQXU-8PTxbKGQYr_DDC8GnuK5nNlmGz3SKgtL8fcqN9mwTQFrbLum8RwgBABY8O36jtIvbMZ_Woy4UjdgP7UdEoCP6oDg60gyZspLwpJBAZWuKsITCl_EJwr_evFMvSwEXTEUb3AtL90LLwWvRhYpS1n-yxByZ-XtwrKfo5wHcOZiU-tB3hFMcvqVoKW6kMcWST1yTUY6qGeKdxGjCyypT5XzKPPTljHSaVS4vEfQuLEs-8',
        description: 'Join the community for a solemn Sunday service followed by a traditional procession through the historic streets of Boac.',
        attendees: 89,
        dayOfMonth: 8,
        month: 2
    }
];

