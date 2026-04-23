export type HubItem = {
    id: string;
    type: 'classifieds' | 'jobs' | 'transport' | 'businesses' | 'gems' | 'event' | 'roro' | 'news';
    categoryLabel: string;
    title: string;
    subtitle: string;
    image: string;
    link: string;
    extraInfo?: string;
};
