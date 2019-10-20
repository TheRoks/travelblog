import React, { FunctionComponent } from "react";
import Helmet from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";
import { SiteMetadata } from "../../utils/models";
import url from "url";

interface SEOProps {
  title?: string;
  lang?: string;
  description?: string;
  location: Location;
  publishedAt?: string;
  updatedAt?: string;
  isArticle?: boolean;
  tags?: string[];
  type?: "WebSite" | "Series" | "Article";
  image?: string;
}

const SEO: FunctionComponent<SEOProps> = ({
  title,
  browserTitle,
  description,
  lang = "nl",
  location,
  publishedAt,
  updatedAt,
  isArticle = false,
  tags = [],
  type = `Article`,
  image,
}) => {
  // const {
  //   file: { publicURL },
  // } = useStaticQuery<{ file: { publicURL: string } }>(graphql`
  //   query GetLogoPath {
  //     file(name: { eq: "logo" }) {
  //       publicURL
  //     }
  //   }
  // `);

  const {
    site,
    file: { publicURL },
  } = useStaticQuery<SiteMetadata & { file: { publicURL: string } }>(graphql`
    query {
      file(name: { eq: "logo" }) {
        publicURL
      }
      site {
        siteMetadata {
          title
          siteUrl
          description
          topics
          author {
            name
            description
            social {
              twitter
              facebook
            }
          }
        }
      }
    }
  `);

  image = image || publicURL.slice(1);

  const metadata = site.siteMetadata;
  const siteTitle = browserTitle ? `${browserTitle}` : title ? `${title} - ${metadata.title}` : metadata.title;
  const metaDescription = description
    ? description
    : metadata.description.replace("%TOPICS%", metadata.topics.join(", "));
  const metaImage = image ? `${metadata.siteUrl}/${image}` : null;
  const canonical = url.resolve(metadata.siteUrl, location.pathname);

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={siteTitle}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: `og:title`,
          content: siteTitle,
        },
        {
          name: `og:type`,
          content: isArticle ? `article` : `website`,
        },
        {
          name: `og:description`,
          content: metaDescription,
        },
        {
          name: `og:url`,
          content: canonical,
        },
        {
          name: `twitter:label1`,
          content: `Written by`,
        },
        {
          name: `twitter:data1`,
          content: metadata.author.name,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: metadata.author.name,
        },
        {
          name: `twitter:title`,
          content: siteTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `keywords`,
          content: metadata.topics.concat(tags).join(", "),
        },
      ].concat(
        publishedAt
          ? [
              {
                name: `article:published_time`,
                content: publishedAt,
              },
            ]
          : [],
        updatedAt
          ? [
              {
                name: `article:modified_time`,
                content: updatedAt,
              },
            ]
          : [],
        tags.length > 0
          ? [
              {
                name: `twitter:label2`,
                content: `Filed under`,
              },
              {
                name: `twitter:data2`,
                content: tags[0],
              },
            ]
          : [],
        metaImage
          ? [
              {
                name: `og:image`,
                content: metaImage,
              },
              {
                name: `twitter:image`,
                content: metaImage,
              },
            ]
          : []
      )}
    >
      <script type={`application/ld+json`}>{`
        {
          "@context": "https://schema.org/",
          "@type": "${type}",
          "author": {
            "@type": "Person",
            "name": "${metadata.author.name}"
          },
          ${tags.length > 0 ? `"keywords": "${tags.join(`, `)}",` : ``}
          "headline": "${siteTitle}",
          "url": "${canonical}",
          ${publishedAt ? `"datePublished": "${publishedAt}",` : ``}
          ${updatedAt ? `"dateModified": "${updatedAt}",` : ``}
          ${
            metaImage
              ? `"image": {
            "@type": "ImageObject",
            "url": "${metaImage}",
            "width": "1000",
            "height": "520"
          },`
              : ``
          }
          "publisher": {
            "@type": "Organization",
            "name": "${metadata.title}",
            "logo": {
                "@type": "ImageObject",
                "url": "${metaImage}",
                "width": "1000",
                "height": "520"
              }
          },
          "description": "${metaDescription}",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "${metadata.siteUrl}"
          }
        }
      `}</script>
    </Helmet>
  );
};

export default SEO;
