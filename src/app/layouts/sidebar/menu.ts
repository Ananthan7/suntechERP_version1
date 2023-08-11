import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [

    {
        id: 1,
        label: 'HOME',
        icon: '../../../../assets/images/menu/9-Home.png',
        link: 'AdminDashboard',
        userType: 'ADMIN'
    },
    // /<i class="fa-duotone fa-file-magnifying-glass"></i>
    {
        id: 1,
        label: 'OVERVIEW',
        // icon: 'fas fa-chart-pie',
        icon: '../../../../assets/images/menu/Overview.png',
        link: 'overview',
        userType: 'USER'
    },
    {
        id: 2,
        label: 'KPI EVOLUTION',
        // icon: 'fas fa-th-large',
        icon: '../../../../assets/images/menu/KPI.png',
        link: 'kpievolution',
        userType: 'USER'
    },
    // {
    //     id: 3,
    //     label: 'SETTINGS',
    //     icon: '../../../../assets/images/menu/Settings.png',
    //     link: 'settings',
    //     userType: 'ADMIN'
    // },
    {
        id: 13,
        label: 'REPORTS',
        // icon: 'fas fa-users',
        icon: '../../../../assets/images/menu/Addmenu.png',
        userType: 'ADMIN',
        subItems: [
            {
                id: 4,
                label: 'ADD MENU',
                icon: '../../../../assets/images/menu/Addmenu.png',
                link: 'addmenu',
                userType: 'ADMIN'
            },
            {
                id: 5,
                label: 'ADD SUB-MENU',
                icon: '../../../../assets/images/menu/addSubmenu.png',
                link: 'addsubmenu',
                userType: 'ADMIN'
            },
        ]
    },
    {
        id: 6,
        label: 'GROUPS',
        icon: '../../../../assets/images/menu/addgroup.png',
        link: 'addgroup',
        userType: 'ADMIN'
    },
    {
        id: 7,
        label: 'USERS',
        icon: '../../../../assets/images/menu/addUser.png',
        link: 'adduser',
        userType: 'ADMIN'
    },
    {
        id: 13,
        label: 'GENERAL',
        // icon: 'fas fa-users',
        icon: '../../../../assets/images/menu/Addmenu.png',
        userType: 'ADMIN',
        subItems: [
            {
                id: 4,
                label: 'CURRENCY',
                icon: '../../../../assets/images/menu/Addmenu.png',
                link: 'general/currency',
                userType: 'ADMIN'
            },
            {
                id: 5,
                label: 'LANGUAGE',
                icon: '../../../../assets/images/menu/addSubmenu.png',
                link: 'general/language',
                userType: 'ADMIN'
            },
            {
                id: 5,
                label: 'PRODUCT ATTRIBUTES',
                icon: '../../../../assets/images/menu/addSubmenu.png',
                link: 'general/product-attributes',
                userType: 'ADMIN'
            },
            {
                id: 5,
                label: 'FILTERS',
                icon: '../../../../assets/images/menu/addSubmenu.png',
                link: 'general/filters',
                userType: 'ADMIN'
            },
            {
                id: 5,
                label: 'FESTIVALS',
                icon: '../../../../assets/images/menu/addSubmenu.png',
                link: 'general/Festivals',
                userType: 'ADMIN'
            },
            {
                id: 5,
                label: 'TARGET',
                icon: '../../../../assets/images/menu/addSubmenu.png',
                link: 'general/Targets',
                userType: 'ADMIN'
            },
        ]
    },
    {
        id: 8,
        label: 'MENU ALLOCATION',
        icon: '../../../../assets/images/menu/allocation.png',
        link: 'menuallocation',
        userType: 'ADMIN'
    },
    {
        id: 8,
        label: 'THEME SETTINGS',
        icon: '../../../../assets/images/menu/themeSetting.png',
        link: 'themesettings',
        userType: 'ADMIN'
    },
    {
        id: 9,
        label: 'BRANCH PERFORMANCE',
        // icon: 'fas fa-store',
        icon: '../../../../assets/images/menu/ShopManager.png',
        userType: 'USER',
        subItems: [
            {
                id: 1,
                label: 'Branch Key Metrics',
                icon: 'fas fa-bars',
                link: 'branchperformance/branchkeymetrics'
            },
            // {
            //     id: 2,
            //     label: 'Selected Branch Key Metrics',
            //     icon: 'fas fa-bars',
            //     link: 'branchperformance/SelectedBranch/All'
            // },
            // {
            //     id: 3,
            //     label: 'Sales Live Monitoring',
            //     icon: 'fas fa-bars',
            //     link: 'branchperformance/SalesMonitoring'
            // },
            {
                id: 4,
                label: 'Overall Branch Analysis',
                icon: 'fas fa-bars',
                link: 'branchperformance/OverallBranchAnalysis'
            },
            {
                id: 5,
                label: 'Branch Comparison For Selected Time Period',
                icon: 'fas fa-bars',
                link: 'branchperformance/SelectedBranchcomparison'
            },
            // {
            //     id: 5,
            //     label: 'YTD Branch Comparison',
            //     icon: 'fas fa-bars',
            //     link: 'branchperformance/YtdBranchComparison'
            // },
            // {
            //     id: 5,
            //     label: 'Branch Comparison',
            //     icon: 'fas fa-bars',
            //     link: 'branchperformance/DaywiseBranchComparison'
            // },
        ]
    },
    {
        id: 10,
        label: 'SALES',
        // icon: 'fas fa-chart-line',
        icon: '../../../../assets/images/menu/SalesView.png',
        userType: 'USER',
        subItems: [
            {
                id: 1,
                label: 'Sales Overview',
                icon: 'fas fa-bars',
                link: 'salesview'
            },
            {
                id: 2,
                label: 'Sales Performance',
                icon: 'fas fa-bars',
                link: 'salesview/SalesPerformance/All'
            },
            {
                id: 3,
                label: 'Products Driving Profits',
                icon: 'fas fa-bars',
                link: 'salesview/ProductsDrivingprofits'
            },
            // {
            //     id: 4,
            //     label: 'Price Tier Analysis',
            //     icon: 'fas fa-bars',
            //     link: 'salesview/PricetierAnalysis'
            // },
            {
                id: 5,
                label: 'Sales & Customer Engagement',
                icon: 'fas fa-bars',
                link: 'salesview/SaleCustomerEngagement'
            },
            {
                id: 6,
                label: 'Sales & Stock Analysis',
                icon: 'fas fa-bars',
                link: 'salesview/SalesStockAnalysis'
            },
            {
                id: 7,
                label: 'Product Group journey',
                icon: 'fas fa-bars',
                link: 'salesview/ProductGroupjourney'
            },
            {
                id: 8,
                label: 'Pareto Analysis',
                icon: 'fas fa-bars',
                link: 'salesview/ParetoAnalysis'
            },
            {
                id: 9,
                label: 'Sales & Gp Insights',
                icon: 'fas fa-bars',
                link: 'salesview/SalesGpInsights'
            },
            {
                id: 10,
                label: 'Moving Average',
                icon: 'fas fa-bars',
                link: 'salesview/MovingAverage'
            },
            {
                id: 11,
                label: 'Outlier Sales',
                icon: 'fas fa-bars',
                link: 'salesview/OutlierSales'
            },
            {
                id: 12,
                label: 'Realtime Sales tracking',
                icon: 'fas fa-bars',
                link: 'salesview/RealtimeSalestracking'
            },

        ]
    },
    {
        id: 11,
        label: 'SALES MAN',
        // icon: 'fas fa-signal',        
        icon: '../../../../assets/images/menu/salesman.png',
        userType: 'USER',
        subItems: [
            {
                id: 1,
                label: 'Overall Sales Metrics',
                icon: 'fas fa-bars',
                link: 'overall-sales-matrics'
            },
            {
                id: 1,
                label: 'Salesman Board',
                icon: 'fas fa-bars',
                link: 'salesman-board'
            },
            {
                id: 1,
                label: 'Overall Sales Branch Wise',
                icon: 'fas fa-bars',
                link: 'sales-branchwise/All'
            },
            // {
            //     id: 1,
            //     label: 'Branch Details with Target',
            //     icon: 'fas fa-bars',
            //     link: 'branch-target-details/0'
            // },
            // {
            //     id: 1,
            //     label: 'Saleman Analysis',
            //     icon: 'fas fa-bars',
            //     link: 'salesman-analysis/0'
            // },
            {
                id: 1,
                label: 'Customer Demographics',
                icon: 'fas fa-bars',
                link: 'customer-details'
            },
            {
                id: 1,
                label: 'Salesman Performance',
                icon: 'fas fa-bars',
                link: 'salesman-performance'
            },
            {
                id: 1,
                label: 'Salesman Pareto Analysis',
                icon: 'fas fa-bars',
                link: 'sales-pareto-analysis'
            },
        ]
    },
    // {
    //     id: 12,
    //     label: 'INVENTORY',
    //     // icon: 'fas fa-user-tie',
    //     icon: '../../../../assets/images/menu/Inventory.png',
    //     userType: 'USER',
    //     subItems: [
    //         {
    //             id: 1,
    //             label: 'Inventory Overview',
    //             icon: 'fas fa-bars',
    //             link: 'inventory'
    //         },
    //         {
    //             id: 2,
    //             label: ' Sales & Inventory Trends',
    //             icon: 'fas fa-bars',
    //             link: 'inventory/SalesInventorytrends'
    //         },
    //         {
    //             id: 3,
    //             label: 'Product Sell-Through Rate',
    //             icon: 'fas fa-bars',
    //             link: 'inventory/ProductSellthroughrate'
    //         },
    //         {
    //             id: 4,
    //             label: 'Abc Analysis By Product',
    //             icon: 'fas fa-bars',
    //             link: 'inventory/AbcAnalysis'
    //         },
    //         {
    //             id: 5,
    //             label: 'Product Inventory Trends',
    //             icon: 'fas fa-bars',
    //             link: 'inventory/ProductInventorytrends'
    //         },
    //         {
    //             id: 6,
    //             label: 'Ageing Analysis',
    //             icon: 'fas fa-bars',
    //             link: 'inventory/AgeingAnalysis'
    //         },
    //         {
    //             id: 7,
    //             label: 'ParetoAnalysis',
    //             icon: 'fas fa-bars',
    //             link: 'inventory/ParetoAnalysis'
    //         },
    //         {
    //             id: 8,
    //             label: 'Stock Value Monitor',
    //             icon: 'fas fa-bars',
    //             link: 'inventory/StockvalueMonitor'
    //         },
    //         {
    //             id: 9,
    //             label: 'Real Time Inventory Tracking',
    //             icon: 'fas fa-bars',
    //             link: 'inventory/RealtimeInventoryTracking'
    //         },
    //     ]
    // },
    {
        id: 13,
        label: 'CUSTOMERS',
        // icon: 'fas fa-users',
        icon: '../../../../assets/images/menu/Customers.png',
        userType: 'USER',
        subItems: [
            {
                id: 1,
                label: 'High Traffic & Top Generating Branches',
                icon: 'fas fa-bars',
                link: 'customers/HightTrafficbranches'
            },
            {
                id: 2,
                label: 'Price Segmentation Analysis at Customer Level',
                icon: 'fas fa-bars',
                link: 'customers/PriceSegmentationAnalysis'
            },
            {
                id: 3,
                label: 'Order Spend Analysis',
                icon: 'fas fa-bars',
                link: 'customers/OrderSpendAnalysis'
            },
            {
                id: 4,
                label: 'Customer Groups',
                icon: 'fas fa-bars',
                link: 'customers/CustomerGroups'
            },
            {
                id: 5,
                label: 'Pareto Analysis',
                icon: 'fas fa-bars',
                link: 'customers/ParetoAnalysis'
            },
            {
                id: 6,
                label: 'Needs Attention',
                icon: 'fas fa-bars',
                link: 'customers/NeedsAttention'
            },
            // {
            //     id: 6,
            //     label: 'Performance Over Time',
            //     icon: 'fas fa-bars',
            //     link: 'customers/PerformanceOvertime'
            // },

        ]
    },
    {
        id: 14,
        label: 'BEHAVIORAL SEGMENTATION',
        icon: '../../../../assets/images/menu/Behavioral-Seg.png',
        userType: 'USER',
        subItems: [
            {
                id: 1,
                label: 'Automated Analysis',
                icon: 'fas fa-bars',
                link: 'BehavioralSegmentation'
            },
        ]
    },
    {
        id: 14,
        label: 'ADVANCED ANALYTICS',
        icon: '../../../../assets/images/menu/invOpt.png',
        userType: 'USER',
        subItems: [
            {
                id: 1,
                label: 'Inventory Optimization',
                icon: 'fas fa-bars',
                link: 'advancedAnalytics/InventoryOptimization',
            },
            {
                id: 1,
                label: 'Sales Forecast',
                icon: 'fas fa-bars',
                // link: 'advancedAnalytics/salesForecast'
            },
        ]
    },
    {
        id: 14,
        label: 'KNOWLEDGE BASE',
        // icon: 'fas fa-th-large',
        icon: '../../../../assets/images/menu/Overview.png',
        link: 'knowledgebase',
        userType: 'USER'
    },
    // {
    //     id: 10,
    //     label: 'FOOTFALL',
    //     icon: 'fas fa-th-large',
    //     link: '',
    //     userType: 'USER'
    // },
    // {
    //     id: 9,
    //     label: 'Task',
    //     icon: 'fa fa-plus-square',

    //     subItems: [
    //         {
    //             id: 1,
    //             label: 'Task List',
    //             icon: 'fas fa-bars',
    //             link: 'task-list'
    //         },]
    // },
    // {
    //     id: 10,
    //     label: 'Chart',
    //     icon: 'fa fa-plus-square',
    //    link:'charts',
    //    userType: 'USER'
    // },
];

