import { createClient } from "next-sanity";

const client = createClient({
  projectId: "f7s9b9q3",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function run() {
  const data = await client.fetch(`*[_type == "post" && defined(thumbnail.video)][0]{
    thumbnail
  }`);
  console.log(JSON.stringify(data, null, 2));
}
run();
