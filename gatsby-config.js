module.exports = {
  siteMetadata: {
    title: "Reisverhalen door Stefan",
    siteUrl: "https://travel.theroks.com",
    twitterHandle: "@theroks",
    url: "https://travel.theroks.com",
    description:
      "Reisverhalen van over de hele wereld door Stefan",
    topics: [],
    menu: [
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Europa",
        path: "/tag/europa",
      },
      {
        name: "Afrika",
        path: "/tag/afrika",
      },
      {
        name: "Noord Amerika",
        path: "/tag/noord-amerika",
      },
      {
        name: "Midden Amerika",
        path: "/tag/midden-amerika",
      },
      {
        name: "Zuid Amerika",
        path: "/tag/zuid-amerika",
      },
    ],
    footerMenu: [
      {
        name: "Citytrips",
        path: "/tag/citytrips",
      },
      {
        name: "Rondreizen",
        path: "/tag/rondreizen",
      },
    ],
    search: true,
    author: {
      name: `Stefan`,
      description: `Hi!`,
      social: {
        facebook: `https://www.facebook.com/stefan.roks`,
        twitter: `https://twitter.com/theroks`,
        linkedin: ``,
        instagram: `https://www.instagram.com/_theroks_`,
        youtube: ``,
        github: ``,
        twitch: ``,
      },
    },
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-20164906-3",
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://travel.theroks.com',
        sitemap: 'https://travel.theroks.com/sitemap.xml',
        policy: [{ userAgent: '*', allow: '/' }]
      }
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
        exclude: ["/404/", "/archive", "/tags", "404.html", "/tag/*", "/dev-404-page/"],
        // Exclude specific pages or groups of pages using glob parameters
        // See: https://github.com/isaacs/minimatch
        // The example below will exclude the single `path/to/page` and all routes beginning with `category`
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
  
            allSitePage {
              edges {
                node {
                  path
                }
              }
            }
        }`,
        serialize: ({ site, allSitePage }) =>
          allSitePage.edges.map(edge => {
            return {
              url: site.siteMetadata.siteUrl + edge.node.path,
              changefreq: `daily`,
              priority: 0.7,
            }
          })
      }
    },    
    {
      resolve: `@nehalist/gatsby-theme-nehalem`,
      options: {
        contentPath: "./content",
        manifest: {
          name: `Stefan Roks's travel blog`,
          short_name: `travel.theroks.com`,
          start_url: `/`,
          background_color: `#555555`,
          theme_color: `#555555`,
          display: `minimal-ui`,
          icon: `${__dirname}/content/assets/images/icon.png`,
        },
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-autolink-headers`,          
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
              withWebp: true,
              loading: 'lazy'
            }
          },
          {
            resolve: "gatsby-remark-embed-youtube",
            options: {
              width: 800,
              height: 400
            }
          }
        ]
      }
    },    
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.frontmatter.excerpt,
                  date: edge.node.frontmatter.created,
                  url: site.siteMetadata.siteUrl + edge.node.frontmatter.path + '?utm_source='+edge.node.frontmatter.title+'&utm_medium=RSS&&utm_campaign=RSS%20Feed',
                  guid: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
            {
              allMarkdownRemark(
                sort: { order: DESC, fields: [frontmatter___created] },
                filter: { fileAbsolutePath: { regex: "/(posts)/.*\\\\.md$/" } }
              ) {
                edges {
                  node {
                    html
                    frontmatter {
                      title
                      excerpt
                      path
                      created
                    }
                  }
                }
              }
            }
            `,
            output: `/rss.xml`,
            title: `RSS Feed`
          }
        ]
      }
    },
  ],
};
