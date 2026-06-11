import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthenticatedRequest } from "../auth/auth.types";

type RequestWithHeaders = AuthenticatedRequest & {
  headers: Record<string, string | string[] | undefined>;
};

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithHeaders>();
    const rawTenantId = request.headers["x-tenant-id"];
    const tenantId = Array.isArray(rawTenantId) ? rawTenantId[0] : rawTenantId;

    if (!tenantId) {
      return false;
    }

    request.activeTenantId = tenantId;
    return true;
  }
}
