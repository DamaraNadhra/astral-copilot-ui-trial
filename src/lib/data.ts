import { z } from "zod";

export interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  imageUrl: string;
  location: string;
  description: string;
  color: string;
}

export interface SearchResultType {
  id: number;
  title: string;
  description: string;
  image: string;
  totalPages: number;
  link: string;
  relevantPages?: {
    startPage: number;
    endPage: number;
  };
}

export const itemsSchema = z.array(
  z.union([
    z.object({
      kind: z.string(),
      title: z.string(),
      htmlTitle: z.string(),
      link: z.string(),
      displayLink: z.string(),
      snippet: z.string(),
      htmlSnippet: z.string(),
      formattedUrl: z.string(),
      htmlFormattedUrl: z.string(),
      pagemap: z.object({
        cse_thumbnail: z.array(
          z.object({ src: z.string(), width: z.string(), height: z.string() })
        ),
        metatags: z.array(
          z.object({
            "apple-itunes-app": z.string(),
            "theme-color": z.string(),
            viewport: z.string(),
            "twitter:url": z.string(),
            "og:url": z.string()
          })
        ),
        cse_image: z.array(z.object({ src: z.string() }))
      })
    }),
    z.object({
      kind: z.string(),
      title: z.string(),
      htmlTitle: z.string(),
      link: z.string(),
      displayLink: z.string(),
      snippet: z.string(),
      htmlSnippet: z.string(),
      formattedUrl: z.string(),
      htmlFormattedUrl: z.string(),
      pagemap: z.object({
        cse_thumbnail: z.array(
          z.object({ src: z.string(), width: z.string(), height: z.string() })
        ),
        document: z.array(
          z.object({
            description: z.string(),
            title: z.string(),
            type: z.string()
          })
        ),
        metatags: z.array(
          z.object({
            "og:image": z.string(),
            "og:type": z.string(),
            "twitter:card": z.string(),
            "og:image:width": z.string(),
            "twitter:title": z.string(),
            "og:site_name": z.string(),
            "og:title": z.string(),
            "og:image:height": z.string(),
            title: z.string(),
            "og:description": z.string(),
            "twitter:image": z.string(),
            "fb:app_id": z.string(),
            "twitter:site": z.string(),
            viewport: z.string(),
            "twitter:description": z.string(),
            "fb:admins": z.string(),
            "fb:page_id": z.string(),
            "og:url": z.string()
          })
        ),
        cse_image: z.array(z.object({ src: z.string() }))
      })
    }),
    z.object({
      kind: z.string(),
      title: z.string(),
      htmlTitle: z.string(),
      link: z.string(),
      displayLink: z.string(),
      snippet: z.string(),
      htmlSnippet: z.string(),
      formattedUrl: z.string(),
      htmlFormattedUrl: z.string(),
      pagemap: z.object({
        cse_thumbnail: z.array(
          z.object({ src: z.string(), width: z.string(), height: z.string() })
        ),
        metatags: z.array(
          z.object({
            "pin:description": z.string(),
            "og:image": z.string(),
            "og:site_name": z.string(),
            handheldfriendly: z.string(),
            viewport: z.string(),
            "og:title": z.string(),
            mobileoptimized: z.string(),
            "pin:url": z.string(),
            "og:url": z.string(),
            "og:description": z.string(),
            "pin:media": z.string()
          })
        ),
        cse_image: z.array(z.object({ src: z.string() }))
      })
    }),
    z.object({
      kind: z.string(),
      title: z.string(),
      htmlTitle: z.string(),
      link: z.string(),
      displayLink: z.string(),
      snippet: z.string(),
      htmlSnippet: z.string(),
      formattedUrl: z.string(),
      htmlFormattedUrl: z.string(),
      pagemap: z.object({
        cse_thumbnail: z.array(
          z.object({ src: z.string(), width: z.string(), height: z.string() })
        ),
        educationalaudience: z.array(z.object({ educationalrole: z.string() })),
        metatags: z.array(z.object({ viewport: z.string() })),
        creativework: z.array(
          z.object({
            educationaluse: z.string(),
            image: z.string(),
            keywords: z.string(),
            learningresourcetype: z.string(),
            name: z.string(),
            description: z.string(),
            datecreated: z.string(),
            filesize: z.string(),
            url: z.string()
          })
        ),
        cse_image: z.array(z.object({ src: z.string() })),
        brand: z.array(z.object({ name: z.string() }))
      })
    }),
    z.object({
      kind: z.string(),
      title: z.string(),
      htmlTitle: z.string(),
      link: z.string(),
      displayLink: z.string(),
      snippet: z.string(),
      htmlSnippet: z.string(),
      formattedUrl: z.string(),
      htmlFormattedUrl: z.string(),
      pagemap: z.object({
        metatags: z.array(
          z.object({
            "og:image": z.string(),
            "theme-color": z.string(),
            "og:image:width": z.string(),
            "og:type": z.string(),
            "og:image:alt": z.string(),
            "twitter:card": z.string(),
            "twitter:title": z.string(),
            "og:site_name": z.string(),
            "og:title": z.string(),
            "og:image:height": z.string(),
            "msapplication-navbutton-color": z.string(),
            "og:description": z.string(),
            "twitter:image": z.string(),
            "apple-mobile-web-app-status-bar-style": z.string(),
            "twitter:site": z.string(),
            viewport: z.string(),
            "apple-mobile-web-app-capable": z.string(),
            "og:ttl": z.string(),
            "og:url": z.string()
          })
        )
      })
    }),
    z.object({
      kind: z.string(),
      title: z.string(),
      htmlTitle: z.string(),
      link: z.string(),
      displayLink: z.string(),
      snippet: z.string(),
      htmlSnippet: z.string(),
      formattedUrl: z.string(),
      htmlFormattedUrl: z.string(),
      pagemap: z.object({
        cse_thumbnail: z.array(
          z.object({ src: z.string(), width: z.string(), height: z.string() })
        ),
        metatags: z.array(
          z.object({
            "p:domain_verify": z.string(),
            "og:image": z.string(),
            "og:type": z.string(),
            "og:site_name": z.string(),
            viewport: z.string(),
            "og:title": z.string(),
            "com.silverpop.brandeddomains": z.string(),
            "og:url": z.string(),
            "com.silverpop.cothost": z.string(),
            "og:description": z.string()
          })
        ),
        cse_image: z.array(z.object({ src: z.string() }))
      })
    })
  ])
)

