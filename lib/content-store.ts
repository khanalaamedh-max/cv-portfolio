import { promises as fs } from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { defaultContent } from "./default-content";
import type { SiteContent } from "./types";

const contentKey = "sandip-poudel-site";
const jsonPath = path.join(process.cwd(), "data", "content.json");

let cachedClient: MongoClient | null = null;

function canUseLocalFileStore() {
  return process.env.NODE_ENV !== "production";
}

async function getCollection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }

  return cachedClient.db().collection("site_content");
}

function normalize(content: SiteContent): SiteContent {
  return {
    ...defaultContent,
    ...content,
    profile: { ...defaultContent.profile, ...content.profile },
    agencyStatus: { ...defaultContent.agencyStatus, ...content.agencyStatus },
    skills: content.skills?.length ? content.skills : defaultContent.skills,
    socials: content.socials?.length ? content.socials : defaultContent.socials,
    experience: content.experience?.length
      ? content.experience
      : defaultContent.experience,
    employees: content.employees || defaultContent.employees,
    projects: content.projects || defaultContent.projects,
    testimonials: content.testimonials || defaultContent.testimonials
  };
}

export async function getContent(): Promise<SiteContent> {
  const collection = await getCollection();
  if (collection) {
    const record = await collection.findOne<{ content: SiteContent }>({
      key: contentKey
    });
    if (record?.content) {
      return normalize(record.content);
    }
    await collection.updateOne(
      { key: contentKey },
      { $set: { key: contentKey, content: defaultContent } },
      { upsert: true }
    );
    return defaultContent;
  }

  if (!canUseLocalFileStore()) {
    return defaultContent;
  }

  try {
    const file = await fs.readFile(jsonPath, "utf8");
    return normalize(JSON.parse(file));
  } catch {
    await fs.mkdir(path.dirname(jsonPath), { recursive: true });
    await fs.writeFile(jsonPath, JSON.stringify(defaultContent, null, 2));
    return defaultContent;
  }
}

export async function saveContent(content: SiteContent) {
  const nextContent = normalize({
    ...content,
    agencyStatus: {
      ...content.agencyStatus,
      updatedAt: new Date().toISOString()
    }
  });

  const collection = await getCollection();
  if (collection) {
    await collection.updateOne(
      { key: contentKey },
      { $set: { key: contentKey, content: nextContent } },
      { upsert: true }
    );
    return nextContent;
  }

  if (!canUseLocalFileStore()) {
    throw new Error("MONGODB_URI is required to save admin content in production.");
  }

  await fs.mkdir(path.dirname(jsonPath), { recursive: true });
  await fs.writeFile(jsonPath, JSON.stringify(nextContent, null, 2));
  return nextContent;
}
