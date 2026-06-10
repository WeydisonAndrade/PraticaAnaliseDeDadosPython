import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { LiveShowsService } from './live-shows.service';
import { CreateLiveShowDto, PurchasePpvDto } from './dto/live-show.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('live-shows')
export class LiveShowsController {
  constructor(private readonly liveShowsService: LiveShowsService) {}

  @Get('upcoming')
  findUpcoming() {
    return this.liveShowsService.findUpcoming();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BAND, UserRole.ADMIN)
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateLiveShowDto,
  ) {
    return this.liveShowsService.create(user.id, dto);
  }

  @Post('purchase')
  @UseGuards(AuthGuard('jwt'))
  purchase(
    @CurrentUser() user: { id: string },
    @Body() dto: PurchasePpvDto,
  ) {
    return this.liveShowsService.purchaseTicket(user.id, dto.liveShowId);
  }

  @Get(':id/access')
  @UseGuards(AuthGuard('jwt'))
  checkAccess(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ) {
    return this.liveShowsService.checkAccess(user.id, id);
  }
}
