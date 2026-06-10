import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/content.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  findPublished(@Query('bandId') bandId?: string) {
    return this.contentService.findPublished(bandId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BAND, UserRole.ADMIN)
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateContentDto,
  ) {
    return this.contentService.create(user.id, dto);
  }

  @Post(':id/publish')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BAND, UserRole.ADMIN)
  publish(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.contentService.publish(id, user.id);
  }

  @Get(':id/stream')
  @UseGuards(AuthGuard('jwt'))
  getStream(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.contentService.getStreamUrl(id, user.id);
  }
}
