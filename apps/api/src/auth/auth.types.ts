export type JwtTenantAccess = {
  tenantId: string;
  role: string | null;
  permissions: string[];
};

export type JwtPayload = {
  sub: string;
  email: string;
  sessionVersion: number;
  tenantAccess: JwtTenantAccess[];
};

export type AuthenticatedRequest = {
  user?: JwtPayload;
  activeTenantId?: string;
};
