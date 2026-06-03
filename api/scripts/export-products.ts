import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const outputPath = resolve(process.cwd(), process.env.EXPORT_PATH ?? "products-export.json");

  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(products, null, 2), "utf8");

  console.log(`Exported ${products.length} product(s) to ${outputPath}`);
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
