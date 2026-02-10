import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import SideBar from "@/components/SideBar";

const POSTS_QUERY = `*[
  _type == "post"
] | order(publishedAt desc)[0...10] {
  _id,
  "title": title_kr,
  slug,
  publishedAt
}`;

const CV_QUERY = `*[
  _type in ["selExhs", "selExh", "award", "awards"]
] | order(date asc) {
  _id,
  _type,
  "category": select(
    _type in ["selExhs", "selExh"] => "Selected Exhibitions",
    _type in ["award", "awards"] => "Award"
  ),
  type,
  date,
  title
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

  return <SideBar posts={posts} selExhs={selExhs} award={award} />;
}
