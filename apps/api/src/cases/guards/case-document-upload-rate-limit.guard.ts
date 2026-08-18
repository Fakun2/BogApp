import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { AuthenticatedRequest } from "../../auth/auth.types";
import { getPositiveIntegerConfig } from "./upload-rate-limit-config";

type UploadRateLimitEntry = {
  count: number;
  resetAt: number;
};

const uploadCounters = new Map<string, UploadRateLimitEntry>();
const defaultUploadLimit = 5;
const defaultUploadWindowMs = 60_000;

@Injectable()
export class CaseDocumentUploadRateLimitGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const tenantId = request.activeTenantId;
    const userId = request.user?.sub;

    if (!tenantId || !userId) {
      return false;
    }

    const now = Date.now();
    const limit = this.getLimit();
    const windowMs = this.getWindowMs();
    const key = `${tenantId}:${userId}`;
    const current = uploadCounters.get(key);
    const entry =
      current && current.resetAt > now ? current : { count: 0, resetAt: now + windowMs };

    entry.count += 1;
    uploadCounters.set(key, entry);

    if (entry.count > limit) {
      throw new HttpException(
        {
          message: `Puedes subir hasta ${limit} documentos por minuto.`,
          statusCode: HttpStatus.TOO_MANY_REQUESTS
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    cleanupExpiredCounters(now);
    return true;
  }

  private getLimit() {
    return getPositiveIntegerConfig(
      this.config,
      "DOCUMENT_UPLOAD_RATE_LIMIT_MAX",
      defaultUploadLimit
    );
  }

  private getWindowMs() {
    return getPositiveIntegerConfig(
      this.config,
      "DOCUMENT_UPLOAD_RATE_LIMIT_WINDOW_MS",
      defaultUploadWindowMs
    );
  }
}

function cleanupExpiredCounters(now: number) {
  if (uploadCounters.size < 1_000) {
    return;
  }

  for (const [key, entry] of uploadCounters.entries()) {
    if (entry.resetAt <= now) {
      uploadCounters.delete(key);
    }
  }
}
