import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "f7s9b9q3",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});