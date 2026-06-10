import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionsService } from './subscriptions.service';
import { SubscribeDto } from './dto/subscription.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  findPlans() {
    return this.subscriptionsService.findPlans();
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMySubscription(@CurrentUser() user: { id: string }) {
    return this.subscriptionsService.getActiveSubscription(user.id);
  }

  @Post('subscribe')
  @UseGuards(AuthGuard('jwt'))
  subscribe(
    @CurrentUser() user: { id: string },
    @Body() dto: SubscribeDto,
  ) {
    return this.subscriptionsService.subscribe(user.id, dto.planSlug);
  }

  @Post('cancel')
  @UseGuards(AuthGuard('jwt'))
  cancel(@CurrentUser() user: { id: string }) {
    return this.subscriptionsService.cancel(user.id);
  }
}
