export type Gem = {
    id: string;
    title: string;
    location: string;
    description: string;
    image: string;
    imageAlt: string;
    author: {
        name: string;
        avatar?: string;
        initials?: string;
    };
    aspectRatio: string;
};

export const GEMS: Gem[] = [
    {
        id: 'poctoy-white-beach',
        title: 'Poctoy White Beach',
        location: 'Torrijos, Marinduque',
        description: 'The sunset here is absolutely magical. Best place to unwind after a long week.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtrXOqDVgL69LjOxVWAA9nO_SXy0z31K588lI3K9hsFvDzKDZv71X6oygWgA4pTC0aY3LFAEPIxtKuipbf6b-zp8QgZIWVuUuKz89TOdp0YJtgd7_r3VyzI5FJdVC9GuSDRxlcYRZkZwpKDB8DR5HW7JGBjhtHfOq7NM5ItoetwkCLXS5Q9tmK-6i1MfZx5kULnmoVt9k_gTNuIVFDsruwsz9aqm-PnWuQkEW-c61AYlOy43tk89AWx9RuiqXfLMbXLCHvlzRgvQA',
        imageAlt: 'Tropical white sand beach with clear blue water and coconut trees',
        author: { name: 'Maria S.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABXvAeMEFZMabjghkJKLLdVzGGGvet5UdQO_aiJiS0iZ4ycXJbZQ2u-VeJSWV8NVRL7dEWxPh0Thy6yjiGZHTo8_ajYUWa0Wrumi-Rv6F1N4s75xRLnSNf82r46Gsgsa1hnrrczxbDCFlv4hestHmzpZADF0xEYu8ZeOfLtmueY73y_qZ9fPMsjtOaKn-KryTpm8QhMIKXzMzz4-x1O1DtkH52qLEWy_As_ewDLVJk_lzz6hpZUmfZA-fwFJdYsWqZX2Fh9sWw4Vc' },
        aspectRatio: 'aspect-[4/5]'
    },
    {
        id: 'boac-cathedral',
        title: 'Boac Cathedral',
        location: 'Boac, Marinduque',
        description: 'Lighting a candle for peace. The architecture is breathtakingly preserved.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdh2E4CRyeLhFyTnxILtr9kYrUifKwS5GFCMEGYpA99jHHWHuDMgD7Qo8EbwZkkycVWT8JGPX494ePtVd7BBl7iZDyG1M5OL7o1g-w_D5ii7d2Aucj_KeTcRLJdgVx61tMqFFhjS4OLcEwthK7RYL7Y3b86nCGIXI_oHZCGhh0PpbdK4i8-cswnG6NWMOmWt6eQgPVQdA4HDvp6pRFyRs98z75P7Cv4648_AFxNJ2e7mEEeL7q811Qez-Sx8luAReJK4TRoP-uKpU',
        imageAlt: 'Historic stone church facade with spanish architecture',
        author: { name: 'Juan D.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIBWiJNJKtlvp0PuXny1DiTxWvQw8DwagNMhR4hMCvEQ0M2Z1VLczgm1aagQQLDb-VGN3b-OI3VOPyR1lAN5vTqjvjPOCkC3pRe4lV2Rm95WMQqK5PFxGYbuXNnNEU-ds1zWfm0a-nP1Z-DXFwzSNwid2Np2-0ttBUPNRzAs6_t6DbeRQ8gyRjAYv8Fgwo_9j0oyMZ6gAqtHDeFKMAqDze4IWaovg-Vgz041ix1jlRzS1DrEu1blV3LIAQ2SZN3FeXVU7oKywPkow' },
        aspectRatio: 'aspect-[3/2]'
    },
    {
        id: 'maniwaya-island',
        title: 'Maniwaya Island',
        location: 'Santa Cruz',
        description: 'Paradise found! The sandbar appeared right at low tide.',
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=500&h=500&fit=crop',
        imageAlt: 'Pristine white sandbar in the middle of turquoise ocean',
        author: { name: 'Lito M.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW6h3n7nSCp1up5tTLlzQj70rDnKKMyw1oUN8v3Phs0jKNssTGzJtDOaOLLSBfYvijuwbtsAUpmlLTNuDOs2HVk6RrgzY5Mh0FX4xGIGjSW9rlumCYYa4FD1l97rfj1Z3bfwCGpYYd50NcqxgPZdW00pjTcN26A4fUfXj5yxcRugzwVEDhqT01cGDs-nRkUAybQ0VkxFtXrz-Ly4FdsruCkbRM5OPmnqDZEHDoPzxYGVaarcIpaNhIaOEPh_ZvU_1EcyGj8HcqGkc' },
        aspectRatio: 'aspect-[3/4]'
    },
    {
        id: 'moriones-festival',
        title: 'Moriones Festival',
        location: 'Boac Town Plaza',
        description: 'Getting ready for Holy Week. The masks are intricate this year!',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6g8TTI4Gef9_JTO7kB3Nl8FwrnMbmGzqkyr5GMXpfhnHMyYn8ivXNZKcIGtklswBBpsXZOR8WTHkS59M7uXE0zwcUXPX8LxxATrB3VsWe5dOHXTICaxEhGSgIpuwm2Y4Fwz5Lbh-x4EzFuE2AvSh2RLZcJ5BYMbQgePEvmeGbGZsqYbXtd7YOrChwuljxNHr03JTVfGVvgzacOFun1ZJ7jtx2sdFhOEQxMlUWvRNhGULzOrOnC5dXNFW8nCKFaQfwTJ4W4Xx_f48',
        imageAlt: 'Close up of traditional moriones festival mask',
        author: { name: 'Jenny S.', initials: 'JS' },
        aspectRatio: 'aspect-[4/3]'
    },
    {
        id: 'bathala-caves',
        title: 'Bathala Caves',
        location: 'Santa Cruz',
        description: 'Spooky yet serene. The light filtering through is divine.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBySILFeyYFsX8dw_QmUgD0Qbn3cbLFbVEO5sWFYg-5AazVzDJcAzocnqjxpBpIqNGbIm7GDjPY1ZSOo9gCn3bZ5XBwGszJQTrReg77KwwxIgZE1DZe4YKGkNeh2yIQsA6oiUjAZNhnNdtt2q_ob1RSbBnUIQdkKEmA9ilbpDpIZhar-_eDAZfzx6FPwApfVpkNuki1ZSyD6ay-oyzDlbDaIr7CSYPRU10Kk1CMUJ1csJZ5s2rpZPnY6cFNL8VNu4nC1-eBi7TO7Xo',
        imageAlt: 'Mystical cave interior with stalactites',
        author: { name: 'Ana R.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIfQ_CWJ0iuRclWehwN_YPgBMjWLTd7kH-o9mX4pTAmrJuVGDUhxuCtZJnMdVadMahxT2496BOySSiYIWAG4qfhL7smn1tR2zrQjuZpqwQUlOjLmNHeWNrXEhrZ9kxlgn_xMxwNtHqZAYUabzZ5MvmEJrfBQUpYYD-9hF3QNrghGd-2RKIEMecW3Y_S5Cfl7-sOyzX4BFjbY4vJSWtz6Yj_M3QKAJx_CYpnyAxirCy12137D3nlqEWUhDedi2EKgmWI55RfiryozI' },
        aspectRatio: 'aspect-[3/4]'
    }
];
