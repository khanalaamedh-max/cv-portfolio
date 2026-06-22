import { getContent } from "@/lib/content-store";
import { defaultContent } from "@/lib/default-content";
import PublicPortfolio from "@/components/PublicPortfolio";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent().catch((error) => {
    console.error("Failed to load site content:", error);
    return defaultContent;
  });

  return <PublicPortfolio initialContent={content} />;
}
