export type JwtTenantAccess = {
  tenantId: string;
  role: string;
  permissions: string[];
};

export type JwtPayload = {
  sub: string;
  email: string;
  tenantAccess: JwtTenantAccess[];
};

export type AuthenticatedRequest = {
  user?: JwtPayload;
  activeTenantId?: string;
};
