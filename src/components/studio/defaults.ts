export type StudioMediaSrc = {
  src: string;
  alt: string;
};

export type StudioServiceDefault = {
  serviceLabel: string;
  title: string;
  displayTitlePrefix: string;
  displayTitleAccent: string;
  description: string;
  includes: string[];
  ctaLabel: string;
  ctaHref: string;
  stackImages: StudioMediaSrc[];
};

export const STUDIO_DEFAULTS = {
  hero: {
    headline: "This is Where The Magic Happens",
    tagline:
      "Four ways to work with us. One non-negotiable standard. Your brand leaves here looking and feeling undeniably itself.",
    image: {
      src: "/assets/studio/studio-hero.jpg",
      alt: "Creative desk with laptop, headphones, and STRATEGY FIRST card",
    },
  },
  servicesSection: {
    title: "The Four Services",
  },
  services: [
    {
      serviceLabel: "Service 01 - The Thryve Blueprint",
      title: "The Thryve Blueprint",
      displayTitlePrefix: "Strategy & Con",
      displayTitleAccent: "sulting",
      description:
        "Think of this as your brand's glow-up plan. We come in, audit what's working and what's not, and build you a full strategy from the ground up complete with a content calendar and a presentation you can actually use.",
      includes: [
        "Brand audit & competitor analysis",
        "Full content strategy",
        "Content calendar",
        "Strategy presentation deck",
        "Optional follow-up session available",
      ],
      ctaLabel: "Book a Discovery Call",
      ctaHref: "/contact",
      stackImages: [
        { src: "/assets/studio/studio-svc01-stack-01.jpg", alt: "Woman holding a maroon card reading Your Brand's New Best Friend" },
        { src: "/assets/studio/studio-svc01-stack-02.jpg", alt: "Strategy and consulting mid-back layer" },
        { src: "/assets/studio/studio-svc01-stack-03.jpg", alt: "Strategy and consulting mid-front layer" },
        { src: "/assets/studio/studio-svc01-stack-04.jpg", alt: "Strategy and consulting front layer" },
      ],
    },
    {
      serviceLabel: "Service 02 - The Thryve Aesthetic",
      title: "The Thryve Aesthetic",
      displayTitlePrefix: "Content Creati",
      displayTitleAccent: "on",
      description:
        "Your brand deserves content that actually looks like something. Whether you come with a concept already in your head or you want us to build one from scratch we have got you covered.",
      includes: [
        "Concept development (yours or ours)",
        "Art direction & creative direction",
        "Photography & video content",
        "Edited, delivery-ready assets",
      ],
      ctaLabel: "Book a Discovery Call",
      ctaHref: "/contact",
      stackImages: [
        { src: "/assets/studio/studio-svc02-stack-01.jpg", alt: "Editorial magazine styled on a table beside a wooden board" },
        { src: "/assets/studio/studio-svc02-stack-02.jpg", alt: "Content creation mid-back layer" },
        { src: "/assets/studio/studio-svc02-stack-03.jpg", alt: "Content creation mid-front layer" },
        { src: "/assets/studio/studio-svc02-stack-04.jpg", alt: "Content creation front layer" },
      ],
    },
    {
      serviceLabel: "Service 03 - The Thryve Edit",
      title: "The Thryve Edit",
      displayTitlePrefix: "Social Media Ma",
      displayTitleAccent: "nagement",
      description:
        "This is the full experience. Strategy, content, scheduling, community management — all of it, all on brand, all the time. You focus on running your business. We handle making sure the world knows about it.",
      includes: [
        "Content strategy & calendar",
        "Content creation",
        "Scheduling & publishing",
        "Community management",
        "Monthly performance report",
      ],
      ctaLabel: "Book a Discovery Call",
      ctaHref: "/contact",
      stackImages: [
        { src: "/assets/studio/studio-svc03-stack-01.jpg", alt: "Vintage radio resting on a Picture Post magazine" },
        { src: "/assets/studio/studio-svc03-stack-02.jpg", alt: "Social media management mid-back layer" },
        { src: "/assets/studio/studio-svc03-stack-03.jpg", alt: "Social media management mid-front layer" },
        { src: "/assets/studio/studio-svc03-stack-04.jpg", alt: "Social media management front layer" },
      ],
    },
    {
      serviceLabel: "Service 04 - The Thryve Moment",
      title: "The Thryve Moment",
      displayTitlePrefix: "Creative Direct",
      displayTitleAccent: "ion",
      description:
        "For the big moments. The launches. The activations. The campaigns that need to feel like something. We shape the creative direction, capture everything beautifully, and make sure it lives beyond the day itself.",
      includes: [
        "Creative concept & mood boarding",
        "On-site art & creative direction",
        "Content capture & editing",
        "Post-moment content rollout strategy",
      ],
      ctaLabel: "Book a Discovery Call",
      ctaHref: "/contact",
      stackImages: [
        { src: "/assets/studio/studio-svc04-stack-01.jpg", alt: "Hand photographing Thryve branded prints on a phone" },
        { src: "/assets/studio/studio-svc04-stack-02.jpg", alt: "Creative direction mid-back layer" },
        { src: "/assets/studio/studio-svc04-stack-03.jpg", alt: "Creative direction mid-front layer" },
        { src: "/assets/studio/studio-svc04-stack-04.jpg", alt: "Creative direction front layer" },
      ],
    },
  ] satisfies StudioServiceDefault[],
  howItWorksSection: {
    title: "How it Works",
  },
  howItWorks: [
    {
      step: 1,
      title: "Discovery Call",
      description:
        "We get on a call, learn your brand inside out, and figure out exactly what you need.",
      image: { src: "/assets/studio/studio-how-step-01.jpg", alt: "Vintage telephone representing discovery call" },
    },
    {
      step: 2,
      title: "The Proposal",
      description:
        "We put together a tailored proposal based on everything you've shared. You sign off and we are good to go.",
      image: { src: "/assets/studio/studio-how-step-02.jpg", alt: "iPad showing creative work" },
    },
    {
      step: 3,
      title: "Onboarding",
      description:
        "You're officially a Thryve client. We get all the good stuff — assets, access, and everything we need to hit the ground running.",
      image: { src: "/assets/studio/studio-how-step-03.jpg", alt: "Founder reviewing work on tablet" },
    },
    {
      step: 4,
      title: "Strategize",
      description:
        "This is where we do the thinking. Deep diving into your brand, your audience, and building the plan that's going to make it all click.",
      image: { src: "/assets/studio/studio-how-step-04.jpg", alt: "Strategic planning with jewelry and magazine" },
    },
    {
      step: 5,
      title: "We Get to Work",
      description:
        "Strategy becomes content. Content becomes presence. Presence becomes something people actually notice.",
      image: { src: "/assets/studio/studio-how-step-05.jpg", alt: "Laptop displaying Thryve Co brand on books" },
    },
    {
      step: 6,
      title: "Your Brand Thrives",
      description:
        "You show up online with intention, consistency, and an aesthetic that's undeniably yours. That's the Thryve effect.",
      image: { src: "/assets/studio/studio-how-step-06.jpg", alt: "Founder relaxed in chair showing brand success" },
    },
  ],
  cta: {
    headline: "Your Next Brand Move Starts Here.",
    subtext:
      "Your brand deserves more than content that fills a feed. Let’s build a strategy, presence, and visual identity people actually remember.",
    ctaLabel: "Book a Discovery Call",
    ctaHref: "/contact",
    image: { src: "/assets/studio/studio-cta.jpg", alt: "Creative studio lifestyle scene" },
  },
  underlineSrc: "/assets/studio/studio-service-underline.svg",
  bulletSrc: "/assets/studio/studio-bullet.svg",
} as const;
