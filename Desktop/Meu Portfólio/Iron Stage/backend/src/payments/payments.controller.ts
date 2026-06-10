import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('commission-rules')
  getCommissionRules() {
    return this.paymentsService.getCommissionRules();
  }

  @Get('bands/:bandId/earnings')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BAND, UserRole.ADMIN)
  getBandEarnings(
    @Param('bandId') bandId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.paymentsService.getBandEarnings(bandId, user.id);
  }

  @Post('bands/:bandId/payout')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BAND, UserRole.ADMIN)
  requestPayout(
    @Param('bandId') bandId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.paymentsService.requestPayout(bandId, user.id);
  }
}
