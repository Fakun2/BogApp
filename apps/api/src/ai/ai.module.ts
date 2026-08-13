import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PermissionsGuard } from "../auth/permissions.guard";
import { DatabaseModule } from "../database/database.module";
import { TenancyModule } from "../tenancy/tenancy.module";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { AiAuditService } from "./audit/ai-audit.service";
import { AiContextService } from "./context/ai-context.service";
import { AiPolicyService } from "./policies/ai-policy.service";
import { AiPromptBuilderService } from "./prompts/ai-prompt-builder.service";
import { AiProviderService } from "./providers/ai-provider.service";

@Module({
  imports: [AuthModule, DatabaseModule, TenancyModule],
  controllers: [AiController],
  providers: [
    AiService,
    AiAuditService,
    AiContextService,
    AiPolicyService,
    AiPromptBuilderService,
    AiProviderService,
    PermissionsGuard
  ]
})
export class AiModule {}
