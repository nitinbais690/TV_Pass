module.exports = {
    title: 'QuickplayTV UI / UX',
    tagline: 'Jump-start your OTT app delivery',
    url:
        'https://pages.git.devops.quickplay.com/b2b-client-team/react-native-ui/',
    baseUrl: '/b2b-client-team/react-native-ui/',
    favicon: 'img/favicon.png',
    organizationName: 'b2b-client-team',
    projectName: 'react-native-ui',
    githubHost: 'git.devops.quickplay.com',
    themeConfig: {
        disableDarkMode: true,
        navbar: {
            title: 'QuickplayTV UI / UX',
            logo: {
                alt: 'Firstlight',
                src: 'img/favicon.png',
            },
            links: [
                {
                    to: 'docs/',
                    activeBasePath: 'docs',
                    label: 'Docs',
                    position: 'left',
                },
            ],
        },
        footer: {
            style: 'light',
            logo: {
                alt: 'Firstlight',
                src: 'img/fl_logo_dark.png',
            },
            copyright: `Copyright © ${new Date().getFullYear()} Firstlight Media Ltd.`,
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    // It is recommended to set document id as docs home page (`docs/` path).
                    homePageId: 'introduction',
                    sidebarPath: require.resolve('./sidebars.js'),
                    // // Please change this to your repo.
                    // editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    editUrl:
                        'https://github.com/facebook/docusaurus/edit/master/website/blog/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
};
