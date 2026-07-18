import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      published: z.coerce.date(), // Date object representing creation date; drives default sort
      status: z.enum(["launched", "beta", "in-development"]),
      blurb: z.string().max(280), // AI-generated, owner-reviewed blurb
      image: image(), // local image resolving through Astro asset pipeline
      imageAlt: z.string().default(""), // alt text description for accessibility
      // Crop focus for the 16:9 card thumbnail: Astro's <Image> cover-crops a
      // non-16:9 master, so a square source loses its top/bottom by default.
      // CSS object-position syntax passed to sharp, e.g. "top" or "center".
      imagePosition: z.string().default("center"),
      links: z.object({
        site: z.url().optional(),
        github: z.url().optional(),
        blog: z.url().optional(),
      }),
    }),
});

export const collections = { projects };
