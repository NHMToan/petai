import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PrismaClient, type Prisma } from "@prisma/client";

type ProductPayload = {
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  description: string;
  longDescription: string;
  price: number;
  heroImage: string;
  imageKey: string | null;
  gallery: Prisma.InputJsonValue;
  specs: Prisma.InputJsonValue;
  category: string;
  badge: string;
};

const prisma = new PrismaClient();

async function main() {
  const inputPath = resolve(process.cwd(), process.env.IMPORT_PATH ?? "products-export.json");
  const raw = await readFile(inputPath, "utf8");
  const products = JSON.parse(raw) as ProductPayload[];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        tagline: product.tagline,
        shortDescription: product.shortDescription,
        description: product.description,
        longDescription: product.longDescription,
        price: product.price,
        heroImage: product.heroImage,
        imageKey: product.imageKey,
        gallery: product.gallery,
        specs: product.specs,
        category: product.category,
        badge: product.badge,
      },
      create: {
        name: product.name,
        slug: product.slug,
        tagline: product.tagline,
        shortDescription: product.shortDescription,
        description: product.description,
        longDescription: product.longDescription,
        price: product.price,
        heroImage: product.heroImage,
        imageKey: product.imageKey,
        gallery: product.gallery,
        specs: product.specs,
        category: product.category,
        badge: product.badge,
      },
    });
  }

  console.log(`Imported ${products.length} product(s) from ${inputPath}`);
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
