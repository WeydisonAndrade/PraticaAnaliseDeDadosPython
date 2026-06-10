import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BandStatus, UserRole } from '@prisma/client';
import { BandsService } from './bands.service';
import { CreateBandDto, UpdateBandDto } from './dto/band.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('bands')
export class BandsController {
  constructor(private readonly bandsService: BandsService) {}

  @Get()
  findAll(@Query('status') status?: BandStatus) {
    return this.bandsService.findAll(status);
  }

  @Get('trending')
  findTrending() {
    return this.bandsService.findTrending();
  }

  @Get('me/following')
  @UseGuards(AuthGuard('jwt'))
  findFollowing(@CurrentUser() user: { id: string }) {
    return this.bandsService.findFollowing(user.id);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.bandsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateBandDto,
  ) {
    return this.bandsService.create(user.id, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BAND, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateBandDto,
  ) {
    return this.bandsService.update(id, user.id, dto);
  }

  @Post(':id/verify')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  verify(@Param('id') id: string) {
    return this.bandsService.verify(id);
  }

  @Post(':id/follow')
  @UseGuards(AuthGuard('jwt'))
  follow(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.bandsService.follow(user.id, id);
  }

  @Post(':id/unfollow')
  @UseGuards(AuthGuard('jwt'))
  unfollow(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.bandsService.unfollow(user.id, id);
  }
}
