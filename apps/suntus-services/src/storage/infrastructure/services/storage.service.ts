import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { UploadFileDto, SignedUrlOptions } from '../../domain/interfaces/storage.interface';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly storage: Storage | null;
  private readonly publicBucket: string;
  private readonly privateBucket: string;

  constructor(private readonly configService: ConfigService) {
    // Inicializar cliente de GCS solo si hay configuración
    const projectId = this.configService.get<string>('GCS_PROJECT_ID');
    const keyFilename = this.configService.get<string>('GCS_KEY_FILENAME');

    if (projectId || keyFilename) {
      this.storage = new Storage({
        projectId,
        keyFilename,
      });
    } else {
      // En desarrollo sin GCS configurado, crear un mock storage
      // Esto permitirá que el servicio compile pero lanzará error si se intenta usar
      this.storage = null;
      this.logger.warn('GCS no configurado - StorageService no funcionará hasta configurar GCS_PROJECT_ID o GCS_KEY_FILENAME');
    }

    this.publicBucket = this.configService.get<string>('GCS_PUBLIC_BUCKET', 'suntus-public');
    this.privateBucket = this.configService.get<string>('GCS_PRIVATE_BUCKET', 'suntus-private');
  }

  /**
   * Subir archivo al bucket público
   */
  async uploadPublicFile(dto: UploadFileDto): Promise<string> {
    if (!this.storage) {
      throw new Error('GCS no configurado. Configure GCS_PROJECT_ID o GCS_KEY_FILENAME');
    }
    const bucket = this.storage.bucket(this.publicBucket);
    const filePath = dto.folder
      ? `${dto.folder}/${dto.fileName}`
      : dto.fileName;

    const file = bucket.file(filePath);

    await file.save(dto.file, {
      metadata: {
        contentType: dto.contentType,
      },
      public: true, // Hacer público
    });

    // Retornar URL pública
    return `https://storage.googleapis.com/${this.publicBucket}/${filePath}`;
  }

  /**
   * Subir documento privado (solo experto puede subir, admin puede acceder)
   */
  async uploadPrivateDocument(
    dto: UploadFileDto,
    expertId: string,
  ): Promise<string> {
    if (!this.storage) {
      throw new Error('GCS no configurado. Configure GCS_PROJECT_ID o GCS_KEY_FILENAME');
    }
    const bucket = this.storage.bucket(this.privateBucket);
    const filePath = `experts/${expertId}/documents/${dto.fileName}`;

    const file = bucket.file(filePath);

    await file.save(dto.file, {
      metadata: {
        contentType: dto.contentType,
      },
      // NO hacer público - solo accesible con Signed URL
    });

    // Retornar path (NO URL pública)
    return filePath;
  }

  /**
   * Generar Signed URL temporal para documento privado (solo admin)
   */
  async getPrivateDocumentUrl(
    filePath: string,
    userRole: 'admin' | 'expert' | 'user',
    options?: SignedUrlOptions,
  ): Promise<string> {
    if (!this.storage) {
      throw new Error('GCS no configurado. Configure GCS_PROJECT_ID o GCS_KEY_FILENAME');
    }
    // Validar que solo admin puede acceder
    if (userRole !== 'admin') {
      throw new ForbiddenException(
        'Unauthorized: Solo admin puede acceder a documentos privados',
      );
    }

    const bucket = this.storage.bucket(this.privateBucket);
    const file = bucket.file(filePath);

    // Verificar que el archivo existe
    const [exists] = await file.exists();
    if (!exists) {
      throw new ForbiddenException('Archivo no encontrado');
    }

    // Generar Signed URL válida por 15 minutos (default)
    const expiresIn = options?.expiresIn || 15 * 60; // 15 minutos
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresIn * 1000,
    });

    return url;
  }

  /**
   * Eliminar archivo del bucket público
   */
  async deletePublicFile(filePath: string): Promise<void> {
    if (!this.storage) {
      throw new Error('GCS no configurado. Configure GCS_PROJECT_ID o GCS_KEY_FILENAME');
    }
    const bucket = this.storage.bucket(this.publicBucket);
    const file = bucket.file(filePath);
    await file.delete();
  }

  /**
   * Eliminar documento privado (solo admin)
   */
  async deletePrivateDocument(
    filePath: string,
    userRole: 'admin' | 'expert' | 'user',
  ): Promise<void> {
    if (!this.storage) {
      throw new Error('GCS no configurado. Configure GCS_PROJECT_ID o GCS_KEY_FILENAME');
    }
    if (userRole !== 'admin') {
      throw new ForbiddenException(
        'Unauthorized: Solo admin puede eliminar documentos privados',
      );
    }

    const bucket = this.storage.bucket(this.privateBucket);
    const file = bucket.file(filePath);
    await file.delete();
  }
}

