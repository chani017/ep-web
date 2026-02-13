import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import PostContent from "@/components/post/PostContent";
import { notFound } from "next/navigation";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const options = { next: { revalidate: 30 } };

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    { slug },
    options,
  );

  if (!post) {
    notFound();
  }

  return <PostContent post={post} />;
}
