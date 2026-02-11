import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import Link from "next/link";
import MuxPlayer from "@mux/mux-player-react";

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

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, await params, options);
  
  const description = post.description_kr || post.description_en;
  const media = post.media || [];

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/" className="hover:underline text-system-gray">
        ← Back to posts
      </Link>
      
      <h1 className="text-4xl font-bold mb-4">{post.title_kr || post.title_en}</h1>
      <div className="text-system-gray mb-4">
        Published: {post.publishedAt} | Client: {post.client}
      </div>

      <div className="prose prose-invert max-w-none mb-12">
        {Array.isArray(description) && (
          <PortableText value={description} />
        )}
      </div>

      <div className="flex flex-col gap-12">
        {media.map((item: any, index: number) => {
          if (item._type === "image") {
            const imgUrl = urlFor(item)?.url();
            return (
              <figure key={item._key || index} className="w-full">
                {imgUrl && (
                  <img
                    src={imgUrl}
                    alt={item.caption || ""}
                    className="w-full rounded-lg"
                  />
                )}
                {item.caption && (
                  <figcaption className="text-center text-sm text-system-gray mt-2">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          if (item._type === "mux.video") {
            const playbackId = item.asset?.playbackId;
            if (!playbackId) return null;
            return (
              <div key={item._key || index} className="w-full rounded-lg overflow-hidden border border-system-gray">
                <MuxPlayer
                  playbackId={playbackId}
                  streamType="on-demand"
                  autoPlay="muted"
                  loop
                  muted
                  style={{ width: "100%", aspectRatio: "16/9" }}
                />
              </div>
            );
          }

          if (item._type === "youtube") {
            const videoId = item.url?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
            if (!videoId) return null;
            return (
              <div key={item._key || index} className="w-full aspect-video rounded-lg overflow-hidden border border-system-gray">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            );
          }

          return null;
        })}
      </div>
    </main>
  );
}