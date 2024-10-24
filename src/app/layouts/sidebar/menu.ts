import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'All',
        icon: 'grid',
        subItems: [
            {
                id: 1,
                label: 'Addons',
                link: '/modules',
                parentId: 1
            },
            {
                id: 2,
                label: 'Boiling',
                link: '/modules',
                parentId: 1
            },
            {
                id: 3,
                label: 'Bullion',
                link: '/modules',
                parentId: 1
            },
            {
                id: 4,
                label: 'Catalogue',
                link: '/modules',
                parentId: 1
            },
            {
                id: 5,
                label: 'Fixed Asset',
                link: '/modules',
                parentId: 1
            },
            {
                id: 6,
                label: 'General',
                link: '/modules',
                parentId: 1
            },
            {
                id: 7,
                label: 'Jewellery Manufacturing',
                link: '/modules',
                parentId: 1
            },
            {
                id: 8,
                label: 'Payroll and HR',
                link: '/modules',
                parentId: 1
            },
            {
                id: 9,
                label: 'Refinery',
                link: '/modules',
                parentId: 1
            },
            {
                id: 10,
                label: 'Repairing',
                link: '/modules',
                parentId: 1
            },
            {
                id: 11,
                label: 'Retail',
                link: '/modules',
                parentId: 1
            },
            {
                id: 12,
                label: 'Wholesale',
                link: '/modules',
                parentId: 1
            },
          
        ]
    },
    {
        id: 2,
        label: 'Management',
        icon: 'user',
        subItems: [
            {
                id: 2,
                label: 'Modules',
                link: '/modules',
                parentId: 2
            },
          
        ]
    },
    {
        id: 3,
        label: 'Operational',
        icon: 'monitor',
        subItems: [
            {
                id: 2,
                label: 'Modules',
                link: '/modules',
                parentId: 3
            },
          
        ]
    },
    {
        id: 4,
        label: 'Sales',
        icon: 'user',
        subItems: [
            {
                id: 2,
                label: 'Modules',
                link: '/modules',
                parentId: 4
            },
          
        ]
    },
    {
        id: 5,
        label: 'Support',
        icon: 'user',
        
    },
  
  
];

