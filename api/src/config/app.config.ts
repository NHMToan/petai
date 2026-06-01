import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  port: parseInt(process.env.PORT ?? "3000", 10),
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@petai.io",
  adminPassword: process.env.ADMIN_PASSWORD ?? "Admin123!",
  adminName: process.env.ADMIN_NAME ?? "PetAI Admin",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  awsRegion: process.env.AWS_REGION ?? "",
  awsS3Bucket: process.env.AWS_S3_BUCKET ?? "",
  awsS3PublicBaseUrl: process.env.AWS_S3_PUBLIC_BASE_URL ?? "",
}));
