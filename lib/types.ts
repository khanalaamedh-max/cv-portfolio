export type SocialLink = {
  id: string;
  label: string;
  url: string;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
};

export type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  link?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
};

export type AgencyStatus = {
  activeProjects: string;
  teamMembers: string;
  latestAchievements: string;
  businessUpdates: string;
  announcements: string;
  updatedAt: string;
};

export type SiteContent = {
  profile: {
    name: string;
    title: string;
    intro: string[];
    about: string;
    email: string;
    phone: string;
    whatsapp: string;
    photoUrl?: string;
  };
  skills: string[];
  socials: SocialLink[];
  experience: {
    id: string;
    title: string;
    description: string;
  }[];
  agencyStatus: AgencyStatus;
  employees: Employee[];
  projects: PortfolioProject[];
  testimonials: Testimonial[];
};
