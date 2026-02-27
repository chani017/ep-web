import { createClient } from "next-sanity";

const client = createClient({
  projectId: "f7s9b9q3",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function run() {
  const data = await client.fetch(`*[_type == "post" && defined(media)][0...1]{
    media
  }`);
  console.log(JSON.stringify(data, null, 2));
}
run();
