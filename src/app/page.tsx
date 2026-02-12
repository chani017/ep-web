import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import SidePanel from "@/components/SidePanel";

const CV_QUERY = `{
  "selExhs": *[_type == "selExhs"] | order(date desc),
  "awards": *[_type in ["award", "awards"]] | order(date desc),
  "clients": array::unique(*[_type == "post" && defined(client)].client) | order(@ asc)
}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const data = await client.fetch<{
    selExhs: SanityDocument[];
    awards: SanityDocument[];
    clients: string[];
  }>(CV_QUERY, {}, options);

  return (
    <SidePanel
      selExhs={data.selExhs}
      award={data.awards}
      clients={data.clients}
    />
  );
}
