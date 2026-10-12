import { ArticleFeed } from "@/components/ArticleFeed";
import { ArticlesClient } from "./ArticlesClient";

export const revalidate = 3600;

export default function ArticlesPage() {
  return (
    <ArticlesClient>
      <ArticleFeed />
    </ArticlesClient>
  );
}
