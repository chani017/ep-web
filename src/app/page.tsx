import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import SideBar from "@/components/SideBar";

const POSTS_QUERY = `*[
  _type == "post"
] | order(index desc)[0...20] {
  _id,
  title_kr,
  title_en,
  slug,
  publishedAt,
  client,
  tags,
  "imageUrl": images[0].asset->url,
  "playbackId": thumbnail.asset->playbackId
}`;

const CV_QUERY = `*[
  _type in ["selExhs", "selExh", "award", "awards", "client"]
] | order(date asc) {
  _id,
  _type,
  "category": select(
    _type in ["selExhs", "selExh"] => "Selected Exhibitions",
    _type in ["award", "awards"] => "Award",
    _type == "client" => "Clients"
  ),
  type,
  date,
  title,
  client
}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);
  const cvItems = await client.fetch<SanityDocument[]>(CV_QUERY, {}, options);

  const selExhs = cvItems.filter((item) =>
    ["selExhs", "selExh"].includes(item._type),
  );
  const award = cvItems.filter((item) =>
    ["award", "awards"].includes(item._type),
  );

  const clients = cvItems.filter((item) => ["client"].includes(item._type));

  return (
    <SideBar posts={posts} selExhs={selExhs} award={award} clients={clients} />
  );
}
