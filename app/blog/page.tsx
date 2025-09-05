import posts from "../../content/posts/index.json";
import BlogClient from "./blog-client";

type Search = { [key: string]: string | string[] | undefined };

export default function BlogPage({ searchParams }: { searchParams?: Search }) {
  const typeRaw = (searchParams?.type as string | undefined)?.toLowerCase();
  const initialType = typeRaw === "research" || typeRaw === "announcements" ? typeRaw : "blog";
  return <BlogClient initialType={initialType} posts={posts as any} />;
}