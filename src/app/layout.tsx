import type { Metadata } from "next";
import "./globals.css";
import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import { AppProvider } from "@/context/AppContext";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "일상의실천",
  description: "일상의실천",
};

const POSTS_QUERY = `*[
  _type == "post"
] | order(orderRank asc)[0...2000] {
  _id,
  title_kr,
  title_en,
  slug,
  year,
  client,
  category,
  "imageUrl": select(
    thumbnail.type == "image" => thumbnail.image.asset->url,
    thumbnail.type == "video" => thumbnail.video.asset->url, // Mux thumbnail image
    images[0].asset->url
  ),
  thumbnail_size,
  "playbackId": thumbnail.video.asset->playbackId
}`;

const options = { next: { revalidate: 30 } };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <html lang="en">
      <body className="antialiased overflow-hidden">
        <AppProvider>
          <ClientLayout posts={posts}>{children}</ClientLayout>
        </AppProvider>
      </body>
    </html>
  );
}
