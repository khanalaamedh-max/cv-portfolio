import type { SiteContent } from "./types";

export const defaultContent: SiteContent = {
  profile: {
    name: "Sandip Poudel",
    title:
      "Digital Marketing Expert | Social Media Marketer | Ads Runner | Web Developer",
    intro: [
      "12th Grade Graduate",
      "Web Developer",
      "Founder of a Digital Marketing Agency",
      "Helps businesses grow through social media marketing and paid advertising",
      "Actively involved in a family business generating over NPR 1 Crore+ annual turnover",
      "Currently seeking opportunities in Social Media Marketing, Performance Marketing, and Digital Advertising"
    ],
    about:
      "Sandip Poudel is a digital marketing and web development professional focused on practical business growth. He manages social media strategy, Facebook and Instagram advertising, lead generation campaigns, content planning, and website development for businesses that need measurable online visibility. Alongside digital work, he is actively involved in real-world family business operations generating over NPR 1 Crore+ annual turnover, giving him a grounded understanding of sales, customer behavior, operations, and execution.",
    email: "sandip.poudel@example.com",
    phone: "9749897650",
    whatsapp: "9749897650",
    photoUrl: "/sandip-profile.jpeg"
  },
  skills: [
    "Meta Ads",
    "Facebook Marketing",
    "Instagram Marketing",
    "Google Ads",
    "Social Media Management",
    "Content Strategy",
    "Lead Generation",
    "Web Development",
    "SEO",
    "Business Management"
  ],
  socials: [
    {
      id: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/sandip-graham-3320b540a/"
    },
    {
      id: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/sandippoudel12/"
    },
    {
      id: "github",
      label: "GitHub",
      url: "https://github.com/khanalaamedh-max"
    },
    {
      id: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com/sandip.poudel.507918/"
    }
  ],
  experience: [
    {
      id: "agency-owner",
      title: "Digital Marketing Agency Owner",
      description:
        "Builds marketing strategies, manages client growth campaigns, and plans paid advertising across social platforms."
    },
    {
      id: "web-developer",
      title: "Web Developer",
      description:
        "Creates fast, responsive websites designed for trust, conversion, SEO, and business credibility."
    },
    {
      id: "family-business",
      title: "Family Business Management",
      description:
        "Supports real business operations, customer management, growth planning, and day-to-day execution in a high-turnover family business."
    }
  ],
  agencyStatus: {
    activeProjects: "3 active marketing and web projects",
    teamMembers: "Founder-led team with flexible collaborators",
    latestAchievements:
      "Built business-focused campaigns, websites, and growth systems for local brands.",
    businessUpdates:
      "Open to new clients, recruiter conversations, and performance marketing opportunities.",
    announcements:
      "Now accepting projects in social media marketing, paid advertising, and website development.",
    updatedAt: new Date().toISOString()
  },
  employees: [
    {
      id: "sandip",
      name: "Sandip Poudel",
      role: "Founder and Digital Marketing Lead",
      bio: "Leads strategy, campaign planning, website delivery, and business growth execution."
    }
  ],
  projects: [
    {
      id: "social-growth",
      title: "Social Growth Campaigns",
      category: "Performance Marketing",
      description:
        "Meta Ads and social media growth systems designed to attract leads, improve visibility, and convert attention into business."
    },
    {
      id: "business-website",
      title: "Business Website Development",
      category: "Web Development",
      description:
        "Responsive websites for businesses that need a credible digital presence, clear messaging, and fast loading pages."
    }
  ],
  testimonials: [
    {
      id: "client-ready",
      name: "Client Ready",
      role: "Digital Marketing",
      quote:
        "A professional, business-minded approach to growth, advertising, and online presence."
    }
  ]
};
