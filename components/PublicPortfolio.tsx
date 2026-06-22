"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Phone,
  Send,
  Sun,
  Target,
  Users,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SiteContent } from "@/lib/types";

type Props = {
  initialContent: SiteContent;
};

const navItems = ["About", "Skills", "Status", "Work", "Contact"];

function socialIcon(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("linkedin")) return <Linkedin size={18} />;
  if (normalized.includes("instagram")) return <Instagram size={18} />;
  if (normalized.includes("github")) return <Github size={18} />;
  return <ArrowUpRight size={18} />;
}

export default function PublicPortfolio({ initialContent }: Props) {
  const [content, setContent] = useState(initialContent);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setDark(shouldUseDark);
    document.documentElement.dataset.theme = shouldUseDark ? "dark" : "light";
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const refresh = async () => {
      const response = await fetch("/api/content", { cache: "no-store" });
      if (response.ok) {
        setContent(await response.json());
      }
    };
    const interval = window.setInterval(refresh, 10000);
    return () => window.clearInterval(interval);
  }, []);

  const whatsappUrl = useMemo(() => {
    const number = content.profile.whatsapp.replace(/[^\d]/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(
      "Hello Sandip, I found your portfolio and would like to connect."
    )}`;
  }, [content.profile.whatsapp]);

  const mailto = useMemo(() => {
    const subject = `Portfolio inquiry from ${form.name || "a visitor"}`;
    const body = `${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`;
    return `mailto:${content.profile.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }, [content.profile.email, form]);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--bg-soft)]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a className="text-sm font-black uppercase tracking-[0.24em]" href="#">
            Sandip Poudel
          </a>
          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
            {navItems.map((item) => (
              <a
                className="text-[var(--muted)] transition hover:text-[var(--text)]"
                href={`#${item.toLowerCase()}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle dark mode"
              className="icon-button"
              onClick={() => setDark((value) => !value)}
              title="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              aria-label="Open menu"
              className="icon-button md:hidden"
              onClick={() => setMenuOpen((value) => !value)}
              title="Menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-[var(--line)] px-4 py-4 md:hidden">
            <div className="mx-auto grid max-w-7xl gap-3">
              {navItems.map((item) => (
                <a
                  className="text-sm font-semibold text-[var(--muted)]"
                  href={`#${item.toLowerCase()}`}
                  key={item}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <section className="section hero-grid min-h-[92vh] pt-28">
        <div className="content-stack animate-rise">
          <p className="eyebrow">Portfolio / CV / Growth Partner</p>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.98] sm:text-7xl lg:text-8xl">
            {content.profile.name}
          </h1>
          <p className="max-w-3xl text-xl font-semibold leading-relaxed text-[var(--muted)] sm:text-2xl">
            {content.profile.title}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {content.profile.intro.map((item) => (
              <div className="fact-line" key={item}>
                <Check size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="primary-button" href="#contact">
              <Mail size={18} />
              Contact Sandip
            </a>
            <a className="secondary-button" href="/admin/login">
              Admin Login
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>

        <div className="profile-stage animate-rise-delay">
          <div className="profile-photo">
            {content.profile.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="Sandip Poudel profile" src={content.profile.photoUrl} />
            ) : (
              <div className="profile-placeholder">
                <span>SP</span>
              </div>
            )}
          </div>
          <div className="profile-stat">
            <Target size={20} />
            <div>
              <strong>Performance focused</strong>
              <span>Social media, paid ads, websites, and business growth</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-y border-[var(--line)] bg-[var(--band)]" id="about">
        <div className="split-layout">
          <div>
            <p className="eyebrow">About Me</p>
            <h2 className="section-title">Digital marketing with real business sense.</h2>
          </div>
          <p className="text-lg leading-8 text-[var(--muted)]">
            {content.profile.about}
          </p>
        </div>
      </section>

      <section className="section" id="skills">
        <div className="section-heading">
          <p className="eyebrow">Skills</p>
          <h2 className="section-title">Capabilities built for measurable growth.</h2>
        </div>
        <div className="skill-grid">
          {content.skills.map((skill) => (
            <div className="skill-pill" key={skill}>
              {skill}
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-[var(--band)]" id="status">
        <div className="section-heading">
          <p className="eyebrow">Current Agency Status</p>
          <h2 className="section-title">Live updates from the agency dashboard.</h2>
        </div>
        <div className="status-grid">
          <StatusItem
            icon={<BriefcaseBusiness size={22} />}
            label="Active Projects"
            value={content.agencyStatus.activeProjects}
          />
          <StatusItem
            icon={<Users size={22} />}
            label="Team Members"
            value={content.agencyStatus.teamMembers}
          />
          <StatusItem
            icon={<Target size={22} />}
            label="Latest Achievements"
            value={content.agencyStatus.latestAchievements}
          />
          <StatusItem
            icon={<Send size={22} />}
            label="Business Updates"
            value={content.agencyStatus.businessUpdates}
          />
        </div>
        <div className="announcement">
          <span>Announcement</span>
          <p>{content.agencyStatus.announcements}</p>
        </div>
      </section>

      <section className="section" id="work">
        <div className="section-heading">
          <p className="eyebrow">Experience</p>
          <h2 className="section-title">Practical work across marketing, websites, and operations.</h2>
        </div>
        <div className="work-grid">
          {content.experience.map((item) => (
            <article className="work-card" key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>

        <div className="section-heading mt-20">
          <p className="eyebrow">Portfolio Projects</p>
          <h2 className="section-title">Selected services and project work.</h2>
        </div>
        <div className="project-grid">
          {content.projects.map((project) => (
            <article className="project-card" key={project.id}>
              {project.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={project.title} src={project.imageUrl} />
              ) : (
                <div className="project-placeholder">{project.category}</div>
              )}
              <div>
                <span>{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {project.link && (
                  <a href={project.link} rel="noreferrer" target="_blank">
                    View project <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section border-y border-[var(--line)] bg-[var(--band)]">
        <div className="section-heading">
          <p className="eyebrow">People and Proof</p>
          <h2 className="section-title">Team, collaborators, and testimonials.</h2>
        </div>
        <div className="people-grid">
          {content.employees.map((employee) => (
            <article className="person-card" key={employee.id}>
              {employee.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={employee.name} src={employee.photoUrl} />
              ) : (
                <div className="avatar">{employee.name.slice(0, 2)}</div>
              )}
              <h3>{employee.name}</h3>
              <span>{employee.role}</span>
              <p>{employee.bio}</p>
            </article>
          ))}
        </div>
        <div className="testimonial-grid">
          {content.testimonials.map((item) => (
            <figure className="quote-card" key={item.id}>
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                {item.name} <span>{item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section" id="contact">
        <div className="contact-layout">
          <div className="content-stack">
            <p className="eyebrow">Contact</p>
            <h2 className="section-title">Available for recruiters, clients, and partners.</h2>
            <div className="contact-links">
              <a href={`mailto:${content.profile.email}`}>
                <Mail size={18} />
                {content.profile.email}
              </a>
              <a href={`tel:${content.profile.phone}`}>
                <Phone size={18} />
                {content.profile.phone}
              </a>
              <a href={whatsappUrl} rel="noreferrer" target="_blank">
                <Send size={18} />
                WhatsApp
              </a>
            </div>
            <div className="flex flex-wrap gap-3">
              {content.socials.map((link) => (
                <a
                  className="social-button"
                  href={link.url}
                  key={link.id}
                  rel="noreferrer"
                  target="_blank"
                >
                  {socialIcon(link.label)}
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={(event) => {
              event.preventDefault();
              window.location.href = mailto;
            }}
          >
            <label>
              Name
              <input
                onChange={(event) =>
                  setForm((value) => ({ ...value, name: event.target.value }))
                }
                required
                value={form.name}
              />
            </label>
            <label>
              Email
              <input
                onChange={(event) =>
                  setForm((value) => ({ ...value, email: event.target.value }))
                }
                required
                type="email"
                value={form.email}
              />
            </label>
            <label>
              Message
              <textarea
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    message: event.target.value
                  }))
                }
                required
                rows={5}
                value={form.message}
              />
            </label>
            <button className="primary-button w-full justify-center" type="submit">
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function StatusItem({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className="status-card">
      {icon}
      <span>{label}</span>
      <p>{value}</p>
    </article>
  );
}
