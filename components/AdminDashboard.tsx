"use client";

import {
  BriefcaseBusiness,
  Camera,
  ExternalLink,
  LogOut,
  Plus,
  Save,
  Trash2,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type {
  Employee,
  PortfolioProject,
  SiteContent,
  SocialLink,
  Testimonial
} from "@/lib/types";

type Tab = "profile" | "status" | "employees" | "projects" | "testimonials" | "socials";

const tabs: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "status", label: "Status" },
  { id: "employees", label: "Employees" },
  { id: "projects", label: "Projects" },
  { id: "testimonials", label: "Testimonials" },
  { id: "socials", label: "Social Links" }
];

function createId() {
  return crypto.randomUUID();
}

function readImage(file: File, callback: (value: string) => void) {
  const reader = new FileReader();
  reader.onload = () => callback(String(reader.result));
  reader.readAsDataURL(file);
}

export default function AdminDashboard() {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetch("/api/content", { cache: "no-store" })
      .then((response) => response.json())
      .then(setContent);
  }, [router]);

  async function save() {
    if (!content) return;
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`
      },
      body: JSON.stringify(content)
    });

    setSaving(false);

    if (response.status === 401) {
      localStorage.removeItem("adminToken");
      router.push("/admin/login");
      return;
    }

    if (!response.ok) {
      setMessage("Could not save changes. Please try again.");
      return;
    }

    setContent(await response.json());
    setMessage("Saved. The public website will refresh automatically.");
  }

  function logout() {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  }

  if (!content) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--bg)] text-[var(--text)]">
        <p className="font-semibold text-[var(--muted)]">Loading dashboard...</p>
      </main>
    );
  }

  const updateProfile = (field: keyof SiteContent["profile"], value: string | string[]) =>
    setContent({
      ...content,
      profile: { ...content.profile, [field]: value }
    });

  const updateStatus = (field: keyof SiteContent["agencyStatus"], value: string) =>
    setContent({
      ...content,
      agencyStatus: { ...content.agencyStatus, [field]: value }
    });

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg-soft)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="eyebrow">Admin Dashboard</p>
            <h1 className="text-2xl font-black">Agency Content Manager</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <a className="secondary-button" href="/" target="_blank">
              <ExternalLink size={18} />
              View Site
            </a>
            <button className="primary-button" disabled={saving} onClick={save}>
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button className="icon-button" onClick={logout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="admin-sidebar">
          {tabs.map((tab) => (
            <button
              className={activeTab === tab.id ? "active" : ""}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          <div className="dashboard-mini">
            <BriefcaseBusiness size={20} />
            <strong>{content.agencyStatus.activeProjects}</strong>
            <span>Current projects</span>
          </div>
          <div className="dashboard-mini">
            <Users size={20} />
            <strong>{content.agencyStatus.teamMembers}</strong>
            <span>Team status</span>
          </div>
        </aside>

        <section className="admin-panel">
          {message && <p className="save-message">{message}</p>}

          {activeTab === "profile" && (
            <div className="admin-section">
              <SectionTitle
                eyebrow="Public Profile"
                title="Hero, about, contact, and skills"
              />
              <div className="form-grid">
                <label>
                  Name
                  <input
                    value={content.profile.name}
                    onChange={(event) => updateProfile("name", event.target.value)}
                  />
                </label>
                <label>
                  Title
                  <input
                    value={content.profile.title}
                    onChange={(event) => updateProfile("title", event.target.value)}
                  />
                </label>
                <label>
                  Email
                  <input
                    value={content.profile.email}
                    onChange={(event) => updateProfile("email", event.target.value)}
                  />
                </label>
                <label>
                  Phone
                  <input
                    value={content.profile.phone}
                    onChange={(event) => updateProfile("phone", event.target.value)}
                  />
                </label>
                <label>
                  WhatsApp Number
                  <input
                    value={content.profile.whatsapp}
                    onChange={(event) => updateProfile("whatsapp", event.target.value)}
                  />
                </label>
                <label>
                  Profile Photo
                  <span className="file-field">
                    <Camera size={18} />
                    Upload photo
                    <input
                      accept="image/*"
                      type="file"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) readImage(file, (value) => updateProfile("photoUrl", value));
                      }}
                    />
                  </span>
                </label>
              </div>
              <label>
                Short Introduction
                <textarea
                  rows={7}
                  value={content.profile.intro.join("\n")}
                  onChange={(event) =>
                    updateProfile(
                      "intro",
                      event.target.value.split("\n").filter(Boolean)
                    )
                  }
                />
              </label>
              <label>
                About Me
                <textarea
                  rows={7}
                  value={content.profile.about}
                  onChange={(event) => updateProfile("about", event.target.value)}
                />
              </label>
              <label>
                Skills
                <textarea
                  rows={5}
                  value={content.skills.join("\n")}
                  onChange={(event) =>
                    setContent({
                      ...content,
                      skills: event.target.value.split("\n").filter(Boolean)
                    })
                  }
                />
              </label>
            </div>
          )}

          {activeTab === "status" && (
            <div className="admin-section">
              <SectionTitle
                eyebrow="Current Agency Status"
                title="Live updates shown on the portfolio"
              />
              <div className="form-grid">
                <label>
                  Active Projects
                  <input
                    value={content.agencyStatus.activeProjects}
                    onChange={(event) => updateStatus("activeProjects", event.target.value)}
                  />
                </label>
                <label>
                  Team Members
                  <input
                    value={content.agencyStatus.teamMembers}
                    onChange={(event) => updateStatus("teamMembers", event.target.value)}
                  />
                </label>
              </div>
              <label>
                Latest Achievements
                <textarea
                  rows={4}
                  value={content.agencyStatus.latestAchievements}
                  onChange={(event) =>
                    updateStatus("latestAchievements", event.target.value)
                  }
                />
              </label>
              <label>
                Business Updates
                <textarea
                  rows={4}
                  value={content.agencyStatus.businessUpdates}
                  onChange={(event) =>
                    updateStatus("businessUpdates", event.target.value)
                  }
                />
              </label>
              <label>
                Announcements
                <textarea
                  rows={4}
                  value={content.agencyStatus.announcements}
                  onChange={(event) => updateStatus("announcements", event.target.value)}
                />
              </label>
            </div>
          )}

          {activeTab === "employees" && (
            <CollectionEditor
              items={content.employees}
              title="Employees"
              eyebrow="Team"
              addLabel="Add Employee"
              onAdd={() =>
                setContent({
                  ...content,
                  employees: [
                    ...content.employees,
                    { id: createId(), name: "", role: "", bio: "" }
                  ]
                })
              }
              render={(employee, index) => (
                <EmployeeEditor
                  employee={employee}
                  onDelete={() =>
                    setContent({
                      ...content,
                      employees: content.employees.filter((item) => item.id !== employee.id)
                    })
                  }
                  onUpdate={(next) => {
                    const employees = [...content.employees];
                    employees[index] = next;
                    setContent({ ...content, employees });
                  }}
                />
              )}
            />
          )}

          {activeTab === "projects" && (
            <CollectionEditor
              items={content.projects}
              title="Portfolio Projects"
              eyebrow="Work"
              addLabel="Add Project"
              onAdd={() =>
                setContent({
                  ...content,
                  projects: [
                    ...content.projects,
                    {
                      id: createId(),
                      title: "",
                      category: "",
                      description: "",
                      link: ""
                    }
                  ]
                })
              }
              render={(project, index) => (
                <ProjectEditor
                  project={project}
                  onDelete={() =>
                    setContent({
                      ...content,
                      projects: content.projects.filter((item) => item.id !== project.id)
                    })
                  }
                  onUpdate={(next) => {
                    const projects = [...content.projects];
                    projects[index] = next;
                    setContent({ ...content, projects });
                  }}
                />
              )}
            />
          )}

          {activeTab === "testimonials" && (
            <CollectionEditor
              items={content.testimonials}
              title="Testimonials"
              eyebrow="Trust"
              addLabel="Add Testimonial"
              onAdd={() =>
                setContent({
                  ...content,
                  testimonials: [
                    ...content.testimonials,
                    { id: createId(), name: "", role: "", quote: "" }
                  ]
                })
              }
              render={(testimonial, index) => (
                <TestimonialEditor
                  testimonial={testimonial}
                  onDelete={() =>
                    setContent({
                      ...content,
                      testimonials: content.testimonials.filter(
                        (item) => item.id !== testimonial.id
                      )
                    })
                  }
                  onUpdate={(next) => {
                    const testimonials = [...content.testimonials];
                    testimonials[index] = next;
                    setContent({ ...content, testimonials });
                  }}
                />
              )}
            />
          )}

          {activeTab === "socials" && (
            <CollectionEditor
              items={content.socials}
              title="Social Media Links"
              eyebrow="Socials"
              addLabel="Add Link"
              onAdd={() =>
                setContent({
                  ...content,
                  socials: [...content.socials, { id: createId(), label: "", url: "" }]
                })
              }
              render={(link, index) => (
                <SocialEditor
                  link={link}
                  onDelete={() =>
                    setContent({
                      ...content,
                      socials: content.socials.filter((item) => item.id !== link.id)
                    })
                  }
                  onUpdate={(next) => {
                    const socials = [...content.socials];
                    socials[index] = next;
                    setContent({ ...content, socials });
                  }}
                />
              )}
            />
          )}
        </section>
      </div>
    </main>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-heading !mb-8">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

function CollectionEditor<T>({
  eyebrow,
  title,
  addLabel,
  items,
  render,
  onAdd
}: {
  eyebrow: string;
  title: string;
  addLabel: string;
  items: T[];
  render: (item: T, index: number) => React.ReactNode;
  onAdd: () => void;
}) {
  return (
    <div className="admin-section">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionTitle eyebrow={eyebrow} title={title} />
        <button className="secondary-button" onClick={onAdd}>
          <Plus size={18} />
          {addLabel}
        </button>
      </div>
      <div className="editor-list">
        {items.map((item, index) => (
          <div key={(item as { id?: string }).id || index}>{render(item, index)}</div>
        ))}
      </div>
    </div>
  );
}

function EmployeeEditor({
  employee,
  onUpdate,
  onDelete
}: {
  employee: Employee;
  onUpdate: (employee: Employee) => void;
  onDelete: () => void;
}) {
  return (
    <article className="editor-card">
      <div className="form-grid">
        <label>
          Employee Name
          <input
            value={employee.name}
            onChange={(event) => onUpdate({ ...employee, name: event.target.value })}
          />
        </label>
        <label>
          Role
          <input
            value={employee.role}
            onChange={(event) => onUpdate({ ...employee, role: event.target.value })}
          />
        </label>
      </div>
      <label>
        Bio
        <textarea
          rows={4}
          value={employee.bio}
          onChange={(event) => onUpdate({ ...employee, bio: event.target.value })}
        />
      </label>
      <EditorActions
        onDelete={onDelete}
        onUpload={(value) => onUpdate({ ...employee, photoUrl: value })}
      />
    </article>
  );
}

function ProjectEditor({
  project,
  onUpdate,
  onDelete
}: {
  project: PortfolioProject;
  onUpdate: (project: PortfolioProject) => void;
  onDelete: () => void;
}) {
  return (
    <article className="editor-card">
      <div className="form-grid">
        <label>
          Project Title
          <input
            value={project.title}
            onChange={(event) => onUpdate({ ...project, title: event.target.value })}
          />
        </label>
        <label>
          Category
          <input
            value={project.category}
            onChange={(event) => onUpdate({ ...project, category: event.target.value })}
          />
        </label>
        <label>
          Project Link
          <input
            value={project.link || ""}
            onChange={(event) => onUpdate({ ...project, link: event.target.value })}
          />
        </label>
      </div>
      <label>
        Description
        <textarea
          rows={4}
          value={project.description}
          onChange={(event) =>
            onUpdate({ ...project, description: event.target.value })
          }
        />
      </label>
      <EditorActions
        onDelete={onDelete}
        onUpload={(value) => onUpdate({ ...project, imageUrl: value })}
      />
    </article>
  );
}

function TestimonialEditor({
  testimonial,
  onUpdate,
  onDelete
}: {
  testimonial: Testimonial;
  onUpdate: (testimonial: Testimonial) => void;
  onDelete: () => void;
}) {
  return (
    <article className="editor-card">
      <div className="form-grid">
        <label>
          Name
          <input
            value={testimonial.name}
            onChange={(event) =>
              onUpdate({ ...testimonial, name: event.target.value })
            }
          />
        </label>
        <label>
          Role
          <input
            value={testimonial.role}
            onChange={(event) =>
              onUpdate({ ...testimonial, role: event.target.value })
            }
          />
        </label>
      </div>
      <label>
        Quote
        <textarea
          rows={4}
          value={testimonial.quote}
          onChange={(event) =>
            onUpdate({ ...testimonial, quote: event.target.value })
          }
        />
      </label>
      <button className="danger-button" onClick={onDelete}>
        <Trash2 size={18} />
        Delete
      </button>
    </article>
  );
}

function SocialEditor({
  link,
  onUpdate,
  onDelete
}: {
  link: SocialLink;
  onUpdate: (link: SocialLink) => void;
  onDelete: () => void;
}) {
  return (
    <article className="editor-card">
      <div className="form-grid">
        <label>
          Label
          <input
            value={link.label}
            onChange={(event) => onUpdate({ ...link, label: event.target.value })}
          />
        </label>
        <label>
          URL
          <input
            value={link.url}
            onChange={(event) => onUpdate({ ...link, url: event.target.value })}
          />
        </label>
      </div>
      <button className="danger-button" onClick={onDelete}>
        <Trash2 size={18} />
        Delete
      </button>
    </article>
  );
}

function EditorActions({
  onDelete,
  onUpload
}: {
  onDelete: () => void;
  onUpload: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <label className="file-field">
        <Camera size={18} />
        Upload image
        <input
          accept="image/*"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) readImage(file, onUpload);
          }}
        />
      </label>
      <button className="danger-button" onClick={onDelete}>
        <Trash2 size={18} />
        Delete
      </button>
    </div>
  );
}
