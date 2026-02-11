import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import PostDetail from "@/components/PostDetail";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  ...,
  media[] {
    ...,
    _type == "mux.video" => {
      asset-> {
        playbackId
      }
    }
  }
}`;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, await params, options);

  if (!post) {
    return (
      <div className="p-4 text-system-gray font-ep-sans">
        Post not found.
      </div>
    );
  }

  return <PostDetail post={post} />;
}