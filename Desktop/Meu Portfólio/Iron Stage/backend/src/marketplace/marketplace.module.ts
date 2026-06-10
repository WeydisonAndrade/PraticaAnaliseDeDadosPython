import { Module } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { AccessControlModule } from '../access-control/access-control.module';
import { CommissionModule } from '../commission/commission.module';

@Module({
  imports: [AccessControlModule, CommissionModule],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
