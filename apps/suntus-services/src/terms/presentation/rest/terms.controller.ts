import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TermsService } from '../../application/services/terms.service';
import { AcceptTermsDto } from '../../domain/interfaces/terms.interface';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @Get('current')
  @Public()
  async getCurrentTerms() {
    return this.termsService.getCurrentVersion();
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async checkAcceptance(@CurrentUser() user: any) {
    return this.termsService.checkUserAcceptance(user.id);
  }

  @Post('accept')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async acceptTerms(
    @CurrentUser() user: any,
    @Body() dto: AcceptTermsDto,
    @Req() request: any,
  ) {
    return this.termsService.acceptTerms(
      user.id,
      dto,
      user.name || user.email,
      user.email,
      request.ip,
      request.headers['user-agent'],
    );
  }
}

