import { PrismaClient, Role, DeviceStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@petai.io";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const adminName = process.env.ADMIN_NAME ?? "PetAI Admin";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {
      name: adminName,
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail.toLowerCase(),
      name: adminName,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const voices = [
    {
      name: "Nova",
      description: "Warm and emotionally responsive primary voice.",
      tone: "Warm",
      locale: "en-US",
      version: "2.4",
      isActive: true,
    },
    {
      name: "Sol",
      description: "Bright and playful voice for energetic companions.",
      tone: "Playful",
      locale: "en-GB",
      version: "2.3",
      isActive: true,
    },
  ];

  for (const voice of voices) {
    await prisma.voice.upsert({
      where: { name: voice.name },
      update: voice,
      create: voice,
    });
  }

  const devices = [
    {
      name: "PetAI Collar Alpha",
      serialNumber: "DV-4021",
      productCode: "PAIR-7781",
      status: DeviceStatus.AVAILABLE,
    },
    {
      name: "PetAI Home Sensor",
      serialNumber: "DV-4022",
      productCode: "PAIR-7782",
      status: DeviceStatus.AVAILABLE,
    },
    {
      name: "PetAI Collar Beta",
      serialNumber: "DV-4023",
      productCode: "PAIR-7783",
      status: DeviceStatus.AVAILABLE,
    },
  ];

  for (const device of devices) {
    await prisma.device.upsert({
      where: { serialNumber: device.serialNumber },
      update: {
        name: device.name,
        productCode: device.productCode,
        status: device.status,
      },
      create: device,
    });
  }

  const seededDevices = await prisma.device.findMany({
    where: {
      serialNumber: {
        in: devices.map((device) => device.serialNumber),
      },
    },
    orderBy: { serialNumber: "asc" },
  });

  const seededVoices = await prisma.voice.findMany({
    where: {
      name: {
        in: voices.map((voice) => voice.name),
      },
    },
    orderBy: { name: "asc" },
  });

  const defaultPets = [
    {
      name: "Collar Alpha",
      species: "Companion",
      breed: "Sentient Collar",
      notes: "Provisioned by admin before customer claim.",
      deviceSerialNumber: "DV-4021",
      voiceName: "Nova",
    },
    {
      name: "Home Sensor",
      species: "Companion",
      breed: "Environment Monitor",
      notes: "Provisioned by admin before customer claim.",
      deviceSerialNumber: "DV-4022",
      voiceName: "Sol",
    },
    {
      name: "Collar Beta",
      species: "Companion",
      breed: "Sentient Collar",
      notes: "Provisioned by admin before customer claim.",
      deviceSerialNumber: "DV-4023",
      voiceName: "Nova",
    },
  ];

  for (const pet of defaultPets) {
    const device = seededDevices.find((entry) => entry.serialNumber === pet.deviceSerialNumber);
    const voice = seededVoices.find((entry) => entry.name === pet.voiceName);
    if (!device) continue;

    const existing = await prisma.pet.findFirst({
      where: { deviceId: device.id },
    });

    if (existing) {
      await prisma.pet.update({
        where: { id: existing.id },
        data: {
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          notes: pet.notes,
          voiceId: voice?.id,
          deviceId: device.id,
        },
      });
      continue;
    }

    await prisma.pet.create({
      data: {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        notes: pet.notes,
        deviceId: device.id,
        voiceId: voice?.id,
      },
    });
  }

  const products = [
    {
      name: "PetAI Bear",
      slug: "petai-bear",
      tagline: "Sentient Arctic Edition",
      shortDescription: "Stoic, protective, and warm. The perfect bedside emotional anchor.",
      description:
        "PetAI Bear is engineered as a calm, grounded companion with a soft arctic shell, heart-lit optics, and tactile neural mesh that responds to presence and tone.",
      longDescription:
        "A premium neural plush companion built for slower evenings, emotional regulation, and always-on comfort. PetAI Bear combines a high-fidelity voice core with proximity, touch, and emotional memory modules so every interaction feels increasingly personal.",
      price: 199,
      heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjDbpDmx2M4XQM3iya-NWl7jO3hu_agfzMLc70eqPvGnzLIFYogmZEsG0C39UaaauTTziVLfcPL5spMQllblo7WbozBLWwW1cgC5TW7pnV6zC5o7HRWqIH7qFt4yqr1wLCzya_wDYeghfKPXRPW2_xAmNqcCIz5l1pScXwrWaW3o38NlsLnHTZAqcteomtjyzZbWgTjT1k_6pfWHl8XlDMjYn8RhiO3Ocin2wxgy8XyuRe2JUofO77s5Cq_s3X7GucMOpjx70mNaBY",
      gallery: ["https://lh3.googleusercontent.com/aida-public/AB6AXuAjDbpDmx2M4XQM3iya-NWl7jO3hu_agfzMLc70eqPvGnzLIFYogmZEsG0C39UaaauTTziVLfcPL5spMQllblo7WbozBLWwW1cgC5TW7pnV6zC5o7HRWqIH7qFt4yqr1wLCzya_wDYeghfKPXRPW2_xAmNqcCIz5l1pScXwrWaW3o38NlsLnHTZAqcteomtjyzZbWgTjT1k_6pfWHl8XlDMjYn8RhiO3Ocin2wxgy8XyuRe2JUofO77s5Cq_s3X7GucMOpjx70mNaBY"],
      specs: [{ icon: "mic", label: "Touch Mesh", value: "Tactile emotional sensing" }],
      category: "Neural Plush",
      badge: "BESTSELLER",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log("Seed complete");
  console.log(`Admin: ${admin.email}`);
  console.log(`Password: ${adminPassword}`);
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
