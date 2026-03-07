export type ServiceType = 'rides' | 'delivery' | 'both';
export type VehicleType = 'motorcycle' | 'tricycle' | 'car-van' | 'jeepney' | 'door-to-door';

export interface Operator {
    id: number;
    name: string;
    operator: string;
    vehicleType: VehicleType;
    serviceType: ServiceType;
    towns: string[];
    price: string;
    rating: number;
    schedule?: string[];
    route?: { from: string; to: string };
    charterAvail?: boolean;
    img: string;
    available: boolean;
    fb?: string;
    phone?: string;
}

export const COMMUTER_OPERATORS: Operator[] = [
    {
        id: 1,
        name: 'Boac → Manila Door-to-Door',
        operator: 'D&G Transport',
        vehicleType: 'door-to-door',
        serviceType: 'rides',
        route: { from: 'Boac', to: 'Manila (via RoRo)' },
        towns: ['Boac', 'Mogpog'],
        price: '₱1,400 / seat',
        rating: 4.8,
        schedule: ['Daily 8:00 PM', 'Daily 10:00 PM'],
        charterAvail: true,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK6cGLQroflv-XbpRE_ZAzmWB662TfBFwLZOB5n3AJqf558C3FNrS6av06aOhrjQh-lFiw3-PimEdiDu9AH8fOakqA3fb0OYKr5VKCajxgw0rdEoZv0nLXp1lndHxbUrplKj73pqoDcYpwVY_m9245KLcORBaEWNQMe8Qrh7eAmUnfq0pRt-sLyjBv43LOg5MW3uOS0eKQMeXwmOAUNGLNW1kDhBJkcj4XhtdUaD3llUnwUbVvOW3myAnvnGLzwYpVK06rDEvYzeY',
        available: true,
        phone: '9171234567',
        fb: 'DGTransportBoac',
    },
    {
        id: 2,
        name: 'Sta. Cruz → Lucena Route',
        operator: 'Kuya Noel',
        vehicleType: 'jeepney',
        serviceType: 'rides',
        route: { from: 'Sta. Cruz', to: 'Lucena City' },
        towns: ['Sta. Cruz', 'Torrijos', 'Buenavista'],
        price: '₱250 / seat',
        rating: 4.5,
        schedule: ['Mon–Sat 5:30 AM', 'Mon–Sat 1:00 PM'],
        charterAvail: true,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANTk38KamPgDWfR1TmPNXpK_dilcD5IXL9Y9LUVIOpIADgvmRWiPq3bAvB7ZWPhAZQmFQfIlO8NHXLe7PjuiKCNjItkzog-jXs3KD6GTHYb05OEY3QZ1TySvGeF2DJa7qjY2JYmhnsHysY-tu3frRfmKvrQraUjBK8pD_Cp9mKHOa1Vw11eUO1yX-RaI722lPY6Sp_k-D4p0j55k8WQn6pHSu1grx80IKfucxERuUSvhF1xjwrvPG2v90pF_P3NNa-lvjmBq4cXGQ',
        available: true,
        phone: '9089876543',
        fb: 'mangboyuvexpress',
    },
    {
        id: 3,
        name: 'Boac Delivery Rider',
        operator: 'Kuya Tonyo',
        vehicleType: 'motorcycle',
        serviceType: 'delivery',
        towns: ['Boac', 'Mogpog', 'Gasan'],
        price: 'From ₱50',
        rating: 4.9,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzqYFgAIu84Ex93XVkX5INHS9_wFSzpteW0L3IsiCZF6QIjdy5Pj6RoPOvPPjiuk8qjttUF3ePe_Gpz9sWViWEBG6GN2_cMiwmXnPeXXW-m2xV9YyjVmcTBXjuI3w9PSfukBoucsnaV-hUXma1n5ATHIP3wPfrU-IxNEC8axyG1NSFvd8NdCHKeKsLpNe6GvmcNocth_xEXjWE6mqxGagW4Pfgq3TzkUtzV6erfvsIqjfF9oTupDlPSQU5syLYv3byJbkctflU_k',
        available: false,
        phone: '9151231234',
    },
    {
        id: 4,
        name: 'Gasan Tricycle — On-demand',
        operator: 'Mang Bert',
        vehicleType: 'tricycle',
        serviceType: 'both',
        towns: ['Gasan', 'Buenavista'],
        price: 'From ₱30',
        rating: 4.7,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnapaupyvBwBt9JEc2DBtBLkShRvFkQcfy9mZIKnhNwlu_5iuM39JE1kpwMbRlLwRc4oxi4JJ_BE_XDucdP_Yb8lx0JRdTIzmQD9Yl0DKyfCEG9suJ2yCZMzr9PK-LD9-KtJcGRRGjVV06Nu9pOYK9CEY6_H1OGBPfW0VjaEX00EoAoAoFfi_qfGr9yDnuublLwB5JPvptZCJGae8oXxFx_jERN-5PBdnrY3bTBFGMoXkC1nrsXjC-9QQPpbajufnvpAOaZgk_JM',
        available: true,
        phone: '9290009901',
        fb: 'JacLinerOfficial',
    },
    {
        id: 5,
        name: 'Boac Multicab & Delivery',
        operator: 'Ate Grace',
        vehicleType: 'car-van',
        serviceType: 'both',
        towns: ['Boac', 'Mogpog', 'Gasan', 'Buenavista'],
        price: 'From ₱80',
        rating: 4.6,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK6cGLQroflv-XbpRE_ZAzmWB662TfBFwLZOB5n3AJqf558C3FNrS6av06aOhrjQh-lFiw3-PimEdiDu9AH8fOakqA3fb0OYKr5VKCajxgw0rdEoZv0nLXp1lndHxbUrplKj73pqoDcYpwVY_m9245KLcORBaEWNQMe8Qrh7eAmUnfq0pRt-sLyjBv43LOg5MW3uOS0eKQMeXwmOAUNGLNW1kDhBJkcj4XhtdUaD3llUnwUbVvOW3myAnvnGLzwYpVK06rDEvYzeY',
        available: true,
        phone: '9178889900',
        fb: 'ategracetransport',
    },
];
