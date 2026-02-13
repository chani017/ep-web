import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import SidePanel from "@/components/SidePanel";

const CV_QUERY = `{
  "exhibition": *[_type == "exhibition"] | order(date desc),
  "awards": *[_type == "award"] | order(date desc),
  "clients": array::unique(*[_type == "post" && defined(client)].client) | order(@ asc)
}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const data = await client.fetch<{
    exhibition: SanityDocument[];
    awards: SanityDocument[];
    clients: string[];
  }>(CV_QUERY, {}, options);

  const exhibitionWithCategory = data.exhibition.map((item) => ({
    ...item,
    category: "Selected Exhibitions",
  }));

  const awardsWithCategory = data.awards.map((item) => ({
    ...item,
    category: "Award",
  }));

  const sortedClients = data.clients.sort((a, b) => {
    // Check if the string starts with a Korean character
    const aIsKorean = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(a);
    const bIsKorean = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(b);

    if (aIsKorean && !bIsKorean) return -1;
    if (!aIsKorean && bIsKorean) return 1;

    // Default sort for same-group items (Korean-Korean or English-English)
    return a.localeCompare(b, "en", { sensitivity: "base" });
  });

  return (
    <SidePanel
      exhibition={exhibitionWithCategory}
      award={awardsWithCategory}
      clients={sortedClients}
    />
  );
}
