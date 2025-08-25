export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: string;
  mode: 'payment' | 'subscription';
  features: string[];
  bestFor: string;
  emoji: string;
}

export interface CareProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: string;
  mode: 'subscription';
  features: string[];
  pitch: string;
  emoji: string;
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_SflpJbCHG3nHm3',
    priceId: 'price_1RkQHoHXLiaHMkNqgYI0ytyh',
    name: 'Starter Boost',
    description: 'For small businesses that just need a clean, professional presence.',
    price: '£395',
    mode: 'payment',
    emoji: '🥉',
    features: [
      '1-page high-converting landing site',
      'Mobile-first design (fast loading)',
      'Built-in lead form or call button',
      'SEO-ready layout (H1, metadata, alt text)',
      'Linked to Google Maps & socials',
      'Delivered in 3–5 business days'
    ],
    bestFor: 'New businesses, local trades, single-service pros'
  },
  {
    id: 'prod_SflpZG3bSynIos',
    priceId: 'price_1RkQIBHXLiaHMkNqeUmn6igJ',
    name: 'Growth Engine',
    description: 'For growing businesses ready to convert traffic into paying clients.',
    price: '£895',
    mode: 'payment',
    emoji: '🥈',
    features: [
      'Up to 5 custom pages (Home, About, Services, Gallery, Contact)',
      'Conversion-optimized layout (CTAs throughout)',
      'Embedded Google Reviews / Testimonials',
      'SEO structure with keywords & schema',
      'Blog or Update section setup',
      'On-page animation / scroll effects (subtle polish)',
      'Basic performance analytics (GA4 ready)',
      'Revisions included'
    ],
    bestFor: 'Established service businesses that want more inbound leads'
  },
  {
    id: 'prod_SflqKsZypFlt0N',
    priceId: 'price_1RkQIVHXLiaHMkNqOjr06RdT',
    name: 'Authority Pro',
    description: 'For brands ready to dominate their niche with a stunning online presence.',
    price: '£1495',
    mode: 'payment',
    emoji: '🥇',
    features: [
      'Everything in Growth Engine, plus:',
      'Custom design system (visual brand guide)',
      'Full branding refresh (colours, fonts, CTA hierarchy)',
      'Advanced animations, hover interactions',
      'Email capture system + CRM integration (e.g., Mailchimp, Notion, Airtable)',
      'High-speed global hosting setup (Netlify/Vercel)',
      'Pre-launch consultation + walkthrough',
      'Free updates for 30 days post-launch'
    ],
    bestFor: 'Niche leaders, high-ticket services, agencies'
  }
];

export const CARE_PLANS: CareProduct[] = [
  {
    id: 'prod_Sfm1HrMPe9v2uS',
    priceId: 'price_1RkQT2HXLiaHMkNq6HUawTwJ', // You'll need to create this in Stripe
    name: 'Care Plan',
    description: 'Keep your site online, up-to-date, and problem-free.',
    price: '£49/month',
    mode: 'subscription',
    emoji: '🔧',
    features: [
      'Monthly backups',
      'Security monitoring',
      'Bug fixes + minor text/image updates (up to 30 min/month)',
      'Hosting & uptime tracking',
      '48-hour response time for support'
    ],
    pitch: 'Like insurance for your site — I\'ll keep it healthy while you focus on business.'
  },
  {
    id: 'prod_Sfm17vkVEhTosZ',
    priceId: 'price_1RkQTOHXLiaHMkNqZtywT7fp', // You'll need to create this in Stripe
    name: 'Growth Plan',
    description: 'Grow your reach, improve rankings, and bring in more leads.',
    price: '£149/month',
    mode: 'subscription',
    emoji: '🚀',
    features: [
      'Everything in Care Plan, plus:',
      '1 hour/month of design tweaks or section updates',
      'Basic monthly SEO tune-up (meta tags, alt text, keyword refresh)',
      'Monthly analytics report (visits, bounce rate, top pages)',
      'A/B testing on CTAs or landing sections'
    ],
    pitch: 'I\'ll help your site get sharper each month — better rankings, better conversions.'
  },
  {
    id: 'prod_Sfm13IJ4f0gYut',
    priceId: 'price_1RkQTiHXLiaHMkNqFEeXS0RE', // You'll need to create this in Stripe
    name: 'Content & Funnel Plan',
    description: 'Turn your site into a sales machine with new content & automation.',
    price: '£395/month',
    mode: 'subscription',
    emoji: '🧠',
    features: [
      'Everything in Growth Plan, plus:',
      '1 new blog/article OR service page/month',
      'Lead magnet creation (PDFs, offers, guides)',
      'Email capture + autoresponder funnel setup',
      'CRM integrations (Notion, Mailchimp, Google Sheets, etc.)',
      'Quarterly strategy call'
    ],
    pitch: 'We\'ll actively grow your traffic and automate follow-ups to close more clients.'
  }
];