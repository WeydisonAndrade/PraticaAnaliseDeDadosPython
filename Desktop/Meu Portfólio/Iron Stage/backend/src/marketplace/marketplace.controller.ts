import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { MarketplaceService } from './marketplace.service';
import { CreateOrderDto, CreateProductDto } from './dto/marketplace.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('products')
  findProducts(@Query('bandId') bandId?: string) {
    return this.marketplaceService.findProducts(bandId);
  }

  @Post('products')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BAND, UserRole.ADMIN)
  createProduct(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateProductDto,
  ) {
    return this.marketplaceService.createProduct(user.id, dto);
  }

  @Post('orders')
  @UseGuards(AuthGuard('jwt'))
  createOrder(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateOrderDto,
  ) {
    return this.marketplaceService.createOrder(user.id, dto);
  }
}
