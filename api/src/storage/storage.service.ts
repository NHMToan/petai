import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { UploadedImageFile } from "./uploaded-image-file.type";

@Injectable()
export class StorageService {
  private readonly bucket: string;
  private readonly publicBaseUrl: string;
  private readonly client: S3Client | null;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>("app.awsS3Bucket", "");
    this.publicBaseUrl = this.configService.get<string>("app.awsS3PublicBaseUrl", "");
    const region = this.configService.get<string>("app.awsRegion", "");

    this.client = this.bucket && region ? new S3Client({ region }) : null;
  }

  async uploadPetImage(file: UploadedImageFile, petId: string) {
    return this.uploadImage(file, `pets/${petId}`);
  }

  async uploadUserImage(file: UploadedImageFile, userId: string) {
    return this.uploadImage(file, `users/${userId}`);
  }

  async uploadProductImage(file: UploadedImageFile, productId: string) {
    return this.uploadImage(file, `products/${productId}`);
  }

  private async uploadImage(file: UploadedImageFile, directory: string) {
    if (!this.client || !this.bucket) {
      throw new InternalServerErrorException("S3 storage is not configured");
    }

    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestException("Only image uploads are supported");
    }

    const extension = this.getExtension(file.originalname, file.mimetype);
    const key = `${directory}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
      url: this.publicBaseUrl ? `${this.publicBaseUrl.replace(/\/$/, "")}/${key}` : `https://${this.bucket}.s3.amazonaws.com/${key}`,
    };
  }

  async deleteObject(key?: string | null) {
    if (!this.client || !this.bucket || !key) {
      return;
    }

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async getObject(key: string) {
    if (!this.client || !this.bucket) {
      throw new InternalServerErrorException("S3 storage is not configured");
    }

    const object = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    if (!object.Body) {
      throw new InternalServerErrorException("S3 object did not return a body");
    }

    const bytes = await object.Body.transformToByteArray();

    return {
      buffer: Buffer.from(bytes),
      contentType: object.ContentType ?? "application/octet-stream",
    };
  }

  private getExtension(fileName: string, mimeType: string) {
    const normalized = fileName.split(".").pop()?.toLowerCase();
    if (normalized && normalized.length <= 5) {
      return normalized;
    }

    if (mimeType === "image/png") return "png";
    if (mimeType === "image/webp") return "webp";
    if (mimeType === "image/gif") return "gif";
    return "jpg";
  }
}
