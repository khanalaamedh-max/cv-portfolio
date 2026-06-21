import { getContent } from "@/lib/content-store";
import PublicPortfolio from "@/components/PublicPortfolio";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();
  return <PublicPortfolio initialContent={content} />;
}
