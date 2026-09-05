type JsonLdProps = { data: Record<string, unknown> | Array<Record<string, unknown>> };

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function breadcrumbJsonLd(items: Array<{ name: string; href: string }>, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.href, baseUrl).toString(),
    })),
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function websiteJsonLd(name: string, url: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    inLanguage: "en-US",
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: { name: string; url: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    mainEntityOfPage: article.url,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    inLanguage: "en-US",
    author: { "@type": "Organization", name: article.author.name, url: article.author.url },
    publisher: { "@type": "Organization", name: "Aniimo", url: new URL("/", article.url).toString() },
  };
}

export function mapJsonLd(map: {
  name: string;
  description: string;
  url: string;
  parts: Array<{ name: string; description: string; href: string; image: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Map",
    name: map.name,
    description: map.description,
    url: map.url,
    inLanguage: "en-US",
    about: { "@type": "VideoGame", name: "Aniimo" },
    hasPart: map.parts.map((part) => ({
      "@type": "Map",
      name: part.name,
      description: part.description,
      url: new URL(part.href, map.url).toString(),
      image: new URL(part.image, map.url).toString(),
      inLanguage: "en-US",
    })),
  };
}
