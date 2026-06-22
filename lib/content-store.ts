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
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000
    });
    await cachedClient.connect();
  }

  return cachedClient
    .db(process.env.MONGODB_DB || "cvportfolio")
    .collection("site_content");
}

async function getCollectionSafely() {
  try {
    return await getCollection();
  } catch (error) {
    cachedClient = null;
    console.error("MongoDB connection failed:", error);
    return null;
  }
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
  const collection = await getCollectionSafely();
  if (collection) {
    try {
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
    } catch (error) {
      console.error("MongoDB content read failed:", error);
      if (!canUseLocalFileStore()) {
        return defaultContent;
      }
    }
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

  let collection = null;
  try {
    collection = await getCollection();
  } catch (error) {
    cachedClient = null;
    console.error("MongoDB connection failed:", error);
    throw new Error(
      "MongoDB connection failed. Check MONGODB_URI, database user password, and Atlas Network Access."
    );
  }

  if (collection) {
    try {
      await collection.updateOne(
        { key: contentKey },
        { $set: { key: contentKey, content: nextContent } },
        { upsert: true }
      );
      return nextContent;
    } catch (error) {
      cachedClient = null;
      console.error("MongoDB content save failed:", error);
      throw new Error(
        "MongoDB connection failed. Check MONGODB_URI, database user password, and Atlas Network Access."
      );
    }
  }

  if (!canUseLocalFileStore()) {
    throw new Error("MONGODB_URI is required to save admin content in production.");
  }

  await fs.mkdir(path.dirname(jsonPath), { recursive: true });
  await fs.writeFile(jsonPath, JSON.stringify(nextContent, null, 2));
  return nextContent;
}
