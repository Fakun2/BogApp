import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PracticeAreaTemplateDto } from "./practice-area-templates.schemas";
import { PracticeAreaTemplatesService } from "./practice-area-templates.service";

@ApiTags("practice-area-templates")
@ApiBearerAuth()
@Controller("practice-area-templates")
@UseGuards(JwtAuthGuard)
export class PracticeAreaTemplatesController {
  constructor(private readonly practiceAreaTemplatesService: PracticeAreaTemplatesService) {}

  @Get()
  @ApiOkResponse({ type: [PracticeAreaTemplateDto] })
  list() {
    return this.practiceAreaTemplatesService.listActive();
  }
}
